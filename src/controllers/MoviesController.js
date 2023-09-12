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

  //FIXME: 
  // 1- Search by tag (only)
  // 2- Search by title (only)
  // 3- Search by mixed querys
  // Note: Working with id and id + title 

  async index(req, res) {
    const { user_id, title, tags } = req.query;

    let movies;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      movies = await knex("tags").select([
        "movies.id",
        "movies.title",
        "movies.user_id"
      ])
      .where("movies.user_id", user_id)
      .whereLike("movies.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movies", "movies.id", "tags.movie_id")
      .orderBy("movies.title");
    } else {
      movies = await knex("movies").where({ user_id }).whereLike("title", `%${title}%`).orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id);

      return {
        ...movie,
        tags: movieTags
      }
    });

    return res.json(moviesWithTags);
  }

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