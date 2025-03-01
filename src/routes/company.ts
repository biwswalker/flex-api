// src/routes/company.ts
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken"; // เรียกใช้งาน middleware
import {
  createCompany,
  getCompany,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
} from "../controllers/companyController";

const router = Router();

router.post("/", createCompany);
router.get("/", getCompany);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompanyById);
router.delete("/:id", deleteCompanyById);

export default router;
