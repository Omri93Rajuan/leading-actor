/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\public\\models\\trees.glb
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('models/trees.glb')
  return (
    <group ref={group} {...props} dispose={null}>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2.geometry} material={materials.Shader_Arbol} position={[3.35, 3.82, -0.41]} scale={0.7} />
    </group>
    <group position={[-3.18, 0.03, 4.53]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2001.geometry} material={materials['Shader_Arbol.001']} position={[-3.29, 9.82, -0.5]} />
    </group>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2002.geometry} material={materials['Shader_Arbol.002']} position={[2.73, -4.28, -0.66]} scale={1.28} />
    </group>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2003.geometry} material={materials['Shader_Arbol.003']} position={[-15.5, -9.27, -0.45]} />
    </group>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2004.geometry} material={materials['Shader_Arbol.004']} position={[-10.32, 15.41, -0.87]} scale={1.92} />
    </group>
    <group position={[-3.31, 1.92, 4.07]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2005.geometry} material={materials['Shader_Arbol.005']} position={[-6.24, 1.49, -2.37]} scale={0.78} />
    </group>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2006.geometry} material={materials['Shader_Arbol.006']} position={[3.09, -13.66, -0.56]} />
    </group>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2007.geometry} material={materials['Shader_Arbol.007']} position={[-7.87, -10.37, -0.41]} scale={1.64} />
    </group>
    <group position={[4.39, 1.92, 4.67]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh castShadow geometry={nodes.Object_2008.geometry} material={materials['Shader_Arbol.008']} position={[-6.24, 1.49, -2.37]} scale={0.78} />
    </group>
  </group>
  )
}

useGLTF.preload('models/trees.glb')