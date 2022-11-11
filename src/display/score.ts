import * as pixi from 'pixi.js'
import { LayoutInfo } from './layout'

export class Score extends pixi.Container {
  _text: pixi.Text

  constructor(layout: LayoutInfo) {
    super()
    let { side } = layout
    this._text = new pixi.Text(
      '',
      new pixi.TextStyle({
        fill: '#c7b59d',
        fontFamily: 'Arial',
        fontSize: side,
        strokeThickness: side / 10,
        align: 'center',
      }),
    )
    this._text.anchor.set(0.5)
    this._text.x = layout.boardSize / 2
    this._text.y = layout.boardSize / 2
    this.addChild(this._text)
  }
  setText(text: string) {
    this._text.text = text
  }
}
