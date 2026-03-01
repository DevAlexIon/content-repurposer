import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { waitlistRouter } from './routes/waitlist'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api', waitlistRouter)

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
})