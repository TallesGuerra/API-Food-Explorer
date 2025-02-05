const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const { name, description, category, price, ingredients } = request.body
    const image = request.file.filename
    const user_id = request.user.id

    const diskStorage = new DiskStorage();
    const filename = await diskStorage.saveFile(image);

    const ingredientsArray = JSON.parse(ingredients || '[]');

    const [dish_id] = await knex("dishes").insert({
      name,
      description,
      category,
      price,
      image: filename,
      created_by: user_id,
      updated_by: user_id,
      
    });

    const ingredientsInsert = ingredientsArray.map((name) => {
      return {
        dish_id,
        name,
        created_by: user_id,
      }
    })

    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ dish_id: id })
      .orderBy("name");

    return response.json({
      ...dish,
      ingredients,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json();
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, description, category, price, ingredients } = request.body;
    const imageFilename = request.file?.filename;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado.", 404);
    }

    const dishUpdate = {
      name: name ?? dish.name,
      description: description ?? dish.description,
      category: category ?? dish.category,
      price: price ?? dish.price,
      updated_by: request.user.id,
      updated_at: knex.fn.now(),
    };

    if (imageFilename) {
      const diskStorage = new DiskStorage();

      if (dish.image) {
        await diskStorage.deleteFile(dish.image);
      }

      const filename = await diskStorage.saveFile(imageFilename);
      dishUpdate.image = filename;
    }

    if (ingredients) {
      await knex("ingredients").where({ dish_id: id }).delete();

      const ingredientsInsert = ingredients.map((name) => {
        return {
          dish_id: id,
          name,
          created_by: dish.created_by,
        };
      });

      await knex("ingredients").insert(ingredientsInsert);
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
          "dishes.name",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .leftJoin("ingredients", "dishes.id", "ingredients.dish_id")
        .where((builder) => {
          builder.where((builder2) => {
            keywords.forEach((keyword) => {
              builder2.orWhere("dishes.name", "like", keyword);
              builder2.orWhere("dishes.description", "like", keyword);
            });
          });
          keywords.forEach((keyword) => {
            builder.orWhere("ingredients.name", "like", keyword);
          });
        })
        .groupBy("dishes.id")
        .orderBy("dishes.name");
    } else {
      dishes = await knex("dishes")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.description",
          "dishes.category",
          "dishes.price",
          "dishes.image",
        ])
        .orderBy("dishes.name");
    }

    const dishesIngredients = await knex("ingredients");
    const dishesWithIngredients = dishes.map((dish) => {
      const dishIngredients = dishesIngredients.filter((ingredient) => ingredient.dish_id === dish.id);

      return {
        ...dish,
        ingredients: dishIngredients,
      };
    });

    return response.json(dishesWithIngredients);
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