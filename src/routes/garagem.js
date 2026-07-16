const router = require("express").Router();
const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/garagem");

router.get("/garagem/veiculos/:idOrgao", (req, res, next) =>
  InterceptError(controller.getAllVeiculos, req, res, next),
);

router.post("/garagem/veiculos/:idOrgao", (req, res, next) =>
  InterceptError(controller.createVeiculo, req, res, next),
);

router.get("/garagem/viagens/:idOrgao", (req, res, next) =>
  InterceptError(controller.getAllViagensOrgao, req, res, next),
);

router.get("/garagem/viagens/unidade/:idUnidade", (req, res, next) =>
  InterceptError(controller.getAllViagensUnidade, req, res, next),
);

router.get("/garagem/viagens/:idViagem/detalhes", (req, res, next) =>
  InterceptError(controller.getViagemById, req, res, next),
);

router.put("/garagem/viagens/:idViagem/iniciar", (req, res, next) =>
  InterceptError(controller.iniciarViagem, req, res, next),
);

router.put("/garagem/viagens/:idViagem/concluir", (req, res, next) =>
  InterceptError(controller.concluirViagem, req, res, next),
);

router.get("/garagem/solicitacoes/:idOrgao", (req, res, next) =>
  InterceptError(controller.getAllSolicitacoes, req, res, next),
);

router.get("/garagem/solicitacoes/:idSolicitacao/detalhes", (req, res, next) =>
  InterceptError(controller.getSolicitacaoById, req, res, next),
);

router.post("/garagem/solicitacoes/:idOrgao/:idUnidade", (req, res, next) =>
  InterceptError(controller.createSolicitacao, req, res, next),
);

router.put(
  "/garagem/solicitacoes/:idSolicitacao/:idUnidade/liberar",
  (req, res, next) =>
    InterceptError(controller.liberarSolicitacao, req, res, next),
);

module.exports = router;
