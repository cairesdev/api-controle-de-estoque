const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/despacho");

router.get("/despacho/:idSolicitacao/orgao/:idOrgao", (req, res, next) =>
  InterceptError(controller.compararEstoque, req, res, next),
);

router.post("/despacho/:idSolicitacao", (req, res, next) =>
  InterceptError(controller.liberar, req, res, next),
);

router.get("/despacho/comprovante/:idEstoque/:codigo", (req, res, next) =>
  InterceptError(controller.getComprovante, req, res, next),
);

module.exports = router;
