const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");
const moviesRoutes = Router();

const movieNotesController = new MovieNotesController();

moviesRoutes.post("/:user_id", movieNotesController.create);
moviesRoutes.get("/:id", movieNotesController.show);
moviesRoutes.delete("/:id", movieNotesController.delete);

module.exports = moviesRoutes;