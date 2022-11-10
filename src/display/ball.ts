import * as pixi from 'pixi.js'
import { PinballConfig } from '../config/config'
import { Stand } from '../type'
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
    arrow.beginFill(0xff0000, 1)
    arrow.lineStyle(0, 0xffffff, 1)
    drawTriangle(arrow, 100, 100)
    arrow.x = base.x + start.x * side
    arrow.y = base.y + start.y * side
    container.addChild(arrow)
    return container
  }
  // else draw the trail and the ball

  return container
}
