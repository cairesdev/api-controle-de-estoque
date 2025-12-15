const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
} = require("../lib");
const SQL = require("../models/extras");

class ExtrasController {
  static async createTipoEstoque(req, res) {
    const data = req.body;
    const numero = randomizeNumber(2, 3);
    await database.query(SQL.createtipo_estoque, [numero, data.NOME]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, numero);
  }

  static async getAllTipoEstoque(req, res) {
    const { rows } = await database.query(SQL.getAlltipoestoque, []);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, rows);
  }

  static async deleteTipoEstoque(req, res) {
    const { idTipoEstoque } = req.params;
    await database.query(SQL.deleteTipoEstoque, [idTipoEstoque]);
    return ResponseController(
      res,
      httpStatus.OK,
      T_PT.no_content,
      idTipoEstoque
    );
  }

  static async createTipoUnidade(req, res) {
    const data = req.body;
    const numero = randomizeNumber(2, 3);
    await database.query(SQL.createtipo_unidade, [numero, data.NOME]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, numero);
  }

  static async getAllTipoUnidade(req, res) {
    const { rows } = await database.query(SQL.getAlltipounidade, []);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, rows);
  }

  static async deleteTipoUnidade(req, res) {
    const { idTipoUnidade } = req.params;
    await database.query(SQL.deleteTipoUnidade, [idTipoUnidade]);
    return ResponseController(
      res,
      httpStatus.OK,
      T_PT.no_content,
      idTipoUnidade
    );
  }
}

module.exports = ExtrasController;
