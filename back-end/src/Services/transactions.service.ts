import { transaction } from "../Interfaces/account.interface.js";
import { forbiddenError, notFoundError } from "../Middlewares/errorHandler.js";
import { transactionsRepository } from "../Repositories/transactions.repository.js";
import { usersRepository } from "../Repositories/users.repository.js";

async function cashOut(transaction: transaction) {
  const { username, receiver, value } = transaction;

  if (value <= 0) throw forbiddenError("transaction not permitted");

  const selfTransaction = username === receiver;
  if (selfTransaction) throw forbiddenError("transaction not permitted");

  const user = await usersRepository.findByUsername(receiver);
  if (!user) throw notFoundError("user not found");

  return await transactionsRepository.createTransaction(transaction);
}

export const transactionsServices = {
  cashOut,
};