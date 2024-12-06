import { Time } from '../Time'
import type { Game } from '../../Game'
import { Timeline } from '../TimeLine'
import { useGameState } from '../GameState'
import { VolumeControl } from '../VolumeControl'
import { PlayButton } from '../Buttons/PlayButton'
import { PauseButton } from '../Buttons/PauseButton'
import { VolumeButton } from '../Buttons/VolumeButton'
import { SpeedUpButton } from '../Buttons/SpeedUpButton'
import { SpeedDownButton } from '../Buttons/SpeedDownButton'
import { SettingsButton } from '../Buttons/SettingsButton'
import { FullscreenButton } from '../Buttons/FullscreenButton'
import { createSignal, onCleanup, Show } from 'solid-js'
import { showSpeed } from '../Buttons/SettingsButton'
import './style.css'

export function ReplayMode(props: { class: string; game: Game; root: Element; visible: boolean }) {
  const gameState = useGameState()
  const [speed, setSpeed] = createSignal(0)

  const updateSpeed = () => {
    const state = props.game.player.state
    if (state.speed) {
      setSpeed(state.speed)
    }
  }

  let frameId: number
  const animate = () => {
    updateSpeed()
    frameId = requestAnimationFrame(animate)
  }
  animate()

  onCleanup(() => cancelAnimationFrame(frameId))

  const onPlayClick = () => {
    props.game.player.play()
  }

  const onPauseClick = () => {
    props.game.player.pause()
  }

  const onSpeedDown = () => {
    props.game.player.speedDown()
  }

  const onSpeedUp = () => {
    props.game.player.speedUp()
  }

  const onVolumeClick = () => {
    props.game.soundSystem.toggleMute()
  }

  return (
    <>
      <div class="hlv-speed-wrapper" classList={{ visible: props.visible }}>
        <Show when={showSpeed()}>
          <div class="hlv-speed-center">
            {speed().toFixed(0)}u/s
          </div>
        </Show>
      </div>
      <div class={props.class}>
        <Timeline game={props.game} />

        <div class="hlv-buttons">
          <div class="hlv-buttons-left">
            <SpeedDownButton onClick={() => onSpeedDown()} />
            {gameState.isPaused || !gameState.isPlaying ? (
              <PlayButton onClick={() => onPlayClick()} />
            ) : (
              <PauseButton onClick={() => onPauseClick()} />
            )}
            <SpeedUpButton onClick={() => onSpeedUp()} />
            <div />
            <div />
            <VolumeButton onClick={() => onVolumeClick()} />
            <VolumeControl game={props.game} />
            <Time player={props.game.player} />
          </div>

          <div class="hlv-buttons-right">
            <SettingsButton game={props.game} />
            <FullscreenButton active={true} root={props.root} />
          </div>
        </div>
      </div>
    </>
  )
}
