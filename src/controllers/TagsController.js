const knex = require("../database/knex");

class TagsController {
    async index(request, response){
       /*  const user_id = request.user.id;  SE FOR USAR O TOKEN NAS TAGS, CONFIGURAR O BEARER TOKEN NO INSOMNIA */

        const tags = await knex("tags")
        /* .where({user_id}) */

        return  response.json(tags);
    }
}

module.exports = TagsController;