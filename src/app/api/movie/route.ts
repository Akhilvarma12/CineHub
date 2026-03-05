import { NextResponse } from "next/server"
import { fetchReviews } from "@/app/lib/fetchReviews"
import { analyzeSentiment } from "@/app/lib/analyzeSentiment"

export async function POST(req: Request) {
  try {
    const { imdbId } = await req.json()

    const movieRes = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
    )

    const movie = await movieRes.json()

    const reviews = await fetchReviews(movie.Title)

    // declare variable BEFORE try
    let aiInsight: any

    try {
      aiInsight = await analyzeSentiment(reviews)
    } catch (err) {
      console.error("AI analysis failed:", err)

      aiInsight = {
        summary: "AI sentiment analysis unavailable.",
        sentiment: "Mixed",
        themes: []
      }
    }

    return NextResponse.json({
      success: true,
      movie,
      reviews,
      aiInsight
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false, error: "Failed to process movie insights" },
      { status: 500 }
    )
  }
}