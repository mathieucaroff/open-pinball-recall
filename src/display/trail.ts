import * as pixi from 'pixi.js'
import { Direction, Trail } from '../type'
import { moveFromDirection } from '../util'
import { LayoutInfo } from './layout'

let addSingleDot = (
  c: pixi.Container,
  color: number,
  layout: LayoutInfo,
  x: number,
  y: number,
  direction: Direction,
) => {
  let { x: dx, y: dy } = moveFromDirection(direction)

  let g = new pixi.Graphics()
  g.beginFill(color)
  g.drawCircle(
    layout.side * (x + 0.5 + dx / 4),
    layout.side * (y + 0.5 + dy / 4),
    layout.trailDotRadius,
  )

  c.addChild(g)
}

export let drawTrail = (color: number, layout: LayoutInfo, trail: Trail) => {
  let trailContainer = new pixi.Container()
  trail.forEach(({ x, y, in: enter, out }) => {
    addSingleDot(trailContainer, color, layout, x, y, enter)
    addSingleDot(trailContainer, color, layout, x, y, out)
  })
  return trailContainer
}
