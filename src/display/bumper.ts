import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Bumper, BumperDirection } from '../type'
import { LayoutInfo } from './layout'

function drawBumper(direction: BumperDirection, config: PinballConfig, slateSize: number) {
  let g = new pixi.Graphics()
  g.beginFill(config.bumperColor)
  g.lineStyle({
    width: slateSize / 10,
    color: config.bumperColor,
    alpha: 0.5,
  })

  let bumperWidth = (4 * slateSize) / 5
  let bumperHeight = slateSize / 8

  g.drawRoundedRect(-bumperWidth / 2, -bumperHeight / 2, bumperWidth, bumperHeight, slateSize / 8)

  g.rotation = Math.PI / 4
  if (direction === 'diagonalUp') {
    g.rotation *= -1
  }
  g.x = slateSize / 2
  g.y = slateSize / 2
  return g
}

export function drawBumperContainer(
  config: PinballConfig,
  layout: LayoutInfo,
  bumperArray: Bumper[],
) {
  let c = new pixi.Container()
  c.x = layout.boardPosition.x + layout.slateSize
  c.y = layout.boardPosition.y + layout.slateSize

  bumperArray.forEach((bumper) => {
    let g = drawBumper(bumper.direction, config, layout.slateSize)
    g.x += layout.slateSize * bumper.x
    g.y += layout.slateSize * bumper.y
    c.addChild(g)
  })

  return c
}
