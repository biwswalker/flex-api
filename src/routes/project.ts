// src/routes/project.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken"; // เรียกใช้งาน middleware
import {
  createProject,
  getProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} from "../controllers/projectController";

const router = Router();

router.post("/project", createProject);
router.get("/project", getProject);
router.get("/project/:id", getProjectById);
router.put("/project/:id", updateProjectById);
router.delete("/project/:id", deleteProjectById);

export default router;
