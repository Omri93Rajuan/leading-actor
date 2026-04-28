import { memo, useEffect, useRef, useState } from 'react'
import { useBox, useSphere } from '@react-three/cannon'
import { BREAKABLES, CLIMBABLES, PUSHABLES } from '../game/worldConfig'

const DEBRIS = [
  { offset: [-0.2, 0.16, -0.18], size: [0.34, 0.26, 0.28], rotation: [0.3, 0.2, -0.4], velocity: [-1.7, 2.2, -1.1] },
  { offset: [0.18, 0.08, -0.2], size: [0.3, 0.2, 0.36], rotation: [-0.2, 0.8, 0.4], velocity: [1.5, 2, -1.3] },
  { offset: [-0.16, -0.08, 0.2], size: [0.38, 0.22, 0.32], rotation: [0.4, -0.4, 0.9], velocity: [-1.2, 1.6, 1.4] },
  { offset: [0.22, 0.18, 0.18], size: [0.28, 0.3, 0.28], rotation: [-0.7, 0.5, -0.2], velocity: [1.8, 2.35, 1.1] },
  { offset: [0, -0.18, 0], size: [0.58, 0.16, 0.5], rotation: [0, 0.35, 0], velocity: [0.2, 1.4, 0.1] }
]

function PushableCrate({ item }) {
  const [ref] = useBox(
    () => ({
      angularDamping: 0.82,
      args: item.size,
      linearDamping: 0.56,
      mass: item.mass,
      material: 'solid',
      position: item.position
    }),
    useRef()
  )

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={item.size} />
      <meshStandardMaterial color={item.color} roughness={0.84} />
    </mesh>
  )
}

function PushableStone({ item }) {
  const [ref] = useSphere(
    () => ({
      angularDamping: 0.55,
      args: [item.radius],
      linearDamping: 0.35,
      mass: item.mass,
      material: 'solid',
      position: item.position
    }),
    useRef()
  )

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[item.radius, 24, 16]} />
      <meshStandardMaterial color={item.color} roughness={0.9} />
    </mesh>
  )
}

function IntactBreakable({ item, onBreak }) {
  const hasBroken = useRef(false)
  const [ref] = useBox(
    () => ({
      angularDamping: 0.76,
      args: item.size,
      linearDamping: 0.48,
      mass: 1.2,
      material: 'solid',
      onCollide: (event) => {
        if (!hasBroken.current && event.impactVelocity > item.threshold) {
          hasBroken.current = true
          onBreak()
        }
      },
      position: item.position
    }),
    useRef()
  )

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={item.size} />
      <meshStandardMaterial color={item.color} roughness={0.82} />
    </mesh>
  )
}

function DebrisPiece({ basePosition, item, piece }) {
  const position = [
    basePosition[0] + piece.offset[0],
    basePosition[1] + piece.offset[1],
    basePosition[2] + piece.offset[2]
  ]
  const [ref, api] = useBox(
    () => ({
      angularDamping: 0.58,
      args: piece.size,
      linearDamping: 0.42,
      mass: 0.28,
      material: 'solid',
      position,
      rotation: piece.rotation
    }),
    useRef()
  )

  useEffect(() => {
    api.velocity.set(...piece.velocity)
    api.angularVelocity.set(piece.velocity[2], piece.velocity[0], piece.velocity[1])
  }, [api, piece.velocity])

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={piece.size} />
      <meshStandardMaterial color={item.color} roughness={0.9} />
    </mesh>
  )
}

function DebrisPile({ item }) {
  return (
    <>
      {DEBRIS.map((piece, index) => (
        <DebrisPiece key={`${item.id}-piece-${index}`} basePosition={item.position} item={item} piece={piece} />
      ))}
    </>
  )
}

function BreakableCrate({ item }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return <DebrisPile item={item} />
  }

  return <IntactBreakable item={item} onBreak={() => setBroken(true)} />
}

function ClimbableBlock({ item }) {
  const [ref] = useBox(
    () => ({
      args: item.size,
      material: 'solid',
      position: item.position,
      rotation: item.rotation ?? [0, 0, 0],
      type: 'Static'
    }),
    useRef()
  )

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={item.size} />
      <meshStandardMaterial color={item.color} roughness={0.88} />
    </mesh>
  )
}

function Interactables() {
  return (
    <>
      {PUSHABLES.map((item) =>
        item.type === 'stone' ? <PushableStone key={item.id} item={item} /> : <PushableCrate key={item.id} item={item} />
      )}
      {BREAKABLES.map((item) => (
        <BreakableCrate key={item.id} item={item} />
      ))}
      {CLIMBABLES.map((item) => (
        <ClimbableBlock key={item.id} item={item} />
      ))}
    </>
  )
}

export default memo(Interactables)
