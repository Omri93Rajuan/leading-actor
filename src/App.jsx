import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Game from './Game'
import { Physics } from '@react-three/cannon'
import { Suspense, useEffect, useState } from 'react'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const CAMERA_SETTINGS = { fov: 45, near: 0.1, far: 70 }
const GL_SETTINGS = { antialias: true, powerPreference: 'high-performance' }

function handleCanvasPointerDown(event) {
  event.target.requestPointerLock?.()
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

  return (
    <main className="app-shell">
      <Suspense fallback={<Loader />}>
        <Canvas
          className="scene-canvas"
          camera={CAMERA_SETTINGS}
          dpr={[1, 1.5]}
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
            intensity={2.1}
            shadow-camera-bottom={-16}
            shadow-camera-far={32}
            shadow-camera-left={-16}
            shadow-camera-near={1}
            shadow-camera-right={16}
            shadow-camera-top={16}
            shadow-mapSize-height={1024}
            shadow-mapSize-width={1024}
          />
          <Physics allowSleep broadphase="SAP" gravity={[0, -9.81, 0]}>
            <Game />
          </Physics>
          {IS_DEVELOPMENT && <Stats />}
        </Canvas>
        <SceneHud isLocked={isLocked} />
      </Suspense>
    </main>
  )
}
