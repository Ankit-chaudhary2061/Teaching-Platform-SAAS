import express, { Router } from "express";

import MiddleWare from "../../../../middleWare/middleWare.ts";
import { UserRole } from "../../../../middleWare/type.ts";
import LessonController from "../../../../controller/teacher/course/lesson/lesson-controller.ts";

const router: Router = express.Router();

// Create Chapter
router.post(
  "/:chapterId/lesson",
  MiddleWare.isLogedIn,MiddleWare.restrictTo(UserRole.Teacher),
  LessonController.createChapterLessonTable
);

// Fetch Chapters of course
router.get(
  "/:chapterId/lesson",
  MiddleWare.isLogedIn,
  LessonController.fetchChapterLesson
);

export default router;
