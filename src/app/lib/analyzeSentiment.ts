import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeSentiment(reviews: string[]) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  })

  const prompt = `
Analyze these audience reactions to a movie.

Reviews:
${reviews.join("\n")}

Return ONLY valid JSON in this format:

{
 "summary": "",
 "sentiment": "Positive | Mixed | Negative",
 "themes": []
}
`

  const result = await model.generateContent(prompt)

  let text = result.response.text()

  // remove markdown code blocks
  text = text.replace(/```json/g, "")
  text = text.replace(/```/g, "").trim()

  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("JSON parse failed:", text)

    return {
      summary: text,
      sentiment: "Mixed",
      themes: []
    }
  }
}