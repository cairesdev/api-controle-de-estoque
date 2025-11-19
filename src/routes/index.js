const router = require("express").Router();

const user = require("./user");
const orgao = require("./orgao");
const unidade = require("./unidade");
const armazem = require("./armazem");
const solicitacao = require("./solicitacao");

router.use("/v1", user);
router.use("/v1", orgao);
router.use("/v1", unidade);
router.use("/v1", armazem);
router.use("/v1", solicitacao);

module.exports = router;
