import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { Object3D } from 'three'

const MOUSE_SENSITIVITY = 0.002
const MIN_CAMERA_ZOOM = 0.5
const MAX_CAMERA_ZOOM = 4
const MIN_CAMERA_TILT = -1
const MAX_CAMERA_TILT = 0.4

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function useFollowCam() {
  const { scene, camera } = useThree()

  const pivot = useMemo(() => new Object3D(), [])
  const followCam = useMemo(() => {
    const o = new Object3D()
    o.position.set(0, 1, 1.5)
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
      followCam.position.y = -nextTilt * followCam.position.z + 1
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
    }

    camera.position.set(0, 0, 0)
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
