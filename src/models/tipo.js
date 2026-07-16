module.exports = {
  createTipoEstoque: `
    INSERT INTO tipo_estoque (id, nome) VALUES ($1, $2)
  `,

  getAllTipoEstoque: `
    SELECT * FROM tipo_estoque ORDER BY nome ASC
  `,

  softDeleteTipoEstoque: `
    UPDATE tipo_estoque SET deleted_at = NOW() WHERE id = $1
  `,

  createTipoUnidade: `
    INSERT INTO tipo_unidade (id, nome) VALUES ($1, $2)
  `,

  getAllTipoUnidade: `
    SELECT * FROM tipo_unidade ORDER BY nome ASC
  `,

  softDeleteTipoUnidade: `
    UPDATE tipo_unidade SET deleted_at = NOW() WHERE id = $1
  `,
};
