const router = require("express").Router();

const user = require("./user");
const orgao = require("./orgao");
const unidade = require("./unidade");
const armazem = require("./armazem");
const solicitacao = require("./solicitacao");
const extras = require("./extra");
const garagem = require("./garagem");

router.use("/v1", garagem);
router.use("/v1", extras);
router.use("/v1", user);
router.use("/v1", orgao);
router.use("/v1", unidade);
router.use("/v1", armazem);
router.use("/v1", solicitacao);

module.exports = router;
