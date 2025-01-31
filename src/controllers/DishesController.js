const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController{
    async create(request, response){
        const { title, description, tags, price } = request.body;
        const avatar = request.file.filename;
        const user_id  = request.user.id

        const diskStorage = new DiskStorage();
        const filename = await diskStorage.saveFile(avatar);

        const tagsArray = JSON.parse(tags || '[]');


        const [dish_id] = await knex("dishes").insert({
            title,
            description,
            price,
            avatar: filename,
           /*  created_at: user_id,
            updated_at: user_id, */
        });

        const tagsInsert = tagsArray.map((name) => {
            return{
                dish_id,
                name,
                user_id,                
            }
        })

        await knex("tags").insert(tagsInsert);

        return response.json();

    }

    async show(request, response){
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const tags = await knex("tags")
            .where({ dish_id: id })
            .orderBy("title");


        return response.json({
            ...dish,
            tags,
        })
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async update(request, response) {
        const { id } = request.params;
        const { title, description, price, tags } = request.body;
        const avatarFilename = request.file?.filename;
    
        const dish = await knex("dishes").where({ id }).first();
    
        if (!dish) {
          throw new AppError("Prato não encontrado.", 404);
        }
    
        const dishUpdate = {
         /*  name: name ?? dish.name, */
         title: title ?? dish.title,
          description: description ?? dish.description,
         /*  category: category ?? dish.category, */
          price: price ?? dish.price,
          /* updated_by: request.user.id, */
          updated_at: knex.fn.now(),
        };
    
        if (avatarFilename) {
          const diskStorage = new DiskStorage();
    
          if (dish.avatar) {
            await diskStorage.deleteFile(dish.avatar);
          }
    
          const filename = await diskStorage.saveFile(avatarFilename);
          dishUpdate.avatar = filename;
        }
    
        if (/* ingredients */ tags) {
          await knex("tags").where({ dish_id: id }).delete();
    
          const tagsInsert = tags.map((name) => {
            return {
              dish_id: id,
              title,
              /* created_by: dish.created_by, */
            };
          });
    
          await knex("tags").insert(tagsInsert);
        }
    
        await knex("dishes").where({ id }).update(dishUpdate);
    
        return response.json();
      }
    
      async index(request, response) {
        const { search } = request.query;
    
        let dishes;
    
        if (search) {
          const keywords = search.split(" ").map((keyword) => `%${keyword}%`);
    
          dishes = await knex("dishes")
            .select([
              "dishes.id",
              "dishes.title",
              "dishes.description",
              "dishes.price",
              "dishes.avatar",
            ])
            .leftJoin("tags", "dishes.id", "tags.dish_id")
            .where((builder) => {
              builder.where((builder2) => {
                keywords.forEach((keyword) => {
                  builder2.orWhere("dishes.title", "like", keyword);
                  builder2.orWhere("dishes.description", "like", keyword);
                });
              });
              keywords.forEach((keyword) => {
                builder.orWhere("tags.name", "like", keyword);
              });
            })
            .groupBy("dishes.id")
            .orderBy("dishes.title");
        } else {
          dishes = await knex("dishes")
            .select([
              "dishes.id",
              "dishes.title",
              "dishes.description",
              "dishes.price",
              "dishes.avatar",
            ])
            .orderBy("dishes.title");
        }
    
        const dishesTags = await knex("tags");
        const dishesWithTags = dishes.map((dish) => {
          const dishesTags = dishesTags.filter((tag) => tag.dish_id === dish.id);
    
          return {
            ...dish,
            tags: dishesTags,
          };
        });
    
        return response.json(dishesWithTags);
      }

   /*  async index(request, response){
        const { title, tags } = request.query
        const user_id = request.user.id

        let dishes

        if( tags ){
            const filterTags = tags.split(',').map((tag) => tag.trim())

            dishes = await knex("tags")
            .select([
                "dishes.id",
                "dishes.title",
                "dishes.user_id"
            ])
            .where("dishes.user_id", user_id)
            .whereLike("dishes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("dishes", "dishes.id", "tags.dish_id")
            .orderBy("dishes.title")

        }else{
            dishes = await knex("dishes")       
            .where({ user_id })
            .whereLike("title", `%${title}%`)       
            .orderBy("title");
        }        
    
        const userTags = await knex("tags").where({ user_id });

        const dishesWithTags = dishes.map((dish) => {
        const dishTags = userTags.filter((tag) => tag.dish_id === dish.id);
            
            return {
                ...dish,
                tags: dishTags,
            }
        
        })

        return response.json({ dishesWithTags })
    } */
}

module.exports = DishesController;