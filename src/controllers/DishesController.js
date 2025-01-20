const knex = require("../database/knex");

class DishesController{
    async create(request, response){
        const { title, description, tags, price } = request.body;
        const { user_id } = request.params;

        const [dish_id] = await knex("dishes").insert({
            title,
            description,
            price,
            user_id
        });

        const tagsInsert = tags.map(name => {
            return{
                dish_id,
                name,
                user_id                
            }
        });

        await knex("tags").insert(tagsInsert);

        response.json();

    }

    async show(request, response){
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const tags = await knex("tags").where({ dish_id: id }).orderBy("name");


        return response.json({
            ...dish,
            tags
        })
    }

    async delete(request, response){
        const { id } = request.params

        await knex("dishes").where({ id }).delete()

        return response.json()
    }

    async index(request, response){
        const { title, user_id, tags } = request.query;

        let dishes;

        if( tags ){
            const filterTags = tags.split(',').map(tag => tag.trim());
           
            dishes = await knex("tags").whereIn("name", filterTags)

        }else{
            dishes = await knex("dishes")       
          /*   .where({ user_id }) */
            .whereLike("title", `%${title}%`)       
            .orderBy("title");
        }        
    
        return response.json({ dishes })
    }
}

module.exports = DishesController;