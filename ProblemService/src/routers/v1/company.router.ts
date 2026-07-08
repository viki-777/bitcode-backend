import express from "express";
import {
  createCompanyHandler,
  deleteCompanyHandler,
  getAllCompaniesHandler,
  getCompanyHandler,
  updateCompanyHandler,
} from "../../controllers/company.controller";
import { validateRequestBody } from "../../validators";
import { companySchema } from "../../validators/company.validator";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const companyRouter = express.Router();

companyRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRequestBody(companySchema),
  createCompanyHandler
);
companyRouter.get("/:id", getCompanyHandler);
companyRouter.get("/", getAllCompaniesHandler);
companyRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCompanyHandler);
companyRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRequestBody(companySchema),
  updateCompanyHandler
);

export default companyRouter;
