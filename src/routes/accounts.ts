// src/routes/account.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken"; // เรียกใช้งาน middleware
import {
  createAccount,
  getAccount,
  getAccountById,
  updateAccountById,
  deleteAccountById,
} from "../controllers/accountController";

const router = Router();

router.post("/account", verifyToken,createAccount);
router.get("/account", getAccount);
router.get("/account/:id", getAccountById);
router.put("/account/:id", updateAccountById);
router.delete("/account/:id", deleteAccountById);

export default router;
