import express from "express";
import { importQuizFromFile } from "../controllers/import.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/quiz",
  protect,
  authorizeRoles("admin"),
  upload.single("file"),
  importQuizFromFile
);

export default router;