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
      const { rowCount, rows } = await database.query(SQL.verificacao_login, [
        data.LOGIN,
      ]);

      if (rowCount !== 0) {
        return ResponseController(
          res,
          httpStatus.CONFLICT,
          T_PT.cft_usuario,
          null
        );
      }

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
      ]);

      return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
    } catch (error) {
      console.error(error);
      return ResponseController(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        T_PT.no_content,
        null
      );
    }
  }

  static async login(req, res) {
    const data = req.body;
    try {
      const { rowCount, rows } = await database.query(SQL.verificacao_login, [
        data.LOGIN,
      ]);

      if (rowCount === 0) {
        return ResponseController(
          res,
          httpStatus.UNAUTHORIZED,
          T_PT.cft_credenciais,
          null
        );
      }

      const machPass = await bcrypt.compare(data.SENHA, rows[0].senha);

      if (!machPass) {
        return ResponseController(
          res,
          httpStatus.UNAUTHORIZED,
          T_PT.cft_credenciais,
          null
        );
      }

      const token = jwt.sign(
        {
          login: data.LOGIN,
          id: rows[0].id,
          nome: rows[0].nome,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return ResponseController(res, httpStatus.OK, T_PT.capturado, token);
    } catch (error) {
      console.error(error);
      return ResponseController(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        T_PT.no_content,
        null
      );
    }
  }
}

module.exports = UserController;
