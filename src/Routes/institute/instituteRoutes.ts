import express, { Router } from "express";
import InstituteController from "../../controller/instititute/institiuteController.ts";
import MiddleWare from "../../middleWare/middleWare.ts";

const router: Router = express.Router()

router.post('/',MiddleWare.isLogedIn, InstituteController.createInstitute,InstituteController.createTeacher)





export default router