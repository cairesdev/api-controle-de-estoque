module.exports = {
  cadastro: `INSERT INTO orgao(id, nome, endereco, bairro, cidade, email, telefone, status)
	VALUES ($1, $2, $3, $4, $5, $6, $7, 1);`,

  update: `UPDATE orgao
	SET nome=$1, endereco=$2, bairro=$3, cidade=$4, email=$5, telefone=$6, status=$7 WHERE id=$8;`,

  modulos_liberados: `INSERT INTO modulos_liberados (id,id_orgao,escolar,saude,assistencia_social,outros) 
  values ($1,$2,$3,$4,$5,$6);`,

  update_modulos_liberados: `UPDATE modulos_liberados SET escolar=$1,saude=$2,assistencia_social=$3,outros=$4 where id_orgao = $5;`,

  verificacao_nome: `SELECT id FROM ORGAO WHERE NOME = $1;`,
  verifica_modulo: `SELECT id FROM modulos_liberados WHERE id_orgao = $1;`,

  getEntidades: `SELECT ID, NOME, STATUS FROM ORGAO ORDER BY NOME ASC;`,
  getEntidade: `SELECT NOME, STATUS, ENDERECO, BAIRRO, CIDADE, EMAIL, TELEFONE FROM ORGAO WHERE ID = $1;`,
};
