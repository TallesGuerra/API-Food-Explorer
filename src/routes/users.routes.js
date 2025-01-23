const { Router } = require("express");

const UsersController = require("../controllers/UsersController");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

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
usersRoutes.put("/", ensureAuthentication, usersController.update)



module.exports = usersRoutes;