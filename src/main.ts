import * as pixi from 'pixi.js'
import { default as packageJson } from '../package.json'
import { default as seedrandom, PRNG } from 'seedrandom'
import { getConfig, PinballConfig } from './config/config'
import { drawBoard } from './display/board'
import { getLayout, LayoutInfo } from './display/layout'
import { githubCornerHTML } from './lib/githubCorner'
import { createGame as createGame } from './logic/game'
import { drawBumperContainerAndFillGrid } from './display/bumper'
import { drawBall } from './display/ball'
import { drawStartArrow } from './display/arrow'
import { drawTrail } from './display/trail'
import { moveFromDirection, onPointerDownOnce, opposite } from './util'
import { Game, Position } from './type'
import { clickSound, errorSound } from './audio/sound'
import { createGrid } from './logic/grid'
import { drawErrorDisk } from './display/error'
import { drawScore } from './display/score'
import { drawIntroduction } from './display/introduction'
import { drawPlayAgain } from './display/playAgain'

let main = () => {
  // Github Corner
  document.body.innerHTML += githubCornerHTML(packageJson.repository, packageJson.version)

  let app = new pixi.Application()
  document.body.appendChild(app.view)

  let config: PinballConfig
  let random: PRNG
  let layout: LayoutInfo
  let game: Game
  let bumperGrid: (pixi.Graphics | 'nothing')[][]
  let journey: number
  let scoreText: string

  let configInit = (firstTime: boolean) => {
    config = getConfig(location)

    if (firstTime) {
      console.clear()
      console.info('config', config)
    }
    console.info(`#seed=${config.seed}`)

    random = seedrandom(config.seed)
    layout = getLayout(config)
    app.renderer.backgroundColor = config.backgroundColor
    game = createGame(config, random, firstTime)
    bumperGrid = createGrid(config.size, 'nothing')
    journey = 0
    scoreText = ''
    redraw()

    resize()

    if (firstTime) {
      introductionContainer.visible = true
      onPointerDownOnce(document.documentElement, startPlay)
    } else {
      setTimeout(() => {
        startPlay()
      }, 1000)
    }
  }
  window.addEventListener('hashchange', () => configInit(false))

  let victory: boolean

  let gameContainer: pixi.Container = new pixi.Container()
  let board: pixi.Container
  let bumperContainer: pixi.Container
  let startArrow: pixi.Container
  let trail: pixi.Container
  let ball: pixi.Container
  let errorDisk: pixi.Container
  let scoreContainer: pixi.Text
  let introductionContainer: pixi.Text
  let playAgainContainer: pixi.Text

  // guess is where the player guessed the ball would land
  let guess: Position

  app.stage.addChild(gameContainer)

  let handleIndicatorClick = (pos: Position) => {
    if (game.phase === 'guess') {
      game.phase = 'result'
      guess = pos

      bumperContainer.visible = true
      bumperContainer.children.forEach((bumper) => (bumper.visible = false))
    }
  }

  let redraw = () => {
    board = drawBoard(game, config, layout, handleIndicatorClick)
    bumperContainer = drawBumperContainerAndFillGrid(config, layout, game.bumperArray, bumperGrid)
    startArrow = drawStartArrow(config.ballColor, layout.ballStrokeWidth, layout.side, game.start)
    trail = drawTrail(config.trailDotColor, layout, game.trail)
    ball = drawBall(config, layout, game)
    errorDisk = drawErrorDisk(config.errorDiskColor, layout)
    scoreContainer = drawScore(layout, scoreText)
    introductionContainer = drawIntroduction(layout)
    playAgainContainer = drawPlayAgain(layout)

    // visibility
    bumperContainer.visible = ['bumperView', 'result', 'end'].includes(game.phase)
    startArrow.visible = ['guess', 'result', 'end'].includes(game.phase)
    trail.children.forEach((g, k) => {
      g.visible = k < 2 * journey
    })
    trail.visible = ['result', 'end'].includes(game.phase)
    ball.visible = ['result', 'end'].includes(game.phase)
    if (game.phase === 'end') {
      let mark = game.trail.slice(-1)[0]
      ball.x = (mark.x + 0.5) * layout.side
      ball.y = (mark.y + 0.5) * layout.side
    }
    errorDisk.visible = false
    introductionContainer.visible = game.phase === 'introduction'
    playAgainContainer.visible = game.phase === 'playAgain'

    gameContainer.x = layout.boardBase.x
    gameContainer.y = layout.boardBase.y

    gameContainer.removeChildren()
    gameContainer.addChild(board)
    gameContainer.addChild(startArrow)
    gameContainer.addChild(trail)
    gameContainer.addChild(bumperContainer)
    gameContainer.addChild(ball)
    gameContainer.addChild(errorDisk)
    gameContainer.addChild(scoreContainer)
    gameContainer.addChild(introductionContainer)
    gameContainer.addChild(playAgainContainer)
  }

  // resize handling
  let redrawTimeout: ReturnType<typeof setTimeout>
  let resize = () => {
    layout = getLayout(config)
    app.renderer.resize(layout.width, layout.height)
    clearTimeout(redrawTimeout)
    redrawTimeout = setTimeout(redraw, 200)
  }
  window.addEventListener('resize', resize)

  // phase initial -> bumperView
  let startPlay = () => {
    introductionContainer.visible = false

    game.phase = 'bumperView'
    clickSound.play()
    bumperContainer.visible = true

    // phase bumperView -> guess
    setTimeout(() => {
      game.phase = 'guess'
      bumperContainer.visible = false
      startArrow.visible = true
      clickSound.play()
    }, 2000)
  }

  configInit(true)

  // update loop
  pixi.Ticker.shared.add(() => {
    let { elapsedMS } = pixi.Ticker.shared

    if (game.phase === 'result') {
      ball.visible = true
      trail.visible = true

      journey += elapsedMS / 256

      if (journey > game.trail.length - 0.5) {
        game.phase = 'end'
        let target = game.trail.slice(-1)[0]
        victory = target.x === guess.x && target.y === guess.y
        if (victory) {
          clickSound.play()
        } else {
          errorSound.play()
          errorDisk.x = layout.side * (guess.x + 0.5)
          errorDisk.y = layout.side * (guess.y + 0.5)
          errorDisk.visible = true
          setTimeout(() => {
            errorDisk.visible = false
          }, 600)
        }

        let handleEnd = () => {
          let { size, bumperCount, remaining, score, seed } = config
          if (victory) {
            bumperCount += 1
            score += size * bumperCount * 10
          } else {
            bumperCount -= 3
          }

          if (bumperCount < 3 * size - 10) {
            if (size > 3) {
              // ^ refuse to go below a size of 3
              size -= 1
              bumperCount += 2
            }
          } else if (bumperCount > 3 * size - 5) {
            size += 1
            bumperCount -= 2
          }

          if (bumperCount < 2) {
            bumperCount = 2
          }

          if (config.remaining <= 0) {
            game.phase = 'score'
            scoreText = `Score:\n${score}`
            scoreContainer.text = scoreText
            bumperContainer.visible = false
            trail.visible = false
            redraw()
            onPointerDownOnce(document.documentElement, () => {
              game.phase = 'playAgain'
              scoreText = ''
              redraw()
              onPointerDownOnce(document.documentElement, () => {
                setLocationHash(location, {}, ['remaining', 'score'], { seed: seedAddOne(seed) })
              })
            })
          } else {
            remaining -= 1
            setLocationHash(
              location,
              {
                difficulty: `${size}:${bumperCount}`,
                remaining,
                score,
              },
              ['size', 'bumperCount'],
              {
                seed: seedAddOne(seed),
              },
            )
          }
        }

        // Show the bumpers at the end
        setTimeout(() => {
          clickSound.play()
          bumperContainer.children.forEach((g) => (g.visible = true))

          if (config.clickyNext) {
            onPointerDownOnce(document.documentElement, handleEnd)
          } else {
            setTimeout(handleEnd, 1500)
          }
        }, 1000)
      } else {
        // moving the ball
        let mark = game.trail[journey | 0]
        if (journey % 1 >= 0.5 && mark.in !== opposite(mark.out) && !mark.revealed) {
          clickSound.play()
          let bumper = bumperGrid[mark.y - 1][mark.x - 1]
          if (bumper === 'nothing') {
            throw new Error(
              `expected to find a bumper at position ${mark.x},${mark.y} but found nothing`,
            )
          }
          bumper.visible = true
          mark.revealed = true
        }
        let diff = Math.abs((journey % 1) - 0.5)
        let direction = journey % 1 < 0.5 ? mark.in : mark.out
        let move = moveFromDirection(direction)
        ball.x = (mark.x + 0.5 + move.x * diff) * layout.side
        ball.y = (mark.y + 0.5 + move.y * diff) * layout.side

        // showing dots
        if (journey % 1 >= 0.25) {
          trail.children[(journey | 0) * 2].visible = true
        }
        if (journey % 1 >= 0.75) {
          trail.children[(journey | 0) * 2 + 1].visible = true
        }
      }
    }
  })
}

