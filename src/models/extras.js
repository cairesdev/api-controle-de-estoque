module.exports = {
  createtipo_estoque: `INSERT INTO tipo_estoque (ID, NOME) VALUES ($1,$2);`,
  getAlltipoestoque: `SELECT * FROM tipo_estoque ORDER BY NOME ASC;`,
  deleteTipoEstoque: `DELETE FROM TIPO_ESTOQUE WHERE ID = $1;`,
  createtipo_unidade: `INSERT INTO tipo_unidade (ID, NOME) VALUES ($1,$2);`,
  getAlltipounidade: `SELECT * FROM tipo_unidade ORDER BY NOME ASC;`,
  deleteTipoUnidade: `DELETE FROM TIPO_UNIDADE WHERE ID = $1;`,
};
