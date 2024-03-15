import express from "express";
import { course } from "../controllers/course.js";

const courseRouter = express.Router();

courseRouter.route("/").get(course.getAllCourses).post(course.createCourse);
courseRouter
  .route("/:id")
  .get(course.getCourse)
  .patch(course.updateCourse)
  .delete(course.deleteCourse);

export default courseRouter;
