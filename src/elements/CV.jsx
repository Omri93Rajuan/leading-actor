import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const CV = () => {
  const colorCv = useLoader(TextureLoader, './img/myImg.png')

  return (
    <>
      <mesh position={[-14, 3, -4]}>
        <boxGeometry args={[0.1, 3, 4]} />
        <meshStandardMaterial map={colorCv} />
      </mesh>
      <mesh position-y={1}>
      <meshPhysicalMaterial
        metalness={0}
        roughness={0.36}
        clearcoat={1}
        transmission={1}
        ior={1.53}
        thickness={5}
      />
    </mesh>
    </>
  )
}

export default CV
