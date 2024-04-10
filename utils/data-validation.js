import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const courseSchema = Joi.object().keys({
  title: Joi.string().min(5).max(50).required(),
  description: Joi.string().min(10).max(200),
  instructor: Joi.string().min(5).max(30).required(),
  price: Joi.number().integer(),
});
const userSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org"] } })
    .required(),
  age: Joi.number().integer().min(18),
  name: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(8).required(),
  courseId: Joi.number().integer(),
});

const validateReqCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors });
  }
  next();
};

const validateReqUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors });
  }
  next();
};

export { courseSchema, userSchema, validateReqCourse, validateReqUser };
