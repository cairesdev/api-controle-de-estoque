module.exports = {
  create: `
    INSERT INTO solicitacao (id, id_unidade, id_orgao, id_status, data_solicitacao, id_solicitante, nome, id_tipo_estoque)
    VALUES ($1, $2, (SELECT id_orgao FROM unidade WHERE id = $3), $4, $5, $6, $7, $8)
  `,

  softDelete: `
    UPDATE solicitacao SET deleted_at = NOW() WHERE id = $1
  `,

  softDeleteItensSolicitacao: `
    UPDATE produto_solicitado SET deleted_at = NOW() WHERE id_solicitacao = $1
  `,

  softDeleteTodasOrgao: `
    UPDATE solicitacao SET deleted_at = NOW() WHERE id_orgao = $1
  `,

  softDeleteTodasUnidade: `
    UPDATE solicitacao SET deleted_at = NOW() WHERE id_unidade = $1
  `,

  addItem: `
    INSERT INTO produto_solicitado (id, id_solicitacao, id_produto, qnt_solicitada)
    VALUES ($1, $2, $3, $4)
  `,

  getAll: `
    SELECT
      s.id,
      s.nome,
      s.data_solicitacao,
      u.nome AS solicitante,
      st.nome AS status,
      und.nome AS unidade,
      und.id AS id_unidade,
      te.nome AS tipo_solicitacao
    FROM solicitacao s
    JOIN usuario u ON s.id_solicitante = u.id
    JOIN status_solicitacao st ON s.id_status = st.id
    JOIN tipo_estoque te ON s.id_tipo_estoque = te.id
    JOIN unidade und ON s.id_unidade = und.id
    WHERE (s.id_unidade = $1 OR s.id_orgao = $1)
      AND s.deleted_at IS NULL
    ORDER BY s.data_solicitacao
  `,

  getAllLiberadas: `
    SELECT
      s.id,
      s.nome,
      s.data_solicitacao,
      u.nome AS solicitante,
      st.nome AS status,
      und.nome AS unidade,
      und.id AS id_unidade,
      te.nome AS tipo_solicitacao
    FROM solicitacao s
    JOIN usuario u ON s.id_solicitante = u.id
    JOIN status_solicitacao st ON s.id_status = st.id
    JOIN tipo_estoque te ON s.id_tipo_estoque = te.id
    JOIN unidade und ON s.id_unidade = und.id
    WHERE (s.id_unidade = $1 OR s.id_orgao = $1)
      AND s.id_status = 'd915a72e-09ae-49af-926d-a0c399fd1aba'
      AND s.deleted_at IS NULL
    ORDER BY s.data_solicitacao
  `,

  getById: `
    SELECT
      s.id,
      s.nome,
      s.data_solicitacao,
      s.data_encerramento,
      u.nome AS solicitante,
      st.nome AS status,
      und.nome AS unidade
    FROM solicitacao s
    JOIN usuario u ON s.id_solicitante = u.id
    JOIN status_solicitacao st ON s.id_status = st.id
    JOIN unidade und ON s.id_unidade = und.id
    WHERE s.id = $1 AND s.deleted_at IS NULL
  `,

  getItens: `
    SELECT ps.id, ps.qnt_solicitada, p.nome, p.und_medida, ps.id_produto
    FROM produto_solicitado ps
    JOIN produto p ON ps.id_produto = p.id
    WHERE ps.id_solicitacao = $1 AND ps.deleted_at IS NULL
  `,

  getEstoqueVinculado: `
    SELECT eu.codigo, eu.nome, eu.data_entrada, eu.qnt_entrada, eu.qnt_disponivel, eu.local_estocado, eu.id
    FROM estoque_unidade eu
    WHERE eu.id_solicitacao = $1
    LIMIT 1
  `,

  setAsPendente: `
    UPDATE solicitacao
    SET id_status = '7c92f4cf-f76b-4333-ac06-6b60bf2b2518'
    WHERE id = $1 AND id_status = 'e1d9ab68-ec2d-47b0-99aa-28bb2f6578f7'
  `,

  setAsConcluida: `
    UPDATE solicitacao
    SET id_status = 'd7e3227d-854b-41e5-a4db-94cadf994d78'
    WHERE id = $1 AND id_status = 'd915a72e-09ae-49af-926d-a0c399fd1aba'
  `,

  verificaDisponivel: `
    SELECT p.id, pe.qnt_disponivel, p.und_medida
    FROM produto_estocado pe
    INNER JOIN produto p ON pe.id_produto = p.id
    INNER JOIN armazem_orgao ao ON pe.id_estoque_origem = ao.id
    WHERE ao.id_orgao = (SELECT id_orgao FROM unidade WHERE id = $1)
      AND pe.deleted_at IS NULL
      AND pe.qnt_disponivel > 0
      AND p.id = $2
    ORDER BY pe.data_validade DESC
  `,

  getProdutosDisponiveisOrgao: `
    SELECT
      pe.qnt_disponivel,
      pe.id,
      pe.data_validade,
      pe.id_estoque_origem,
      ao.nome,
      ao.codigo
    FROM produto_estocado pe
    JOIN armazem_orgao ao ON pe.id_estoque_origem = ao.id
    WHERE pe.id_produto = $1
      AND ao.id_orgao = $2
      AND pe.qnt_disponivel > 0
      AND ao.deleted_at IS NULL
      AND pe.deleted_at IS NULL
    ORDER BY pe.data_validade ASC
  `,

  getItensUnidadePorProduto: `
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
    WHERE eu.id_unidade = $1
      AND pe.qnt_disponivel > 0
      AND p.id = $2
      AND pe.deleted_at IS NULL
    ORDER BY pe.data_validade DESC
  `,
};
