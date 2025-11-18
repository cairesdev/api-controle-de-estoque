module.exports = {
  create: `INSERT INTO unidade (id, nome, endereco, bairro, id_orgao, email, telefone, status, id_tipo_unidade)
	VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8);`,

  verifica_unidade: `SELECT ID FROM UNIDADE WHERE ID_ORGAO =$1 and NOME = $2;`,

  getAll: `SELECT ID, NOME, STATUS FROM UNIDADE WHERE ID_ORGAO = $1 ORDER BY NOME ASC;`,
  getUnique: `SELECT NOME, STATUS, ENDERECO, BAIRRO ,EMAIL, TELEFONE, ID_TIPO_UNIDADE FROM UNIDADE WHERE id = $1;`,

  updade: `UPDATE unidade
	SET nome=$1, endereco=$2, bairro=$3, email=$4, telefone=$5, status=$6, id_tipo_unidade=$7
	WHERE id=$8;`,
};
