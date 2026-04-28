import { Canvas } from '@react-three/fiber'
import Game from './Game'
import { Physics } from '@react-three/cannon'
import { Suspense, useEffect, useState } from 'react'

const CAMERA_SETTINGS = { fov: 45, near: 0.1, far: 70 }
const GL_SETTINGS = { antialias: true, powerPreference: 'high-performance', stencil: false }

function handleCanvasPointerDown(event) {
  event.currentTarget.requestPointerLock?.()
}

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
          <p className="hud__eyebrow">Reactive playground</p>
          <h1>Kid World</h1>
        </div>
        <div className={`hud__status ${isLocked ? 'hud__status--active' : ''}`}>
          {isLocked ? 'Playing' : 'Click to play'}
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
      <div className={`reticle ${isLocked ? 'reticle--active' : ''}`} aria-hidden="true" />
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

  return (
    <main className="app-shell">
      <Suspense fallback={<Loader />}>
        <Canvas
          className="scene-canvas"
          camera={CAMERA_SETTINGS}
          dpr={[1, 1.25]}
          gl={GL_SETTINGS}
          shadows
          onPointerDown={handleCanvasPointerDown}
        >
          <color attach="background" args={['#07090f']} />
          <fog attach="fog" args={['#07090f', 18, 42]} />
          <hemisphereLight args={['#d6f3ff', '#6f5c3d', 0.9]} />
          <directionalLight
            castShadow
            position={[4, 8, 6]}
            intensity={2.25}
            shadow-camera-bottom={-20}
            shadow-camera-far={42}
            shadow-camera-left={-20}
            shadow-camera-near={1}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-mapSize-height={512}
            shadow-mapSize-width={512}
          />
          <Physics broadphase="SAP" gravity={[0, -9.81, 0]} iterations={12} maxSubSteps={4}>
            <Game />
          </Physics>
        </Canvas>
        <SceneHud isLocked={isLocked} />
      </Suspense>
    </main>
  )
}
