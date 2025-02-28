// src/routes/index.ts
import { Router } from "express";
import usersRouter from "./users";

const router = Router();

router.use("/users", usersRouter);
// router.use("/products", productsRouter);

export default router;
