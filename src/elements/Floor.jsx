import { useRef } from 'react'
import { usePlane } from '@react-three/cannon'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export default function Floor(props) {
  const [ref] = usePlane(() => ({ ...props }), useRef())
  const texture = useLoader(TextureLoader, 'https://i.postimg.cc/FH1tyn7q/pexels-photo-413195.jpg')

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry  args={[25, 25]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
