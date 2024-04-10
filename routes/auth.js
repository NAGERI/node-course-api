import express from "express";

import { users } from '../controllers/user.controller.js'

const authRouter = express.Router();
/**
 * @param  
 * @returns success message & token
 */
authRouter.post("/login", users.userLogin);
//   loggedIn = true;
//   res.redirect("/node-course");
// });

/**
 * @route: /register
 * @returns a token
 */
authRouter.post("/register", users.userRegister);

export default authRouter;
