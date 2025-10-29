import express from 'express'
import authRoutes from './Routes/global/auth/authRoute.ts'
const app = express()
app.use(express.json())

app.use('/api', authRoutes)
export default app   