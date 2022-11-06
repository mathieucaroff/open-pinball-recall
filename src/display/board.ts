import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { LayoutInfo } from './layout'

export function drawBoard(config: PinballConfig, layout: LayoutInfo) {
  let container = new pixi.Container()
  container.x = layout.boardPosition.x
  container.y = layout.boardPosition.y

  // Outer board
  let g = new pixi.Graphics()
  g.beginFill(config.boardColor)
  g.drawRect(0, 0, layout.boardSize, layout.boardSize)
  g.endFill()

  let { size } = config
  let size1 = size + 1
  let ss = layout.slateSize

  // Indicators
  let ir = layout.indicatorRadius
  let dx = Math.floor(ss / 2)
  let dy = Math.floor(ss / 2)
  g.beginFill(config.indicatorColor)
  g.lineStyle({ color: config.indicatorStrokeColor, width: layout.indicatorStrokeWidth })
  Array.from({ length: size }, (_, k) => {
    // draw indicators
    // top
    g.drawCircle(dx + (k + 1) * ss, dy, ir)
    // bottom
    g.drawCircle(dx + (k + 1) * ss, dy + size1 * ss, ir)

    // left
    g.drawCircle(dx, dy + (k + 1) * ss, ir)
    // right
    g.drawCircle(dx + size1 * ss, dy + (k + 1) * ss, ir)
  })
  g.endFill()

  // Slates
  g.beginFill(config.slateColor)
  g.lineStyle({})
  Array.from({ length: size }, (_, ky) => {
    Array.from({ length: size }, (_, kx) => {
      // draw slates
      g.drawRect((kx + 1) * ss - 1, (ky + 1) * ss - 1, ss - 2, ss - 2)
    })
  })
  g.endFill()

  container.addChild(g)
  return container
}
