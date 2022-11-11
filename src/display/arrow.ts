import * as pixi from 'pixi.js'
import { Start } from '../type'
import { trigonometricRotationFromDirection } from '../util'

export function drawStartArrow(color: number, strokeWidth: number, side: number, start: Start) {
  // draw an arrow at the start
  let arrow = new pixi.Graphics()
  arrow.beginFill(color, 1)
  arrow.lineStyle({
    color: 0xffffff,
    width: strokeWidth,
  })
  drawTriangle(arrow, side * 0.7, side * 0.45)
  arrow.x = (start.x + 0.5) * side
  arrow.y = (start.y + 0.5) * side
  arrow.rotation = trigonometricRotationFromDirection(start.direction)

  return arrow
}

export function drawTriangle(triangle: pixi.Graphics, width: number, height: number) {
  // draw triangle
  triangle.moveTo(0, 0)
  triangle.lineTo(width / 2, 0)
  triangle.lineTo(0, height)
  triangle.lineTo(-width / 2, 0)
  triangle.lineTo(0, 0)
}
