import { memo, useRef } from 'react'
import { useBox } from '@react-three/cannon'

const LOGS = [
  {
    id: 'starter-log',
    position: [6.2, 0.32, -5.2],
    rotation: [0, 0, Math.PI / 2],
    length: 3.8,
    radius: 0.38,
    color: '#755436'
  },
  {
    id: 'cross-log',
    position: [9.2, 0.38, -7.2],
    rotation: [0, -0.85, Math.PI / 2],
    length: 3.1,
    radius: 0.43,
    color: '#5d4028'
  },
  {
    id: 'jump-log',
    position: [11.2, 0.52, -4.9],
    rotation: [0, 0.35, Math.PI / 2],
    length: 2.8,
    radius: 0.54,
    color: '#8a6644'
  }
]

function Log({ log }) {
  const colliderHeight = log.radius * 1.35
  const [ref] = useBox(
    () => ({
      args: [log.length, colliderHeight, log.radius * 1.75],
      material: 'solid',
      position: log.position,
      rotation: log.rotation,
      type: 'Static'
    }),
    useRef()
  )

  return (
    <group>
      <mesh ref={ref} visible={false} />
      <mesh castShadow receiveShadow position={log.position} rotation={log.rotation}>
        <cylinderGeometry args={[log.radius, log.radius, log.length, 24]} />
        <meshStandardMaterial color={log.color} roughness={0.86} />
      </mesh>
    </group>
  )
}

function Logs() {
  return (
    <>
      {LOGS.map((log) => (
        <Log key={log.id} log={log} />
      ))}
    </>
  )
}

export default memo(Logs)
