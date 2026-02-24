export type SeasonEvent = {
  id: string
  name: string
  season: string
  venue: string
  city: string
  country: string
  date: string | null
}

export type SeasonEventDetails = SeasonEvent & {
  poster: string | null
  video: string | null
}
