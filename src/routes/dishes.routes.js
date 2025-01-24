const { Router } = require("express");
const  multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const DishAvatarController = require("../controllers/DishAvatarController");

const ensureAuthentication = require("../middlewares/ensureAuthentication");


const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController();
const dishAvatarController = new DishAvatarController();

dishesRoutes.use(ensureAuthentication);

dishesRoutes.post("/", dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.get("/", dishesController.index);

dishesRoutes.patch("/avatar", ensureAuthentication, upload.single("avatar"), dishAvatarController.update)

module.exports = dishesRoutes; 

