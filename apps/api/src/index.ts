import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import { waitlistRouter } from './routes/waitlist.js'
import { authRouter } from './routes/auth.js'
import { jobsRouter } from './routes/jobs.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api', waitlistRouter)
app.use('/api/jobs', jobsRouter)


app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
})