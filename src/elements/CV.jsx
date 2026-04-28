import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { DoubleSide, sRGBEncoding, TextureLoader } from 'three'
import StaticBoxCollider from './StaticBoxCollider'

const CV_TEXTURE_URL = `${process.env.PUBLIC_URL}/img/myImg.png`
const BOARD_WIDTH = 4.8
const BOARD_HEIGHT = 2.85
const IMAGE_WIDTH = 4.45
const IMAGE_HEIGHT = 2.5

export default function CV() {
  const cvTexture = useLoader(TextureLoader, CV_TEXTURE_URL)

  useEffect(() => {
    cvTexture.encoding = sRGBEncoding
    cvTexture.anisotropy = 4
    cvTexture.needsUpdate = true
  }, [cvTexture])

  return (
    <>
      <StaticBoxCollider args={[BOARD_WIDTH, BOARD_HEIGHT, 0.18]} position={[-12.6, 2.25, -5.5]} rotation={[0, Math.PI / 2, 0]} />
      <StaticBoxCollider args={[BOARD_WIDTH + 0.35, 0.18, 0.36]} position={[-12.66, 0.73, -5.5]} rotation={[0, Math.PI / 2, 0]} />

      <group position={[-12.5, 2.25, -5.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, -0.1]}>
          <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, 0.18]} />
          <meshStandardMaterial color="#101820" metalness={0.08} roughness={0.72} />
        </mesh>

        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[IMAGE_WIDTH, IMAGE_HEIGHT]} />
          <meshStandardMaterial map={cvTexture} roughness={0.5} side={DoubleSide} />
        </mesh>

        <mesh receiveShadow position={[0, -1.52, -0.16]}>
          <boxGeometry args={[BOARD_WIDTH + 0.35, 0.18, 0.36]} />
          <meshStandardMaterial color="#26343d" metalness={0.12} roughness={0.64} />
        </mesh>
      </group>
    </>
  )
}
