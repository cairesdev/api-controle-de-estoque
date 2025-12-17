const PG_DEFAULT_POOL = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

const T_PT = {
  cadastrado: "Cadastrado com sucesso.",
  not_found: "Item não encontrado.",
  server_error: "Erro interno do servidor. Tente novamente mais tarde.",
  atualizado: "Atualizado com sucesso.",
  no_content: "Nenhum item presente na requisição.",
  nao_autorizado: "Usuario não autorizado.",
  apagado: "Apagado com sucesso.",

  // CONFLITOS
  cft_nome: "Nome já registrado na base de dados.",
  cft_usuario: "Usuario não disponível.",
  cft_modulos: "Modulos já registrados.",
  cft_credenciais: "Credenciais inválidas.",

  // LISTAGEM
  capturados: "Itens capturados com sucesso.",
  capturado: "Item capturado com sucesso.",
  autorizado: "Acesso autorizado.",
};

module.exports = { PG_DEFAULT_POOL, T_PT };
