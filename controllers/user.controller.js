import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @param null
 * @returns array of users.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    await prisma.$disconnect();
    res.status(404).json({ message: "Error getting Users", err: error });
  }
};

/**
 * @route GET /user/:id
 * @desc Get User with ID number
 * @returns a user given ID.
 */
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ msg: "Please provide User ID!" });
    return;
  }
  try {
    // Query the database.
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    await prisma.$disconnect();
    res.status(404).json({ msg: "User not Found!" });
  }
};

/**
 * TODO: Return error if email is not unique.
 * @route PATCH /users
 * @description Update a user
 * @returns String
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { ...vals } = req.body;
  if (!id) {
    return res.status(400).json({ msg: "Please provide User ID!" });
  }
  try {
    const user = await prisma.user.updateMany({
      where: { id: Number(id) },
      data: {
        email: vals.email,
        name: vals.name,
        age: vals.age,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(400).json({ error });
  }
};

/**
 * TODO: Return error if email is not unique.
 * @route POST /users
 * @description Create a user
 * @returns String
 */
const createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ msg: " User Data not provided!" });
  }
  try {
    const result = await prisma.user.create({
      data: req.body,
    });
    return res.status(201).json(result);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(304).json(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "Please provide User ID!" });
  }
  const user = await prisma.user.delete({
    where: { id: Number(id) },
  });
  return res.status(204).json(user);
};

export const users = {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
};
