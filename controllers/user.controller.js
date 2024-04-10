import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

/**
 * @param null
 * @returns array of users.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        courseId: true,
        role: true,
      },
    });
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    await prisma.$disconnect();
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Error getting Users", error });
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
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        courseId: true,
        role: true,
      },
    });
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    await prisma.$disconnect();
    res.status(StatusCodes.NOT_FOUND).json({ msg: "User not Found!" });
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
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Please provide User ID!" });
  }
  try {
    let { email } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      const updatedUser = await prisma.user.updateMany({
        where: { id: Number(id) },
        data: {
          email: vals.email,
          name: vals.name,
          age: vals.age,
        },
      });
      return res.status(StatusCodes.OK).json(updatedUser);
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not Found." });
    }

  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.NOT_FOUND).json({ error });
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
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: " User Data not provided!" });
  }
  try {
    let { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user != null && user.email === email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exists." });
    }
    let saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const data = {
      ...req.body,
      password: hashed,
    };

    const newUser = await prisma.user.create({
      data: data,
    });
    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    await prisma.$disconnect();
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Please provide User ID!" });
  }
  const user = await prisma.user.delete({
    where: { id: Number(id) },
  });
  return res.status(StatusCodes.NO_CONTENT).json(user);
};

const userLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("Please provide Username & Password!");
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: username },
    });
    let userDBPassword = await bcrypt.compare(password, user.password);

    if (userDBPassword) {
      const payload = {
        username,
        password: user.password,
        user_role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res
        .status(StatusCodes.OK)
        .json({ message: "Login Successful ✔", token });
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({message: "Access denied ✖ Password is incorrect!"});
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json(error);
  }
};

const userRegister = async (req, res) => {
  const { password, name, age, email } = req.body;
  let saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);

  const payload = {
    username: email,
    password: hashed,
    user_role: "STUDENT",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const data = {
    email,
    name,
    age,
    password: hashed,
  };
  try {
    const newUser = await prisma.user.create({
      data,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User Created", token, newUser });
  } catch (error) {
    return res.status(StatusCodes.BAD_GATEWAY).json({ error });
  }
};
export const users = {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  userLogin,
  userRegister,
};
