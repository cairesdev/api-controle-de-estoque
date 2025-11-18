const { database } = require("../client/database");
const { DefaultMessages, Return } = require("../lib/returns");
const { CREATED, CONFLICT } = require("../lib/http-status");
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
      return Return(res, CONFLICT, DefaultMessages.cft_usuario, rows[0].id);
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

    return Return(res, CREATED, DefaultMessages.cadastrado, id);
  }
}

module.exports = UserController;
