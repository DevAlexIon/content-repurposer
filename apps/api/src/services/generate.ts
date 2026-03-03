import { createClient } from '@supabase/supabase-js'
import { generateContent, OutputFormat } from './ai.js'

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )
}

const DEFAULT_FORMATS: OutputFormat[] = [
    'linkedin_post',
    'twitter_thread',
    'newsletter',
    'tiktok_script'
]

export async function processJob(jobId: string) {
    const supabase = getSupabase()

    try {
        await supabase
            .from('jobs')
            .update({ status: 'processing' })
            .eq('id', jobId)

        const { data: job } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single()

        if (!job) throw new Error('Job not found')

        let content = job.input_text

        // TODO: dacă e video/audio → transcribe mai întâi
        // if (job.input_type === 'video' || job.input_type === 'audio') {
        //   content = await transcribeAudio(job.input_url)
        // }

        if (!content) throw new Error('No content to process')

        const outputs = await generateContent(content, DEFAULT_FORMATS)

        await supabase
            .from('jobs')
            .update({
                status: 'done',
                outputs
            })
            .eq('id', jobId)

    } catch (err) {
        console.error('Job processing error:', err)

        await supabase
            .from('jobs')
            .update({ status: 'error' })
            .eq('id', jobId)
    }
}