const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const validator = require("../middlewares/validate-schema");

const schema = require("../lib/schemas/user");
const controller = require("../controllers/user");
const m = new validator(schema.create);

router.post(
  "/usuario/perfil",
  (req, res, next) => m.validate(req, res, next),
  controller.create
);

router.post("/usuario/login", controller.login);

module.exports = router;
