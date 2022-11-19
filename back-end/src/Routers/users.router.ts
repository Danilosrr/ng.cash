import { Router } from "express";
import { signIn, signUp } from "../Controllers/users.controller.js";
import validSchema from "../Middlewares/validateSchema.js";
import { userSchema } from "../Schemas/users.schema.js";

const usersRouter = Router();

usersRouter.post("/signin",validSchema(userSchema),signIn);
usersRouter.post("/signup",validSchema(userSchema),signUp);

export default usersRouter;
