import express from 'express'
import authRoutes from './Routes/global/auth/authRoute.ts'
import instituteRoutes from './Routes/institute/instituteRoutes.ts'
import instituteCourseRoutes from './Routes/institute/course/instituteCourse.ts'
import instituteCategoryRoutes from './Routes/institute/category/instituteCategoreyRoutes.ts'
import instituteTeacherRoutes from './Routes/institute/teacher/instituteTeacherRoutes.ts'
import teacherRoute from './Routes/teacher/teacherRoute.ts'

const app = express()
app.use(express.json())
//auth routes
app.use('/api', authRoutes)
//instituteRoutes
app.use('/api/institute', instituteRoutes)
app.use('/api/institute', instituteCourseRoutes)
app.use('/api/institute', instituteCategoryRoutes)
app.use('/api/institute', instituteTeacherRoutes)
//teacherRoute
app.use('api/teacher', teacherRoute)




export default app   