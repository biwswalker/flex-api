// src/routes/users.ts
import { Router } from "express";
import {
  createUser,
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
  login,
  forgotPassword,
  verify,
  resetPassword,
  me,
  logout,
} from "../controllers/usersController";
import { verifyToken } from "../middlewares/verifyToken"; // เรียกใช้งาน middleware

const router = Router();

router.post("/users", createUser);
router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify", verify);
router.get("/me", verifyToken, me);
router.post("/logout", logout);

export default router;
