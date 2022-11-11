import { PRNG } from 'seedrandom'
import { PinballConfig } from '../config/config'
import { GridDirection, Game } from '../type'
import { createTrail } from './trail'
import { createGrid } from './grid'
import { createStart } from './start'
import { createBumperArray } from './bumperArray'

export function createGame(config: PinballConfig, random: PRNG): Game {
  if (config.bumperCount > config.size ** 2) {
    console.error(
      'Cannot afford',
      config.bumperCount,
      'bumpers in a squard of side',
      config.size,
      '. The maximum is',
      config.size ** 2,
      '.',
    )
    config.bumperCount = config.size ** 2
  }

  let start = createStart(config, random)

  let grid = createGrid<GridDirection>(config.size, 'empty')

  let game: Game = {
    bumperArray: createBumperArray(config, random, grid),
    grid,
    start,
    trail: createTrail(config, start, grid),
    phase: 'initial',
  }

  return game
}
