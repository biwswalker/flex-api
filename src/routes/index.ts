// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";
import companyRouter from "./company";

const router = Router();

router.use("/user", usersRouter);
router.use("/company", companyRouter);

export default router;
