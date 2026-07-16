const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");
const schema = require("../lib/schemas/orgao");
const controller = require("../controllers/orgao");

const validateOrgao = new validator(schema.orgao);
const validateModulos = new validator(schema.modulos);

router.get("/orgaos", (req, res, next) =>
  InterceptError(controller.getAll, req, res, next),
);

router.get("/orgaos/:idOrgao", (req, res, next) =>
  InterceptError(controller.getById, req, res, next),
);

router.post(
  "/orgaos",
  (req, res, next) => validateOrgao.validate(req, res, next),
  (req, res, next) => InterceptError(controller.create, req, res, next),
);

router.patch(
  "/orgaos/:idOrgao",
  (req, res, next) => validateOrgao.validate(req, res, next),
  (req, res, next) => InterceptError(controller.update, req, res, next),
);

router.get("/orgaos/:idOrgao/modulos", (req, res, next) =>
  InterceptError(controller.getModulos, req, res, next),
);

router.post(
  "/orgaos/:idOrgao/modulos",
  (req, res, next) => validateModulos.validate(req, res, next),
  (req, res, next) =>
    InterceptError(controller.cadastrarModulos, req, res, next),
);

router.patch(
  "/orgaos/:idOrgao/modulos",
  (req, res, next) => validateModulos.validate(req, res, next),
  (req, res, next) => InterceptError(controller.updateModulos, req, res, next),
);

module.exports = router;
