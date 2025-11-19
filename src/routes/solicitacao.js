const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");

const controller = require("../controllers/solicitacao");

router.post("/solicitacao/:idUnidade", (req, res, next) =>
  InterceptError(controller.createSolicitacao, req, res, next)
);

module.exports = router;
