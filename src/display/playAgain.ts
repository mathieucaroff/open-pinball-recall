import * as pixi from 'pixi.js'
import { LayoutInfo } from './layout'

export function drawPlayAgain(layout: LayoutInfo) {
  let { side } = layout
  let text = new pixi.Text(
    'Play again?',
    new pixi.TextStyle({
      fill: '#c7b59d',
      fontFamily: 'Arial',
      fontSize: side,
      strokeThickness: side / 10,
      align: 'center',
    }),
  )
  text.anchor.set(0.5)
  text.x = layout.boardSize / 2
  text.y = layout.boardSize / 2

  return text
}
