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

    try {
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
          null,
        );
      }

      const dateISO =
        new Date()
          .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
          .replace(" ", "T") + "-03:00";

      for await (let item of json) {
        var id = uuid();
        await database.query(SQL.cadastro_produto, [
          id,
          item.NOME,
          item.UNIDADE,
        ]);

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
        json.length,
      );
    } catch (error) {
      return ResponseController(
        res,
        httpStatus.CREATED,
        T_PT.cadastrado,
        error.message,
      );
    }
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
          null,
        );
      }
    } else {
      return ResponseController(
        res,
        httpStatus.UNAUTHORIZED,
        T_PT.nao_autorizado,
        null,
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

  static async getItensListEntidade(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAllDisponiveisForList, [
      idUnidade,
    ]);

    const agrupados = Object.values(
      rows.reduce((acc, item) => {
        const chave = `${item.id_tipo_estoque}-${item.nome}`;

        if (!acc[chave]) {
          acc[chave] = {
            nome: item.nome,
            id_tipo_estoque: item.id_tipo_estoque,
            und_medida: item.und_medida,
            qnt_disponivel: 0,
            id: item.id,
          };
        }

        acc[chave].qnt_disponivel += Number(item.qnt_disponivel);

        return acc;
      }, {}),
    );

    return ResponseController(res, HttpStatus.OK, T_PT.capturados, agrupados);
  }

  static async getEstoque(req, res) {
    const { idEstoque } = req.params;
    const { rows } = await database.query(SQL.getAllEstoqueRemessa, [
      idEstoque,
    ]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, rows);
  }

  static async getAllItensUnidade(req, res) {
    const { idUnidade } = req.params;
    const { rows } = await database.query(SQL.getAllItensUnidade, [idUnidade]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, rows);
  }

  static async updateQuantidadeUtilizada(req, res) {
    const { idProduto } = req.params;
    const data = req.body;

    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    await database.query(SQL.createMovimentoEstoque, [
      uuid(),
      idProduto,
      dateISO,
      data.QNT_SOLICITADA,
    ]);

    await database.query(SQL.updateQuantidadeUtilizada, [
      data.QNT_SOLICITADA,
      idProduto,
    ]);
    return ResponseController(res, HttpStatus.OK, T_PT.capturados, null);
  }

  static async deleteItem(req, res) {
    const { idItem } = req.params;
    await database.query(SQL.removeOnUpdate, [idItem]);
    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";
    await database.query(SQL.movimentaDelecaoProduto, [
      uuid(),
      idItem,
      dateISO,
      idItem,
      "54-24c4-8330-94f5-edddeeb076f7",
      req.user.id,
    ]);
    await database.query(SQL.removeOnUpdateEstoqueUnidade, [idItem]);

    await database.query(SQL.deleteItem, [idItem]);
    return ResponseController(res, HttpStatus.OK, T_PT.atualizado, null);
  }

  static async deleteArmazem(req, res) {
    const { idArmazem } = req.params;

    const { rows: itens } = await database.query(SQL.getItens, [idArmazem]);
    const dateISO =
      new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T") + "-03:00";

    for await (let item of itens) {
      await database.query(SQL.deleteItem, [item.id]);
      await database.query(SQL.movimentaDelecaoProduto, [
        uuid(),
        item.id,
        dateISO,
        item.id,
        "4-ccc4-8325-9437-512d3ebf24f8",
        req.user.id,
      ]);
    }

    await database.query(SQL.deleteArmazem, [idArmazem]);
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
      idSolicitacao,
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

      await database.query(SQL.createMovimento, [
        uuid(),
        id,
        item.id_estoque_origem,
        dateISO,
        item.qnt_liberada,
        productId,
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
    for await (let item of itens) {
      const { rows: origem } = await database.query(SQL.selectOrigem, [
        item.id,
      ]);
      item.origem = origem[0];
    }

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
