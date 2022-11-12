import clickUrl from 'url:../../asset/sound/click.mp3'
import errorUrl from 'url:../../asset/sound/error.mp3'

let createAudioManager = (url: string, { volume = 1 } = {}) => {
  let audioArray = Array.from({ length: 10 }, () => {
    let audio = new Audio(url)
    audio.volume = volume
    return audio
  })

  let k = 0
  return {
    play: () => {
      audioArray[k].play()
      k = (k + 1) % audioArray.length
    },
  }
}

export const clickSound = createAudioManager(clickUrl)
export const errorSound = createAudioManager(errorUrl)
