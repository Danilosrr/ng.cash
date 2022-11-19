import { PrismaClient, Users } from "@prisma/client";
import { prisma } from "../Config/database.js";

async function findByUsername(username: string) {
  return await prisma.users.findUnique({
    where: { username },
  });
}

async function createUser(user: Omit<Users, "id" | "accountId">) {
  return await prisma.$transaction(async (prisma: PrismaClient) => {
    const account = await prisma.accounts.create({ data: { balance: 100 } });

    return await prisma.users.create({
      data: { ...user, accountId: account.id },
    });
  });
}

export const usersRepository = {
  findByUsername,
  createUser,
};
