import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Game } from '../type'
import { LayoutInfo } from './layout'

export function drawBall(config: PinballConfig, layout: LayoutInfo, stand: Game) {
  let g = new pixi.Graphics()
  g.lineStyle({ color: 0xffffff, width: layout.ballStrokeWidth })
  g.beginFill(config.ballColor)
  g.drawCircle(0, 0, layout.ballRadius)
  g.endFill()
  return g
}
