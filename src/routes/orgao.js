const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");

const schema = require("../lib/schemas/orgao");
const controller = require("../controllers/orgao");

const o = new validator(schema.orgao);
const m = new validator(schema.modulos);

router.get("/entidade", (req, res, next) =>
  InterceptError(controller.listaEntidades, req, res, next)
);

router.get("/entidade/:idEntidade", (req, res, next) =>
  InterceptError(controller.listaEntidade, req, res, next)
);

router.post(
  "/entidade",
  (req, res, next) => o.validate(req, res, next),
  (req, res, next) => InterceptError(controller.create, req, res, next)
);

router.patch(
  "/entidade/:idEntidade",
  (req, res, next) => o.validate(req, res, next),
  (req, res, next) => InterceptError(controller.updateEntidade, req, res, next)
);

router.post(
  "/modulos/:idEntidade",
  (req, res, next) => m.validate(req, res, next),
  (req, res, next) =>
    InterceptError(controller.cadastrarModulos, req, res, next)
);

router.patch(
  "/modulos/:idEntidade",
  (req, res, next) => m.validate(req, res, next),
  (req, res, next) => InterceptError(controller.updateModulos, req, res, next)
);

module.exports = router;
