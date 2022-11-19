import { transactionsToFilter } from "../Interfaces/account.interface.js";
import { badRequestError, notFoundError } from "../Middlewares/errorHandler.js";
import { accountsRepository } from "../Repositories/accounts.repository.js";
import { transactionsRepository } from "../Repositories/transactions.repository.js";
import { usersRepository } from "../Repositories/users.repository.js";

async function accountBalance(username: string) {
  const user = await usersRepository.findByUsername(username);
  if (!user) throw notFoundError("user not found");

  const account = await accountsRepository.findById(user.accountId);
  if (!account) throw notFoundError("account not found");

  delete account.id;
  return account;
}

async function accountExtract(username: string) {
  const user = await usersRepository.findByUsername(username);
  if (!user) throw notFoundError("user not found");

  const cashOuts = await transactionsRepository.findCashOuts(user.accountId);
  const cashIns = await transactionsRepository.findCashIns(user.accountId);

  const debitTransactions = cashOuts.map((operations) => {
    return { ...operations, type: "debit" };
  });
  const creditTransactions = cashIns.map((operations) => {
    return { ...operations, type: "credit" };
  });

  const transactions = debitTransactions.concat(creditTransactions);
  return transactions;
}

async function filterType(extractInfo: Omit<transactionsToFilter, "dateFilter">) {
  const { typeFilter, extract } = extractInfo;

  const typeFormat =
    typeFilter.toLowerCase() == "debit" || typeFilter.toLowerCase() == "credit";
  if (!typeFormat) throw badRequestError("invalid operation type");

  const filteredExtract = extract.filter((operation) =>
    operation.type == typeFilter
  )

  return filteredExtract;
}

function filterDate(extractInfo: Omit<transactionsToFilter, "typeFilter">) {
  const { dateFilter, extract } = extractInfo;

  const dateFormat = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(
    dateFilter
  ); // yyyy-mm-dd
  if (!dateFormat) throw badRequestError("invalid date format");

  const filteredExtract = extract.filter((operation) =>
    JSON.stringify(operation.createdAt).includes(dateFilter)
  );

  return filteredExtract;
}

export const accountsServices = {
  accountBalance,
  accountExtract,
  filterType,
  filterDate
};
