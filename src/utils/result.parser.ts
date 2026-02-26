import type { EventResult } from '@/types/event-result.type'

export function parseResult(result: string | null, maxPositions?: number): EventResult[] {
  if (!result) return []

  maxPositions = maxPositions ?? 3

  return result
    .split(/\r?\n/)
    .filter((line) => /^\d{1,2}\t/.test(line))
    .slice(0, maxPositions)
    .map((line) => {
      const cols = line
        .split('\t')
        .map((c) => c.trim())
        .filter(Boolean)
      return {
        position: Number(cols[0]),
        driver: cols[1]?.replace(/^\//, '') ?? '',
        team: cols[2]?.replace(/^\//, '') ?? '',
        time: cols[3] ?? null,
      }
    })
}
