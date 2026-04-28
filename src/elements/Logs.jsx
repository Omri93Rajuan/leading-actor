import { memo, useRef } from 'react'
import { useCylinder } from '@react-three/cannon'
import { LOGS } from '../game/worldConfig'

function Log({ log }) {
  const [ref] = useCylinder(
    () => ({
      args: [log.radius, log.radius, log.length, 24],
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
