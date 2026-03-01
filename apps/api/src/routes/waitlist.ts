import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { sendWaitlistEmail } from '../services/email.js'

export const waitlistRouter = Router()

waitlistRouter.post('/waitlist', async (req, res) => {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )

    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: 'Email is required' })
    }

    const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])

    if (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email already on waitlist' })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }

    await sendWaitlistEmail(email)

    res.json({ success: true })
})