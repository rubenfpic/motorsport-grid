import { describe, expect, it } from 'vitest'

import { parseResult } from './result.parser'

describe('parseResult', () => {
  it('devuelve array vacío cuando no hay resultado', () => {
    expect(parseResult(null)).toEqual([])
    expect(parseResult('')).toEqual([])
  })

  it('parsea formato TSV con limpieza básica de valores', () => {
    const rawResult = [
      '1\t /Mirko Bortolotti\t /ABT Sportsline\t 51:10.456',
      '2\tLucas Auer\tMercedes-AMG Team Landgraf\t51:11.102',
    ].join('\n')

    expect(parseResult(rawResult)).toEqual([
      {
        position: 1,
        driver: 'Mirko Bortolotti',
        team: 'ABT Sportsline',
        time: '51:10.456',
      },
      {
        position: 2,
        driver: 'Lucas Auer',
        team: 'Mercedes-AMG Team Landgraf',
        time: '51:11.102',
      },
    ])
  })

  it('parsea formato compacto separado por "/"', () => {
    const rawResult =
      '1 / Mirko Bortolotti / ABT Sportsline / 51:10.456 2 / Lucas Auer / Mercedes-AMG Team Landgraf / 51:11.102'

    expect(parseResult(rawResult)).toEqual([
      {
        position: 1,
        driver: 'Mirko Bortolotti',
        team: 'ABT Sportsline',
        time: '51:10.456',
      },
      {
        position: 2,
        driver: 'Lucas Auer',
        team: 'Mercedes-AMG Team Landgraf',
        time: '51:11.102',
      },
    ])
  })

  it('respeta maxPositions para limitar el número de filas', () => {
    const rawResult = [
      '1\tDriver 1\tTeam 1\t50:00.000',
      '2\tDriver 2\tTeam 2\t50:01.000',
      '3\tDriver 3\tTeam 3\t50:02.000',
    ].join('\n')

    expect(parseResult(rawResult, 2)).toEqual([
      {
        position: 1,
        driver: 'Driver 1',
        team: 'Team 1',
        time: '50:00.000',
      },
      {
        position: 2,
        driver: 'Driver 2',
        team: 'Team 2',
        time: '50:01.000',
      },
    ])
  })
})
