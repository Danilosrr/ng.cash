import { Router } from "express";
import { transaction } from "../Controllers/transactions.controller.js";
import validSchema from "../Middlewares/validateSchema.js";
import validateToken from "../Middlewares/validateToken.js";
import { transactionSchema } from "../Schemas/transactions.schema.js";

const transactionsRouter = Router();

transactionsRouter.post(
  "/transaction",
  validateToken,
  validSchema(transactionSchema),
  transaction
);

export default transactionsRouter;
