import express from "express";

import { course } from "../controllers/course.contoller.js";
import {validateReqCourse} from "../utils/data-validation.js"
import { checkReqForAuthToken } from "../utils/jwt-auth.js";

const courseRouter = express.Router();



courseRouter
  .route("/")
  .get(checkReqForAuthToken,course.getAllCourses)
  .post([checkReqForAuthToken,validateReqCourse],course.createCourse);
courseRouter
  .route("/:id")
  .get(checkReqForAuthToken,course.getCourse)
  .patch([checkReqForAuthToken,validateReqCourse], course.updateCourse)
  .delete(checkReqForAuthToken,course.deleteCourse);

export default courseRouter;
