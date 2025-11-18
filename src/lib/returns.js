const Return = (response, httpStatus, message, data) => {
  return response.status(httpStatus).json({
    message: message,
    res: data,
  });
};

const DefaultMessages = {
  cadastrado: "Cadastrado com sucesso.",
  not_found: "Item não encontrado.",
  server_error: "Erro interno do servidor. Tente novamente mais tarde.",
  atualizado: "Atualizado com sucesso.",
  no_content: "Nenhum item presente na requisição.",
  nao_autorizado: "Usuario não autorizado.",

  // CONFLITOS
  cft_nome: "Nome já registrado na base de dados.",
  cft_usuario: "Usuario não disponível.",
  cft_modulos: "Modulos já registrados.",

  // LISTAGEM
  capturados: "Itens capturados com sucesso.",
  capturado: "Item capturado com sucesso.",
};

module.exports = { Return, DefaultMessages };
