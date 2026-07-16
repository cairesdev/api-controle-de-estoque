module.exports = {
  create: `
    INSERT INTO unidade (id, nome, endereco, bairro, id_orgao, email, telefone, status, id_tipo_unidade)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8)
  `,

  update: `
    UPDATE unidade
    SET nome = $1, endereco = $2, bairro = $3, email = $4, telefone = $5, status = $6, id_tipo_unidade = $7
    WHERE id = $8
  `,

  verifica_nome: `
    SELECT id FROM unidade WHERE id_orgao = $1 AND nome = $2 AND deleted_at IS NULL
  `,

  getAll: `
    SELECT id, nome, status, id_tipo_unidade
    FROM unidade
    WHERE id_orgao = $1 AND deleted_at IS NULL
    ORDER BY nome ASC
  `,

  getById: `
    SELECT nome, status, endereco, bairro, email, telefone, id_tipo_unidade
    FROM unidade
    WHERE id = $1 AND deleted_at IS NULL
  `,

  getEstoque: `
    SELECT
      eu.id,
      eu.codigo,
      eu.nome AS nome_remessa,
      eu.data_entrada,
      eu.local_estocado,
      te.nome AS tipo_estoque,
      eu.qnt_disponivel
    FROM estoque_unidade eu
    JOIN solicitacao s ON eu.id_solicitacao = s.id
    JOIN tipo_estoque te ON eu.id_tipo_estoque = te.id
    WHERE eu.id_unidade = $1
      AND s.id_status = 'd7e3227d-854b-41e5-a4db-94cadf994d78'
      AND eu.deleted_at IS NULL
    ORDER BY eu.data_entrada DESC
  `,
};
