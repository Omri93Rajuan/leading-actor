import { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { sRGBEncoding, TextureLoader } from 'three'

const SUN_TEXTURE_URL = `${process.env.PUBLIC_URL}/img/myImg.png`

export default function Sun() {
  const sun = useRef()
  const texture = useLoader(TextureLoader, SUN_TEXTURE_URL)

  useEffect(() => {
    texture.encoding = sRGBEncoding
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  useFrame((_, delta) => {
    if (sun.current) {
      sun.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group position={[11, 8.5, -13]}>
      <pointLight color="#ffd89a" distance={52} intensity={1.3} />
      <mesh ref={sun}>
        <sphereGeometry args={[2.2, 64, 32]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
