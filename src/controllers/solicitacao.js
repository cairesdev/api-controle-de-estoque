const { T_PT, ResponseController, httpStatus, dateISO } = require("../lib");
const { database } = require("../client/database");
const SQL = require("../models/solicitacao");
const { v4: uuid } = require("uuid");
const { redisClient: redis } = require("../client/redis");

const STATUS_RASCUNHO = "e1d9ab68-ec2d-47b0-99aa-28bb2f6578f7";
const TTL_48H = 60 * 60 * 48;

class SolicitacaoController {
  static async create(req, res) {
    const { idUnidade } = req.params;
    const data = req.body;
    const user = req.user;
    const id = uuid();

    await database.query(SQL.create, [
      id,
      idUnidade,
      idUnidade,
      STATUS_RASCUNHO,
      dateISO(),
      user.id,
      data.NOME,
      data.TIPO_ESTOQUE,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async softDelete(req, res) {
    const { idSolicitacao } = req.params;
    await database.query(SQL.softDeleteItensSolicitacao, [idSolicitacao]);
    await database.query(SQL.softDelete, [idSolicitacao]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, null);
  }

  static async addItem(req, res) {
    const { idSolicitacao } = req.params;
    const data = req.body;

    const produtoId = String(data.PRODUTO).trim();
    const unidadeId = String(data.UNIDADE).trim();
    const chaveRedis = `reservas:${unidadeId}:${produtoId}`;

    const { rows: produtos } = await database.query(SQL.verificaDisponivel, [
      data.UNIDADE,
      data.PRODUTO,
    ]);

    if (produtos.length === 0) {
      return ResponseController(
        res,
        httpStatus.NOT_FOUND,
        T_PT.not_found,
        null,
      );
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
        `${T_PT.qnt_indisp}. Restante: ${disponivelReal}${produtos[0].und_medida}`,
        null,
      );
    }

    await redis.incrby(chaveRedis, Number(data.QNT_SOLICITADA));
    await redis.expire(chaveRedis, TTL_48H);

    try {
      const id = uuid();
      await database.query(SQL.addItem, [
        id,
        idSolicitacao,
        data.PRODUTO,
        data.QNT_SOLICITADA,
      ]);
      return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, null);
    } catch (error) {
      await redis.decrby(chaveRedis, Number(data.QNT_SOLICITADA));
      throw error;
    }
  }

  static async getAll(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAll, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getAllLiberadas(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAllLiberadas, [idUnidade]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getById(req, res) {
    const { idSolicitacao, idUnidade } = req.params;
    const { visualizacao } = req.query;

    const tiposValidos = ["administrativa", "unidade", "almoxarifado"];
    if (!tiposValidos.includes(visualizacao)) {
      return ResponseController(
        res,
        httpStatus.NOT_ACEPTABLE,
        T_PT.not_found,
        null,
      );
    }

    const { rows: solicitacao } = await database.query(SQL.getById, [
      idSolicitacao,
    ]);
    const { rows: itens } = await database.query(SQL.getItens, [idSolicitacao]);

    if (visualizacao !== "unidade") {
      for (const item of itens) {
        const { rows: itensPresentes } = await database.query(
          SQL.getItensUnidadePorProduto,
          [idUnidade, item.id_produto],
        );
        item.disponiveis = itensPresentes;
      }

      await database.query(SQL.setAsPendente, [idSolicitacao]);
    }

    if (visualizacao === "unidade") {
      const { rows: estoque } = await database.query(SQL.getEstoqueVinculado, [
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

  static async concluir(req, res) {
    const { idSolicitacao } = req.params;
    await database.query(SQL.setAsConcluida, [idSolicitacao]);
    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }
}

module.exports = SolicitacaoController;
