const { database } = require("../client/database");
const { httpStatus, T_PT, ResponseController } = require("../lib");
const SQL = require("../models/unidade");
const { v4: uuid } = require("uuid");

class UnidadeController {
  static async create(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;
    const id = uuid();

    const { rowCount, rows } = await database.query(SQL.verifica_nome, [
      idOrgao,
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

    await database.query(SQL.create, [
      id,
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      idOrgao,
      data.EMAIL,
      data.TELEFONE,
      data.TIPO_UNIDADE,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async update(req, res) {
    const { idUnidade } = req.params;
    const data = req.body;

    await database.query(SQL.update, [
      data.NOME,
      data.ENDERECO,
      data.BAIRRO,
      data.EMAIL,
      data.TELEFONE,
      data.STATUS,
      data.TIPO_UNIDADE,
      idUnidade,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idUnidade);
  }

  static async getAll(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQL.getAll, [idOrgao]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getById(req, res) {
    const { idUnidade } = req.params;
    const { rows, rowCount } = await database.query(SQL.getById, [idUnidade]);

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

  static async getEstoque(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getEstoque, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows);
  }
}

module.exports = UnidadeController;
