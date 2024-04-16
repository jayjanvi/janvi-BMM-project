const { z } = require("zod");

//object schema
const signupSchema = z.object({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must have at lest 3 character" })
    .max(255, { message: "Name must not have more than 255 character" }),
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "Invalid Email Address" })
    .email(3, { message: "Email must have at lest 3 character" })
    .max(255, { message: "Email must not have more than 255 character" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(10, { message: "Phone must have at lest 10 character" })
    .max(13, { message: "phone must not have more than 13 character" }),
  password: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password must have at lest 6 character" })
    .max(1024, { message: "password must not have more than 1024 character" }),
});

module.exports = signupSchema;
