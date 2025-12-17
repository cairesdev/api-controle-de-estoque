module.exports = {
  create: `INSERT INTO usuario(id, nome, descricao, id_unidade, nivel, id_orgao, login, senha)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,

  verificacao_login: `SELECT senha, id FROM USUARIO WHERE login = $1;`,

  dados_usuario: `SELECT * FROM DADOS_USUARIO WHERE ID = $1;`,

  todosUsuarios: `SELECT ID,NOME, DESCRICAO, NIVEL, LOGIN FROM USUARIO ORDER BY NOME ASC;`,
  deleteUsuario: `DELETE FROM USUARIO WHERE ID = $1;`,
  updatePass: `UPDATE USUARIO SET SENHA = $1 WHERE LOGIN = $2;`,
};
