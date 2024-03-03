import express from "express";

const courseRouter = express.Router();

courseRouter.get("/:id", function (req, res) {
  // res.send("Course Found");
  const { id } = req.params;
  if (id) {
    res.status(200).json({ msg: `Course with ID: ${id} Found` });
  } else {
    res.status(400).json({ msg: "Please provide Course ID!" });
  }
});

export default courseRouter;
