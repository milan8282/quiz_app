import express from "express";
import {
  getQuizzes,
  getQuizById,
  startQuiz,
} from "../controllers/quiz.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("user", "admin"));

router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/start", startQuiz);

export default router;