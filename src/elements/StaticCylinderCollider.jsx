import { memo, useRef } from 'react'
import { useCylinder } from '@react-three/cannon'

function StaticCylinderCollider({ radius, height, material = 'solid', position, rotation = [0, 0, 0], segments = 18 }) {
  const [ref] = useCylinder(
    () => ({
      args: [radius, radius, height, segments],
      material,
      position,
      rotation,
      type: 'Static'
    }),
    useRef()
  )

  return <mesh ref={ref} visible={false} />
}

export default memo(StaticCylinderCollider)
