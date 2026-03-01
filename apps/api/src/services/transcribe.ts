import OpenAI from 'openai'
import fs from 'fs'

function getOpenAI() {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function transcribeAudio(filePath: string): Promise<string> {
    const openai = getOpenAI()

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
        language: 'en'
    })

    return transcription.text
}