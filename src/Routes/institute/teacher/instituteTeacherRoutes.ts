import express, { Router } from "express";
import MiddleWare from "../../../middleWare/middleWare.ts";
import TeacherController from "../../../controller/instititute/teacher/teacherController.ts";
import { cloudinary, storage } from "../../../services/cloudinaryConfig.ts";
import multer from "multer";

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const router: Router = express.Router();

/* ================================
      CREATE TEACHER
================================ */
router.post(
  "/teacher",
  MiddleWare.isLogedIn,
  upload.single("teacherPhoto"),
  TeacherController.createTeacher
);

/* ================================
      DELETE TEACHER (FIXED)
================================ */
router.delete(
  "/teacher/:id",
  MiddleWare.isLogedIn,
  TeacherController.deleteTeacher
);

/* ================================
      GET ALL TEACHERS
================================ */
router.get(
  "/teacher",
  MiddleWare.isLogedIn,
  TeacherController.getTeachers
);

export default router;
