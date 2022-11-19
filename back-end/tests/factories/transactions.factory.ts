import { prisma } from "../../src/Config/database";

async function getAccountDebits(accountId: number) {
  return await prisma.transactions.findMany({
    where: { debitedAccountId: accountId },
  });
}

export const transactionsFactory = {
  getAccountDebits,
};
