import FirecrawlApp from '@mendable/firecrawl-js'

export async function scrapeUrl(url: string): Promise<string> {
    const firecrawl = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY!
    })

    const result = await firecrawl.scrape(url, {
        formats: ['markdown'],
    })

    if (!result.markdown) {
        throw new Error(`Failed to scrape content from: ${url}`)
    }

    return result.markdown.slice(0, 8000) // 8000 chars


}