import express from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "../../controllers/category.controller";
import { validateRequestBody } from "../../validators";
import { categorySchema } from "../../validators/category.validator";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateRequestBody(categorySchema),
  createCategoryHandler
);
categoryRouter.get("/:id", getCategoryHandler);
categoryRouter.get("/", getAllCategoriesHandler);
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategoryHandler);
categoryRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateRequestBody(categorySchema),
  updateCategoryHandler
);

export default categoryRouter;
