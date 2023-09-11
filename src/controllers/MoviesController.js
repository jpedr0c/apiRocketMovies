const knex = require("../database/knex");

class MoviesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const [movie_id] = await knex("movies").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert);

    res.json();
  }

  // TODO: Index method

  async show(req, res) {
    const { id } = req.params;

    const movie = await knex("movies").where({ id }).first();
    const tags = await knex("tags").where({ movie_id: id });

    return res.json({
      ...movie,
      tags
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movies").where({ id }).delete();

    return res.json();
  }
}

module.exports = MoviesController;