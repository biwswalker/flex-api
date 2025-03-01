// src/routes/users.ts
import { Router } from "express";
import {
  createUser,
  getUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/usersController";

const router = Router();

router.post("/", createUser);
router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;
