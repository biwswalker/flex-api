// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";
import companyRouter from "./company";

const router = Router();

router.use("/", usersRouter); //user
router.use("/", companyRouter); //company

export default router;
