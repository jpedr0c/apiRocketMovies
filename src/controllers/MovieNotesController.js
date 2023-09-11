const knex = require("../database/knex");

class MovieNotesController {
  async create(req, res) {
    const { title, description, rating } = req.body;
    const { user_id } = req.params;

    await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    });

    res.json();
  }

  async show(req, res) {
    const { id } = req.params;

    const movie = await knex("movie_notes").where({ id }).first();

    return res.json({
      ...movie
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("movie_notes").where({ id }).delete();

    return res.json();
  }
}

module.exports = MovieNotesController;