const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const isUserExist = await knex("users").where({ email })

    if (isUserExist[0])
      throw new AppError("Este e-mail já está em uso.");

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const { id } = req.params;
    
    const user = await knex("users").where({ id });

    const newName = name ?? user[0].name;
    const newEmail = email ?? user[0].email;

    if (!user[0])
      throw new AppError("Usuário não encontrado");

    const userWithUpdateEmail = await knex("users").where("email", newEmail);

    if (userWithUpdateEmail[0] && userWithUpdateEmail[0].id !== user[0].id)
      throw new AppError("Este e-mail já está em uso");

    if (password && !old_password)
      throw new AppError("Você precisa informar a senha antiga para definir definir uma nova senha!");

    if (password && old_password) {
      console.log(old_password === user[0].password)
      const checkOldPassword = await compare(old_password, user[0].password);

      if (!checkOldPassword)
        throw new AppError("A senha antiga não confere");

      console.log("Alterar a senha");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").where({ id }).update({ 
      name: newName, 
      email: newEmail,
      password: hashedPassword
     });

    return res.json();
  }
}

module.exports = UsersController;