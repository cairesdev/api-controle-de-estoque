const { T_PT, ResponseController, httpStatus } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/solicitacao");
const { v4: uuid } = require("uuid");

class SolicitacaoController {
  static async createSolicitacao(req, res) {
    const { idUnidade } = req.params;
    const data = req.body;

    const { authorization } = req.headers;
    const userId = authorization.replace("Bearer ", "");

    const id = uuid();
    const dateISO = new Date().toISOString();

    await database.query(SQL.createSolicitacao, [
      id,
      idUnidade,
      idUnidade,
      data.STATUS,
      dateISO,
      userId,
      data.QNT_SOLICITADA,
      data.NOME,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }
}

module.exports = SolicitacaoController;
