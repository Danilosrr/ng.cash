import { PrismaClient } from "@prisma/client";
import { prisma } from "../Config/database.js";
import { transaction } from "../Interfaces/account.interface.js";
import { forbiddenError } from "../Middlewares/errorHandler.js";

async function findById(id: number) {
  return await prisma.accounts.findUnique({
    where: { id },
  });
}

async function createAccount(balance: number) {
  return await prisma.accounts.create({ data: { balance } });
}

async function createTransaction(transaction: transaction) {
  return await prisma.$transaction(async (prisma: PrismaClient) => {
    const user = await prisma.users.findUnique({
      where: { username: transaction.username },
      include: { account: true },
    });

    const receiver = await prisma.users.findUnique({
      where: { username: transaction.receiver },
      include: { account: true },
    });

    if (user.account.balance < transaction.value)
      throw forbiddenError("unavailable balance");

    await prisma.accounts.update({
      where: { id: user.account.id },
      data: { balance: { decrement: transaction.value } },
    });

    await prisma.accounts.update({
      where: { id: receiver.account.id },
      data: { balance: { increment: transaction.value } },
    });

    return;
  });
}

export const accountsRepository = {
  findById,
  createAccount,
  createTransaction,
};
