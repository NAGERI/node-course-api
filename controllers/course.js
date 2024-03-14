// import data from '../models/courses.json' assert {type: 'json'};
import {writeFile, readFile} from "fs"
import fs  from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATH = `${__dirname}\\courses.json`;

/**
 * @param null
 * @returns array of courses.
*/
const getAllCourses = (req, res) => {

fs.readFile(PATH, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(JSON.parse(data));
});
  // console.log(data[0]);
  res.status(200).json("All Courses");
};

/**
 * @route GET /courses/:id
 * @desc Get course with ID number
 * @returns a course given ID.
 */
const getCourse = (req, res) => {
  const { id } = req.params;
  if (id) {
    res.status(200).json({ msg: `Course with ID: ${id} found` });
  } else {
    res.status(400).json({ msg: "Please provide Course ID!" });
  }
};

const updateCourse = (req, res) => {
  res.status(200).json({ msg: "Course Updated successfully." });
};
/**
 * @route POST /courses
 * @desc Create a course
 * @returns String
 */
const createCourse = (req, res) => {
  const Data = req.body;
  if (Data) {
    /** const DATA = {
      "id" : data.id,
      "title" : data.title,
      "description": data.description,
      "instructor" : data.instructor,
      "price" : data.price,
      "createdAt" : new Date().toISOString()
    }*/
    Data.createdAt = new Date().toISOString("GMT+3");
    readFile(PATH, (error, data) => {
    if (error) {
    console.log(error);
    return;
    }
    const parsedData = JSON.parse(data);
    console.log(parsedData)
    writeFile(PATH, JSON.stringify(Data, null, 2), (err) => {
      if (err) {
        console.log('Failed to write updated data to file');
        return;
      } 
      console.log('Updated file successfully');
    });
    }
    );

  } else {
      res.status(500).json({ msg: " ID not provided!" });
    }

  res.status(200).json({ msg: "Course created Successfuly." });
};

const deleteCourse = (req, res) => {
  res.status(200).json({ msg: "Course Deleted" });
};

export const course = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
