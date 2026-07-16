module.exports = {
  criarEstoqueUnidade: `
    INSERT INTO estoque_unidade (id, nome, data_entrada, codigo, qnt_entrada, qnt_disponivel, id_unidade, id_solicitacao, id_tipo_estoque)
    VALUES ($1, (SELECT nome FROM solicitacao WHERE id = $2), $3, $4, $5, $6, $7, $8, (SELECT id_tipo_estoque FROM solicitacao WHERE id = $9))
  `,

  estocarItemDespachado: `
    INSERT INTO produto_estocado (id, id_estoque_origem, data_validade, data_ultima_movimentacao, qnt_entrada, qnt_disponivel, id_produto)
    VALUES (
      $1,
      $2,
      (SELECT data_validade FROM produto_estocado WHERE id = $3),
      $4,
      $5,
      $6,
      (SELECT id_produto FROM produto_estocado WHERE id = $7)
    )
  `,

  criarMovimentoArmazem: `
    INSERT INTO movimentacao_armazem (id, id_estoque_unidade, id_armazem_orgao, data_movimentacao, qnt_movimentada, id_produto_destino, id_produto_origem)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,

  decrementaItemOrigem: `
    UPDATE produto_estocado SET qnt_disponivel = qnt_disponivel - $1 WHERE id = $2
  `,

  atualizaStatusSolicitacao: `
    UPDATE solicitacao
    SET id_status = 'd915a72e-09ae-49af-926d-a0c399fd1aba', id_despachante = $2, data_encerramento = $3
    WHERE id = $1
  `,

  getComprovante: `
    SELECT
      eu.codigo,
      eu.nome,
      eu.data_entrada,
      eu.qnt_entrada,
      eu.qnt_disponivel,
      eu.local_estocado,
      u.nome AS solicitante,
      s.data_solicitacao,
      ss.nome AS status,
      ud.nome AS despachante,
      eu.id_unidade AS unidade,
      o.nome AS orgao,
      o.cidade
    FROM estoque_unidade eu
    JOIN solicitacao s ON eu.id_solicitacao = s.id
    JOIN usuario u ON s.id_solicitante = u.id
    JOIN usuario ud ON s.id_despachante = ud.id
    JOIN unidade und ON eu.id_unidade = und.id
    JOIN orgao o ON und.id_orgao = o.id
    JOIN status_solicitacao ss ON s.id_status = ss.id
    WHERE eu.id = $1 AND eu.codigo = $2
  `,
};
