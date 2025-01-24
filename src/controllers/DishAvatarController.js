const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")


class DishAvatarController{
    async update(request, response){
        const dish_id = request.dish.dish_id
        const avatarFilename = request.file.filename
        
        const diskStorage = new DiskStorage()
        
        const dish = await knex("dishes")
        .where ({ id: dish_id}).first();

        if(!dish){
            throw new AppError("Prato ainda não cadastrado.", 401)
        }

        if(dish.avatar){
            await diskStorage.deleteFile(dish.avatar)  

        }

        const filename = await diskStorage.saveFile(avatarFilename)
        dish.avatar = filename

       await knex("dishes").update(dish).where({ id: dish_id })

       return response.json(dish)
    }
}

module.exports = DishAvatarController;