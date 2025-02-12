const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const favoritesRoutes = Router();
const favoritesController = new FavoritesController();

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.post("/", favoritesController.create);
favoritesRoutes.get("/", favoritesController.index);
favoritesRoutes.delete("/:dish_id", favoritesController.delete);

module.exports = favoritesRoutes;


/* 

Invoke-WebRequest -Uri "http://localhost:3333/favorites" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19hZG1pbiI6MCwiaWF0IjoxNzM5MzcyOTg2LCJleHAiOjE3Mzk0NTkzODYsInN1YiI6IjIifQ.U4Ffqs9fBSB6QXBTnyRhXppGY38w9tC852YHXefNFPo"} `
  -Body '{"dish_id": 1}' `
  -UseBasicParsing


 */