import { Router } from "express";
import { balance, extract } from "../Controllers/accounts.controller.js";
import validateToken from "../Middlewares/validateToken.js";

const accountsRouter = Router();

accountsRouter.get("/balance", validateToken, balance);
accountsRouter.get("/extract", validateToken, extract);

export default accountsRouter;
