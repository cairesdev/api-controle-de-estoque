const { database } = require("../client/database");
const { T_PT, ResponseController, httpStatus } = require("../lib");
const SQL = require("../models/garagem");
const { v4: uuid } = require("uuid");

class ExtrasController {
  static async getAllVeiculos(req, res) {
    const { idEntidade } = req.params;
    const { rows } = await database.query(SQL.getAll, [idEntidade]);
    return ResponseController(res, httpStatus.CREATED, T_PT.capturado, rows);
  }

  static async createVeiculo(req, res) {
    const { idEntidade } = req.params;
    const data = req.body;
    const id = uuid();
    await database.query(SQL.createVeiculo, [
      id,
      data.NOME,
      data.MARCA,
      data.MODEDO,
      data.PLACA,
      1,
      idEntidade,
    ]);
    return ResponseController(res, httpStatus.CREATED, T_PT.cadastrado, id);
  }
}

module.exports = ExtrasController;
