import { resolveConfig } from './resolver'

function randomSeed() {
  return Math.random().toString(36).slice(2).toUpperCase()
}

export interface PinballConfig {
  difficulty: string
  /**
   * size is the number of squares on the sides of the inner grid
   */
  size: number
  bumperCount: number
  /**
   * seed -- the seed of the game
   */
  seed: string
  // Colors
  backgroundColor: number
  ballColor: number
  boardColor: number
  bumperColor: number
  indicatorColor: number
  indicatorHoverColor: number
  indicatorStrokeColor: number
  slateColor: number
  trailDotColor: number
  validTickColor: number
  errorCrossColor: number
}

export function getConfig(location: Location) {
  let config = resolveConfig<PinballConfig>(location, {
    difficulty: () => '4:5',
    size: ({ difficulty }) => +difficulty().split(':')[0],
    bumperCount: ({ difficulty }) => +difficulty().split(':')[1],
    // Seed
    seed: () => randomSeed(),
    // Colors
    backgroundColor: () => 0x503010,
    ballColor: () => 0x18b0e8,
    boardColor: () => 0x705028,
    bumperColor: () => 0xffffff,
    indicatorColor: () => 0x805028,
    indicatorStrokeColor: () => 0x3a200a,
    indicatorHoverColor: () => 0xfcf0bc,
    slateColor: () => 0x38200a,
    trailDotColor: () => 0x604008,
    validTickColor: () => 0x60d038,
    errorCrossColor: () => 0xf06028,
  })

  console.info(`#seed=${config.seed}`)

  console.info('config', config)

  return config
}

// export type PinballConfig = ReturnType<typeof getConfig>
