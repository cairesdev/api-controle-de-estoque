const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/garagem");

router.get("/garagem/viajens/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllViagens, req, res, next),
);

router.get("/garagem/viajens/:idUnidade/unidade", (req, res, next) =>
  InterceptError(controller.getAllViagensUnidade, req, res, next),
);

router.get("/garagem/viajens/:idViagem/detalhes", (req, res, next) =>
  InterceptError(controller.getViagemDetalhe, req, res, next),
);

router.put("/garagem/viajens/:idViagem/concluir", (req, res, next) =>
  InterceptError(controller.concluirViagem, req, res, next),
);

router.post(
  "/garagem/viajens/solicitacao/:idEntidade/:idUnidade",
  (req, res, next) =>
    InterceptError(controller.createSolicitacao, req, res, next),
);

router.post(
  "/garagem/viajens/liberacao/:idSolicitacao/:idUnidade",
  (req, res, next) =>
    InterceptError(controller.liberaSolicitacao, req, res, next),
);

router.put("/garagem/viajens/liberacao/:idViagem", (req, res, next) =>
  InterceptError(controller.iniciaViagem, req, res, next),
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

router.get("/garagem/viajens/solicitacao/:idSolicitacao", (req, res, next) =>
  InterceptError(controller.getDetalheSolicitcao, req, res, next),
);

module.exports = router;
