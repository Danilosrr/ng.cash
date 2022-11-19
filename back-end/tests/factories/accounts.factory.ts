import jwt from "jsonwebtoken";
import { prisma } from "../../src/Config/database";
import { createUser } from "../../src/Interfaces/users.interface";
import { userFactory } from "./users.factory";

async function clearDatabase() {
  await prisma.transactions.deleteMany();
  await prisma.users.deleteMany();
  await prisma.accounts.deleteMany();
}

async function getToken(user: createUser) {
  await userFactory.createNewUser(user);
  const { id, username } = await userFactory.findUser(user.username);

  const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
  return token;
}

export const accountFactory = {
  clearDatabase,
  getToken,
};
