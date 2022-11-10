import * as pixi from 'pixi.js'

export function drawTriangle(triangle: pixi.Graphics, width: number, height: number) {
  // draw triangle
  triangle.moveTo(width, 0)
  triangle.lineTo(width / 2, height)
  triangle.lineTo(0, 0)
  triangle.lineTo(width / 2, 0)
}
