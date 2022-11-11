import * as pixi from 'pixi.js'
import { default as packageJson } from '../package.json'
import { default as seedrandom } from 'seedrandom'
import { getConfig, PinballConfig } from './config/config'
import { drawBoard } from './display/board'
import { getLayout } from './display/layout'
import { githubCornerHTML } from './lib/githubCorner'
import { createGame as createGame } from './logic/generate'
import { drawBumperContainerAndFillGrid } from './display/bumper'
import { drawBall } from './display/ball'
import { drawStartArrow } from './display/arrow'
import { drawTrail } from './display/trail'
import { moveFromDirection, opposite } from './util'
import { GridPosition, Phase } from './type'
import { clickSound } from './audio/sound'
import { createGrid } from './logic/grid'

let main = (config: PinballConfig) => {
  // Github Corner
  document.body.innerHTML += githubCornerHTML(packageJson.repository, packageJson.version)

  let random = seedrandom(config.seed)

  let layout = getLayout(config)

  let app = new pixi.Application({
    backgroundColor: config.backgroundColor,
  })
  document.body.appendChild(app.view)

  let game = createGame(config, random)

  let bumperGrid = createGrid<pixi.Graphics | 'nothing'>(config.size, 'nothing')

  let journey = 0

  let gameContainer: pixi.Container = new pixi.Container()
  let board: pixi.Container
  let bumperContainer: pixi.Container
  let startArrow: pixi.Container
  let trail: pixi.Container
  let ball: pixi.Container

  app.stage.addChild(gameContainer)

  let handleIndicatorClick = (pos: GridPosition) => {
    if (game.phase === 'guess') {
      game.phase = 'result'

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

    // visibility
    bumperContainer.visible = ['bumperView', 'result', 'end'].includes(game.phase)
    startArrow.visible = ['guess', 'result', 'end'].includes(game.phase)
    trail.children.forEach((g, k) => {
      g.visible = k < 2 * journey
    })
    ball.visible = ['result', 'end'].includes(game.phase)
    if (game.phase === 'end') {
      let mark = game.trail.slice(-1)[0]
      ball.x = (mark.x + 0.5) * layout.side
      ball.y = (mark.y + 0.5) * layout.side
    }

    gameContainer.x = layout.boardBase.x
    gameContainer.y = layout.boardBase.y

    gameContainer.removeChildren()
    gameContainer.addChild(board)
    gameContainer.addChild(startArrow)
    gameContainer.addChild(trail)
    gameContainer.addChild(bumperContainer)
    gameContainer.addChild(ball)
  }
  redraw()

  let redrawTimeout: ReturnType<typeof setTimeout>
  let resize = () => {
    layout = getLayout(config)
    app.renderer.resize(layout.width, layout.height)
    clearTimeout(redrawTimeout)
    redrawTimeout = setTimeout(redraw, 200)
  }
  resize()
  window.addEventListener('resize', resize)

  // phase initial -> bumperView
  let firstClickHandler = () => {
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

    window.removeEventListener('click', firstClickHandler)
  }
  window.addEventListener('click', firstClickHandler)

  pixi.Ticker.shared.add(() => {
    let { elapsedMS } = pixi.Ticker.shared

    if (game.phase === 'result') {
      ball.visible = true

      journey += elapsedMS / 256

      if (journey > game.trail.length - 0.5) {
        game.phase = 'end'
        clickSound.play()
        setTimeout(() => {
          clickSound.play()
          bumperContainer.children.forEach((g) => (g.visible = true))
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

// getting the configuration
main(getConfig(location))

window.addEventListener('hashchange', () => {
  console.clear()
  document.body.innerHTML = ''
  main(getConfig(location))
})
