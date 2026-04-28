import { memo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import StaticCylinderCollider from './StaticCylinderCollider'
import { TREE_COLLIDERS, TREE_ROTATION, TREE_VISUALS } from '../game/worldConfig'

function Trees(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('models/trees.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      {TREE_VISUALS.map((tree) => (
        <group key={tree.node} position={tree.groupPosition} rotation={TREE_ROTATION}>
          <mesh
            castShadow={Boolean(tree.castShadow)}
            receiveShadow
            geometry={nodes[tree.node].geometry}
            material={materials[tree.material]}
            position={tree.position}
            scale={tree.scale ?? 1}
          />
        </group>
      ))}
      {TREE_COLLIDERS.map((collider) => (
        <StaticCylinderCollider
          key={collider.id}
          height={collider.height}
          position={collider.position}
          radius={collider.radius}
        />
      ))}
    </group>
  )
}

export default memo(Trees)

useGLTF.preload('models/trees.glb')
