import express from "express";

import { users } from "../controllers/user.controller.js";
import { checkReqForAuthToken } from "../utils/jwt-auth.js";
import { validateReqUser } from "../utils/data-validation.js";
import { isAdmin, isStudent, isTeacher } from "../utils/middleware.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get([checkReqForAuthToken,isStudent],users.getAllUsers)
  .post([checkReqForAuthToken,validateReqUser],users.createUser);
  
userRouter
  .route("/:id")
  .get(checkReqForAuthToken,users.getUser)
  .patch([checkReqForAuthToken,validateReqUser], users.updateUser)
  .delete([checkReqForAuthToken, isAdmin || isTeacher],users.deleteUser);

export default userRouter;
