import joi from "joi";
import { createUser } from "../Interfaces/users.interface";

export const userSchema = joi.object<createUser>({
  username: joi.string().min(3).required(),
  password: joi
    .string()
    .min(8)
    .regex(/[A-Z]/, "upper-case")
    .regex(/[a-z]/, "lower-case")
    .regex(/[0-9]/, "number")
    .required(),
});
