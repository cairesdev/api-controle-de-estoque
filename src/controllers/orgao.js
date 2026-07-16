const { T_PT, ResponseController, httpStatus } = require("../lib");
const { database } = require("../client/database");
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
      return ResponseController(
        res,
        httpStatus.CONFLICT,
        T_PT.cft_nome,
        rows[0].id,
      );
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

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async update(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;

    await database.query(SQL.update, [
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      data.CIDADE,
      data.EMAIL,
      data.TELEFONE,
      data.STATUS,
      idOrgao,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idOrgao);
  }

  static async getAll(req, res) {
    const { rows } = await database.query(SQL.getAll, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getById(req, res) {
    const { idOrgao } = req.params;
    const { rows, rowCount } = await database.query(SQL.getById, [idOrgao]);

    if (rowCount === 0) {
      return ResponseController(
        res,
        httpStatus.NOT_FOUND,
        T_PT.not_found,
        null,
      );
    }

    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }

  static async cadastrarModulos(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verifica_modulo, [
      idOrgao,
    ]);

    if (rowCount !== 0) {
      return ResponseController(
        res,
        httpStatus.CONFLICT,
        T_PT.cft_modulos,
        rows[0].id,
      );
    }

    await database.query(SQL.modulos_liberados, [
      id,
      idOrgao,
      data.ESCOLAR,
      data.SAUDE,
      data.ASSISTENCIA_SOCIAL,
      data.COMBUSTIVEL,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async updateModulos(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;

    await database.query(SQL.update_modulos, [
      data.ESCOLAR,
      data.SAUDE,
      data.ASSISTENCIA_SOCIAL,
      data.COMBUSTIVEL,
      idOrgao,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idOrgao);
  }

  static async getModulos(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQL.getModulos, [idOrgao]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }
}

module.exports = OrgaoController;
