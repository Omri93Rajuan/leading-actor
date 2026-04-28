import { useEffect, useMemo, useRef, useState } from 'react'
import { Euler, Quaternion, Vector3 } from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useCompoundBody } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Vec3 } from 'cannon-es'
import { PLAYER_CONFIG } from '../game/worldConfig'
import useFollowCam from '../hooks/useFollowCam'
import { useInput } from '../hooks/useInput'

const UP_AXIS = new Vec3(0, 1, 0)
const MODEL_YAW_OFFSET = 0

function copyContactNormal(event, target) {
  const normal = event.contact?.contactNormal ?? event.contact?.ni

  if (!normal) {
    return false
  }

  const sign = event.contact?.contactNormal ? 1 : event.contact?.bi?.id === event.body?.id ? -1 : 1
  const x = Array.isArray(normal) ? normal[0] : normal.x ?? normal[0]
  const y = Array.isArray(normal) ? normal[1] : normal.y ?? normal[1]
  const z = Array.isArray(normal) ? normal[2] : normal.z ?? normal[2]

  if (![x, y, z].every(Number.isFinite)) {
    return false
  }

  target.set(x * sign, y * sign, z * sign)
  return true
}

function dampAngle(current, target, speed, delta) {
  const angleDelta = Math.atan2(Math.sin(target - current), Math.cos(target - current))
  return current + angleDelta * Math.min(1, speed * delta)
}

function nextAnimationName({ grounded, moving, running }) {
  if (!grounded) {
    return 'Jumping'
  }

  if (moving) {
    return running ? 'Running' : 'Walking'
  }

  return 'Idle'
}

