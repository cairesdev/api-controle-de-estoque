const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/solicitacao");

router.get("/solicitacoes/:idUnidade", (req, res, next) =>
  InterceptError(controller.getAll, req, res, next),
);

router.get("/solicitacoes/:idUnidade/liberadas", (req, res, next) =>
  InterceptError(controller.getAllLiberadas, req, res, next),
);

router.post("/solicitacoes/:idUnidade", (req, res, next) =>
  InterceptError(controller.create, req, res, next),
);

router.get(
  "/solicitacoes/:idSolicitacao/unidade/:idUnidade",
  (req, res, next) => InterceptError(controller.getById, req, res, next),
);

router.post("/solicitacoes/:idSolicitacao/itens", (req, res, next) =>
  InterceptError(controller.addItem, req, res, next),
);

router.put("/solicitacoes/:idSolicitacao/status/concluir", (req, res, next) =>
  InterceptError(controller.concluir, req, res, next),
);

router.delete("/solicitacoes/:idSolicitacao", (req, res, next) =>
  InterceptError(controller.softDelete, req, res, next),
);

module.exports = router;
