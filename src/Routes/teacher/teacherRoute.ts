

import express, { Router } from "express";
import teacherLogin from "../../controller/teacher/teacherController.ts";





const router: Router = express.Router()

router.post('/login', teacherLogin)









export default router