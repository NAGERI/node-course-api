import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

/**
 * @param null
 * @returns array of courses.
 */
const getAllCourses = async (req, res) => {
  try {
    const coursesData = await prisma.course.findMany();
    return res.status(StatusCodes.OK).json(coursesData);
  } catch (error) {
    await prisma.$disconnect();
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Error getting courses", error });
  }
};

/**
 * @route GET /courses/:id
 * @desc Get course with ID number
 * @returns a course given ID.
 */
const getCourse = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Course ID!" });
    return;
  }
  try {
    // Query the database.
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });
    res.status(StatusCodes.OK).json(course);
  } catch (error) {
    await prisma.$disconnect();
    res.status(StatusCodes.NOT_FOUND).json({ msg: "Course not Found!" });
  }
};

/**
 * @route PUT /courses
 * @desc Update a course
 * @returns String
 */
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { ...vals } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Course ID!" });
  }
  try {
    const course = await prisma.course.updateMany({
      where: { id: Number(id) },
      data: {
        title: vals.title,
        description: vals.description,
        instructor: vals.instructor,
        price: vals.price,
      },
    });
    return res.status(StatusCodes.OK).json(course);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.NOT_MODIFIED).json({ error });
  }
};

/**
 * @route POST /courses
 * @desc Create a course
 * @returns String
 */
const createCourse = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: " Course Data not provided!" });
  }
  try {
    const newCourse = await prisma.course.create({
      data: req.body,
    });
    return res.status(StatusCodes.CREATED).json(newCourse);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide Course ID!" });
  }
  const course = await prisma.course.delete({
    where: { id: Number(id) },
  });
  return res.status(StatusCodes.NO_CONTENT).json(course);
};

export const course = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
