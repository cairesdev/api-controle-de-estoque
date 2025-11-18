const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");

const schema = require("../lib/schemas/unidade");
const controller = require("../controllers/unidade");
const m = new validator(schema.unidade);

router.post(
  "/unidade/:idEntidade",
  (req, res, next) => m.validate(req, res, next),
  (req, res, next) => InterceptError(controller.create, req, res, next)
);

router.patch(
  "/unidade/:idUnidade",
  (req, res, next) => m.validate(req, res, next),
  (req, res, next) => InterceptError(controller.update, req, res, next)
);

router.get("/unidades/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAll, req, res, next)
);

router.get("/unidade/:idUnidade", (req, res, next) =>
  InterceptError(controller.getUnique, req, res, next)
);

module.exports = router;
