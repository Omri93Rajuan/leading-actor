import { useEffect, useMemo, useRef } from 'react'
import { usePlane } from '@react-three/cannon'
import { CanvasTexture, RepeatWrapping } from 'three'

const FLOOR_SIZE = 56

function seededRandom() {
  let seed = 42

  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function createGroundTexture() {
  const canvas = document.createElement('canvas')
  const size = 512
  const tile = 64
  const context = canvas.getContext('2d')
  const random = seededRandom()

  canvas.width = size
  canvas.height = size

  context.fillStyle = '#516744'
  context.fillRect(0, 0, size, size)

  for (let y = 0; y < size; y += tile) {
    for (let x = 0; x < size; x += tile) {
      context.fillStyle = (x + y) / tile % 2 === 0 ? '#5f7446' : '#465a3d'
      context.fillRect(x, y, tile, tile)
    }
  }

  context.globalAlpha = 0.28
  for (let i = 0; i < 420; i += 1) {
    const x = random() * size
    const y = random() * size
    const radius = 1 + random() * 2.8

    context.fillStyle = i % 3 === 0 ? '#d0b66a' : '#243222'
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  const texture = new CanvasTexture(canvas)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(11, 11)
  texture.anisotropy = 4

  return texture
}

export default function Floor(props) {
  const [ref] = usePlane(() => ({ ...props }), useRef())
  const texture = useMemo(createGroundTexture, [])

  useEffect(() => {
    return () => texture.dispose()
  }, [texture])

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshStandardMaterial map={texture} roughness={0.92} />
    </mesh>
  )
}
