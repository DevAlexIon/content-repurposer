import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )
}

// POST /api/auth/register
authRouter.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password required' })
        }

        const supabase = getSupabase()

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
            plan: 'free',
            credits: 3
        })

        res.status(201).json({ message: 'Account created successfully' })
    } catch (err) {
        next(err)
    }
})

// POST /api/auth/login
authRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' })
        }

        const supabase = getSupabase()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()


        res.json({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: profile.name,
                credits: profile.credits,
                plan: profile.plan
            }
        })
    } catch (err) {
        next(err)
    }
})

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const supabase = getSupabase()

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user!.id)
            .single()

        if (!profile) return res.status(404).json({ error: 'Profile not found' })

        res.json({
            user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                credits: profile.credits,
                plan: profile.plan
            }
        })
    } catch (err) {
        next(err)
    }
})

// POST /api/auth/logout
authRouter.post('/logout', requireAuth, async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]!
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        )

        await supabase.auth.signOut()
        res.json({ message: 'Logged out successfully' })
    } catch (err) {
        next(err)
    }
})