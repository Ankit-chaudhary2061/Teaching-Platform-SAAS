



import express, { Router } from "express";

import asyncErrorHolder from "../../../services/asyncErrorHandler.ts";
import { instituteCourseListForStudent, instituteListForStudent } from "../../../controller/student/institute/student-institute-controller.ts";
import MiddleWare from "../../../middleWare/middleWare.ts";
import CartController from "../../../controller/student/cart/student-cart-controller.ts";
import { UserRole } from "../../../middleWare/type.ts";






const router: Router = express.Router()

router.post('/cart',MiddleWare.isLogedIn,MiddleWare.changeUserIdForTableName, MiddleWare.restrictTo(UserRole.Student),asyncErrorHolder(CartController.insertIntoCartTableOfStudent))
router.get('/cart',MiddleWare.isLogedIn,MiddleWare.changeUserIdForTableName, MiddleWare.restrictTo(UserRole.Student), asyncErrorHolder(CartController.fetchStudentCartItems))
router.delete('/cart/:id',MiddleWare.isLogedIn, MiddleWare.restrictTo(UserRole.Student), asyncErrorHolder(CartController.deleteStudentCartItem))












export default router