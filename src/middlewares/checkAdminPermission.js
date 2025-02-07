const knex = require("../database/knex");
const AppError = require("../utils/AppError");

async function checkAdminPermission(request, response, next) {
    const user_id = request.user.id;

    // Consulta ao banco de dados para verificar se o usuário é administrador
    const user = await knex("users")
        .select("is_admin")
        .where({ id: user_id })
        .first();

    // Verifica se o usuário existe
    if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    // Verifica se o usuário é administrador
    if (!user.is_admin) {
        throw new AppError("Apenas administradores podem realizar esta ação.", 403);
    }

    // Se o usuário for administrador, prossegue para a próxima função
    return next();
}

module.exports = checkAdminPermission;
