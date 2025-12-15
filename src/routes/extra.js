const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/extras");

router.get("/extras/tipos/unidade", (req, res, next) =>
  InterceptError(controller.getAllTipoUnidade, req, res, next)
);

router.get("/extras/tipos/estoque", (req, res, next) =>
  InterceptError(controller.getAllTipoEstoque, req, res, next)
);

router.delete("/extras/tipos/estoque/:idTipoEstoque", (req, res, next) =>
  InterceptError(controller.deleteTipoEstoque, req, res, next)
);

router.delete("/extras/tipos/unidade/:idTipoUnidade", (req, res, next) =>
  InterceptError(controller.deleteTipoUnidade, req, res, next)
);

router.post("/extras/tipos/estoque", (req, res, next) =>
  InterceptError(controller.createTipoEstoque, req, res, next)
);

router.post("/extras/tipos/unidade", (req, res, next) =>
  InterceptError(controller.createTipoUnidade, req, res, next)
);

module.exports = router;
