import { PinballConfig } from '../config/config'
import { indirectResolve } from '../lib/indirectResolver'
import { Position } from '../type'

export interface LayoutInfo {
  // Grid size
  size: number
  // Sizes and positions
  width: number
  height: number
  // side is the size of a side of a slate
  side: number
  // boardBase is the board position
  boardBase: Position
  boardSize: number
  indicatorRadius: number
  indicatorStrokeWidth: number
  trailDotRadius: number
  bumperWidth: number
  bumperHeight: number
  ballRadius: number
  ballStrokeWidth: number
}

export function getLayout(config: PinballConfig) {
  return indirectResolve<LayoutInfo>({
    size: () => config.size,
    // Sizes and positions
    width: () => window.innerWidth - 3,
    height: () => window.innerHeight - 4,
    side: ({ size, width, height }) => Math.floor(Math.min(width(), height()) / (size() + 2)),
    boardSize: ({ size, side }) => side() * (size() + 2),
    boardBase: ({ width, height, boardSize }) => ({
      x: (width() - boardSize()) / 2,
      y: (height() - boardSize()) / 2,
    }),
    indicatorRadius: ({ side }) => Math.floor((2 * side()) / 7),
    indicatorStrokeWidth: ({ indicatorRadius }) => (2 * indicatorRadius()) / 5,
    trailDotRadius: ({ side }) => Math.floor(side() / 8),
    bumperWidth: ({ side }) => (4 * side()) / 5,
    bumperHeight: ({ side }) => side() / 8,
    ballRadius: ({ side }) => Math.floor(side() / 3),
    ballStrokeWidth: ({ ballRadius }) => ballRadius() / 3,
  })
}
