const { database } = require("../client/database");
const {
  T_PT,
  ResponseController,
  randomizeNumber,
  httpStatus,
} = require("../lib");
const SQL = require("../models/tipo");

class TipoController {
  static async createTipoEstoque(req, res) {
    const data = req.body;
    const numero = randomizeNumber(2, 3);
    await database.query(SQL.createTipoEstoque, [numero, data.NOME]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, numero);
  }

  static async getAllTipoEstoque(req, res) {
    const { rows } = await database.query(SQL.getAllTipoEstoque, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async softDeleteTipoEstoque(req, res) {
    const { idTipo } = req.params;
    await database.query(SQL.softDeleteTipoEstoque, [idTipo]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, idTipo);
  }

  static async createTipoUnidade(req, res) {
    const data = req.body;
    const numero = randomizeNumber(2, 3);
    await database.query(SQL.createTipoUnidade, [numero, data.NOME]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, numero);
  }

  static async getAllTipoUnidade(req, res) {
    const { rows } = await database.query(SQL.getAllTipoUnidade, []);
    return ResponseController(res, httpStatus.OK, T_PT.capturados, rows);
  }

  static async softDeleteTipoUnidade(req, res) {
    const { idTipo } = req.params;
    await database.query(SQL.softDeleteTipoUnidade, [idTipo]);
    return ResponseController(res, httpStatus.OK, T_PT.apagado, idTipo);
  }
}

module.exports = TipoController;
