const yup = require("yup");

const unidade = yup.object().shape({
  NOME: yup.string().max(155, "tamanho máximo atingido."),
  ENDERECO: yup.string().max(100, "Tamanho maximo atingido."),
  BAIRRO: yup.string().max(100, "Tamanho maximo atingido."),
  TELEFONE: yup.string().max(18, "Tamanho maximo atingido."),
  EMAIL: yup.string().max(80, "Tamanho maximo atingido."),
  TIPO_UNIDADE: yup.number(),
});

module.exports = {
  unidade,
};
