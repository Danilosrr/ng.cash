import { Router } from "express";
import accountsRouter from "./accounts.router.js";
import transactionsRouter from "./transactions.router.js";
import usersRouter from "./users.router.js";

const router = Router();

router.use(usersRouter);
router.use(accountsRouter);
router.use(transactionsRouter);

export default router;
