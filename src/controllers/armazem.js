const { database } = require("../client/database");
const { DefaultMessages, Return } = require("../lib/returns");
const { randomizeNumber } = require("../lib/utils");
const {
  CREATED,
  CONFLICT,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  NO_CONTENT,
} = require("../lib/http-status");
const SQL = require("../models/armazem");
const { v4: uuid } = require("uuid");
const xlsx = require("xlsx");

class ArmazemController {
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
      return Return(res, NO_CONTENT, DefaultMessages.no_content, null);
    }

    const dateISO = new Date().toISOString();
    const codigo = randomizeNumber(8, 12);

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

    await database.query(SQL.update_armazem, [json.length, codigo, idEstoque]);

    return Return(res, CREATED, DefaultMessages.cadastrado, codigo);
  }

  static async createArmazem(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const { authorization } = req.headers;

    const id = uuid();

    const userId = authorization.replace("Bearer ", "");
    const { rows, rowCount } = await database.query(SQL.verifica_usuario, [
      userId,
    ]);

    if (rowCount !== 0) {
      if (rows[0].nivel <= 3) {
        return Return(res, UNAUTHORIZED, DefaultMessages.nao_autorizado, null);
      }
    } else {
      return Return(res, UNAUTHORIZED, DefaultMessages.nao_autorizado, null);
    }

    await database.query(SQL.cadastro_armazem, [
      id,
      data.NOME,
      data.TIPO_ESTOQUE,
      data.DATA_ENTRADA,
      idEntidade,
      userId,
      data.LOCAL_ESTOCADO,
    ]);

    return Return(res, CREATED, DefaultMessages.cadastrado, id);
  }

  static async resumoRemessa(req, res) {
    const { idRemessa } = req.params;
    const { rows: itens } = await database.query(SQL.getItens, [idRemessa]);
    const { rows: estoque } = await database.query(SQL.getRemessa, [idRemessa]);

    return Return(res, OK, DefaultMessages.capturado, {
      remessa: estoque[0],
      itens,
    });
  }
}

module.exports = ArmazemController;
