const { T_PT, ResponseController, httpStatus } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/solicitacao");
const { v4: uuid } = require("uuid");
const { redisClient: redis } = require("../client/redis");

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

  static async deleteSolicitacao(req, res) {
    const { idSolicitacao } = req.params;
    await database.query(SQL.deleteSolicitacao, [idSolicitacao]);
    await database.query(SQL.deleteProdutoSolicitado, [idSolicitacao]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, null);
  }

  // ✅ RESERVA - itemSolicitado
  static async itemSolicitado(req, res) {
    const { idSolicitacao } = req.params;
    const data = req.body;

    const produtoId = String(data.PRODUTO).trim();
    const unidadeId = String(data.UNIDADE).trim();
    const chaveRedis = `reservas:${unidadeId}:${produtoId}`;
    const TTL_48H = 60 * 60 * 48;

    const { rows: produtos } = await database.query(SQL.getDisponiveisVerify, [
      data.UNIDADE,
      data.PRODUTO,
    ]);

    if (produtos.length === 0) {
      return ResponseController(res, 404, "Produto não encontrado", null);
    }

    const totalDisponivel = produtos.reduce(
      (acc, p) => acc + Number(p.qnt_disponivel),
      0,
    );

    const reservado = Number(await redis.get(chaveRedis)) || 0;
    const disponivelReal = totalDisponivel - reservado;

    if (disponivelReal < Number(data.QNT_SOLICITADA)) {
      return ResponseController(
        res,
        httpStatus.CONFLICT,
        `Indisponível. Restante: ${disponivelReal}${produtos[0].und_medida}`,
        null,
      );
    }

    await redis.incrby(chaveRedis, Number(data.QNT_SOLICITADA));

    await redis.expire(chaveRedis, TTL_48H);

    try {
      const id = uuid();
      await database.query(SQL.createItemSolicitado, [
        id,
        idSolicitacao,
        data.PRODUTO,
        data.QNT_SOLICITADA,
      ]);

      return ResponseController(
        res,
        httpStatus.CREATED,
        "Reservado e registrado com sucesso",
        null,
      );
    } catch (error) {
      await redis.decrby(chaveRedis, Number(data.QNT_SOLICITADA));
      throw error;
    }
  }

  static async getSolicitacoes(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getSolicitacoes, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getSolicitacoesLiberadas(req, res) {
    const { idUnidade } = req.params;

    const { rows } = await database.query(SQL.getSolicitacoesLiberadas, [
      idUnidade,
    ]);
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

    const reservadoPorEstoque = {};

    const arrayOfEstoque = [];
    for await (let item of itensSolicitacao) {
      let { rows } = await database.query(SQL.getProdutosDisponiveis, [
        item.id_produto,
        idEntidade,
      ]);

      let restante = item.qnt_solicitada;

      const disponiveis = [];
      for (const estoque of rows) {
        const jaReservado = reservadoPorEstoque[estoque.id] ?? 0;
        const disponivelReal = estoque.qnt_disponivel - jaReservado;

        if (disponivelReal <= 0) continue;

        const alocar = Math.min(restante, disponivelReal);
        reservadoPorEstoque[estoque.id] = jaReservado + alocar;
        restante -= alocar;

        disponiveis.push({
          ...estoque,
          qnt_disponivel: disponivelReal,
        });

        if (restante <= 0) break;
      }

      item.disponiveis = disponiveis;
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
