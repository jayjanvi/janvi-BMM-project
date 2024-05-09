const { z } = require("zod");

// Object schema
const addUserSchema = z.object({
  username: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must not have more than 255 characters" })
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .max(255, { message: "Email must not have more than 255 characters" })
    .refine(
      (value) => {
        // Regular expression pattern to match Yahoo and Gmail domains
        const emailPattern = /^\S+@\S+\.\S+$/;
        return emailPattern.test(value);
      },
      {
        message:
          "Email must be a valid Yahoo or Gmail address ending with '.com'",
      }
    ),
  phone: z
    .string({ required_error: "Phone number is required" })
    .refine((value) => /^\d{10}$/.test(value), {
      message: "Phone number must be exactly 10 digits",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must have at least 6 characters" })
    .max(1024, { message: "Password must not have more than 1024 characters" })
    .refine(
      (value) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(value),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    ),
  department: z.any(),
  isEmployee: z.any(),
  code: z.any(),
});

module.exports = addUserSchema;
