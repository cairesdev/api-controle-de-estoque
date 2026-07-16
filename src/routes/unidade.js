const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");
const schema = require("../lib/schemas/unidade");
const controller = require("../controllers/unidade");

const validateUnidade = new validator(schema.unidade);

router.get("/unidades/:idOrgao", (req, res, next) =>
  InterceptError(controller.getAll, req, res, next),
);

router.get("/unidades/:idUnidade/detalhes", (req, res, next) =>
  InterceptError(controller.getById, req, res, next),
);

router.get("/unidades/:idUnidade/estoque", (req, res, next) =>
  InterceptError(controller.getEstoque, req, res, next),
);

router.post(
  "/unidades/:idOrgao",
  (req, res, next) => validateUnidade.validate(req, res, next),
  (req, res, next) => InterceptError(controller.create, req, res, next),
);

router.patch(
  "/unidades/:idUnidade",
  (req, res, next) => validateUnidade.validate(req, res, next),
  (req, res, next) => InterceptError(controller.update, req, res, next),
);

module.exports = router;
