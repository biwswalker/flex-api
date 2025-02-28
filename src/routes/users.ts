// src/routes/users.ts
import { Router } from "express";
import { getUser } from "../controllers/usersController";

const router = Router();

router.get("/:id", getUser);

export default router;
