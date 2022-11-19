import { PrismaClient, Transactions } from "@prisma/client";
import { prisma } from "../Config/database.js";
import { transaction } from "../Interfaces/account.interface.js";
import { forbiddenError } from "../Middlewares/errorHandler.js";

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
      where: { id: user.accountId },
      data: { balance: { decrement: transaction.value } },
    });

    await prisma.accounts.update({
      where: { id: receiver.accountId },
      data: { balance: { increment: transaction.value } },
    });

    await prisma.transactions.create({
      data: {
        value: transaction.value,
        creditedAccountId: receiver.accountId,
        debitedAccountId: user.accountId,
      },
    });

    return;
  });
}

async function findCashOuts(accountId: number) {
  return await prisma.transactions.findMany({
    where: { debitedAccountId: accountId },
  });
}

async function findCashIns(accountId: number) {
  return await prisma.transactions.findMany({
    where: { creditedAccountId: accountId },
  });
}

export const transactionsRepository = {
  createTransaction,
  findCashOuts,
  findCashIns,
};
