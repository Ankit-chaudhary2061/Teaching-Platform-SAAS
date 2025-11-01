import express, { Router } from "express";
import multer from "multer";
import MiddleWare from "../../../middleWare/middleWare.ts";
import CourseController from "../../../controller/instititute/course/courseController.ts";

// local style
// import{multer, storage} from '../../../middleWare/multerMiddleWare.ts'
// const upload = multer({storage:storage})

// online 
import { cloudinary,storage } from "../../../services/cloudinaryConfig.ts";
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
})

const router: Router = express.Router()

router.post('/course',MiddleWare.isLogedIn,upload.single('courseThumbnail'),CourseController.createCourse )
router.get('/course',CourseController.fetchCourse )
router.get('/course/:id',CourseController.getAllSingleCourse )
router.delete('/course/:id',CourseController.deleteCourse )








export default router