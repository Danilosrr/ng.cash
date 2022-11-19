import { Request, Response } from "express";
import { createUser } from "../Interfaces/users.interface.js";
import { userServices } from "../Services/users.services.js";

export async function signUp(req: Request, res: Response) {
  const user:createUser = req.body;
  
  await userServices.signUpService(user);

  res.sendStatus(201);
}

export async function signIn(req: Request, res: Response) {
  const user:createUser = req.body;

  const login = await userServices.signInService(user);

  res.status(200).send(login);
}
