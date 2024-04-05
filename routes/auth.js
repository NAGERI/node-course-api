import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { checkReqForAuthToken } from "../utils/jwt-auth.js";

const authRouter = express.Router();
/**
 * @param  
 * 
 * @returns success on login 
 */
authRouter.post("/login", checkReqForAuthToken, (req, res) => {
  const uname = "john";
  const pass = "password";
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide Username & Password!");
  }

  if (username !== uname || password !== pass) {
    return res
      .status(400)
      .send("Access denied - Password or Username is incorrect!");
  }

  loggedIn = true;
  res.redirect("/node-course");
});

/**
 * @route: /register
 * @returns a token
 */
authRouter.post("/register", async (req, res) => {
  let password = req.body.password;
  let saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log(hashed);

  const payload = {
    username: req.body.email,
    password: hashed,
    user_role: "ADMIN",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(201).json({token});
});

export default authRouter;
