const { database } = require("../client/database");
const { DefaultMessages, Return } = require("../lib/returns");
const { CREATED, CONFLICT, OK, NOT_FOUND } = require("../lib/http-status");
const SQL = require("../models/orgao");
const { v4: uuid } = require("uuid");

class OrgaoController {
  static async create(req, res) {
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verificacao_nome, [
      data.NOME,
    ]);

    if (rowCount !== 0) {
      return Return(res, CONFLICT, DefaultMessages.cft_nome, rows[0].id);
    }

    await database.query(SQL.cadastro, [
      id,
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      data.CIDADE,
      data.EMAIL,
      data.TELEFONE,
    ]);

    return Return(res, CREATED, DefaultMessages.cadastrado, id);
  }

  static async cadastrarModulos(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verifica_modulo, [
      idEntidade,
    ]);

    if (rowCount !== 0) {
      return Return(res, CONFLICT, DefaultMessages.cft_modulos, rows[0].id);
    }

    await database.query(SQL.modulos_liberados, [
      id,
      idEntidade,
      data.ESCOLAR,
      data.SAUDE,
      data.ASSISTENCIA_SOCIAL,
      data.OUTROS,
    ]);

    return Return(res, CREATED, DefaultMessages.cadastrado, id);
  }

  static async listaEntidades(req, res) {
    const { rows } = await database.query(SQL.getEntidades, []);
    return Return(res, OK, DefaultMessages.capturados, rows);
  }

  static async listaEntidade(req, res) {
    const { idEntidade } = req.params;
    const { rows, rowCount } = await database.query(SQL.getEntidade, [
      idEntidade,
    ]);
    if (rowCount === 0) {
      return Return(res, NOT_FOUND, DefaultMessages.not_found, null);
    }
    return Return(res, OK, DefaultMessages.capturado, rows[0]);
  }

  static async updateEntidade(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;

    await database.query(SQL.update, [
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      data.CIDADE,
      data.EMAIL,
      data.TELEFONE,
      data.STATUS,
      idEntidade,
    ]);

    return Return(res, OK, DefaultMessages.atualizado, idEntidade);
  }

  static async updateModulos(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;

    await database.query(SQL.update_modulos_liberados, [
      data.ESCOLAR,
      data.SAUDE,
      data.ASSISTENCIA_SOCIAL,
      data.OUTROS,
      idEntidade,
    ]);

    return Return(res, OK, DefaultMessages.atualizado, idEntidade);
  }
}

module.exports = OrgaoController;
