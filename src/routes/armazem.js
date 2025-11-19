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
  (req, res, next) =>
    InterceptError(controller.cadastroItensXlsx, req, res, next)
);

router.post("/armazem/individual/:idEstoque", (req, res, next) =>
  InterceptError(controller.cadastroIndividual, req, res, next)
);

router.post("/armazem/estoque", (req, res, next) =>
  InterceptError(controller.createArmazem, req, res, next)
);

router.get("/armazem/estoque/resumo/:idRemessa", (req, res, next) =>
  InterceptError(controller.resumoRemessa, req, res, next)
);

module.exports = router;
