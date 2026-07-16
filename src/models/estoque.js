module.exports = {
  criarRemessa: `
    INSERT INTO armazem_orgao (id, nome, id_tipo_estoque, data_entrada, id_orgao, id_responsavel, local_estocado, codigo, qnt_registrada)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)
  `,

  updateQntRemessa: `
    UPDATE armazem_orgao SET qnt_registrada = qnt_registrada + $1 WHERE id = $2
  `,

  decrementaQntRemessa: `
    UPDATE armazem_orgao SET qnt_registrada = qnt_registrada - 1
    WHERE id = (SELECT id_estoque_origem FROM produto_estocado WHERE id = $1)
  `,

  decrementaQntEstoqueUnidade: `
    UPDATE estoque_unidade SET qnt_disponivel = qnt_disponivel - 1
    WHERE id = (SELECT id_estoque_origem FROM produto_estocado WHERE id = $1)
  `,

  softDeleteRemessa: `
    UPDATE armazem_orgao SET deleted_at = NOW() WHERE id = $1
  `,

  softDeleteTodasRemessasOrgao: `
    UPDATE armazem_orgao SET deleted_at = NOW() WHERE id_orgao = $1
  `,

  softDeleteTodasRemessasUnidade: `
    UPDATE estoque_unidade SET deleted_at = NOW() WHERE id_unidade = $1
  `,

  getRemessaOrgao: `
    SELECT
      ao.qnt_registrada,
      ao.local_estocado,
      ao.data_entrada,
      ao.codigo,
      u.nome,
      ao.nome AS nome_estoque,
      te.nome AS tipo_estoque
    FROM armazem_orgao ao
    LEFT JOIN usuario u ON ao.id_responsavel = u.id
    LEFT JOIN tipo_estoque te ON ao.id_tipo_estoque = te.id
    WHERE ao.id = $1 AND ao.deleted_at IS NULL
  `,

  getRemessaUnidade: `
    SELECT
      eu.local_estocado,
      eu.data_entrada,
      eu.codigo,
      eu.nome AS nome_estoque,
      eu.qnt_entrada,
      eu.qnt_disponivel,
      te.nome AS tipo_estoque,
      s.data_solicitacao,
      s.data_encerramento,
      u.nome AS solicitante
    FROM estoque_unidade eu
    JOIN solicitacao s ON eu.id_solicitacao = s.id
    JOIN tipo_estoque te ON s.id_tipo_estoque = te.id
    JOIN usuario u ON s.id_solicitante = u.id
    WHERE eu.id = $1
  `,

  getAllRemessasOrgao: `
    SELECT
      ao.id,
      ao.codigo,
      ao.nome AS nome_remessa,
      ao.data_entrada,
      ao.local_estocado,
      te.nome AS tipo_estoque,
      ao.qnt_registrada AS qnt_disponivel
    FROM armazem_orgao ao
    JOIN tipo_estoque te ON ao.id_tipo_estoque = te.id
    WHERE ao.id_orgao = $1 AND ao.deleted_at IS NULL
    ORDER BY ao.data_entrada DESC
  `,

  getAllItensOrgao: `
    SELECT
      pe.id,
      p.nome,
      pe.data_validade,
      pe.qnt_entrada,
      pe.qnt_disponivel,
      p.und_medida,
      ao.data_entrada,
      ao.id_tipo_estoque
    FROM produto_estocado pe
    INNER JOIN produto p ON pe.id_produto = p.id
    INNER JOIN armazem_orgao ao ON pe.id_estoque_origem = ao.id
    WHERE ao.id_orgao = $1 AND pe.deleted_at IS NULL
    ORDER BY pe.data_validade DESC
  `,

  getAllItensRemessa: `
    SELECT
      pe.id,
      p.nome,
      pe.data_validade,
      pe.qnt_entrada,
      pe.qnt_disponivel,
      p.und_medida,
      ao.data_entrada
    FROM produto_estocado pe
    INNER JOIN produto p ON pe.id_produto = p.id
    INNER JOIN armazem_orgao ao ON pe.id_estoque_origem = ao.id
    WHERE ao.id = $1 AND pe.deleted_at IS NULL
    ORDER BY pe.data_validade DESC
  `,

  getAllItensUnidade: `
    SELECT
      pe.id,
      p.nome,
      pe.data_validade,
      pe.qnt_entrada,
      pe.qnt_disponivel,
      p.und_medida,
      eu.data_entrada
    FROM produto_estocado pe
    INNER JOIN produto p ON pe.id_produto = p.id
    INNER JOIN estoque_unidade eu ON pe.id_estoque_origem = eu.id
    WHERE eu.id_unidade = $1 AND pe.qnt_disponivel <> 0 AND pe.deleted_at IS NULL
    ORDER BY pe.data_validade DESC
  `,

  getAllDisponiveisLista: `
    SELECT
      p.id,
      p.nome,
      pe.qnt_disponivel,
      p.und_medida,
      ao.id_tipo_estoque
    FROM produto_estocado pe
    INNER JOIN produto p ON pe.id_produto = p.id
    INNER JOIN armazem_orgao ao ON pe.id_estoque_origem = ao.id
    WHERE ao.id_orgao = (SELECT id_orgao FROM unidade WHERE id = $1)
      AND pe.deleted_at IS NULL
      AND pe.qnt_disponivel > 0
    ORDER BY pe.data_validade DESC
  `,

  getItensPorRemessa: `
    SELECT
      pe.id,
      p.nome,
      pe.qnt_entrada,
      pe.qnt_disponivel,
      pe.data_validade,
      p.und_medida
    FROM produto_estocado pe
    JOIN produto p ON pe.id_produto = p.id
    WHERE pe.id_estoque_origem = $1 AND pe.deleted_at IS NULL
  `,

  getOrigemItem: `
    SELECT ao.codigo, ao.nome
    FROM armazem_orgao ao
    JOIN movimentacao_armazem ma ON ao.id = ma.id_armazem_orgao
    WHERE ma.id_produto_destino = $1
  `,

  estocarItemIndividual: `
    INSERT INTO produto_estocado (id, id_estoque_origem, data_validade, data_ultima_movimentacao, qnt_entrada, qnt_disponivel, id_produto)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,

  estocarItemPorNome: `
    INSERT INTO produto_estocado (id, id_estoque_origem, data_validade, data_ultima_movimentacao, qnt_entrada, qnt_disponivel, id_produto)
    VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM produto WHERE nome = $7))
  `,

  softDeleteItem: `
    UPDATE produto_estocado SET deleted_at = NOW() WHERE id = $1
  `,

  updateQntItem: `
    UPDATE produto_estocado SET qnt_disponivel = qnt_disponivel - $1 WHERE id = $2
  `,

  criarMovimentoEstoque: `
    INSERT INTO movimentacao_estoque (id, id_produto_estocado, data_movimentacao, qnt_movimentada, id_tipo_movimentacao)
    VALUES ($1, $2, $3, $4, 'f28031fd-af25-49cd-a430-47680f3aaa2b')
  `,

  criarMovimentoDelecao: `
    INSERT INTO movimentacao_estoque (id, id_produto_estocado, data_movimentacao, qnt_movimentada, id_tipo_movimentacao, id_usuario)
    VALUES ($1, $2, $3, (SELECT qnt_disponivel FROM produto_estocado WHERE id = $4), $5, $6)
  `,
};
