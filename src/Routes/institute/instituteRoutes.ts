import express, { Router } from "express";
import InstituteController from "../../controller/instititute/institiuteController.ts";

const router: Router = express.Router()

router.post('/', InstituteController.createInstitute)





export default router