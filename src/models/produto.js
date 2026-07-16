module.exports = {
  upsert: `
    INSERT INTO produto (id, nome, und_medida)
    VALUES ($1, $2, $3)
    ON CONFLICT (nome, und_medida) DO NOTHING
  `,

  getAll: `
    SELECT * FROM produto WHERE deleted_at IS NULL ORDER BY nome ASC
  `,
};
