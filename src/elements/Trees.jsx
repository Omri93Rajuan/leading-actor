import { memo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const TREE_ROTATION = [-Math.PI / 2, 0, 0]

const TREES = [
  {
    node: 'Object_2',
    material: 'Shader_Arbol',
    position: [3.35, 3.82, -0.41],
    scale: 0.7,
    castShadow: true
  },
  {
    node: 'Object_2001',
    material: 'Shader_Arbol.001',
    groupPosition: [-3.18, 0.03, 4.53],
    position: [-3.29, 9.82, -0.5]
  },
  {
    node: 'Object_2002',
    material: 'Shader_Arbol.002',
    position: [2.73, -4.28, -0.66],
    scale: 1.28,
    castShadow: true
  },
  {
    node: 'Object_2003',
    material: 'Shader_Arbol.003',
    position: [-15.5, -9.27, -0.45]
  },
  {
    node: 'Object_2004',
    material: 'Shader_Arbol.004',
    position: [-10.32, 15.41, -0.87],
    scale: 1.92
  },
  {
    node: 'Object_2005',
    material: 'Shader_Arbol.005',
    groupPosition: [-3.31, 1.92, 4.07],
    position: [-6.24, 1.49, -2.37],
    scale: 0.78
  },
  {
    node: 'Object_2006',
    material: 'Shader_Arbol.006',
    position: [3.09, -13.66, -0.56]
  },
  {
    node: 'Object_2007',
    material: 'Shader_Arbol.007',
    position: [-7.87, -10.37, -0.41],
    scale: 1.64
  },
  {
    node: 'Object_2008',
    material: 'Shader_Arbol.008',
    groupPosition: [4.39, 1.92, 4.67],
    position: [-6.24, 1.49, -2.37],
    scale: 0.78
  }
]

function Trees(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('models/trees.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      {TREES.map((tree) => (
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
    </group>
  )
}

export default memo(Trees)

useGLTF.preload('models/trees.glb')
