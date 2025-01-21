const { Router } = require("express");

const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();


const tagsController = new TagsController();

tagsRoutes.get("/", tagsController.index);
/* 
Caso seja necessario filtrar a tag pelo user_id
tagsRoutes.get("/:user_id", tagsController.index); */


module.exports = tagsRoutes;