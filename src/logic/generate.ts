import { PRNG } from 'seedrandom'
import { PinballConfig } from '../config/config'
import { BumperDirection, Direction, GridDirection, Stand, Start } from '../type'
import { randomPick } from '../util'
import { computeTrail } from './compute'
import { createGrid } from './grid'

export function createStand(config: PinballConfig, random: PRNG): Stand {
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

  let grid = createGrid<GridDirection>(config.size, 'empty')

  let bumperArray = Array.from({ length: config.bumperCount }, (_, k) => {
    // Get a random direction
    let direction: BumperDirection = 'diagonalUp'
    if (random() >= 0.5) {
      direction = 'diagonalDown'
    }

    // Get a random position for the bumper
    let position = { x: -1, y: -1 }
    let optionCount = config.size ** 2 - k
    if (optionCount <= 0) {
      throw new Error()
    }

    let index = Math.floor(random() * optionCount) % optionCount

    let count = 0
    let reached = grid.some((line, ky) =>
      line.some((square, kx) => {
        if (square === 'empty') {
          // Counting empty squares
          count++
        }
        if (count > index) {
          // Until one reaches index
          position = { y: ky, x: kx }
          return true
        }
        return false
      }),
    )

    if (!reached || position.x === -1) {
      throw new Error() // Impossible in theory
    }

    grid[position.y][position.x] = direction
    return { direction, ...position }
  })

  let start = createStart(config, random)

  let stand: Stand = {
    bumperArray,
    grid,
    start,
    trail: computeTrail(config, start, grid),
  }

  return stand
}

export function createStart(config: PinballConfig, random: PRNG): Start {
  let direction: Direction = 'up'
  let x = -1
  let y = -1
  let randomPosition = Math.floor(random() * config.size) + 1

  randomPick(random, [
    () => {
      direction = 'up'
      y = config.size + 1
      x = randomPosition
    },
    () => {
      direction = 'down'
      y = 0
      x = randomPosition
    },
    () => {
      direction = 'left'
      x = config.size + 1
      y = randomPosition
    },
    () => {
      direction = 'right'
      x = 0
      y = randomPosition
    },
  ])()

  return {
    direction,
    x,
    y,
  }
}
