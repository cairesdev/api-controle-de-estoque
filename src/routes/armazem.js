const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 2 * 1024 * 1024 },
});

const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/armazem");

router.post(
  "/armazem/xlsx/:idEstoque",
  upload.single("ARQUIVO"),
  controller.cadastroItensXlsx,
);

router.get("/armazem/estoque/produtos", (req, res, next) =>
  InterceptError(controller.getListaProdutos, req, res, next),
);

router.get("/armazem/estoque/itens-unidade/:idUnidade", (req, res, next) =>
  InterceptError(controller.getAllItensUnidade, req, res, next),
);

router.patch("/armazem/estoque/itens-utilizados/:idProduto", (req, res, next) =>
  InterceptError(controller.updateQuantidadeUtilizada, req, res, next),
);

router.post("/armazem/individual/:idEstoque", (req, res, next) =>
  InterceptError(controller.cadastroIndividual, req, res, next),
);

router.post("/armazem/estoque/:idEntidade", (req, res, next) =>
  InterceptError(controller.createArmazem, req, res, next),
);

router.get("/armazem/estoque/:idEntidade", (req, res, next) =>
  InterceptError(controller.getEstoquesEntidade, req, res, next),
);

router.get("/armazem/estoque/lista/:idUnidade", (req, res, next) =>
  InterceptError(controller.getItensListEntidade, req, res, next),
);

router.get("/armazem/estoque/remessa/:idEstoque", (req, res, next) =>
  InterceptError(controller.getEstoque, req, res, next),
);

router.get("/armazem/estoque/resumo-unidade/:idRemessa", (req, res, next) =>
  InterceptError(controller.resumoRemessaUnidade, req, res, next),
);

router.get("/armazem/estoque/resumo/:idRemessa", (req, res, next) =>
  InterceptError(controller.resumoRemessa, req, res, next),
);

router.delete("/armazem/estoque/item/:idItem", (req, res, next) =>
  InterceptError(controller.deleteItem, req, res, next),
);

router.delete("/armazem/estoque/remessa/:idArmazem", (req, res, next) =>
  InterceptError(controller.deleteArmazem, req, res, next),
);

router.post("/solicitacao/:idSolicitacao/:idEntidade", (req, res, next) =>
  InterceptError(controller.liberaSolicitacao, req, res, next),
);

router.get(
  "/armazem/estoque/comprovante/:idEstoque/:codigo",
  (req, res, next) =>
    InterceptError(controller.capturarSolicitacaoRespondida, req, res, next),
);

router.delete("/armazem/estoques/all/:idEntidade", (req, res, next) =>
  InterceptError(controller.deleteAllArmazem, req, res, next),
);

router.delete("/armazem/estoques/unidade/all/:idUnidade", (req, res, next) =>
  InterceptError(controller.deleteAllArmazemUnidade, req, res, next),
);

router.delete(
  "/armazem/entidade/solicitacoes/:idEntidade/all",
  (req, res, next) =>
    InterceptError(controller.deleteAllSolicitacao, req, res, next),
);

router.delete(
  "/armazem/unidade/solicitacoes/all/:idUnidade",
  (req, res, next) =>
    InterceptError(controller.deleteAllSolicitacaoUnidade, req, res, next),
);

module.exports = router;
