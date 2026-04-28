import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Game from './Game'
import { Physics } from '@react-three/cannon'
import { Suspense, useEffect, useState } from 'react'

function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__mark" />
      <span>Loading scene</span>
    </div>
  )
}

function SceneHud({ isLocked }) {
  return (
    <>
      <header className="hud">
        <div>
          <p className="hud__eyebrow">Interactive portfolio</p>
          <h1>Leading Actor</h1>
        </div>
        <div className={`hud__status ${isLocked ? 'hud__status--active' : ''}`}>
          {isLocked ? 'Exploring' : 'Click scene to enter'}
        </div>
      </header>

      <aside className="control-strip" aria-label="Scene controls">
        <div>
          <strong>WASD</strong>
          <span>Move</span>
        </div>
        <div>
          <strong>Shift</strong>
          <span>Run</span>
        </div>
        <div>
          <strong>Space</strong>
          <span>Jump</span>
        </div>
        <div>
          <strong>Mouse</strong>
          <span>Look</span>
        </div>
      </aside>

      <a className="credit" href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
        Character model: Mixamo
      </a>
    </>
  )
}

export default function App() {
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const handlePointerLockChange = () => setIsLocked(Boolean(document.pointerLockElement))

    document.addEventListener('pointerlockchange', handlePointerLockChange)
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange)
  }, [])

  const handleCanvasPointerDown = (event) => {
    event.currentTarget.requestPointerLock?.()
  }

  return (
    <main className="app-shell">
      <Suspense fallback={<Loader />}>
        <Canvas className="scene-canvas" shadows onPointerDown={handleCanvasPointerDown}>
          <spotLight position={[2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} />
          <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} />
          <Physics>
            <Game />
          </Physics>
          <Stats />
        </Canvas>
        <SceneHud isLocked={isLocked} />
      </Suspense>
    </main>
  )
}
