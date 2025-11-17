import express, { Router } from "express";
import InstituteController from "../../controller/instititute/institiuteController.ts";
import MiddleWare from "../../middleWare/middleWare.ts";

const router: Router = express.Router();

// Chain all table creations properly
router.post(
  '/',
  MiddleWare.isLogedIn,
  InstituteController.createInstitute,
  InstituteController.createTeacher,
  InstituteController.createStudent,
  InstituteController.createCategoryTable,
  InstituteController.createCourseChatpterTable,
  InstituteController.createCourseTable
);

export default router;
