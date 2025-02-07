const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkAdminPermission = require("../middlewares/checkAdminPermission");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);
const dishesController = new DishesController();

// Aplica o middleware de autenticação a todas as rotas
dishesRoutes.use(ensureAuthenticated);

// Aplica o middleware de verificação de administrador às rotas que requerem privilégios administrativos
dishesRoutes.post("/", checkAdminPermission, upload.single("image"), dishesController.create);
dishesRoutes.delete("/:id", checkAdminPermission, dishesController.delete);
dishesRoutes.patch("/:id", checkAdminPermission, upload.single("image"), dishesController.update);

// Rotas que não requerem privilégios administrativos
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);

module.exports = dishesRoutes;
