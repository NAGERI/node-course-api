import { writeFileSync, readFileSync } from "fs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATH = path.join(__dirname, "../models/courses.json");

/**
 * @param null
 * @returns array of courses.
 */
const getAllCourses = (req, res) => {
  try {
    const coursesData = readFileSync(PATH, "utf-8");
    return res.status(200).json(JSON.parse(coursesData));
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(404).json({ message: "Error getting courses" });
  }
};

/**
 * @route GET /courses/:id
 * @desc Get course with ID number
 * @returns a course given ID.
 */
const getCourse = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ msg: "Please provide Course ID!" });
    return;
  }
  // Read the file
  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    // Find the record to update
    const recordIndex = jsonData.findIndex((record) => record.id === id);

    if (recordIndex === -1) {
      console.error("Record not found");
      return res.status(400).json({ msg: " Course ID not found!" });
    }
    return res.status(200).json(jsonData[recordIndex]);
  });
};

const updateCourse = (req, res) => {
  const { id } = req.params;
  const { ...vals } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Please provide Course ID!" });
  }
  // Read the file
  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    // Find the record to update
    const recordIndex = jsonData.findIndex((record) => record.id === id);

    if (recordIndex === -1) {
      console.error("Record not found");
      return res.status(400).json({ msg: " Course ID not found!" });
    }
    let oldCourse = jsonData[recordIndex];

    // Update the values
    jsonData[recordIndex] = {
      id,
      title: vals.title || oldCourse.title,
      description: vals.description || oldCourse.description,
      instructor: vals.instructor || oldCourse.instructor,
      price: vals.price || oldCourse.price,
      createdAt: new Date().toISOString(),
    };
    console.info(vals);

    try {
      writeFileSync(PATH, JSON.stringify(jsonData, null, 2), "utf-8");
      return res.status(200).json(jsonData[recordIndex]);
    } catch (error) {
      console.log("Failed to write updated data to file");
      return;
    }
  });
};

/**
 * @route POST /courses
 * @desc Create a course
 * @returns String
 */
const createCourse = (req, res) => {
  const Data = req.body;
  if (!Data) {
    return res.status(400).json({ msg: " Course Data not provided!" });
  }

  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    // Find the record to update
    const recordIndex = jsonData.findIndex((record) => record.id === Data.id);
    Data.createdAt = new Date().toISOString();

    if (recordIndex >= 0) {
      console.error("Record already exists.");
      return res.status(400).json({ msg: " Course already exists!" });
    } else {
      try {
        jsonData.push(Data);
        writeFileSync(PATH, JSON.stringify(jsonData, null, 2), "utf-8");
        console.log("Updated file successfully");
        res.status(200).json({ msg: "Course created Successfuly." });
      } catch (error) {
        console.log("Failed to write updated data to file");
        return res.status(500);
      }
    }
  });
};

const deleteCourse = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "Please provide Course ID!" });
  }
  // Read the file
  fs.readFile(PATH, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const jsonData = JSON.parse(data);
    // Find the record to update
    const recordIndex = jsonData.findIndex((record) => record.id === id);

    if (recordIndex === -1) {
      return res.status(400).json({ msg: " Course ID not found!" });
    }

    // Delete the value
    jsonData.splice(recordIndex, 1);

    try {
      writeFileSync(PATH, JSON.stringify(jsonData, null, 2), "utf-8");
      return res.status(200).json({ msg: "Course Deleted Successfuly." });
    } catch (error) {
      console.log("Failed to write updated data to file");
      return;
    }
  });
};

export const course = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
