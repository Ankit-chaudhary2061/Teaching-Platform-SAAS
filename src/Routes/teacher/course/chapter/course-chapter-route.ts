import express, { Router } from "express";
import ChapterController from "../../../../controller/teacher/course/chapter/chapter-controller.ts";
import MiddleWare from "../../../../middleWare/middleWare.ts";

const router: Router = express.Router();

// Create Chapter
router.post(
  "/course/:courseId/chapter",
  MiddleWare.isLogedIn,
  ChapterController.addChapterCourse
);

// Fetch Chapters of course
router.get(
  "/course/:courseId/chapter",
  MiddleWare.isLogedIn,
  ChapterController.fetchCourseChapter
);

export default router;
