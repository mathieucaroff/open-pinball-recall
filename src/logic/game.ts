import { PRNG } from 'seedrandom'
import { PinballConfig } from '../config/config'
import { GridDirection, Game, Trail, Bumper } from '../type'
import { createTrail } from './trail'
import { createGrid } from './grid'
import { createStart } from './start'
import { createBumperArray } from './bumperArray'

export function createGame(config: PinballConfig, random: PRNG, firstTime: boolean): Game {
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

  let trail: Trail
  let grid: GridDirection[][]
  let bumperArray: Bumper[]

  let k = 0
  while (true) {
    grid = createGrid<GridDirection>(config.size, 'empty')
    bumperArray = createBumperArray(config, random, grid)
    let bumperCounter = { count: 0 }
    trail = createTrail(config, start, grid, bumperCounter)
    if (bumperCounter.count >= 2) {
      break
    }
    if (k > 1000) {
      console.error('failed to get two or more bumpers on the ball path in 1000 attempts')
      break
    }
    k += 1
  }

  let game: Game = {
    bumperArray,
    grid,
    start,
    trail,
    phase: firstTime ? 'introduction' : 'initial',
  }

  return game
}
