import * as pixi from 'pixi.js'
import { LayoutInfo } from './layout'

export function drawIntroduction(layout: LayoutInfo) {
  let { side } = layout

  let text = new pixi.Text(
    'Click or tap to\nstart the game',
    new pixi.TextStyle({
      fill: '#c7b59d',
      fontFamily: 'Arial',
      fontSize: side / 2,
      strokeThickness: side / 20,
      align: 'center',
    }),
  )
  text.anchor.set(0.5)
  text.x = layout.boardSize / 2
  text.y = layout.boardSize / 2

  return text
}
