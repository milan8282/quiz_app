import express from "express";
import {
  getAttemptById,
  saveAnswer,
  submitAttempt,
  getAttemptResult,
  getUserDashboard,
  getUserAttempts,
  getAdminAttempts,
  getAdminAttemptDetail,
} from "../controllers/attempt.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/user/dashboard", authorizeRoles("user", "admin"), getUserDashboard);
router.get("/user", authorizeRoles("user", "admin"), getUserAttempts);

router.get("/admin", authorizeRoles("admin"), getAdminAttempts);
router.get("/admin/:attemptId", authorizeRoles("admin"), getAdminAttemptDetail);

router.get("/:attemptId", authorizeRoles("user", "admin"), getAttemptById);
router.patch("/:attemptId/answer", authorizeRoles("user", "admin"), saveAnswer);
router.post("/:attemptId/submit", authorizeRoles("user", "admin"), submitAttempt);
router.get(
  "/:attemptId/result",
  authorizeRoles("user", "admin"),
  getAttemptResult
);

export default router;