export type PodiumEntry = {
  position: number;
  driver: string;
  team: string
}

export type PastRace = {
  id: string
  name: string
  venue: string
  city: string
  country: string
  date: string | null
  podium: PodiumEntry[]
}

