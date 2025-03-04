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

router.post("/company", createCompany);
router.get("/company", getCompany);
router.get("/company/:id", getCompanyById);
router.put("/company/:id", updateCompanyById);
router.delete("/company/:id", deleteCompanyById);

export default router;
