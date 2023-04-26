import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Game from './Game'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'

function Loader() {
  return <h1>Loading...</h1>
}

export default function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Canvas shadows onPointerDown={(e) => e.target.requestPointerLock()}>
          <spotLight position={[2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} />
          <spotLight position={[-2.5, 5, 5]} angle={Math.PI / 3} penumbra={0.5} castShadow shadow-mapSize-height={2048} shadow-mapSize-width={2048} />
          <Physics>
            <Game />
          </Physics>
          <Stats />
        </Canvas>
        <h3 id="instructions">
          WASD to move 
          <br />
          SHIFT + WASD to run
          <br />
          SPACE to jump.
          <br />
          Model from{' '}
          <a href="https://www.mixamo.com" target="_blank" rel="nofollow noreferrer">
            Mixamo
          </a>
        </h3>
      </Suspense>
    </>
  )
}
