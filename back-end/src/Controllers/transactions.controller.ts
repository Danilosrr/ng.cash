import { Request, Response } from "express";
import { transaction } from "../Interfaces/account.interface.js";
import { transactionsServices } from "../Services/transactions.service.js";

export async function transaction(req: Request, res: Response) {
  const token = res.locals.token;
  const transaction: transaction = { ...req.body, username: token.username };

  await transactionsServices.cashOut(transaction);

  res.sendStatus(201);
}
