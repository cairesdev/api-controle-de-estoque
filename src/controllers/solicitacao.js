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
    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    await database.query(SQL.createSolicitacao, [
      id,
      idUnidade,
      idUnidade,
      "e1d9ab68-ec2d-47b0-99aa-28bb2f6578f7", // ENVIADO
      dateISO,
      user.id,
      data.NOME,
      data.TIPO_ESTOQUE,
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

  static async getSolicitacoesLiberadas(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getSolicitacoes, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async concluirSolicitacao(req, res) {
    const { idSolicitacao } = req.params;
    await database.query(SQL.setAsConcluida, [idSolicitacao]);
    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }

  static async getSolicitacao(req, res) {
    const { idSolicitacao, idUnidade } = req.params;
    const { visualizacao } = req.query;

    const tiposVisualizacao = ["administrativa", "unidade", "almoxarifado"];
    if (!tiposVisualizacao.includes(visualizacao)) {
      return ResponseController(
        res,
        httpStatus.NOT_ACEPTABLE,
        T_PT.not_found,
        null,
      );
    }

    const { rows: solicitacao } = await database.query(SQL.getSolicitacao, [
      idSolicitacao,
    ]);

    const { rows: itens } = await database.query(SQL.getItensSolicitacao, [
      idSolicitacao,
    ]);

    if (visualizacao !== "unidade") {
      for await (let item of itens) {
        const { rows: itensPresentes } = await database.query(
          SQL.getAllItensUnidade,
          [idUnidade, item.id_produto],
        );
        item.disponiveis = itensPresentes;
      }

      await database.query(SQL.setAsPendente, [idSolicitacao]);
    }

    if (visualizacao === "unidade") {
      const { rows: estoque } = await database.query(SQL.getEstoque, [
        idSolicitacao,
      ]);

      if (estoque.length !== 0) {
        solicitacao[0].estoque = estoque[0].id;
        solicitacao[0].codigo = estoque[0].codigo;
      }
    }

    return ResponseController(res, httpStatus.OK, T_PT.capturados, {
      solicitacao: solicitacao[0],
      itens,
    });
  }

  static async getSolicitacaoeComparaEstoque(req, res) {
    const { idSolicitacao, idEntidade } = req.params;

    const { rows: itensSolicitacao } = await database.query(
      SQL.getItensSolicitacao,
      [idSolicitacao],
    );

    const arrayOfEstoque = [];
    for await (let item of itensSolicitacao) {
      let { rows } = await database.query(SQL.getProdutosDisponiveis, [
        item.id_produto,
        idEntidade,
      ]);

      item.disponiveis = rows;
      arrayOfEstoque.push(item);
    }

    return ResponseController(
      res,
      httpStatus.OK,
      T_PT.capturados,
      arrayOfEstoque,
    );
  }
}

module.exports = SolicitacaoController;
