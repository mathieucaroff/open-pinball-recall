import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Bumper, BumperDirection } from '../type'
import { LayoutInfo } from './layout'

function drawBumper(direction: BumperDirection, color: number, layout: LayoutInfo) {
  let { bumperWidth, bumperHeight, side } = layout

  let g = new pixi.Graphics()
  g.beginFill(color)
  g.lineStyle({
    width: side / 10,
    color,
    alpha: 0.5,
  })

  g.drawRoundedRect(-bumperWidth / 2, -bumperHeight / 2, bumperWidth, bumperHeight, side / 8)

  g.rotation = Math.PI / 4
  if (direction === 'diagonalUp') {
    g.rotation *= -1
  }
  g.x = side / 2
  g.y = side / 2
  return g
}

export function drawBumperContainer(
  config: PinballConfig,
  layout: LayoutInfo,
  bumperArray: Bumper[],
) {
  let c = new pixi.Container()

  bumperArray.forEach((bumper) => {
    let g = drawBumper(bumper.direction, config.bumperColor, layout)
    g.x += layout.side * (bumper.x + 1)
    g.y += layout.side * (bumper.y + 1)
    c.addChild(g)
  })

  return c
}
