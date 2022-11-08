import * as pixi from 'pixi.js'
import { default as packageJson } from '../package.json'
import { default as seedrandom } from 'seedrandom'
import { getConfig } from './config/config'
import { drawBoard } from './display/board'
import { getLayout } from './display/layout'
import { githubCornerHTML } from './lib/githubCorner'
import { createStand, createStart } from './logic/generate'
import { drawBumperContainer } from './display/bumper'
import { drawBall } from './display/ball'
import { drawStartArrow } from './display/triangle'
import { drawTrail } from './display/trail'

let main = () => {
  // Github Corner
  document.body.innerHTML += githubCornerHTML(packageJson.repository, packageJson.version)

  // getting the configuration
  let config = getConfig(location)

  let layout = getLayout(config)

  let app = new pixi.Application({
    backgroundColor: config.backgroundColor,
  })
  document.body.appendChild(app.view)
  let redrawTimeout: ReturnType<typeof setTimeout>

  let random = seedrandom(config.seed)
  let stand = createStand(config, random)

  let gameContainer: pixi.Container = new pixi.Container()
  let board: pixi.Container
  let bumperContainer: pixi.Container
  let startArrow: pixi.Container
  let trail: pixi.Container
  let ball: pixi.Container

  app.stage.addChild(gameContainer)

  let redraw = () => {
    board = drawBoard(config, layout)
    bumperContainer = drawBumperContainer(config, layout, stand.bumperArray)
    startArrow = drawStartArrow(config.ballColor, layout.side, stand.start)
    trail = drawTrail(config.trailDotColor, layout, stand.trail)
    ball = drawBall(config, layout, stand)

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

  let resize = () => {
    layout = getLayout(config)
    app.renderer.resize(layout.width, layout.height)
    clearTimeout(redrawTimeout)
    redrawTimeout = setTimeout(redraw, 100)
  }
  resize()
  window.addEventListener('resize', resize)

  // pixi.Ticker.shared.add(() => {
  //   let a = Math.floor((Date.now() * 256) / 1000 / 60) % 256
  //   app.renderer.backgroundColor = a * 0x10101
  // })
}

main()
