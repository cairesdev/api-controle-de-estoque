const yup = require("yup");

const orgao = yup.object().shape({
  NOME: yup.string().max(255, "Nome muito longo.").required(),
  ENDERECO: yup.string().max(100, "Endereço muito longo.").required(),
  BAIRRO: yup.string().max(100, "Nome da cidade muito longo.").required(),
  CIDADE: yup.string().max(100, "Nome do bairro muito longo.").required(),
  EMAIL: yup.string().max(125, "Email muito grande.").required(),
  TELEFONE: yup.string().max(18, "Numero muito longo.").required(),
});

const modulos = yup.object().shape({
  ESCOLAR: yup.number(),
  SAUDE: yup.number(),
  ASSISTENCIA_SOCIAL: yup.number(),
  COMBUSTIVEL: yup.number(),
});

module.exports = {
  orgao,
  modulos,
};
