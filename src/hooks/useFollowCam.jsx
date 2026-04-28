import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Object3D } from 'three'

const MOUSE_SENSITIVITY = 0.002
const MIN_CAMERA_ZOOM = 1.45
const MAX_CAMERA_ZOOM = 6.2
const MIN_CAMERA_TILT = -0.72
const MAX_CAMERA_TILT = 0.36
const DEFAULT_CAMERA_TILT = -0.18
const CAMERA_HEIGHT = 1.25

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function useFollowCam() {
  const { scene, camera } = useThree()

  const pivot = useMemo(() => new Object3D(), [])
  const followCam = useMemo(() => {
    const o = new Object3D()
    o.rotation.x = DEFAULT_CAMERA_TILT
    o.position.set(0, -DEFAULT_CAMERA_TILT * 3.25 + CAMERA_HEIGHT, 3.25)
    return o
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!document.pointerLockElement) {
        return
      }

      pivot.rotation.y -= e.movementX * MOUSE_SENSITIVITY

      const nextTilt = clamp(
        followCam.rotation.x - e.movementY * MOUSE_SENSITIVITY,
        MIN_CAMERA_TILT,
        MAX_CAMERA_TILT
      )

      followCam.rotation.x = nextTilt
      followCam.position.y = -nextTilt * followCam.position.z + CAMERA_HEIGHT
    }

    const handleWheel = (e) => {
      if (!document.pointerLockElement) {
        return
      }

      followCam.position.z = clamp(
        followCam.position.z + e.deltaY * MOUSE_SENSITIVITY,
        MIN_CAMERA_ZOOM,
        MAX_CAMERA_ZOOM
      )
      followCam.position.y = -followCam.rotation.x * followCam.position.z + CAMERA_HEIGHT
    }

    camera.position.set(0, 0, 0)
    camera.rotation.set(0, 0, 0)
    followCam.add(camera)
    pivot.add(followCam)
    scene.add(pivot)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('wheel', handleWheel)
      followCam.remove(camera)
      pivot.remove(followCam)
      scene.remove(pivot)
    }
  }, [camera, followCam, pivot, scene])

  return { pivot }
}
