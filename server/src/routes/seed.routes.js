import express from "express";
import { seedQuizzes } from "../controllers/seed.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/quizzes", protect, authorizeRoles("admin"), seedQuizzes);

export default router;