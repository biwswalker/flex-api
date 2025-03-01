// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";
import companyRouter from "./company";

const router = Router();

router.use("/users", usersRouter);
router.use("/company", companyRouter);

export default router;
