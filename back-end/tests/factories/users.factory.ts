import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";
import { prisma } from "../../src/Config/database";
import { createUser } from "../../src/Interfaces/users.interface";

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

async function findUser(username: string) {
  return await prisma.users.findUnique({
    where: {
      username,
    },
  });
}

function validUser() {
  return {
    username: faker.lorem.word({ length: { min: 3, max: 9 } }),
    password:
      faker.random.alpha({ count: 8, casing: "mixed" }) +
      faker.random.numeric(2),
  };
}

function validUsername() {
  return faker.lorem.word({ length: { min: 6, max: 12 }, strategy: "longest" });
}

function validPassword() {
  return (
    faker.random.alpha({ count: 6, casing: "upper" }) +
    faker.random.alpha({ count: 6, casing: "lower" }) +
    faker.random.numeric(2)
  );
}

async function createNewUser(user: createUser) {
  const { username, password } = user;

  const account = await prisma.accounts.create({
    data: {},
  });

  const newUser = {
    username,
    password: cryptr.encrypt(password),
    accountId: account.id,
  };

  await prisma.users.create({
    data: newUser,
  });

  return newUser;
}

function createTransaction(receiver: string) {
  return {
    receiver,
    value: 100,
  };
}

async function getToken(user: createUser) {
  await createNewUser(user);
  const { id, username } = await userFactory.findUser(user.username);

  const token = jwt.sign({ id, username }, process.env.JWT_KEY, {
    expiresIn: "24h",
  });
  return token;
}

async function clearDatabase() {
  await prisma.transactions.deleteMany();
  await prisma.users.deleteMany();
  await prisma.accounts.deleteMany();
}

export const userFactory = {
  findUser,
  validUser,
  validUsername,
  validPassword,
  createNewUser,
  createTransaction,
  getToken,
  clearDatabase,
};
