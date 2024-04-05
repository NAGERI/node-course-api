import Joi from "joi";

const courseSchema = Joi.object().keys({
  title: Joi.string().min(5).max(50).required(),
  description: Joi.string().min(10).max(200).required(),
  instructor: Joi.string().min(5).max(30).required(),
  price: Joi.number().integer(),
});
const userSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "org"] } })
    .required(),
  name: Joi.string().alphanum().min(5).max(50).required(),
  age: Joi.number().integer().min(13).max(70),
});

 function validate(schema) { 
  (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error)
      const { details } = error;
      const message = details.map((i) => i.message).join(", ");
      return res.status(422).json({
        type: details.type,
        message,
      });
    } else {
      next();
    }
  };}


export { courseSchema, userSchema, validate };
