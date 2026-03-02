import type { EventResult } from '@/types'

export function parseResult(result: string | null, maxPositions?: number): EventResult[] {
  if (!result) return []

  const clean = (value: string) => value.replace(/^\s*\/\s*/, '').trim()

  const tabRows = result
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => /^\d{1,2}\s*\t/.test(row))

  let parsed: EventResult[] = []

  if (tabRows.length) {
    parsed = tabRows.map((row) => {
      const cols = row
        .split('\t')
        .map((c) => c.trim())
        .filter(Boolean)

      return {
        position: Number(cols[0]),
        driver: clean(cols[1] ?? ''),
        team: clean(cols[2] ?? ''),
        time: cols[3] ? clean(cols[3]) : null,
      }
    })
  } else {
    const compact = result.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()

    const pattern =
      /(\d{1,2})\s*\/\s*([^/]+?)\s*\/\s*([^/]+?)\s*\/\s*([^/]+?)(?=\s+\d{1,2}\s*\/|$)/g

    for (const match of compact.matchAll(pattern)) {
      parsed.push({
        position: Number(match[1] ?? 0),
        driver: (match[2] ?? '').trim(),
        team: (match[3] ?? '').trim(),
        time: (match[4] ?? '').trim() || null,
      })
    }
  }

  return maxPositions !== undefined ? parsed.slice(0, maxPositions) : parsed
}
