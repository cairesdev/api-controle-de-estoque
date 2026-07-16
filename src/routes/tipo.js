const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/tipo");

router.get("/tipos/estoque", (req, res, next) =>
  InterceptError(controller.getAllTipoEstoque, req, res, next),
);

router.post("/tipos/estoque", (req, res, next) =>
  InterceptError(controller.createTipoEstoque, req, res, next),
);

router.delete("/tipos/estoque/:idTipo", (req, res, next) =>
  InterceptError(controller.softDeleteTipoEstoque, req, res, next),
);

router.get("/tipos/unidade", (req, res, next) =>
  InterceptError(controller.getAllTipoUnidade, req, res, next),
);

router.post("/tipos/unidade", (req, res, next) =>
  InterceptError(controller.createTipoUnidade, req, res, next),
);

router.delete("/tipos/unidade/:idTipo", (req, res, next) =>
  InterceptError(controller.softDeleteTipoUnidade, req, res, next),
);

module.exports = router;
