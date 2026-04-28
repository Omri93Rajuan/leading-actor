import { useRef } from 'react'
import { useBox } from '@react-three/cannon'

export default function StaticBoxCollider({ args, material = 'solid', position, rotation = [0, 0, 0] }) {
  const [ref] = useBox(
    () => ({
      args,
      material,
      position,
      rotation,
      type: 'Static'
    }),
    useRef()
  )

  return <mesh ref={ref} visible={false} />
}
