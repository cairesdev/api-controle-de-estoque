const yup = require("yup");

const create = yup.object().shape({
  NOME: yup.string().max(255, "Nome muito longo.").required(),
  DESCRICAO: yup.string().max(255, "Descrição muito longa.").required(),
  UNIDADE: yup.string().max(80, "Unidade não reconhecida.").nullable(),
  ORGAO: yup.string().max(80, "Entidade não reconhecida.").required(),
  LOGIN: yup.string().max(80, "Nome de usuario muito longo.").required(),
  SENHA: yup.string().max(30, "Senha muito longa.").required(),
  NIVEL: yup.number().required(),
  TIPO_ALMOXARIFE: yup.number().required(),
});

module.exports = {
  create,
};
