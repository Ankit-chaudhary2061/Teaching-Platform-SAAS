import express from 'express'
import authRoutes from './Routes/global/auth/authRoute.ts'
import instituteRoutes from './Routes/institute/instituteRoutes.ts'
import instituteCourseRoutes from './Routes/institute/course/instituteCourse.ts'
import instituteCategoryRoutes from './Routes/institute/category/instituteCategoreyRoutes.ts'
const app = express()
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/institute', instituteRoutes)
app.use('/api/institute', instituteCourseRoutes)
app.use('/api/institute', instituteCategoryRoutes)



export default app   