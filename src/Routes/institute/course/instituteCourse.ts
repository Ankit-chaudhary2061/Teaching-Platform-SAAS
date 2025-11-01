import express, { Router } from "express";

import MiddleWare from "../../../middleWare/middleWare.ts";
import CourseController from "../../../controller/instititute/course/courseController.ts";

const router: Router = express.Router()

router.post('/course',MiddleWare.isLogedIn,CourseController.createCourse )
router.get('/course',CourseController.fetchCourse )
router.get('/course/:id',CourseController.getAllSingleCourse )
router.delete('/course/:id',CourseController.deleteCourse )








export default router