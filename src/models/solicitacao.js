module.exports = {
  createSolicitacao: `INSERT INTO solicitacao (id, id_unidade, id_orgao, id_status, data_solicitacao, id_solicitante, nome) VALUES ($1,$2,(select id_orgao from unidade where id = $3),$4,$5,$6,$7);`,

  createItemSolicitado: `INSERT INTO produto_solicitado (id, id_solicitacao, id_produto, qnt_solicitada)
	VALUES ($1, $2, $3, $4);`,

  getSolicitacoes: `
  SELECT S.ID, S.NOME, S.DATA_SOLICITACAO, U.NOME, ST.NOME as "status" 
  FROM SOLICITACAO S 
  JOIN USUARIO U ON S.ID_SOLICITANTE = U.ID 
  JOIN STATUS_SOLICITACAO ST ON S.ID_STATUS = ST.ID 
  WHERE S.ID_UNIDADE = $1 ORDER BY S.DATA_SOLICITACAO;
  `,
};
