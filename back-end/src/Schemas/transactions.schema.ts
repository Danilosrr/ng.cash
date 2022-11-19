import joi from "joi";
import { transaction } from "../Interfaces/account.interface";

export const transactionSchema = joi.object<Omit<transaction, "username">>({
  receiver: joi.string().min(3).required(),
  value: joi.number().positive().required(),
});
