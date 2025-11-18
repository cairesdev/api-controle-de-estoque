module.exports = {
  cadastro_produto: `
 INSERT INTO produto (id, nome, und_medida)
	VALUES ($1, $2, $3) on conflict (nome,und_medida) do nothing;
 `,

  cadastro_armazem: `INSERT INTO armazem_orgao (ID, CODIGO, NOME, ID_TIPO_ESTOQUE, DATA_ENTRADA, ID_ORGAO, ID_RESPONSAVEL, LOCAL_ESTOCADO) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,

  verifica_usuario: `SELECT NIVEL FROM USUARIO WHERE ID = $1;`,

  update_armazem: `UPDATE ARMAZEM_ORGAO SET QNT_REGISTRADA = $1, CODIGO = $2 WHERE ID = $3;`,

  estocar_produto: `INSERT INTO produto_estocado (id, id_estoque_origem, data_validade, data_ultima_movimentacao, qnt_entrada, qnt_disponivel, id_produto)
	VALUES ($1, $2, $3, $4, $5, $6,(select id from produto where nome = $7));`,
};
