module.exports = {
  cadastro_produto: `
 INSERT INTO produto (id, nome, und_medida)
	VALUES ($1, $2, $3) on conflict (nome,und_medida) do nothing;
 `,

  cadastro_armazem: `INSERT INTO armazem_orgao (ID, NOME, ID_TIPO_ESTOQUE, DATA_ENTRADA, ID_ORGAO, ID_RESPONSAVEL, LOCAL_ESTOCADO,CODIGO) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,

  verifica_usuario: `SELECT NIVEL FROM USUARIO WHERE ID = $1;`,

  update_armazem: `UPDATE ARMAZEM_ORGAO SET QNT_REGISTRADA = QNT_REGISTRADA + $1 WHERE ID = $2;`,

  estocar_produto: `INSERT INTO produto_estocado (id, id_estoque_origem, data_validade, data_ultima_movimentacao, qnt_entrada, qnt_disponivel, id_produto)
	VALUES ($1, $2, $3, $4, $5, $6,(select id from produto where nome = $7));`,

  estocar_item: `INSERT INTO produto_estocado (ID,ID_ESTOQUE_ORIGEM,DATA_VALIDADE,DATA_ULTIMA_MOVIMENTACAO,QNT_ENTRADA,QNT_DISPONIVEL,ID_PRODUTO) VALUES ($1, $2, $3, $4, $5, $6, $7);`,

  getItens: `SELECT PE.ID, P.NOME, PE.QNT_ENTRADA, PE.DATA_VALIDADE, P.UND_MEDIDA FROM produto_estocado PE
  JOIN PRODUTO P ON PE.ID_PRODUTO = P.ID
  WHERE ID_ESTOQUE_ORIGEM = $1;`,

  getRemessa: `SELECT AO.QNT_REGISTRADA, AO.LOCAL_ESTOCADO, AO.DATA_ENTRADA, AO.CODIGO, U.NOME FROM ARMAZEM_ORGAO AO JOIN USUARIO U ON AO.ID_RESPONSAVEL = U.ID WHERE AO.ID = $1;`,

  getAllEstoque: `
  SELECT PE.ID, P.NOME, PE.DATA_VALIDADE, PE.QNT_ENTRADA, PE.QNT_DISPONIVEL, P.UND_MEDIDA, AO.DATA_ENTRADA 
  FROM PRODUTO_ESTOCADO PE
  INNER JOIN PRODUTO P ON PE.ID_PRODUTO = P.ID
  INNER JOIN ARMAZEM_ORGAO AO ON PE.ID_ESTOQUE_ORIGEM = AO.ID
  WHERE AO.ID_ORGAO = $1 ORDER BY PE.DATA_VALIDADE DESC;
  `,

  createEstoqueUnidade: `INSERT INTO estoque_unidade(
	id, nome, data_entrada, codigo, qnt_entrada, qnt_disponivel, id_unidade, id_solicitacao)
	VALUES ($1, (select nome from solicitacao where id = $2), $3, $4, $5, $6, $7, $8);`,

  estocar_item_solicitado: `INSERT INTO produto_estocado (ID,ID_ESTOQUE_ORIGEM,DATA_VALIDADE,DATA_ULTIMA_MOVIMENTACAO,QNT_ENTRADA,QNT_DISPONIVEL,ID_PRODUTO) VALUES ($1, $2, (select data_validade from produto_estocado where id = $3), $4, $5, $6, (select id_produto from produto_estocado where id = $7));`,

  rezumirItemRetirado: `UPDATE PRODUTO_ESTOCADO SET QNT_DISPONIVEL = QNT_DISPONIVEL - $1 WHERE ID = $2;`,

  update_solicitacao_status: `UPDATE SOLICITACAO SET ID_STATUS = 'd915a72e-09ae-49af-926d-a0c399fd1aba' WHERE ID = $1;`,

  getEstoque: `SELECT EU.CODIGO, EU.NOME, EU.DATA_ENTRADA, EU.QNT_ENTRADA, EU.QNT_DISPONIVEL, EU.LOCAL_ESTOCADO, U.NOME AS "solicitante", S.DATA_SOLICITACAO, SS.NOME AS "status"
  FROM ESTOQUE_UNIDADE EU
  JOIN SOLICITACAO S ON EU.ID_SOLICITACAO = S.ID
  JOIN USUARIO U ON S.ID_SOLICITANTE = U.ID
  JOIN STATUS_SOLICITACAO SS ON S.ID_STATUS = SS.ID
  WHERE EU.ID = $1 AND EU.CODIGO = $2;
  `,
};
