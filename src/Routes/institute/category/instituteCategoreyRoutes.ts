import express, { Router } from "express";

import MiddleWare from "../../../middleWare/middleWare.ts";
import CategoryController from "../../../controller/instititute/category/instituteCategoryController.ts";




const router: Router = express.Router()

router.post('/category',MiddleWare.isLogedIn,CategoryController.createCategory )
router.get('/category',MiddleWare.isLogedIn,CategoryController.getAllCategories )
router.delete('/category/:id',MiddleWare.isLogedIn,CategoryController.deletelCategories )








export default router