import { resolveConfig } from './resolver'

function randomSeed() {
  return Math.random().toString(36).slice(2).toUpperCase()
}

export interface PinballConfig {
  /**
   * difficulty specifies the size and the number of bumpers, separated by a colon `:`
   */
  difficulty: string
  /**
   * size is the number of squares on the sides of the inner grid
   */
  size: number
  bumperCount: number
  /**
   * baseBumperDisplayTimeoutMs is the base time that the game waits while
   * displaying the bumpers to the player. The actual time will be longer than
   * the base proportionally to the number of bumpers.
   *
   * It is expressed in milliseconds
   */
  baseBumperDisplayTimeoutMs: number
  /**
   * extraBumperDisplayTimeoutMs is multiplied by the number of bumpers and
   * added to the base timeout.
   *
   * It is expressed in milliseconds
   */
  extraBumperDisplayTimeoutMs: number
  /**
   * remaining is the number of play until the score is displayed
   */
  remaining: number
  /**
   * score is the number of accumulated points while playing
   */
  score: number
  /**
   * seed -- the seed of the game
   */
  seed: string
  /**
   * clickyNext specifies that the game should wait for the use to click before starting the next play
   */
  clickyNext: boolean
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
  errorDiskColor: number
}

export function getConfig(location: Location) {
  let config = resolveConfig<PinballConfig>(location, {
    difficulty: () => '4:5',
    size: ({ difficulty }) => +difficulty().split(':')[0],
    bumperCount: ({ difficulty }) => +difficulty().split(':')[1],
    baseBumperDisplayTimeoutMs: () => 2000,
    extraBumperDisplayTimeoutMs: () => 200,
    remaining: () => 7,
    score: () => 0,
    // Seed
    seed: () => randomSeed(),
    clickyNext: () => false,
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
    errorDiskColor: () => 0xf06028,
  })

  return config
}
