module.exports = {
  create: `INSERT INTO usuario(id, nome, descricao, id_unidade, nivel, id_orgao, login, senha, tipo_almoxarifado)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,

  verificacao_login: `SELECT senha, id FROM USUARIO WHERE login = $1;`,

  dados_usuario: `SELECT * FROM DADOS_USUARIO WHERE ID = $1;`,

  todosUsuarios: `
  SELECT U.ID,U.NOME, U.DESCRICAO, U.NIVEL, U.LOGIN, UND.NOME as unidade
  FROM USUARIO U
  INNER JOIN UNIDADE UND ON U.ID_UNIDADE = UND.ID
  ORDER BY NOME ASC;`,
  deleteUsuario: `DELETE FROM USUARIO WHERE ID = $1;`,
  updatePass: `UPDATE USUARIO SET SENHA = $1 WHERE LOGIN = $2;`,
  tipo_almoxarifado: `SELECT ID_TIPO_UNIDADE FROM UNIDADE WHERE ID = $1;`,

  updatebasics: `UPDATE USUARIO SET NOME = $1, DESCRICAO = $2, NIVEL = $3 WHERE ID = $4;`,
};
