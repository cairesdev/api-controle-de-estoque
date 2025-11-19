const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");

const controller = require("../controllers/solicitacao");

router.post("/solicitacao/:idUnidade", (req, res, next) =>
  InterceptError(controller.createSolicitacao, req, res, next)
);
router.post("/solicitacao/itens/:idSolicitacao", (req, res, next) =>
  InterceptError(controller.itemSolicitado, req, res, next)
);

router.get("/solicitacoes/:idUnidade", (req, res, next) =>
  InterceptError(controller.getSolicitacoes, req, res, next)
);

module.exports = router;
