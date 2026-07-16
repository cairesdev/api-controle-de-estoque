const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
  dateISO,
} = require("../lib");
const SQLDespacho = require("../models/despacho");
const SQLEstoque = require("../models/estoque");
const SQLSolicitacao = require("../models/solicitacao");
const { v4: uuid } = require("uuid");

class DespachoController {
  static async compararEstoque(req, res) {
    const { idSolicitacao, idOrgao } = req.params;

    const { rows: itensSolicitacao } = await database.query(
      SQLSolicitacao.getItens,
      [idSolicitacao],
    );

    const reservadoPorEstoque = {};
    const resultado = [];

    for (const item of itensSolicitacao) {
      const { rows } = await database.query(
        SQLSolicitacao.getProdutosDisponiveisOrgao,
        [item.id_produto, idOrgao],
      );

      let restante = item.qnt_solicitada;
      const disponiveis = [];

      for (const estoque of rows) {
        const jaReservado = reservadoPorEstoque[estoque.id] ?? 0;
        const disponivelReal = estoque.qnt_disponivel - jaReservado;

        if (disponivelReal <= 0) continue;

        const alocar = Math.min(restante, disponivelReal);
        reservadoPorEstoque[estoque.id] = jaReservado + alocar;
        restante -= alocar;

        disponiveis.push({ ...estoque, qnt_disponivel: disponivelReal });

        if (restante <= 0) break;
      }

      item.disponiveis = disponiveis;
      resultado.push(item);
    }

    return ResponseController(res, httpStatus.OK, T_PT.capturados, resultado);
  }

  static async liberar(req, res) {
    const { idSolicitacao } = req.params;
    const data = req.body;
    const user = req.user;

    const id = uuid();
    const codigo = randomizeNumber(7, 12);
    const now = dateISO();

    await database.query(SQLDespacho.criarEstoqueUnidade, [
      id,
      idSolicitacao,
      now,
      codigo,
      data.RETIRADAS.length,
      data.RETIRADAS.length,
      data.DESTINATARIO,
      data.SOLICITACAO,
      idSolicitacao,
    ]);

    for (const item of data.RETIRADAS) {
      const productId = uuid();

      await database.query(SQLDespacho.estocarItemDespachado, [
        productId,
        id,
        item.id,
        now,
        item.qnt_liberada,
        item.qnt_liberada,
        item.id,
      ]);

      await database.query(SQLDespacho.criarMovimentoArmazem, [
        uuid(),
        id,
        item.id_estoque_origem,
        now,
        item.qnt_liberada,
        productId,
        item.id,
      ]);

      await database.query(SQLDespacho.decrementaItemOrigem, [
        item.qnt_liberada,
        item.id,
      ]);
    }

    await database.query(SQLDespacho.atualizaStatusSolicitacao, [
      idSolicitacao,
      user.id,
      now,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, {
      codigo,
      id,
    });
  }

  static async getComprovante(req, res) {
    const { idEstoque, codigo } = req.params;

    const { rows: estoque } = await database.query(SQLDespacho.getComprovante, [
      idEstoque,
      codigo,
    ]);
    const { rows: itens } = await database.query(
      SQLEstoque.getItensPorRemessa,
      [idEstoque],
    );

    for (const item of itens) {
      const { rows: origem } = await database.query(SQLEstoque.getOrigemItem, [
        item.id,
      ]);
      item.origem = origem[0];
    }

    return ResponseController(res, httpStatus.OK, T_PT.capturado, {
      estoque: estoque[0],
      itens,
    });
  }
}

module.exports = DespachoController;
