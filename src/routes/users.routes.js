const { Router } = require("express");
const usersRoutes = Router();

usersRoutes.get("/", (req, res) => {
  res.send("Estamos na rota do usuário");
})

module.exports = usersRoutes;