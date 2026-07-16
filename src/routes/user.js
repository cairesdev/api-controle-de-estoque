const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");
const schema = require("../lib/schemas/user");
const controller = require("../controllers/user");

const validateCreate = new validator(schema.create);

router.post("/usuarios/login", controller.login);

router.post(
  "/usuarios",
  (req, res, next) => validateCreate.validate(req, res, next),
  controller.create,
);

router.get("/usuarios", (req, res, next) =>
  InterceptError(controller.getAll, req, res, next),
);

router.delete("/usuarios/:idUsuario", (req, res, next) =>
  InterceptError(controller.softDelete, req, res, next),
);

router.put("/usuarios/:idUsuario/senha", (req, res, next) =>
  InterceptError(controller.updateSenha, req, res, next),
);

router.patch("/usuarios/:idUsuario", (req, res, next) =>
  InterceptError(controller.updateBasicos, req, res, next),
);

module.exports = router;
