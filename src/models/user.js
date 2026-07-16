module.exports = {
  create: `
    INSERT INTO usuario (id, nome, descricao, id_unidade, nivel, id_orgao, login, senha, tipo_almoxarifado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `,

  verificacao_login: `
    SELECT senha, id FROM usuario WHERE login = $1 AND deleted_at IS NULL
  `,

  dados_usuario: `
    SELECT * FROM dados_usuario WHERE id = $1
  `,

  getAll: `
    SELECT u.id, u.nome, u.descricao, u.nivel, u.login, und.nome AS unidade
    FROM usuario u
    INNER JOIN unidade und ON u.id_unidade = und.id
    WHERE u.deleted_at IS NULL
    ORDER BY u.nome ASC
  `,

  softDelete: `
    UPDATE usuario SET deleted_at = NOW() WHERE id = $1
  `,

  updateSenha: `
    UPDATE usuario SET senha = $1 WHERE login = $2 AND deleted_at IS NULL
  `,

  updateBasicos: `
    UPDATE usuario SET nome = $1, descricao = $2, nivel = $3 WHERE id = $4 AND deleted_at IS NULL
  `,

  getTipoAlmoxarifado: `
    SELECT id_tipo_unidade FROM unidade WHERE id = $1 AND deleted_at IS NULL
  `,

  verifica_nivel: `
    SELECT nivel FROM usuario WHERE id = $1 AND deleted_at IS NULL
  `,
};