export default function Man(props) {
  const input = useInput()
  const bodyRef = useRef()
  const visualRef = useRef()
  const currentAnimation = useRef('')
  const currentVelocity = useRef([0, 0, 0])
  const activeContacts = useRef(new Set())
  const lastGroundedAt = useRef(0)
  const [animationName, setAnimationName] = useState('Idle')

  const { pivot } = useFollowCam()
  const { nodes, materials, animations } = useGLTF('models/kid-game.glb')
  const { actions } = useAnimations(animations, visualRef)

  const velocity = useMemo(() => new Vector3(), [])
  const inputVelocity = useMemo(() => new Vector3(), [])
  const worldPosition = useMemo(() => new Vector3(), [])
  const visualTarget = useMemo(() => new Vector3(), [])
  const cameraEuler = useMemo(() => new Euler(0, 0, 0, 'XYZ'), [])
  const cameraQuaternion = useMemo(() => new Quaternion(), [])
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), [])

  const [physicsRef, body] = useCompoundBody(
    () => ({
      allowSleep: false,
      fixedRotation: true,
      linearDamping: 0.2,
      mass: 1,
      material: 'player',
      onCollide: (event) => {
        if (!copyContactNormal(event, contactNormal)) {
          return
        }

        if (Math.abs(contactNormal.dot(UP_AXIS)) > PLAYER_CONFIG.groundedDot) {
          lastGroundedAt.current = performance.now()
        }
      },
      onCollideBegin: (event) => {
        if (event.body?.uuid) {
          activeContacts.current.add(event.body.uuid)
        }
      },
      onCollideEnd: (event) => {
        if (event.body?.uuid) {
          activeContacts.current.delete(event.body.uuid)
        }
      },
      shapes: [
        { args: [PLAYER_CONFIG.radius], position: [0, PLAYER_CONFIG.lowerSphereY, 0], type: 'Sphere' },
        { args: [PLAYER_CONFIG.radius], position: [0, PLAYER_CONFIG.upperSphereY, 0], type: 'Sphere' }
      ],
      ...props
    }),
    bodyRef
  )

  useEffect(() => {
    body.angularFactor.set(0, 0, 0)
    return body.velocity.subscribe((value) => {
      currentVelocity.current = value
    })
  }, [body])

  useEffect(() => {
    if (currentAnimation.current === animationName) {
      return
    }

    const nextAction = actions[animationName]
    const previousAction = actions[currentAnimation.current]

    previousAction?.fadeOut(0.16)
    nextAction?.reset().fadeIn(0.14).play()
    currentAnimation.current = animationName
  }, [actions, animationName])

  useFrame((_, delta) => {
    if (!physicsRef.current || !visualRef.current) {
      return
    }

    physicsRef.current.getWorldPosition(worldPosition)

    const now = performance.now()
    const hasStableContact = activeContacts.current.size > 0 && Math.abs(currentVelocity.current[1]) < 0.55
    if (hasStableContact) {
      lastGroundedAt.current = now
    }
    const grounded = hasStableContact || now - lastGroundedAt.current < PLAYER_CONFIG.groundedGraceMs
    const hasMoveInput = input.forward || input.backward || input.left || input.right
    const running = Boolean(input.shift && hasMoveInput)
    const speed = running ? PLAYER_CONFIG.runSpeed : PLAYER_CONFIG.walkSpeed

    inputVelocity.set(0, 0, 0)

    if (input.forward) {
      inputVelocity.z -= 1
    }
    if (input.backward) {
      inputVelocity.z += 1
    }
    if (input.left) {
      inputVelocity.x -= 1
    }
    if (input.right) {
      inputVelocity.x += 1
    }

    if (inputVelocity.lengthSq() > 0) {
      inputVelocity.normalize().multiplyScalar(speed)
      cameraEuler.y = pivot.rotation.y
      cameraQuaternion.setFromEuler(cameraEuler)
      inputVelocity.applyQuaternion(cameraQuaternion)
    }

    if (document.pointerLockElement) {
      const wantsJump = input.jump && grounded
      const control = grounded ? 1 : PLAYER_CONFIG.airControl
      const nextX = hasMoveInput ? inputVelocity.x * control + currentVelocity.current[0] * (1 - control) : 0
      const nextZ = hasMoveInput ? inputVelocity.z * control + currentVelocity.current[2] * (1 - control) : 0
      const nextY = wantsJump ? PLAYER_CONFIG.jumpSpeed : currentVelocity.current[1]

      if (hasMoveInput || wantsJump) {
        body.wakeUp()
      }

      if (wantsJump) {
        lastGroundedAt.current = 0
      }

      velocity.set(nextX, nextY, nextZ)
      body.velocity.set(velocity.x, velocity.y, velocity.z)
    } else {
      body.velocity.set(currentVelocity.current[0] * 0.88, currentVelocity.current[1], currentVelocity.current[2] * 0.88)
    }

    if (hasMoveInput && inputVelocity.lengthSq() > 0.01) {
      const targetYaw = Math.atan2(inputVelocity.x, inputVelocity.z) + MODEL_YAW_OFFSET
      visualRef.current.rotation.y = dampAngle(visualRef.current.rotation.y, targetYaw, PLAYER_CONFIG.rotationSpeed, delta)
    }

    visualTarget.set(worldPosition.x, worldPosition.y + PLAYER_CONFIG.visualGroundOffset, worldPosition.z)
    visualRef.current.position.lerp(visualTarget, 0.26)
    pivot.position.lerp(worldPosition, 0.24)

    const next = nextAnimationName({ grounded, moving: hasMoveInput, running })
    if (next !== animationName) {
      setAnimationName(next)
    }
  })

  return (
    <>
      <group ref={physicsRef} visible={false} />
      <group ref={visualRef} dispose={null}>
        <group name="Scene">
          <group name="Armature005" position={[0.01, -0.01, 0]} scale={0.01}>
            {nodes.mixamorig6Hips && <primitive object={nodes.mixamorig6Hips} />}
            {nodes.Ch09 ? (
              <skinnedMesh
                castShadow
                name="Ch09"
                geometry={nodes.Ch09.geometry}
                material={materials.Ch09_body}
                skeleton={nodes.Ch09.skeleton}
              />
            ) : (
              <mesh castShadow>
                <capsuleGeometry args={[0.28, 0.9, 8, 16]} />
                <meshStandardMaterial color="#d58b73" roughness={0.7} />
              </mesh>
            )}
          </group>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('models/kid-game.glb')
