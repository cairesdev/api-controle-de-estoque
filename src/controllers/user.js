const { httpStatus, T_PT, ResponseController } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/user");
const { v4: uuid } = require("uuid");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "123456";

class UserController {
  static async create(req, res) {
    const data = req.body;
    const id = uuid();
    try {
      const { rowCount } = await database.query(SQL.verificacao_login, [
        data.LOGIN,
      ]);

      if (rowCount !== 0) {
        return ResponseController(
          res,
          httpStatus.CONFLICT,
          T_PT.cft_usuario,
          null,
        );
      }

      const { rows } = await database.query(SQL.tipo_almoxarifado, [
        data.UNIDADE,
      ]);
      const tipoAlmoxarifado =
        data.TIPO_ALMOXARIFE == null
          ? rows[0].id_tipo_unidade
          : data.TIPO_ALMOXARIFE;

      const hashPassword = await bcrypt.hash(data.SENHA, 14);

      await database.query(SQL.create, [
        id,
        data.NOME,
        data.DESCRICAO,
        data.UNIDADE,
        data.NIVEL,
        data.ORGAO,
        data.LOGIN,
        hashPassword,
        tipoAlmoxarifado,
      ]);

      return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
    } catch (error) {
      console.error(error);
      return ResponseController(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        T_PT.no_content,
        null,
      );
    }
  }

  static async login(req, res) {
    const data = req.body;

    try {
      const { rowCount, rows } = await database.query(SQL.verificacao_login, [
        data.username,
      ]);

      if (rowCount === 0) {
        return ResponseController(
          res,
          httpStatus.UNAUTHORIZED,
          T_PT.cft_credenciais,
          null,
        );
      }

      const machPass = await bcrypt.compare(data.password, rows[0].senha);

      if (!machPass) {
        return ResponseController(
          res,
          httpStatus.UNAUTHORIZED,
          T_PT.cft_credenciais,
          null,
        );
      }

      const { rows: dados_usuario } = await database.query(SQL.dados_usuario, [
        rows[0].id,
      ]);

      const token = jwt.sign(
        {
          id: rows[0].id,
          nome: dados_usuario[0].nome,
        },
        JWT_SECRET,
        { expiresIn: "3h" },
      );

      const user = {
        access_token: token,
        nome: dados_usuario[0].nome,
        descricao: dados_usuario[0].descricao,
        login: data.username,
        nivel: dados_usuario[0].nivel,
        expires_on: new Date(Date.now() + 3 * 60 * 60 * 1000),
        entidade_nome: dados_usuario[0].entidade,
        entidade_id: dados_usuario[0].id_orgao,
        unidade_id: dados_usuario[0].id_unidade,
        unidade_nome: dados_usuario[0].unidade,
        tipo_almoxarife: dados_usuario[0].tipo_almoxarifado,
      };

      return ResponseController(res, httpStatus.OK, T_PT.autorizado, user);
    } catch (error) {
      console.error(error);
      return ResponseController(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        T_PT.no_content,
        null,
      );
    }
  }

  static async listAllUsers(req, res) {
    const { rows } = await database.query(SQL.todosUsuarios, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async deleteUsuario(req, res) {
    const { idUsuario } = req.params;
    await database.query(SQL.deleteUsuario, [idUsuario]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, null);
  }

  static async updatePassword(req, res) {
    const { user } = req.params;
    const data = req.body;
    const hashPassword = await bcrypt.hash(data.SENHA, 14);
    await database.query(SQL.updatePass, [hashPassword, user]);
    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }
}

module.exports = UserController;
