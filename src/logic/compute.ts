import { PinballConfig } from '../config/config'
import { Grid, Start, Trail } from '../type'
import { bumperTurn, moveFromDirection, opposite } from '../util'

export let computeTrail = (config: PinballConfig, start: Start, grid: Grid) => {
  let trail = [] as Trail
  let cursor = {
    x: start.x,
    y: start.y,
  }
  let direction = start.direction

  let k = 0
  while (true) {
    let delta = moveFromDirection(direction)
    cursor.x += delta.x
    cursor.y += delta.y
    if (cursor.x <= 0 || cursor.x > config.size || cursor.y <= 0 || cursor.y > config.size) {
      trail.push({ ...cursor, in: opposite(direction), out: direction })
      break
    }
    let bumper = grid[cursor.y - 1][cursor.x - 1]
    let enter = opposite(direction)
    let out = bumperTurn(bumper, enter)
    trail.push({ ...cursor, in: enter, out })
    direction = out
    k += 1
  }

  return trail
}
