import * as pixi from 'pixi.js'
import { LayoutInfo } from './layout'

export let drawErrorDisk = (color: number, layout: LayoutInfo) => {
  let errorDisk = new pixi.Graphics()
  errorDisk.beginFill(color)
  errorDisk.lineStyle({ color: 0xffffff })
  errorDisk.drawCircle(0, 0, layout.indicatorRadius)
  errorDisk.endFill()
  return errorDisk
}
