



import express, { Router } from "express";

import asyncErrorHolder from "../../../services/asyncErrorHandler.ts";
import { instituteCourseListForStudent, instituteListForStudent } from "../../../controller/student/institute/student-institute-controller.ts";






const router: Router = express.Router()

router.get('/institute', asyncErrorHolder(instituteListForStudent))
router.get('/institute/:instituteId/course', asyncErrorHolder(instituteCourseListForStudent))











export default router