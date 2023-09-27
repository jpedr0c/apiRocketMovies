const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");
const moviesRoutes = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesController = new MoviesController();

moviesRoutes.use(ensureAuthenticated);

moviesRoutes.get("/", moviesController.index);
moviesRoutes.post("/", moviesController.create);
moviesRoutes.get("/:id", moviesController.show);
moviesRoutes.delete("/:id", moviesController.delete);

module.exports = moviesRoutes;