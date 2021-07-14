const Joi = require("joi")

const title = Joi.string()
  .required();

const name = Joi.string()
.regex(/^[a-zA-Z ]*$/)
.min(3)
.max(30)
.required()

const role = Joi.string().valid('applicant', 'recruiter')

const startYear = Joi.string()
.regex(/\d{4}$/)
.required()

const endYear = Joi.string()
.trim()
.regex(/\d{4}$/)

const message =
  "must be between 8-16 characters, " +
  "have at least one capital letter, " +
  "one lowercase letter, one digit, " +
  "and one special character";

const password = Joi.string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  .min(8)
  .max(16)
  .required()
  .messages({
    'regex': message
  })

const education = Joi.array().items(Joi.object().keys({
  name,
  startYear,
  endYear
}))

const bio = Joi.string()

const contactNumber = Joi.string()
  .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)

const applicantSchema = Joi.object(
{
  user:{
    name,
    email,
    password,
    role
  },
  education
  
});

const recruiterSchema = Joi.object(
{
  user:{
    name,
    email,
    password,
    role
  },
  contactNumber,
  bio
  
}).allowUnknown();

const signInValidator = Joi.object().keys({
  email,
  password
});

module.exports = { applicantSchema,  recruiterSchema, signInValidator};