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
        rows[0].id
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

  static async cadastrarModulos(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verifica_modulo, [
      idEntidade,
    ]);

    if (rowCount !== 0) {
      return ResponseController(
        res,
        httpStatus.CONFLICT,
        T_PT.cft_modulos,
        rows[0].id
      );
    }

    await database.query(SQL.modulos_liberados, [
      id,
      idEntidade,
      data.ESCOLAR,
      data.SAUDE,
      data.ASSISTENCIA_SOCIAL,
      data.OUTROS,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async listaEntidades(req, res) {
    const { rows } = await database.query(SQL.getEntidades, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async listaEntidade(req, res) {
    const { idEntidade } = req.params;
    const { rows, rowCount } = await database.query(SQL.getEntidade, [
      idEntidade,
    ]);
    if (rowCount === 0) {
      return ResponseController(
        res,
        httpStatus.NOT_FOUND,
        T_PT.not_found,
        null
      );
    }
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
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

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idEntidade);
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

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idEntidade);
  }

  static async getEstoque(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getEstoque, [idEntidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows);
  }
}

module.exports = OrgaoController;
