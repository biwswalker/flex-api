// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";
import companyRouter from "./company";
import projectRouter from "./project";
import accountsRouter from "./accounts";

const router = Router();

router.use("/", usersRouter); //user
router.use("/", companyRouter); //company
router.use("/", projectRouter); //project
router.use("/", accountsRouter); //project


export default router;
