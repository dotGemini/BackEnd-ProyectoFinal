import UsersModel from "../dao/models/usersModel.js";
import { decodedCookie } from "../config/passport.config.js";

export const changeUserRole = async (req, res) => {
    try {
      const userId = req.params.uid;
      let cookie = req.cookies.coderCookieToken;
      const user = decodedCookie(cookie);
      let updatedRole = user.role
  
      if (updatedRole === "user") {
        updatedRole = "premium";

        const updatedUser = await UsersModel.findByIdAndUpdate(
          { _id: userId },
          { role: updatedRole }
        );
        
        res.status(200).send("rol actualizado a premium");
      }else{
        res.status(400).send("rol no fue aceptado, eliga entre las siguientes opciones: user o premium");
      }
    } catch (error) {
      console.log(error.message)
    }
  }

export const getAllUsers = async (req, res) => {
    try {
        const users = await UsersModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteUsers = async (req, res) => {
  try {
    const cutoffDate = Date.now() - 172800000; // 2 days in milliseconds
    const deletedUsers = await UsersModel.deleteMany({ last_connection: { $lt: cutoffDate } });
    res.status(200).json(deletedUsers);
  } catch (error) {
    console.log(error.message);
  }
};


//metodos para la vista de admin


export const getAdminPanel = async (req, res) => {
  try {
      const users = await UsersModel.find();
      let usersJSON = users.map(u => u.toJSON());
      res.render('adminPanel', { users: usersJSON, user: req.session.user });
  } catch (error) {
      console.log(error.message)
  }
}