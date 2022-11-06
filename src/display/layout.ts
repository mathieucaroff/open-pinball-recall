import { PinballConfig } from '../config/config'
import { indirectResolve } from '../lib/indirectResolver'
import { Position } from '../type'

export interface LayoutInfo {
  // Grid size
  size: number
  // Sizes and positions
  width: number
  height: number
  slateSize: number
  boardPosition: Position
  boardSize: number
  indicatorRadius: number
  indicatorStrokeWidth: number
}

export function getLayout(config: PinballConfig) {
  return indirectResolve<LayoutInfo>({
    size: () => config.size,
    // Sizes and positions
    width: () => window.innerWidth - 3,
    height: () => window.innerHeight - 4,
    slateSize: ({ size, width, height }) => Math.floor(Math.min(width(), height()) / (size() + 2)),
    boardSize: ({ size, slateSize }) => slateSize() * (size() + 2),
    boardPosition: ({ width, height, boardSize }) => ({
      x: (width() - boardSize()) / 2,
      y: (height() - boardSize()) / 2,
    }),
    indicatorRadius: ({ slateSize }) => Math.floor((2 * slateSize()) / 7),
    indicatorStrokeWidth: ({ indicatorRadius }) => (2 * indicatorRadius()) / 5,
  })
}
