import express from 'express'
import authRoutes from './Routes/global/auth/authRoute.ts'
import instituteRoutes from './Routes/institute/instituteRoutes.ts'
const app = express()
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/institute', instituteRoutes)

export default app   