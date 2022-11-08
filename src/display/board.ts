import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { LayoutInfo } from './layout'

export function drawBoard(config: PinballConfig, layout: LayoutInfo) {
  // Outer board
  let board = new pixi.Graphics()
  board.beginFill(config.boardColor)
  board.drawRect(0, 0, layout.boardSize, layout.boardSize)
  board.endFill()

  let { size } = config
  let size1 = size + 1
  let ss = layout.side

  // Indicators
  let ir = layout.indicatorRadius
  let dx = Math.floor(ss / 2)
  let dy = Math.floor(ss / 2)
  board.beginFill(config.indicatorColor)
  board.lineStyle({ color: config.indicatorStrokeColor, width: layout.indicatorStrokeWidth })
  Array.from({ length: size }, (_, k) => {
    // draw indicators
    // top
    board.drawCircle(dx + (k + 1) * ss, dy, ir)
    // bottom
    board.drawCircle(dx + (k + 1) * ss, dy + size1 * ss, ir)

    // left
    board.drawCircle(dx, dy + (k + 1) * ss, ir)
    // right
    board.drawCircle(dx + size1 * ss, dy + (k + 1) * ss, ir)
  })
  board.endFill()

  // Slates
  board.beginFill(config.slateColor)
  board.lineStyle({})
  Array.from({ length: size }, (_, ky) => {
    Array.from({ length: size }, (_, kx) => {
      // draw slates
      board.drawRect((kx + 1) * ss - 1, (ky + 1) * ss - 1, ss - 2, ss - 2)
    })
  })
  board.endFill()

  return board
}
