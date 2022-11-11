import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Game, GridPosition } from '../type'
import { LayoutInfo } from './layout'

export function drawBoard(
  game: Game,
  config: PinballConfig,
  layout: LayoutInfo,
  clickCallback: (position: GridPosition) => void,
) {
  // Outer board
  let board = new pixi.Graphics()
  board.beginFill(config.boardColor)
  board.drawRect(0, 0, layout.boardSize, layout.boardSize)
  board.endFill()

  let { size } = config
  let size1 = size + 1
  let { side } = layout

  // Indicators
  Array.from({ length: size }, (_, k) => {
    // draw indicators
    // top
    board.addChild(createIndicator(game, config, layout, k + 1, 0, clickCallback))
    // bottom
    board.addChild(createIndicator(game, config, layout, k + 1, size1, clickCallback))

    // left
    board.addChild(createIndicator(game, config, layout, 0, k + 1, clickCallback))
    // right
    board.addChild(createIndicator(game, config, layout, size1, k + 1, clickCallback))
  })
  board.endFill()

  // Slates
  board.beginFill(config.slateColor)
  board.lineStyle({})
  Array.from({ length: size }, (_, ky) => {
    Array.from({ length: size }, (_, kx) => {
      // draw slates
      board.drawRect((kx + 1) * side - 1, (ky + 1) * side - 1, side - 2, side - 2)
    })
  })
  board.endFill()

  return board
}

export function createIndicator(
  game: Game,
  config: PinballConfig,
  layout: LayoutInfo,
  column: number,
  row: number,
  callback: (p: GridPosition) => void,
) {
  let { side, indicatorRadius: radius } = layout

  let g = new pixi.Graphics()

  let drawCircle = (color: number) => {
    g.beginFill(color)
    g.lineStyle({ color: config.indicatorStrokeColor, width: layout.indicatorStrokeWidth })
    g.drawCircle(0, 0, radius)
  }
  drawCircle(config.indicatorColor)
  g.x = Math.floor(side / 2) + column * side
  g.y = Math.floor(side / 2) + row * side

  g.interactive = true

  g.hitArea = new pixi.Circle(0, 0, radius)

  g.on('mouseover', () => {
    if (game.phase === 'guess') {
      drawCircle(config.indicatorHoverColor)
    }
  })

  g.on('mouseout', () => {
    drawCircle(config.indicatorColor)
  })

  g.on('click', () => {
    callback({ column, row })
  })

  return g
}
