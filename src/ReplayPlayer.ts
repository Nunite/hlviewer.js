import { glMatrix } from 'gl-matrix'
import { createNanoEvents, type Emitter as EventEmitter } from 'nanoevents'
import type { Game } from './Game'
import { Replay } from './Replay/Replay'
import { ReplayState } from './Replay/ReplayState'

const updateGame = (game: Game, state: ReplayState) => {
  game.camera.position[0] = state.cameraPos[0]
  game.camera.position[1] = state.cameraPos[1]
  game.camera.position[2] = state.cameraPos[2]
  game.camera.rotation[0] = glMatrix.toRadian(state.cameraRot[0])
  game.camera.rotation[1] = glMatrix.toRadian(state.cameraRot[1])
  game.camera.rotation[2] = glMatrix.toRadian(state.cameraRot[2])
}

export class ReplayPlayer {
  game: Game
  state: ReplayState
  replay: any
  events: EventEmitter

  currentMap = 0
  currentChunk = 0
  currentTime = 0
  currentTick = 0
  isPlaying = false
  isPaused = false
  speed = 1

  constructor(game: Game) {
    this.reset()
    this.game = game
    this.state = new ReplayState()
    this.replay = null
    this.events = createNanoEvents()
  }

  reset() {
    this.currentMap = 0
    this.currentChunk = 0
    this.currentTime = 0
    this.currentTick = 0

    this.isPlaying = false
    this.isPaused = false
    this.speed = 1

    if (this.replay) {
      const firstChunk = this.replay.maps[0].chunks[0]
      firstChunk.reader.seek(0)
      this.state = firstChunk.state.clone()
    }
  }

  changeReplay(replay: Replay) {
    this.replay = replay
    this.reset()
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true
    } else if (this.isPaused) {
      this.isPaused = false
    }

    this.events.emit('play', this.currentTime)
  }

  pause() {
    if (this.isPlaying) {
      this.isPaused = true
    }

    this.events.emit('pause', this.currentTime)
  }

  stop() {
    this.reset()
    this.events.emit('stop', 0)
  }

  speedUp() {
    this.speed = Math.min(this.speed * 2, 4)
  }

  speedDown() {
    this.speed = Math.max(this.speed / 2, 0.25)
  }

  seek(value: number) {
    const t = Math.max(0, Math.min(this.replay.length, value))

    const maps = this.replay.maps
    for (let i = 0; i < maps.length; ++i) {
      const chunks = maps[i].chunks
      for (let j = 0; j < chunks.length; ++j) {
        const chunk = chunks[j]
        const startTime = chunk.startTime
        const timeLimit = startTime + chunk.timeLength
        if (t >= startTime && t < timeLimit) {
          this.currentMap = i
          this.currentChunk = j
          this.currentTime = t

          this.state = chunk.state.clone()
          const deltaDecoders = this.replay.deltaDecoders
          const customMessages = this.replay.customMessages
          const r = chunk.reader
          r.seek(0)
          while (true) {
            const offset = r.tell()
            const frame = Replay.readFrame(r, deltaDecoders, customMessages)
            if (frame.time <= t) {
              this.state.feedFrame(frame)
              this.currentTick = frame.tick
            } else {
              r.seek(offset)
              break
            }
          }

          this.events.emit('seek', t)
          updateGame(this.game, this.state)

          return
        }
      }
    }
  }

  seekByPercent(value: number) {
    this.seek((Math.max(0, Math.min(value, 100)) / 100) * this.replay.length)
  }

  update(dt: number) {
    if (!this.isPlaying || this.isPaused) {
      return;
    }

    const deltaDecoders = this.replay.deltaDecoders
    const customMessages = this.replay.customMessages

    let map = this.replay.maps[this.currentMap]
    let chunk = map.chunks[this.currentChunk]
    let r = chunk.reader

    const endTime = this.currentTime + dt * this.speed

    let hitStop = false

    while (true) {
      let offset = r.tell()
      if (offset >= chunk.data.length) {
        if (this.currentChunk === map.chunks.length - 1) {
          if (this.currentMap === this.replay.maps.length - 1) {
            hitStop = true
            break
          }
          this.currentChunk = 0
          this.currentMap++
          map = this.replay.maps[this.currentMap]
          chunk = map.chunks[this.currentChunk]
        } else {
          this.currentChunk++
          chunk = map.chunks[this.currentChunk]
        }

        r = chunk.reader
        r.seek(0)
        offset = 0

        continue
      }

      const frame = Replay.readFrame(r, deltaDecoders, customMessages)
      if (frame.time <= endTime) {
        this.state.feedFrame(frame)
        this.currentTick = frame.tick
        if (frame.type === 0 || frame.type === 1) {
          const pos = frame.camera.position
          const time = frame.time
          if (this.state.prevCameraPos) {
            const dt = time - this.state.prevTime
            if (dt > 0) {
              this.state.velocity = [
                (pos[0] - this.state.prevCameraPos[0]) / dt,
                (pos[1] - this.state.prevCameraPos[1]) / dt,
                (pos[2] - this.state.prevCameraPos[2]) / dt
              ]
              this.state.speed = Math.sqrt(
                this.state.velocity[0] * this.state.velocity[0] +
                this.state.velocity[1] * this.state.velocity[1] 
              )
            }
          }
          this.state.prevCameraPos = [pos[0], pos[1], pos[2]]
          this.state.prevTime = time
        }
      } else {
        r.seek(offset)
        break
      }
    }

    updateGame(this.game, this.state)
    this.currentTime = endTime

    if (hitStop) {
      this.stop()
    }
  }
}
