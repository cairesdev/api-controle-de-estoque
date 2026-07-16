const { database } = require("../client/database");
const { T_PT, ResponseController, httpStatus } = require("../lib");
const SQL = require("../models/garagem");
const { v4: uuid } = require("uuid");

const STATUS_PENDENTE = "7c92f4cf-f76b-4333-ac06-6b60bf2b2518";

function datetimeLocalToBrazil(dateTimeLocal) {
  return new Date(dateTimeLocal).toISOString().slice(0, 19).replace("T", " ");
}

class GaragemController {
  static async getAllVeiculos(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQL.getAllVeiculos, [idOrgao]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async createVeiculo(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;
    const id = uuid();

    await database.query(SQL.createVeiculo, [
      id,
      data.NOME,
      data.MARCA,
      data.MODELO,
      data.PLACA,
      1,
      idOrgao,
      data.COR,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async getAllViagensOrgao(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQL.getAllViagensOrgao, [idOrgao]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getAllViagensUnidade(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAllViagensUnidade, [
      idUnidade,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getViagemById(req, res) {
    const { idViagem } = req.params;
    const { rows } = await database.query(SQL.getViagemById, [idViagem]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }

  static async getAllSolicitacoes(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQL.getAllSolicitacoes, [idOrgao]);

    return ResponseController(
      res,
      httpStatus.OK,
      T_PT.capturados,
      rows.sort((a) => (a.status === "Pendente" ? -1 : 1)),
    );
  }

  static async getSolicitacaoById(req, res) {
    const { idSolicitacao } = req.params;
    const { rows } = await database.query(SQL.getSolicitacaoById, [
      idSolicitacao,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, rows[0]);
  }

  static async createSolicitacao(req, res) {
    const { idOrgao, idUnidade } = req.params;
    const data = req.body;
    const id = uuid();

    await database.query(SQL.createSolicitacao, [
      id,
      data.ID_VEICULO,
      datetimeLocalToBrazil(data.DATA_VIAGEM),
      data.RESPONSAVEL,
      data.MOTIVO,
      idUnidade,
      idOrgao,
      STATUS_PENDENTE,
      data.TELEFONE_RESPONSAVEL,
      data.RESUMO,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async liberarSolicitacao(req, res) {
    const { idSolicitacao, idUnidade } = req.params;
    const data = req.body;
    const id = uuid();

    await database.query(SQL.liberarSolicitacao, [idSolicitacao]);
    await database.query(SQL.indisponibilizarVeiculo, [data.ID_VEICULO]);
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

  static async iniciarViagem(req, res) {
    const { idViagem } = req.params;
    const data = req.body;

    await database.query(SQL.iniciarViagem, [
      data.MOTORISTA,
      data.KM_INICIAL,
      datetimeLocalToBrazil(new Date()),
      idViagem,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, idViagem);
  }

  static async concluirViagem(req, res) {
    const { idViagem } = req.params;
    const data = req.body;

    await database.query(SQL.disponibilizarVeiculo, [idViagem]);
    await database.query(SQL.concluirSolicitacao, [idViagem]);
    await database.query(SQL.concluirViagem, [
      datetimeLocalToBrazil(data.DATA),
      data.CHEGADA,
      idViagem,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }
}

module.exports = GaragemController;
