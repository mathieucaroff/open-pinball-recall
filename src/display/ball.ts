import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Stand } from '../type'
import { trigonometricRotationFromDirection } from '../util'
import { LayoutInfo } from './layout'
import { drawTriangle } from './triangle'

export function drawBall(config: PinballConfig, layout: LayoutInfo, stand: Stand) {
  let container = new pixi.Container()
  if (stand.start === undefined) {
    // do nothing
    return container
  }

  let base = layout.boardPosition
  let side = layout.slateSize

  if (stand.journey === undefined) {
    // draw a blue arrow at the start
    let { start } = stand
    let arrow = new pixi.Graphics()
    arrow.beginFill(config.ballColor, 1)
    arrow.lineStyle({
      color: 0xffffff,
      width: 10,
    })
    drawTriangle(arrow, side * 0.7, side * 0.45)
    arrow.x = base.x + (start.x + 0.5) * side
    arrow.y = base.y + (start.y + 0.5) * side
    arrow.rotation = trigonometricRotationFromDirection(start.direction)
    container.addChild(arrow)
    return container
  }
  // else draw the trail and the ball

  return container
}
