const knex = require("../database/knex");

class FavoritesController {
  async create(request, response) {
    try {
      const { dish_id } = request.body;
      const user_id = request.user.id;

      // Verifica se o favorito já existe
      const existingFavorite = await knex("favorites")
        .where({ user_id, dish_id })
        .first();

      if (existingFavorite) {
        return response.status(400).json({ error: "Este prato já está nos favoritos." });
      }

      await knex("favorites").insert({ user_id, dish_id });

      return response.status(201).json({ message: "Prato adicionado aos favoritos." });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao adicionar favorito." });
    }
  }

  async index(request, response) {
    try {
      const user_id = request.user.id;

      const favorites = await knex("favorites")
        .select("dishes.*", "favorites.dish_id")
        .innerJoin("dishes", "dishes.id", "favorites.dish_id")
        .where({ user_id });

      return response.json(favorites);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao listar favoritos." });
    }
  }

  async delete(request, response) {
    try {
      const { dish_id } = request.params;
      const user_id = request.user.id;

      const favorite = await knex("favorites")
        .where({ user_id, dish_id })
        .first();

      if (!favorite) {
        return response.status(404).json({ error: "Favorito não encontrado." });
      }

      await knex("favorites")
        .where({ user_id, dish_id })
        .delete();

      return response.json({ message: "Prato removido dos favoritos." });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao remover favorito." });
    }
  }
}

module.exports = FavoritesController;
