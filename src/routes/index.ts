// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";
import companyRouter from "./company";
import projectRouter from "./project";

const router = Router();

router.use("/", usersRouter); //user
router.use("/", companyRouter); //company
router.use("/", projectRouter); //project


export default router;
