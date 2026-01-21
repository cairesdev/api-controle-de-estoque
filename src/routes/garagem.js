const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/garagem");

router.get("/garagem/viajens/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllViagens, req, res, next),
);
router.get("/garagem/viajens/solicitacoes/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllSolicitacoes, req, res, next),
);
router.get("/garagem/veiculos/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllVeiculos, req, res, next),
);
router.post("/garagem/veiculos/:idEntidade", (req, res, next) =>
  InterceptError(controller.createVeiculo, req, res, next),
);

module.exports = router;
