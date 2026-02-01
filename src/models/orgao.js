module.exports = {
  cadastro: `INSERT INTO orgao(id, nome, endereco, bairro, cidade, email, telefone, status)
	VALUES ($1, $2, $3, $4, $5, $6, $7, 1);`,

  update: `UPDATE orgao
	SET nome=$1, endereco=$2, bairro=$3, cidade=$4, email=$5, telefone=$6, status=$7 WHERE id=$8;`,

  modulos_liberados: `INSERT INTO modulos_liberados (id,id_orgao,escolar,saude,assistencia_social,combustivel) 
  values ($1,$2,$3,$4,$5,$6);`,

  update_modulos_liberados: `UPDATE modulos_liberados SET escolar=$1,saude=$2,assistencia_social=$3,combustivel=$4 where id_orgao = $5;`,

  getModulosLiberados: `SELECT escolar, saude, combustivel from modulos_liberados where id_orgao = $1;`,

  verificacao_nome: `SELECT id FROM ORGAO WHERE NOME = $1;`,
  verifica_modulo: `SELECT id FROM modulos_liberados WHERE id_orgao = $1;`,

  getEntidades: `SELECT ID, NOME, STATUS FROM ORGAO ORDER BY NOME ASC;`,
  getEntidade: `SELECT NOME, STATUS, ENDERECO, BAIRRO, CIDADE, EMAIL, TELEFONE FROM ORGAO WHERE ID = $1;`,

  getEstoque: `SELECT AO.ID, AO.CODIGO, AO.NOME AS "nome_remessa", AO.DATA_ENTRADA, AO.LOCAL_ESTOCADO, TE.NOME as "tipo_estoque",AO.QNT_REGISTRADA as "qnt_disponivel"
  FROM ARMAZEM_ORGAO AO 
  JOIN TIPO_ESTOQUE TE ON AO.ID_TIPO_ESTOQUE = TE.ID
  WHERE ID_ORGAO = $1 AND AO.EXCLUIDO = 0 ORDER BY AO.DATA_ENTRADA DESC;`,

  getEstoqueUnidade: `SELECT EU.ID, EU.CODIGO, EU.NOME AS "nome_remessa", EU.DATA_ENTRADA, EU.LOCAL_ESTOCADO, TE.NOME as "tipo_estoque", EU.QNT_DISPONIVEL
  FROM ESTOQUE_UNIDADE EU 
  JOIN TIPO_ESTOQUE TE ON EU.ID_TIPO_ESTOQUE = TE.ID
  WHERE ID_UNIDADE = $1 ORDER BY EU.DATA_ENTRADA DESC;`,
};
