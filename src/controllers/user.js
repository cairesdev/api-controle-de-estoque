const { httpStatus, T_PT, ResponseController } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/user");
const { v4: uuid } = require("uuid");

class UserController {
  static async create(req, res) {
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verificacao_login, [
      data.LOGIN,
    ]);

    if (rowCount !== 0) {
      return ResponseController(
        res,
        httpStatus.CONFLICT,
        T_PT.cft_usuario,
        rows[0].id
      );
    }

    await database.query(SQL.create, [
      id,
      data.NOME,
      data.DESCRICAO,
      data.UNIDADE,
      data.NIVEL,
      data.ORGAO,
      data.LOGIN,
      data.SENHA,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }
}

module.exports = UserController;
