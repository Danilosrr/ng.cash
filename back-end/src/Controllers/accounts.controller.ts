import { Request, Response } from "express";
import { date } from "joi";
import { transactionType } from "../Interfaces/account.interface.js";
import { token } from "../Interfaces/users.interface.js";
import { accountsServices } from "../Services/accounts.service.js";

export async function balance(req: Request, res: Response) {
  const token: token = res.locals.token;

  const balance = await accountsServices.accountBalance(token.username);

  res.status(200).send(balance);
}

export async function extract(req: Request, res: Response) {
  const token: token = res.locals.token;
  const dateFilter = req.query.date;
  const typeFilter = req.query.type;

  let extract = await accountsServices.accountExtract(token.username);

  if (!!dateFilter) {
    extract = accountsServices.filterDate({
      extract,
      dateFilter: String(dateFilter),
    });
  }

  if (!!typeFilter) {
    extract = await accountsServices.filterType({
      extract,
      typeFilter: String(typeFilter) as transactionType,
    });
  }

  res.status(200).send(extract);
}
