import express from "express";

import { users } from "../controllers/user.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import { validateReqUser } from "../utils/data-validation.js";

const userRouter = express.Router();

// userRouter.get("/", checkReqForAuthToken, users.getAllUsers);

userRouter
  .route("/")
  .get(checkReqForAuthToken,users.getAllUsers)
  .post([checkReqForAuthToken,validateReqUser],users.createUser);
  
userRouter
  .route("/:id")
  .get(checkReqForAuthToken,users.getUser)
  .patch([checkReqForAuthToken,validateReqUser], users.updateUser)
  .delete(checkReqForAuthToken,users.deleteUser);

export default userRouter;
