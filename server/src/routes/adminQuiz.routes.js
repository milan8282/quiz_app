import express from "express";
import {
  createQuiz,
  getAdminQuizzes,
  getAdminQuizById,
  updateQuiz,
  deleteQuiz,
  updateQuizStatus,
} from "../controllers/adminQuiz.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.route("/").post(createQuiz).get(getAdminQuizzes);

router
  .route("/:id")
  .get(getAdminQuizById)
  .patch(updateQuiz)
  .delete(deleteQuiz);

router.patch("/:id/status", updateQuizStatus);

export default router;