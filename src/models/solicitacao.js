module.exports = {
  createSolicitacao: `INSERT INTO solicitacao (id, id_unidade, id_orgao, id_status, data_solicitacao, id_solicitante, nome) VALUES ($1,$2,(select id_orgao from unidade where id = $3),$4,$5,$6,$7);`,

  createItemSolicitado: `INSERT INTO produto_solicitado (id, id_solicitacao, id_produto, qnt_solicitada)
	VALUES ($1, $2, $3, $4);`,

  getSolicitacoes: `
  SELECT S.ID, S.NOME, S.DATA_SOLICITACAO, U.NOME as "solicitante", ST.NOME as "status", UND.NOME as "unidade", UND.id as "id_unidade"  
  FROM SOLICITACAO S 
  JOIN USUARIO U ON S.ID_SOLICITANTE = U.ID 
  JOIN STATUS_SOLICITACAO ST ON S.ID_STATUS = ST.ID
  JOIN UNIDADE UND ON S.ID_UNIDADE = UND.ID
  WHERE S.ID_UNIDADE = $1 OR S.ID_ORGAO = $1 ORDER BY S.DATA_SOLICITACAO;
  `,

  getSolicitacao: `
  SELECT S.ID, S.NOME, S.DATA_SOLICITACAO, U.NOME as "solicitante", ST.NOME as "status", UND.NOME as "unidade" 
  FROM SOLICITACAO S 
  JOIN USUARIO U ON S.ID_SOLICITANTE = U.ID 
  JOIN STATUS_SOLICITACAO ST ON S.ID_STATUS = ST.ID 
  JOIN UNIDADE UND ON S.ID_UNIDADE = UND.ID
  WHERE S.id = $1;
  `,

  getItensSolicitacao: `
  SELECT PS.ID, PS.QNT_SOLICITADA, P.NOME, P.UND_MEDIDA, PS.ID_PRODUTO from produto_solicitado PS 
  JOIN PRODUTO P ON PS.ID_PRODUTO = P.ID
  WHERE PS.ID_SOLICITACAO = $1;
  `,

  setAsPendente: `update solicitacao set id_status = '7c92f4cf-f76b-4333-ac06-6b60bf2b2518' where id = $1;`,

  getProdutosDisponiveis: `
  SELECT PE.QNT_DISPONIVEL, PE.ID, PE.data_validade, PE.ID_ESTOQUE_ORIGEM 
  FROM produto_estocado PE
  JOIN ARMAZEM_ORGAO AO ON PE.ID_ESTOQUE_ORIGEM = AO.ID 
  WHERE PE.ID_PRODUTO = $1 AND AO.ID_ORGAO = $2 AND PE.QNT_DISPONIVEL <> 0 order by PE.data_validade asc LIMIT 1;
  `,
};
