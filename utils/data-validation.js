import Joi from "joi";

const courseSchema = Joi.object().keys({
  title: Joi.string().min(5).max(50).required(),
  description: Joi.string().min(10).max(200).required(),
  instructor: Joi.string().min(5).max(30).required(),
  price: Joi.number().integer(),
});
const userSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org"] } })
    .required(),
  age: Joi.number().integer().required(),
  name: Joi.string().min(5).max(50).required()
});

const  validateReqCourse = (req, res, next) => {
   const { error } = courseSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).json({ errors });
    }
      next();
  };

const  validateReqUser = (req, res, next) => {

    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).json({ errors });
    }
      next();
  };



export { courseSchema, userSchema, validateReqCourse , validateReqUser};
