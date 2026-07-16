const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
  dateISO,
} = require("../lib");
const SQLEstoque = require("../models/estoque");
const SQLProduto = require("../models/produto");
const SQLUsuario = require("../models/user");
const { v4: uuid } = require("uuid");
const xlsx = require("xlsx");
const { redisClient: redis } = require("../client/redis");

const UUID_DELECAO_ITEM = "da7df121-0409-4ff7-a6f5-863ebe3f953b";
const UUID_DELECAO_ESTOQUE = "ff3e3314-4e4d-4b65-bf21-d6f28f32e1d2";

class EstoqueController {
  static async criarRemessa(req, res) {
    const { idOrgao } = req.params;
    const data = req.body;
    const user = req.user;

    const { rows, rowCount } = await database.query(SQLUsuario.verifica_nivel, [
      user.id,
    ]);

    if (rowCount === 0 || rows[0].nivel < 2) {
      return ResponseController(
        res,
        httpStatus.UNAUTHORIZED,
        T_PT.nao_autorizado,
        null,
      );
    }

    const id = uuid();
    const codigo = randomizeNumber(8, 12);

    await database.query(SQLEstoque.criarRemessa, [
      id,
      data.NOME,
      data.TIPO_ESTOQUE,
      data.DATA_ENTRADA,
      idOrgao,
      user.id,
      data.LOCAL_ESTOCADO,
      codigo,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, {
      id,
      codigo,
    });
  }

  static async getAllRemessasOrgao(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQLEstoque.getAllRemessasOrgao, [
      idOrgao,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getAllItensOrgao(req, res) {
    const { idOrgao } = req.params;
    const { rows } = await database.query(SQLEstoque.getAllItensOrgao, [
      idOrgao,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getRemessa(req, res) {
    const { idRemessa } = req.params;
    const { rows: itens } = await database.query(
      SQLEstoque.getItensPorRemessa,
      [idRemessa],
    );
    const { rows: remessa } = await database.query(SQLEstoque.getRemessaOrgao, [
      idRemessa,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.capturado, {
      remessa: remessa[0],
      itens,
    });
  }

  static async getRemessaUnidade(req, res) {
    const { idRemessa } = req.params;
    const { rows: itens } = await database.query(
      SQLEstoque.getItensPorRemessa,
      [idRemessa],
    );
    const { rows: remessa } = await database.query(
      SQLEstoque.getRemessaUnidade,
      [idRemessa],
    );

    return ResponseController(res, httpStatus.OK, T_PT.capturado, {
      remessa: remessa[0],
      itens,
    });
  }

  static async getAllItensRemessa(req, res) {
    const { idRemessa } = req.params;
    const { rows } = await database.query(SQLEstoque.getAllItensRemessa, [
      idRemessa,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getAllItensUnidade(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQLEstoque.getAllItensUnidade, [
      idUnidade,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async getListaDisponiveisUnidade(req, res) {
    const { idUnidade } = req.params;

    const { rows } = await database.query(SQLEstoque.getAllDisponiveisLista, [
      idUnidade,
    ]);

    const agrupadosObj = rows.reduce((acc, item) => {
      const chave = item.id;

      if (!acc[chave]) {
        acc[chave] = {
          id: item.id,
          nome: item.nome,
          id_tipo_estoque: item.id_tipo_estoque,
          und_medida: item.und_medida,
          qnt_disponivel: 0,
        };
      }

      acc[chave].qnt_disponivel += Number(item.qnt_disponivel);
      return acc;
    }, {});

    const agrupados = Object.values(agrupadosObj);

    const keys = agrupados.map((item) => `reservas:${idUnidade}:${item.id}`);
    const valores = await redis.mget(keys);

    agrupados.forEach((item, index) => {
      const reservado = Number(valores[index]) || 0;
      item.qnt_reservado = reservado;
      item.qnt_disponivel = Math.max(0, item.qnt_disponivel - reservado);
    });

    return ResponseController(res, httpStatus.OK, T_PT.capturados, agrupados);
  }

  static async getProdutos(req, res) {
    const { rows } = await database.query(SQLProduto.getAll, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async adicionarItemIndividual(req, res) {
    const { idRemessa } = req.params;
    const data = req.body;
    const id = uuid();

    await database.query(SQLEstoque.estocarItemIndividual, [
      id,
      idRemessa,
      data.DATA_VALIDADE,
      dateISO(),
      data.QUANTIDADE,
      data.QUANTIDADE,
      data.PRODUTO,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async adicionarItensXlsx(req, res) {
    const { idRemessa } = req.params;
    const file = req.file;

    try {
      const workbook = xlsx.read(file.buffer, {
        type: "buffer",
        cellDates: true,
      });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      if (json.length === 0) {
        return ResponseController(
          res,
          httpStatus.NO_CONTENT,
          T_PT.no_content,
          null,
        );
      }

      const now = dateISO();

      for (const item of json) {
        const id = uuid();
        await database.query(SQLProduto.upsert, [id, item.NOME, item.UNIDADE]);
        await database.query(SQLEstoque.estocarItemPorNome, [
          id,
          idRemessa,
          item.DATA_VALIDADE === "" ? null : item.DATA_VALIDADE,
          now,
          item.QUANTIDADE,
          item.QUANTIDADE,
          item.NOME,
        ]);
      }

      await database.query(SQLEstoque.updateQntRemessa, [
        json.length,
        idRemessa,
      ]);

      return ResponseController(
        res,
        httpStatus.CREATED,
        T_PT.cadastrado,
        json.length,
      );
    } catch (error) {
      return ResponseController(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        T_PT.server_error,
        error.message,
      );
    }
  }

  static async consumirItem(req, res) {
    const { idItem } = req.params;
    const data = req.body;
    const now = dateISO();

    await database.query(SQLEstoque.criarMovimentoEstoque, [
      uuid(),
      idItem,
      now,
      data.QNT_SOLICITADA,
    ]);
    await database.query(SQLEstoque.updateQntItem, [
      data.QNT_SOLICITADA,
      idItem,
    ]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }

  static async softDeleteItem(req, res) {
    const { idItem } = req.params;
    const now = dateISO();

    await database.query(SQLEstoque.decrementaQntRemessa, [idItem]);
    await database.query(SQLEstoque.criarMovimentoDelecao, [
      uuid(),
      idItem,
      now,
      idItem,
      UUID_DELECAO_ITEM,
      req.user.id,
    ]);
    await database.query(SQLEstoque.decrementaQntEstoqueUnidade, [idItem]);
    await database.query(SQLEstoque.softDeleteItem, [idItem]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }

  static async softDeleteRemessa(req, res) {
    const { idRemessa } = req.params;
    const now = dateISO();

    const { rows: itens } = await database.query(
      SQLEstoque.getItensPorRemessa,
      [idRemessa],
    );

    for (const item of itens) {
      await database.query(SQLEstoque.softDeleteItem, [item.id]);
      await database.query(SQLEstoque.criarMovimentoDelecao, [
        uuid(),
        item.id,
        now,
        item.id,
        UUID_DELECAO_ESTOQUE,
        req.user.id,
      ]);
    }

    await database.query(SQLEstoque.softDeleteRemessa, [idRemessa]);

    return ResponseController(res, httpStatus.OK, T_PT.atualizado, null);
  }

  static async softDeleteTodasRemessasOrgao(req, res) {
    const { idOrgao } = req.params;
    await database.query(SQLEstoque.softDeleteTodasRemessasOrgao, [idOrgao]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, null);
  }

  static async softDeleteTodasRemessasUnidade(req, res) {
    const { idUnidade } = req.params;
    await database.query(SQLEstoque.softDeleteTodasRemessasUnidade, [
      idUnidade,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, null);
  }
}

module.exports = EstoqueController;
