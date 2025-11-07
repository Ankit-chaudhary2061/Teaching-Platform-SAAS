import express, { Router } from "express";
import MiddleWare from "../../../middleWare/middleWare.ts";
import TeacherController from "../../../controller/instititute/teacher/teacherController.ts";
import { cloudinary,storage } from "../../../services/cloudinaryConfig.ts";
import multer from "multer";
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
})

const router: Router = express.Router();

// Chain all table creations properly
router.post(
  '/teacher',
 MiddleWare.isLogedIn,upload.single('teacherPhoto'),TeacherController.createTeacher
);
router.delete('/course/:id',MiddleWare.isLogedIn,TeacherController.createTeacher )
router.get('/course',MiddleWare.isLogedIn,TeacherController.getTeachers )

export default router;
