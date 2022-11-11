import { PRNG } from 'seedrandom'
import { PinballConfig } from '../config/config'
import { Direction, Start } from '../type'
import { randomPick } from '../util'

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
