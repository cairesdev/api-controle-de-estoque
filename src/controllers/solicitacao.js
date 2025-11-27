const { T_PT, ResponseController, httpStatus } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/solicitacao");
const { v4: uuid } = require("uuid");

class SolicitacaoController {
  static async createSolicitacao(req, res) {
    const { idUnidade } = req.params;
    const data = req.body;
    const user = req.user;

    const id = uuid();
    const dateISO = new Date().toISOString();

    await database.query(SQL.createSolicitacao, [
      id,
      idUnidade,
      idUnidade,
      data.STATUS,
      dateISO,
      user.id,
      data.NOME,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async itemSolicitado(req, res) {
    const { idSolicitacao } = req.params;
    const data = req.body;

    const id = uuid();

    await database.query(SQL.createItemSolicitado, [
      id,
      idSolicitacao,
      data.PRODUTO,
      data.QNT_SOLICITADA,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async getSolicitacoes(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getSolicitacoes, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getSolicitacao(req, res) {
    const { idSolicitacao } = req.params;
    const { visualizacao } = req.query;

    const tiposVisualizacao = ["administrativa", "unidade", "almoxarifado"];
    if (!tiposVisualizacao.includes(visualizacao)) {
      return ResponseController(
        res,
        httpStatus.NOT_ACEPTABLE,
        T_PT.not_found,
        null
      );
    }

    const { rows: solicitacao } = await database.query(SQL.getSolicitacao, [
      idSolicitacao,
    ]);

    const { rows: itens } = await database.query(SQL.getItensSolicitacao, [
      idSolicitacao,
    ]);

    if (visualizacao === "almoxarifado") {
      await database.query(SQL.setAsPendente, [idSolicitacao]);
    }

    return ResponseController(res, httpStatus.OK, T_PT.capturados, {
      solicitacao: solicitacao[0],
      itens,
    });
  }
}

module.exports = SolicitacaoController;
