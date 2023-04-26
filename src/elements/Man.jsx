import { useEffect, useMemo, useRef } from 'react'
import { Vector3, Euler, Quaternion, Matrix4} from 'three'
import { useCompoundBody } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Vec3 } from 'cannon-es'
import useFollowCam from '../hooks/useFollowCam'
import { useInput } from '../hooks/useInput'
import { useAnimations, useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { forward, backward, left, right, shift, jump } = useInput();
  const group = useRef();
  const model = useGLTF("models/kid.glb");
  const { nodes, materials, animations } = model;
  const { actions } = useAnimations(animations, group);

  const { pivot } = useFollowCam()
  const canJump = useRef(false)
  const velocity = useMemo(() => new Vector3(), [])
  const inputVelocity = useMemo(() => new Vector3(), [])
  const euler = useMemo(() => new Euler(), [])
  const quat = useMemo(() => new Quaternion(), [])
  const targetQuaternion = useMemo(() => new Quaternion(), [])
  const worldPosition = useMemo(() => new Vector3(), [])
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), [])



  const currentRef = useRef("");
  const [ref, body] = useCompoundBody(
    () => ({
      mass: 1,
      shapes: [
        { args: [0.5], position: [0, 0.5, 0], type: 'Sphere' },
        { args: [0.5], position: [0, 1.5, 0], type: 'Sphere' }
      ],
      onCollide: (e) => {
        if (e.contact.bi.id === e.body.id) {
          e.contact.ni.negate(contactNormal)
        } else {
          contactNormal.set(...e.contact.ni)
        }
    
        
      },
      ...props
    }),
    useRef()
  )

  useFrame((_, delta) => {
    body.angularFactor.set(0, 0, 0)

    ref.current.getWorldPosition(worldPosition)

    const rotationMatrix = new Matrix4()
    rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up)
    targetQuaternion.setFromRotationMatrix(rotationMatrix)
    if (!group.current.quaternion.equals(targetQuaternion)) {
      targetQuaternion.z = 0
      targetQuaternion.x = 0
      targetQuaternion.normalize()
      group.current.quaternion.rotateTowards(targetQuaternion, delta * 1)
    }

    if (!group.current.quaternion.equals(targetQuaternion)) {
      targetQuaternion.z = 0
      targetQuaternion.x = 0
      targetQuaternion.normalize()
      group.current.quaternion.rotateTowards(targetQuaternion, delta * 10)
    }

    if (document.pointerLockElement) {
      inputVelocity.set(0, 0, 0)
        if (forward ) {
          shift?inputVelocity.z += -6 * delta:inputVelocity.z += -2 * delta
        }
        if (backward) {
          shift?inputVelocity.z += 6 * delta:inputVelocity.z += 2 * delta
        }
        if (left) {
          shift?inputVelocity.x += -6 * delta:inputVelocity.x += -2 * delta
        }
        if (right) {
          shift?inputVelocity.x += 6 * delta:inputVelocity.x += 2 * delta
        }
        if (jump) if (canJump.current) {
          canJump.current = false
          inputVelocity.x += 10
        }

        euler.y = pivot.rotation.y
        euler.order = 'XYZ'
        quat.setFromEuler(euler)
        inputVelocity.applyQuaternion(quat)
        velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z)
      
        body.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0])
        
      }
        group.current.position.lerp(worldPosition, 0.1)
        pivot.position.lerp(worldPosition, 0.2)
      })

  useEffect(() => {
    let action = "";
    if (forward || backward || left || right) {
      action = "Walking";
      if (shift) action = "Running";
    } else if (jump) {
      action = "Jumping";
    } else action = "Idle";

    if (currentRef.current !== action) {
      const nextAction = actions[action];
      const current = actions[currentRef.current];
      current?.fadeOut(0.2);
      nextAction?.reset().fadeIn(0.2).play();
      currentRef.current = action;
    }
  }, [forward, backward, left, right, shift, jump, actions]);

  return (
    <>
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature005" position={[0.01, -0.01, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig6Hips} />
          <skinnedMesh castShadow name="Ch09" geometry={nodes.Ch09.geometry} material={materials.Ch09_body} skeleton={nodes.Ch09.skeleton} />
        </group>
      </group>
    </group>

    </>
  );
}

useGLTF.preload("models/kid.glb");
