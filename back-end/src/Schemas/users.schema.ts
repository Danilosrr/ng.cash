import joi from "joi";
import { createUser } from "../Interfaces/users.interface";

export const userSchema = joi.object<createUser>({
  username: joi.string().min(3).required(),
  password: joi
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .error(
      new Error(
        "password must contain upper and lower case letters and at least one number!"
      )
    ),
});
