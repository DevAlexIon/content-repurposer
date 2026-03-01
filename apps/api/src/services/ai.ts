import OpenAI from 'openai'

function getOpenAI() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
    })
}

const PROMPTS = {
    linkedin_post: `You are an expert LinkedIn content creator. Transform the following content into a compelling LinkedIn post.
Rules:
- Maximum 1300 characters
- Start with a strong hook (first line is crucial)
- Use short paragraphs and line breaks
- End with a question or CTA to drive engagement
- Professional but conversational tone
- NO hashtags spam, max 3 relevant hashtags

Content: {{content}}`,

    twitter_thread: `You are an expert Twitter/X content creator. Transform the following content into a viral Twitter thread.
Rules:
- 5-8 tweets maximum
- First tweet must be a strong hook that makes people want to read more
- Each tweet max 280 characters
- Number each tweet: 1/, 2/, 3/ etc
- Last tweet should be a CTA or summary
- Punchy, direct language

Content: {{content}}`,

    newsletter: `You are an expert newsletter writer. Transform the following content into an engaging newsletter section.
Rules:
- Include a catchy subject line suggestion at the top
- Conversational, personal tone (like writing to a friend)
- 200-400 words
- Key takeaways in bullet points at the end
- End with a question to drive replies

Content: {{content}}`,

    tiktok_script: `You are an expert short-form video scriptwriter. Transform the following content into a TikTok/YouTube Shorts script.
Rules:
- Maximum 60 seconds when read aloud (roughly 150 words)
- Hook in first 3 seconds — must stop the scroll
- Fast-paced, energetic tone
- Include [VISUAL CUE] notes for what to show on screen
- End with a strong CTA
- Format: Hook / Main Points / CTA

Content: {{content}}`
}

export type OutputFormat = keyof typeof PROMPTS

export async function generateContent(
    content: string,
    formats: OutputFormat[]
): Promise<Record<OutputFormat, string>> {
    const openai = getOpenAI()
    const results: Partial<Record<OutputFormat, string>> = {}

    // Rulează toate formatele în paralel
    await Promise.all(
        formats.map(async (format) => {
            const prompt = PROMPTS[format].replace('{{content}}', content)

            const response = await openai.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7
            })

            results[format] = response.choices[0].message.content ?? ''
        })
    )

    return results as Record<OutputFormat, string>
}