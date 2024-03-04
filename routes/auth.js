import express from "express";

const loginRouter = express.Router();

const uname = "john";
const pass = "pass1234";

loginRouter.post("/", function (req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    if (username !== uname || password !== pass) {
      res
        .status(500)
        .json({ msg: "Access denined - Password or Username is incorrect!" });
    }
    res.status(200).json({ msg: "Login Successful✅" });
    next("/node-course");
    // .redirect("/node-course")
  } else {
    res.status(400).json({ msg: "Please provide Username & Password!" });
  }
});

export default loginRouter;
