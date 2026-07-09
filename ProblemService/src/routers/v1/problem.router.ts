import express from "express";
import {
  createProblemHandler,
  deleteProblemHandler,
  getProblemHandler,
  updateProblemHandler,
  getProblemsHandler,
  getProblemsCountHandler,
  getProblemBySlugHandler,
  patchProblemHandler,
  softDeleteProblemHandler,
  getProblemTagsHandler,
  addProblemTagsHandler,
  removeProblemTagHandler,
  getProblemCompaniesHandler,
  addProblemCompaniesHandler,
  removeProblemCompanyHandler,
  getProblemStatementHandler,
  updateProblemStatementHandler,
  getProblemMetaHandler,
  getProblemStatsHandler,
  updateProblemStatsHandler,
  getProblemTestcasesHandler,
  addProblemTestcaseHandler,
  updateProblemTestcaseHandler,
  deleteProblemTestcaseHandler,
  validateProblemTestcasesHandler,
  getRandomProblemHandler,
  isSlugAvailableHandler,
} from "../../controllers/problem.controller";

import {
  createCommentHandler,
  getCommentsHandler
} from "../../controllers/comment.controller";

import {
  createSolutionHandler,
  getSolutionsHandler
} from "../../controllers/solution.controller";


import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const problemRouter = express.Router();

// Create
problemRouter.post("/", authMiddleware, adminMiddleware, createProblemHandler);

// List & query
problemRouter.get("/", getProblemsHandler);
problemRouter.get("/count", getProblemsCountHandler);
problemRouter.get("/random", getRandomProblemHandler);
problemRouter.get("/slug-available", isSlugAvailableHandler);
problemRouter.get("/slug/:slug", getProblemBySlugHandler);

// Read single
problemRouter.get("/:id", getProblemHandler);

// Update
problemRouter.put("/:id", authMiddleware, adminMiddleware, updateProblemHandler);
problemRouter.patch("/:id", authMiddleware, adminMiddleware, patchProblemHandler);

// Delete (soft + hard existing)
problemRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProblemHandler);
problemRouter.delete("/:id/soft", authMiddleware, adminMiddleware, softDeleteProblemHandler);

// Tags
problemRouter.get("/:id/tags", getProblemTagsHandler);
problemRouter.post("/:id/tags", authMiddleware, adminMiddleware, addProblemTagsHandler);
problemRouter.delete("/:id/tags/:tag", authMiddleware, adminMiddleware, removeProblemTagHandler);

// Companies
problemRouter.get("/:id/companies", getProblemCompaniesHandler);
problemRouter.post("/:id/companies", authMiddleware, adminMiddleware, addProblemCompaniesHandler);
problemRouter.delete("/:id/companies/:companyId", authMiddleware, adminMiddleware, removeProblemCompanyHandler);

// Statement / Meta / Stats
problemRouter.get("/:id/statement", getProblemStatementHandler);
problemRouter.patch("/:id/statement", authMiddleware, adminMiddleware, updateProblemStatementHandler);
problemRouter.get("/:id/meta", getProblemMetaHandler);
problemRouter.get("/:id/stats", getProblemStatsHandler);
problemRouter.patch("/:id/stats", updateProblemStatsHandler); // stats uses no auth so EvaluationService can call it

// Testcases
problemRouter.get("/:id/testcases", getProblemTestcasesHandler);
problemRouter.post("/:id/testcases", authMiddleware, adminMiddleware, addProblemTestcaseHandler);
problemRouter.patch("/:id/testcases/:index", authMiddleware, adminMiddleware, updateProblemTestcaseHandler);
problemRouter.delete("/:id/testcases/:index", authMiddleware, adminMiddleware, deleteProblemTestcaseHandler);
problemRouter.post("/:id/testcases/validate", authMiddleware, adminMiddleware, validateProblemTestcasesHandler);

// Comments
problemRouter.get("/:id/comments", getCommentsHandler);
problemRouter.post("/:id/comments", authMiddleware, createCommentHandler);

// Solutions
problemRouter.get("/:id/solutions", getSolutionsHandler);
problemRouter.post("/:id/solutions", authMiddleware, createSolutionHandler);

export default problemRouter;
