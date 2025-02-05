const { Router } = require("express");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();

/*
function myMiddleware(request, response, next) {
     if (!request.body.isAdmin) {
        return response.json({ message: "user unauthorized" });
    }
    next();
};
*/


const usersController = new UsersController();

usersRoutes.post("/", /* myMiddleware */ usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update)



module.exports = usersRoutes;