/**
 * setLocationHash
 *
 * **it may not work properly with boolean values**
 *
 * @param location the location object of the page (window.location)
 * @param updateObject an object containing values to set in the url
 * @param deleteKeyArray an array containing keys to remove from the url
 * @param updateIfPresentObject an object containing values to update only if already present in the URL
 */
let setLocationHash = (
  location: Location,
  updateObject: Record<string, string | number | boolean>,
  deleteKeyArray: string[],
  updateIfPresentObject: Record<string, string | number | boolean>,
) => {
  let hashArray = location.hash
    .slice(1)
    .split('#')
    .map((entry) => {
      let key = entry
      let value: string | undefined = undefined
      if (entry.includes('=')) {
        let valueList: string[]
        ;[key, ...valueList] = entry.split('=')
        value = valueList.join('=')
      }

      // core activity: filtering and setting difficulty value
      if (deleteKeyArray.includes(key)) {
        return
      } else if (updateObject[key] !== undefined) {
        value = `${updateObject[key]}`
        delete updateObject[key]
      } else if (updateIfPresentObject[key] !== undefined) {
        value = `${updateIfPresentObject[key]}`
      }
      // core activity end

      if (value !== undefined) {
        entry = `${key}=${value}`
      }
      return entry
    })
    .filter((x) => x !== undefined)

  Object.entries(updateObject).map(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }
    if (typeof value !== 'boolean') {
      hashArray.push(`${key}=${value}`)
    } else if (value === true) {
      hashArray.push(key)
    }
  })

  location.hash = hashArray.join('#')
}

let seedAddOne = (seed: string) => (parseInt(seed, 36) + 1).toString(36)

main()
