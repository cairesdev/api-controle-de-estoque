const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/garagem");

router.get("/garagem/veiculos/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllVeiculos, req, res, next),
);

module.exports = router;
