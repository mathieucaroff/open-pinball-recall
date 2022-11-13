import * as pixi from 'pixi.js'
import { LayoutInfo } from './layout'

export function drawScore(layout: LayoutInfo, scoreText: string) {
  let { boardSize } = layout
  let text = new pixi.Text(
    scoreText,
    new pixi.TextStyle({
      fill: '#c7b59d',
      fontFamily: 'Arial',
      fontSize: boardSize / 8,
      strokeThickness: boardSize / 80,
      align: 'center',
    }),
  )
  text.anchor.set(0.5)
  text.x = layout.boardSize / 2
  text.y = layout.boardSize / 2

  return text
}
