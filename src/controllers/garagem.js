const { database } = require("../client/database");
const { T_PT, ResponseController, httpStatus } = require("../lib");
const SQL = require("../models/garagem");
const { v4: uuid } = require("uuid");

class ExtrasController {
  static async getAllVeiculos(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAll, [idEntidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows);
  }

  static async createVeiculo(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const id = uuid();
    await database.query(SQL.createVeiculo, [
      id,
      data.NOME,
      data.MARCA,
      data.MODELO,
      data.PLACA,
      1,
      idEntidade,
      data.COR,
    ]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async getAllViagens(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAllViagens, [idEntidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows);
  }

  static async getAllViagensUnidade(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAllViagensUnidade, [
      idUnidade,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows);
  }

  static async getViagemDetalhe(req, res) {
    const { idViagem } = req.params;
    const { rows } = await database.query(SQL.getViagemDetalhe, [idViagem]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }

  static async getAllSolicitacoes(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAllSolicitacoes, [idEntidade]);

    return ResponseController(
      res,
      httpStatus.OK,
      T_PT.capturado,
      rows.sort((solicitacao) => {
        if (solicitacao.status == "Pendente") return -1;
        else return 1;
      }),
    );
  }

  static async concluirViagem(req, res) {
    const { idViagem } = req.params;
    const data = req.body;

    function datetimeLocalToBrazil(dateTimeLocal) {
      const date = new Date(dateTimeLocal);
      return date.toISOString().slice(0, 19).replace("T", " ");
    }

    await database.query(SQL.disponibilizaVeiculo, [idViagem]);
    await database.query(SQL.concluiSolicitacao, [idViagem]);

    await database.query(SQL.concluirViagem, [
      datetimeLocalToBrazil(data.DATA),
      data.CHEGADA,
      idViagem,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }

  static async createSolicitacao(req, res) {
    const { idEntidade, idUnidade } = req.params;
    const data = req.body;
    const id = uuid();

    function datetimeLocalToBrazil(dateTimeLocal) {
      const date = new Date(dateTimeLocal);
      return date.toISOString().slice(0, 19).replace("T", " ");
    }

    await database.query(SQL.createSolicitacao, [
      id,
      data.ID_VEICULO,
      datetimeLocalToBrazil(data.DATA_VIAGEM),
      data.RESPONSAVEL,
      data.MOTIVO,
      idUnidade,
      idEntidade,
      "7c92f4cf-f76b-4333-ac06-6b60bf2b2518",
      data.TELEFONE_RESPONSAVEL,
      data.RESUMO,
    ]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async getDetalheSolicitcao(req, res) {
    const { idSolicitacao } = req.params;
    const { rows } = await database.query(SQL.getSolicitacao, [idSolicitacao]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }

  static async liberaSolicitacao(req, res) {
    const { idSolicitacao, idUnidade } = req.params;
    const data = req.body;
    const id = uuid();

    await database.query(SQL.liberarSolicitacao, [idSolicitacao]);
    await database.query(SQL.indisponibilizaVeiculo, [data.ID_VEICULO]);
    await database.query(SQL.createViagem, [
      id,
      data.ID_VEICULO,
      idUnidade,
      idSolicitacao,
      idSolicitacao,
      null,
      null,
      idSolicitacao,
      data.DATA,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async iniciaViagem(req, res) {
    const { idViagem } = req.params;
    const data = req.body;

    function datetimeLocalToBrazil(dateTimeLocal) {
      const date = new Date(dateTimeLocal);
      return date.toISOString().slice(0, 19).replace("T", " ");
    }

    await database.query(SQL.iniciarViagem, [
      data.MOTORISTA,
      data.KM_INICIAL,
      datetimeLocalToBrazil(new Date()),
      idViagem,
    ]);

    return ResponseController(
      res,
      httpStatus.CREATED,
      T_PT.atualizado,
      idViagem,
    );
  }
}

module.exports = ExtrasController;
