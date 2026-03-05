import axios from "axios"

export async function fetchMovie(imdbId: string) {
  const response = await axios.get(
    `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
  )

  return response.data
}