const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
} = require("../lib");
const HttpStatus = require("../lib/http-status");
const SQL = require("../models/armazem");
const { v4: uuid } = require("uuid");
const xlsx = require("xlsx");

class ArmazemController {
  static async cadastroIndividual(req, res) {
    const { idEstoque } = req.params;
    const data = req.body;

    const id = uuid();
    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    await database.query(SQL.estocar_item, [
      id,
      idEstoque,
      data.DATA_VALIDADE,
      dateISO,
      data.QUANTIDADE,
      data.QUANTIDADE,
      data.PRODUTO,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }

  static async cadastroItensXlsx(req, res) {
    const { idEstoque } = req.params;
    const file = req.file;

    const workbook = xlsx.read(file.buffer, {
      type: "buffer",
      cellDates: true,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const json = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    if (json.length === 0) {
      return ResponseController(
        res,
        httpStatus.NO_CONTENT,
        T_PT.no_content,
        null
      );
    }

    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    for await (let item of json) {
      var id = uuid();
      await database.query(SQL.cadastro_produto, [id, item.NOME, item.UNIDADE]);

      await database.query(SQL.estocar_produto, [
        id,
        idEstoque,
        item.DATA_VALIDADE == "" ? null : item.DATA_VALIDADE,
        dateISO,
        item.QUANTIDADE,
        item.QUANTIDADE,
        item.NOME,
      ]);
    }

    await database.query(SQL.update_armazem, [json.length, idEstoque]);

    return ResponseController(
      res,
      httpStatus.CREATED,
      T_PT.cadastrado,
      json.length
    );
  }

  static async createArmazem(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const user = req.user;

    const id = uuid();
    const codigo = randomizeNumber(8, 12);

    const { rows, rowCount } = await database.query(SQL.verifica_usuario, [
      user.id,
    ]);

    if (rowCount !== 0) {
      if (rows[0].nivel < 2) {
        return ResponseController(
          res,
          httpStatus.UNAUTHORIZED,
          T_PT.nao_autorizado,
          null
        );
      }
    } else {
      return ResponseController(
        res,
        httpStatus.UNAUTHORIZED,
        T_PT.nao_autorizado,
        null
      );
    }

    await database.query(SQL.cadastro_armazem, [
      id,
      data.NOME,
      data.TIPO_ESTOQUE,
      data.DATA_ENTRADA,
      idEntidade,
      user.id,
      data.LOCAL_ESTOCADO,
      codigo,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, {
      id,
      codigo,
    });
  }

  static async resumoRemessa(req, res) {
    const { idRemessa } = req.params;
    const { rows: itens } = await database.query(SQL.getItens, [idRemessa]);
    const { rows: estoque } = await database.query(SQL.getRemessa, [idRemessa]);

    return ResponseController(res, httpStatus.OK, T_PT.capturado, {
      remessa: estoque[0],
      itens,
    });
  }
  static async resumoRemessaUnidade(req, res) {
    const { idRemessa } = req.params;
    const { rows: itens } = await database.query(SQL.getItens, [idRemessa]);
    const { rows: estoque } = await database.query(SQL.getRemessaUnidade, [
      idRemessa,
    ]);
    return ResponseController(res, httpStatus.OK, T_PT.capturado, {
      remessa: estoque[0],
      itens,
    });
  }

  static async getEstoquesEntidade(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAllEstoque, [idEntidade]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, rows);
  }

  static async getEstoque(req, res) {
    const { idEstoque } = req.params;
    const { rows } = await database.query(SQL.getAllEstoqueRemessa, [
      idEstoque,
    ]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, rows);
  }

  static async deleteItem(req, res) {
    const { idItem } = req.params;
    await database.query(SQL.removeOnUpdate, [idItem]);
    await database.query(SQL.removeOnUpdateEstoqueUnidade, [idItem]);

    await database.query(SQL.deleteItem, [idItem]);
    return ResponseController(res, HttpStatus.OK, T_PT.atualizado, null);
  }

  static async liberaSolicitacao(req, res) {
    const { idSolicitacao, idEntidade } = req.params;
    const data = req.body;

    const codigo = randomizeNumber(7, 12);
    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    const id = uuid();

    await database.query(SQL.createEstoqueUnidade, [
      id,
      idSolicitacao,
      dateISO,
      codigo,
      data.RETIRADAS.length,
      data.RETIRADAS.length,
      data.DESTINATARIO,
      data.SOLICITACAO,
    ]);

    for await (let item of data.RETIRADAS) {
      var productId = uuid();

      await database.query(SQL.estocar_item_solicitado, [
        productId,
        id,
        item.id,
        dateISO,
        item.qnt_liberada,
        item.qnt_liberada,
        item.id,
      ]);

      await database.query(SQL.rezumirItemRetirado, [
        item.qnt_liberada,
        item.id,
      ]);
    }

    await database.query(SQL.update_solicitacao_status, [
      idSolicitacao,
      req.user.id,
      dateISO,
    ]);

    return ResponseController(res, HttpStatus.CREATED, T_PT.cadastrado, {
      codigo,
      id,
    });
  }

  static async capturarSolicitacaoRespondida(req, res) {
    const { idEstoque, codigo } = req.params;
    const { rows: estoque } = await database.query(SQL.getEstoque, [
      idEstoque,
      codigo,
    ]);
    const { rows: itens } = await database.query(SQL.getItens, [idEstoque]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturado, {
      estoque: estoque[0],
      itens,
    });
  }

  static async getListaProdutos(req, res) {
    const { rows } = await database.query(SQL.getAllProducts, []);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, rows);
  }
}

module.exports = ArmazemController;
