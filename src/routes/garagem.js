const router = require("express").Router();

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/garagem");

router.get("/garagem/viagens/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllViagens, req, res, next),
);

router.get("/garagem/viagens/:idUnidade/unidade", (req, res, next) =>
  InterceptError(controller.getAllViagensUnidade, req, res, next),
);

router.get("/garagem/viagens/:idViagem/detalhes", (req, res, next) =>
  InterceptError(controller.getViagemDetalhe, req, res, next),
);

router.put("/garagem/viagens/:idViagem/concluir", (req, res, next) =>
  InterceptError(controller.concluirViagem, req, res, next),
);

router.post(
  "/garagem/viagens/solicitacao/:idEntidade/:idUnidade",
  (req, res, next) =>
    InterceptError(controller.createSolicitacao, req, res, next),
);

router.post(
  "/garagem/viagens/liberacao/:idSolicitacao/:idUnidade",
  (req, res, next) =>
    InterceptError(controller.liberaSolicitacao, req, res, next),
);

router.put("/garagem/viagens/liberacao/:idViagem", (req, res, next) =>
  InterceptError(controller.iniciaViagem, req, res, next),
);

router.get("/garagem/viagens/solicitacoes/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllSolicitacoes, req, res, next),
);

router.get("/garagem/veiculos/:idEntidade", (req, res, next) =>
  InterceptError(controller.getAllVeiculos, req, res, next),
);

router.post("/garagem/veiculos/:idEntidade", (req, res, next) =>
  InterceptError(controller.createVeiculo, req, res, next),
);

router.get("/garagem/viagens/solicitacao/:idSolicitacao", (req, res, next) =>
  InterceptError(controller.getDetalheSolicitcao, req, res, next),
);

module.exports = router;
