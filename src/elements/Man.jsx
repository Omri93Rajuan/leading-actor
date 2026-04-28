import React, { useEffect, useMemo, useRef } from 'react';
import { Vector3, Euler, Quaternion, Matrix4 } from 'three';
import { useCompoundBody } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Vec3 } from 'cannon-es';
import useFollowCam from '../hooks/useFollowCam';
import { useInput } from '../hooks/useInput';
import { useAnimations, useGLTF } from '@react-three/drei';

const WALK_SPEED = 4;
const RUN_SPEED = 8;
const JUMP_SPEED = 5.5;
const ROTATION_SPEED = 10;

export default function Model(props) {
  const { forward, backward, left, right, shift, jump } = useInput();
  const group = useRef();
  const model = useGLTF("models/kid.glb");
  const { nodes, materials, animations } = model;
  const { actions } = useAnimations(animations, group);

  const { pivot } = useFollowCam();
  const canJump = useRef(false);
  const velocity = useMemo(() => new Vector3(), []);
  const inputVelocity = useMemo(() => new Vector3(), []);
  const euler = useMemo(() => new Euler(), []);
  const quat = useMemo(() => new Quaternion(), []);
  const targetQuaternion = useMemo(() => new Quaternion(), []);
  const worldPosition = useMemo(() => new Vector3(), []);
  const rotationMatrix = useMemo(() => new Matrix4(), []);
  const contactNormal = useMemo(() => new Vec3(0, 0, 0), []);
  const upAxis = useMemo(() => new Vec3(0, 1, 0), []);
  const currentVelocity = useRef([0, 0, 0]);

  const currentRef = useRef("");
  const [ref, body] = useCompoundBody(
    () => ({
      allowSleep: false,
      mass: 1,
      shapes: [
        { args: [0.5], position: [0, 0.5, 0], type: 'Sphere' },
        { args: [0.5], position: [0, 1.5, 0], type: 'Sphere' }
      ],
      onCollide: (e) => {
        if (e.contact.bi.id === e.body.id) {
          e.contact.ni.negate(contactNormal);
        } else {
          contactNormal.set(...e.contact.ni);
        }

        if (contactNormal.dot(upAxis) > 0.5) {
          canJump.current = true;
        }
      },
      ...props
    }),
    useRef()
  );

  useEffect(() => {
    body.angularFactor.set(0, 0, 0);
    return body.velocity.subscribe((value) => {
      currentVelocity.current = value;
    });
  }, [body]);

  useFrame((_, delta) => {
    if (!ref.current || !group.current) {
      return;
    }

    ref.current.getWorldPosition(worldPosition);

    rotationMatrix.lookAt(worldPosition, group.current.position, group.current.up);
    targetQuaternion.setFromRotationMatrix(rotationMatrix);

    if (!group.current.quaternion.equals(targetQuaternion)) {
      targetQuaternion.z = 0;
      targetQuaternion.x = 0;
      group.current.quaternion.rotateTowards(targetQuaternion, delta * ROTATION_SPEED);
    } else {
      group.current.quaternion.copy(targetQuaternion);
    }

    if (document.pointerLockElement) {
      inputVelocity.set(0, 0, 0);
      const hasMoveInput = forward || backward || left || right;
      if (forward) {
        inputVelocity.z -= 1;
      }
      if (backward) {
        inputVelocity.z += 1;
      }
      if (left) {
        inputVelocity.x -= 1;
      }
      if (right) {
        inputVelocity.x += 1;
      }

      if (inputVelocity.lengthSq() > 0) {
        inputVelocity.normalize().multiplyScalar(shift ? RUN_SPEED : WALK_SPEED);
      }

      const shouldJump = jump && canJump.current;
      const yVelocity = shouldJump ? JUMP_SPEED : currentVelocity.current[1];

      if (shouldJump) {
        canJump.current = false;
      }

      euler.y = pivot.rotation.y;
      euler.order = 'XYZ';
      quat.setFromEuler(euler);
      inputVelocity.applyQuaternion(quat);

      if (hasMoveInput || shouldJump) {
        body.wakeUp();
      }

      velocity.set(inputVelocity.x, yVelocity, inputVelocity.z);
      body.velocity.set(velocity.x, velocity.y, velocity.z);
    }

    group.current.position.lerp(worldPosition, 0.1);
    pivot.position.lerp(worldPosition, 0.2);
  });

  useEffect(() => {
    let action = "";
    if (forward || backward || left || right) {
      action = "Walking";
      if (shift) action = "Running";
    } else if (jump) {
      action = "Jumping";
    } else {
      action = "Idle";
    }

    if (currentRef.current !== action) {
      const nextAction = actions[action];
      const current = actions[currentRef.current];
      current?.fadeOut(0.5);
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
            <skinnedMesh
              castShadow
              name="Ch09"
              geometry={nodes.Ch09.geometry}
              material={materials.Ch09_body}
              skeleton={nodes.Ch09.skeleton}
            />
          </group>
        </group>
      </group>
    </>
  );
}

useGLTF.preload("models/kid.glb");
