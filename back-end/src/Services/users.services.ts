import jwt from "jsonwebtoken";
import { forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import Cryptr from "cryptr";
import { usersRepository } from "../Repositories/users.repository.js";
import { createUser } from "../Interfaces/users.interface.js";

const cryptrKey = process.env.CRYPTR_KEY || "cryptr";
const cryptr = new Cryptr(cryptrKey);

function encrypt(password: string) {
  const encryptedPassword = cryptr.encrypt(password);
  return encryptedPassword;
}

function compare(password: string, encryptedPassword: string) {
  const decryptedPassword = cryptr.decrypt(encryptedPassword);
  if (decryptedPassword === password) return true;
  else return false;
}

async function signUpService(newUser: createUser) {
  const { username, password } = newUser;

  const userFound = await usersRepository.findByUsername(username);
  if (userFound) throw notFoundError("username not available");

  const createUser = await usersRepository.createUser({
    username,
    password: encrypt(password),
  });

  return;
}

async function signInService(login: createUser) {
  const { username, password } = login;

  const userFound = await usersRepository.findByUsername(username);
  if (!userFound) throw notFoundError("user not found");

  const passwordMatch = compare(password, userFound.password);
  if (!passwordMatch) throw forbiddenError("incorrect password");

  const token = jwt.sign({ username, id: userFound.id }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
  
  return { token: token };
}

export const userServices = {
  compare,
  signInService,
  signUpService
};
