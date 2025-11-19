const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
} = require("../lib");
const SQL = require("../models/armazem");
const { v4: uuid } = require("uuid");
const xlsx = require("xlsx");

class ArmazemController {
  static async cadastroIndividual(req, res) {
    const { idEstoque } = req.params;
    const data = req.body;

    const id = uuid();
    const dateISO = new Date().toISOString();

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

    const dateISO = new Date().toISOString();

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

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, codigo);
  }

  static async createArmazem(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const { authorization } = req.headers;
    const userId = authorization.replace("Bearer ", "");

    const id = uuid();
    const codigo = randomizeNumber(8, 12);

    const { rows, rowCount } = await database.query(SQL.verifica_usuario, [
      userId,
    ]);

    if (rowCount !== 0) {
      if (rows[0].nivel <= 3) {
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
      userId,
      data.LOCAL_ESTOCADO,
      codigo,
    ]);

    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
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
}

module.exports = ArmazemController;
