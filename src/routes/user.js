const router = require("express").Router();
const validator = require("../middlewares/validate-schema");
const InterceptError = require("../middlewares/intercept-erros");
const schema = require("../lib/schemas/user");
const controller = require("../controllers/user");
const m = new validator(schema.create);

router.post(
  "/usuario/perfil",
  (req, res, next) => m.validate(req, res, next),
  controller.create
);

router.post("/usuario/login", controller.login);
router.put("/usuario/login/danger/:user", controller.updatePassword);
router.patch("/usuarios/acesso-livre", (req, res, next) =>
  InterceptError(controller.listAllUsers, req, res, next)
);
router.delete("/usuarios/danger/:idUsuario", (req, res, next) =>
  InterceptError(controller.deleteUsuario, req, res, next)
);

module.exports = router;
