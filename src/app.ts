import express from 'express';
import cors from 'cors';
import authRoutes from './Routes/global/auth/authRoute.ts';
import instituteRoutes from './Routes/institute/instituteRoutes.ts';
import instituteCourseRoutes from './Routes/institute/course/instituteCourse.ts';
import instituteCategoryRoutes from './Routes/institute/category/instituteCategoreyRoutes.ts';
import instituteTeacherRoutes from './Routes/institute/teacher/instituteTeacherRoutes.ts';
import teacherRoute from './Routes/teacher/teacherRoute.ts';
import lessonRoute from './Routes/teacher/course/lesson/course-lesson.ts'
import chapterRoute from './Routes/teacher/course/chapter/course-chapter-route.ts'
const app = express();


app.use(express.json());

// Enable CORS
app.use(cors({
 origin: "http://localhost:3000", //  frontend url
  // methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Routes
//auth routes
app.use('/api', authRoutes);
//institute route
app.use('/api/institute', instituteRoutes);
app.use('/api/institute', instituteCourseRoutes);
app.use('/api/institute', instituteCategoryRoutes);
app.use('/api/institute', instituteTeacherRoutes);
// teacher Route
app.use('/api/teacher', teacherRoute);
app.use('/api/teacher/course', lessonRoute);
app.use('/api/teacher/course', chapterRoute);




export default app;
