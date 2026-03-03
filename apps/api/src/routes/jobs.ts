import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../middleware/auth.js'
import { processJob } from '../services/generate.js'

export const jobsRouter = Router()

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )
}

// GET /api/jobs — toate joburile userului
jobsRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', req.user!.id)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: error.message })

        res.json({ jobs: data })
    } catch (err) {
        next(err)
    }
})

// GET /api/jobs/:id — un job specific
jobsRouter.get('/:id', requireAuth, async (req, res, next) => {
    try {
        const supabase = getSupabase()

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user!.id)
            .single()

        if (error || !data) {
            return res.status(404).json({ error: 'Job not found' })
        }

        res.json({ job: data })
    } catch (err) {
        next(err)
    }
})

// POST /api/jobs — creează job nou
jobsRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const supabase = getSupabase()
        const { input_type, input_text, input_url } = req.body

        if (!input_type) {
            return res.status(400).json({ error: 'input_type is required' })
        }

        if (!input_text && !input_url) {
            return res.status(400).json({ error: 'input_text or input_url is required' })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', req.user!.id)
            .single()

        if (!profile || profile.credits <= 0) {
            return res.status(402).json({ error: 'No credits remaining' })
        }

        const { data: job, error } = await supabase
            .from('jobs')
            .insert({
                user_id: req.user!.id,
                status: 'pending',
                input_type,
                input_text,
                input_url
            })
            .select()
            .single()

        if (error) return res.status(500).json({ error: error.message })

        await supabase
            .from('profiles')
            .update({ credits: profile.credits - 1 })
            .eq('id', req.user!.id)

        processJob(job.id).catch(console.error)
        res.status(201).json({ job })
    } catch (err) {
        next(err)
    }
})