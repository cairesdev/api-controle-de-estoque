const { database } = require("../client/database");
const { DefaultMessages, Return } = require("../lib/returns");
const { CREATED, CONFLICT, OK, NOT_FOUND } = require("../lib/http-status");
const SQL = require("../models/unidade");

const { v4: uuid } = require("uuid");

class UnidadeController {
  static async create(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verifica_unidade, [
      idEntidade,
      data.NOME,
    ]);

    if (rowCount !== 0) {
      return Return(res, CONFLICT, DefaultMessages.cft_nome, rows[0].id);
    }

    await database.query(SQL.create, [
      id,
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      idEntidade,
      data.EMAIL,
      data.TELEFONE,
      data.TIPO_UNIDADE,
    ]);

    return Return(res, CREATED, DefaultMessages.cadastrado, id);
  }

  static async update(req, res) {
    const { idUnidade } = req.params;
    const data = req.body;

    await database.query(SQL.updade, [
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      data.EMAIL,
      data.TELEFONE,
      data.STATUS,
      data.TIPO_UNIDADE,
      idUnidade,
    ]);

    return Return(res, OK, DefaultMessages.atualizado, idUnidade);
  }

  static async getAll(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAll, [idEntidade]);
    return Return(res, OK, DefaultMessages.capturados, rows);
  }

  static async getUnique(req, res) {
    const { idUnidade } = req.params;
    const { rows, rowCount } = await database.query(SQL.getUnique, [idUnidade]);
    if (rowCount === 0) {
      return Return(res, NOT_FOUND, DefaultMessages.not_found, null);
    }
    return Return(res, OK, DefaultMessages.capturado, rows[0]);
  }
}

module.exports = UnidadeController;
