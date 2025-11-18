const router = require("express").Router();

const orgao = require("./orgao");
const user = require("./user");
const unidade = require("./unidade");

router.use("/v1", orgao);
router.use("/v1", user);
router.use("/v1", unidade);

module.exports = router;
