const router = require("express").Router();
const multer = require("multer");
const InterceptError = require("../middlewares/intercept-erros");
const controller = require("../controllers/estoque");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 2 * 1024 * 1024 },
});

router.get("/estoque/produtos", (req, res, next) =>
  InterceptError(controller.getProdutos, req, res, next),
);

router.get("/estoque/:idOrgao/remessas", (req, res, next) =>
  InterceptError(controller.getAllRemessasOrgao, req, res, next),
);

router.get("/estoque/:idOrgao/itens", (req, res, next) =>
  InterceptError(controller.getAllItensOrgao, req, res, next),
);

router.post("/estoque/:idOrgao/remessas", (req, res, next) =>
  InterceptError(controller.criarRemessa, req, res, next),
);

router.get("/estoque/remessa/:idRemessa", (req, res, next) =>
  InterceptError(controller.getRemessa, req, res, next),
);

router.get("/estoque/remessa/:idRemessa/unidade", (req, res, next) =>
  InterceptError(controller.getRemessaUnidade, req, res, next),
);

router.get("/estoque/remessa/:idRemessa/itens", (req, res, next) =>
  InterceptError(controller.getAllItensRemessa, req, res, next),
);

router.post("/estoque/remessa/:idRemessa/itens", (req, res, next) =>
  InterceptError(controller.adicionarItemIndividual, req, res, next),
);

router.post(
  "/estoque/remessa/:idRemessa/xlsx",
  upload.single("ARQUIVO"),
  controller.adicionarItensXlsx,
);

router.delete("/estoque/remessa/:idRemessa", (req, res, next) =>
  InterceptError(controller.softDeleteRemessa, req, res, next),
);

router.delete("/estoque/item/:idItem", (req, res, next) =>
  InterceptError(controller.softDeleteItem, req, res, next),
);

router.patch("/estoque/item/:idItem/consumo", (req, res, next) =>
  InterceptError(controller.consumirItem, req, res, next),
);

router.get("/estoque/unidade/:idUnidade/itens", (req, res, next) =>
  InterceptError(controller.getAllItensUnidade, req, res, next),
);

router.get("/estoque/unidade/:idUnidade/lista", (req, res, next) =>
  InterceptError(controller.getListaDisponiveisUnidade, req, res, next),
);

router.delete("/estoque/orgao/:idOrgao/all", (req, res, next) =>
  InterceptError(controller.softDeleteTodasRemessasOrgao, req, res, next),
);

router.delete("/estoque/unidade/:idUnidade/all", (req, res, next) =>
  InterceptError(controller.softDeleteTodasRemessasUnidade, req, res, next),
);

module.exports = router;
