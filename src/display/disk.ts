import * as pixi from 'pixi.js'

export let drawDisk = (color: number, radius: number, strokeWidth = 0) => {
  let disk = new pixi.Graphics()
  disk.beginFill(color)
  disk.lineStyle({ width: strokeWidth, color: 0xffffff })
  disk.drawCircle(0, 0, radius)
  disk.endFill()
  return disk
}
