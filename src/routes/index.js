const router = require("express").Router();

const orgao = require("./orgao");
const unidade = require("./unidade");
const usuario = require("./user");
const estoque = require("./estoque");
const solicitacao = require("./solicitacao");
const despacho = require("./despacho");
const tipo = require("./tipo");
const garagem = require("./garagem");

router.use("/v1", orgao);
router.use("/v1", unidade);
router.use("/v1", usuario);
router.use("/v1", estoque);
router.use("/v1", solicitacao);
router.use("/v1", despacho);
router.use("/v1", tipo);
router.use("/v1", garagem);

module.exports = router;
