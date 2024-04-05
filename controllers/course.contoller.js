import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @param null
 * @returns array of courses.
 */
const getAllCourses = async (req, res) => {
  try {

    const coursesData = await prisma.course.findMany();
    return res.status(200).json(coursesData);
  } catch (error) {
    await prisma.$disconnect();
    res.status(404).json({ message: "Error getting courses", err:error });
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
    res.status(400).json({ msg: "Please provide Course ID!" });
    return;
  }
  try {

    // Query the database.
    const course = await prisma.course.findUnique({
      where: { id: Number(id) }
    })
    res.status(200).json(course);

  } catch (error) {
    await prisma.$disconnect();
    res.status(404).json({ msg: "Course not Found!" });

  }


};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { ...vals } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Please provide Course ID!" });
  }
  try {
    const course = await prisma.course.updateMany({
      where: { id: Number(id) },
      data: {
        title: vals.title,
        description: vals.description,
        instructor: vals.instructor,
        price: vals.price
      }
    })
    return res.status(200).json(course)
  }
  catch (error) {
    await prisma.$disconnect();
    return res.status(400).json({course, error})
  }
};

/**
 * @route POST /courses
 * @desc Create a course
 * @returns String
 */
const createCourse = async (req, res) => {
  const Data = req.body;
  if (!Data) {
    return res.status(400).json({ msg: " Course Data not provided!" });
  }
  try {
    const result = await prisma.course.create({
      data: req.body
    });
    return res.status(201).json(result)
  } catch (error) {
    await prisma.$disconnect();
    console.error(error)
    return res.status(304).json(error)
  }


};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "Please provide Course ID!" });
  }
  const course = await prisma.course.delete({
    where: { id: Number(id) }
  })
  return res.status(204).json(course)
};

export const  course = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
