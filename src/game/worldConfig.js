export const PLAYER_CONFIG = {
  radius: 0.36,
  lowerSphereY: 0.46,
  upperSphereY: 1.2,
  visualGroundOffset: 0.02,
  walkSpeed: 3.4,
  runSpeed: 5.9,
  jumpSpeed: 5.35,
  airControl: 0.35,
  rotationSpeed: 12,
  groundedDot: 0.46,
  groundedGraceMs: 140
}

export const TREE_ROTATION = [-Math.PI / 2, 0, 0]

export const TREE_VISUALS = [
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

export const TREE_COLLIDERS = [
  { id: 'tree-1-root', position: [3.35, 0.4, -3.82], radius: 0.66, height: 0.8 },
  { id: 'tree-1-trunk', position: [3.35, 1.25, -3.82], radius: 0.43, height: 2.3 },
  { id: 'tree-2-root', position: [-6.47, 0.4, -5.29], radius: 0.7, height: 0.8 },
  { id: 'tree-2-trunk', position: [-6.47, 1.28, -5.29], radius: 0.47, height: 2.35 },
  { id: 'tree-3-root', position: [2.73, 0.45, 4.28], radius: 0.78, height: 0.9 },
  { id: 'tree-3-trunk', position: [2.73, 1.45, 4.28], radius: 0.52, height: 2.65 },
  { id: 'tree-4-root', position: [-15.5, 0.42, 9.27], radius: 0.7, height: 0.84 },
  { id: 'tree-4-trunk', position: [-15.5, 1.28, 9.27], radius: 0.46, height: 2.38 },
  { id: 'tree-5-root', position: [-10.32, 0.5, -15.41], radius: 1.0, height: 1.0 },
  { id: 'tree-5-trunk', position: [-10.32, 1.72, -15.41], radius: 0.7, height: 3.25 },
  { id: 'tree-6-root', position: [-9.55, 0.38, 2.58], radius: 0.64, height: 0.76 },
  { id: 'tree-6-trunk', position: [-9.55, 1.18, 2.58], radius: 0.42, height: 2.2 },
  { id: 'tree-7-root', position: [3.09, 0.4, 13.66], radius: 0.72, height: 0.8 },
  { id: 'tree-7-trunk', position: [3.09, 1.3, 13.66], radius: 0.48, height: 2.4 },
  { id: 'tree-8-root', position: [-7.87, 0.48, 10.37], radius: 0.9, height: 0.96 },
  { id: 'tree-8-trunk', position: [-7.87, 1.55, 10.37], radius: 0.6, height: 2.95 },
  { id: 'tree-9-root', position: [-1.85, 0.38, 3.18], radius: 0.64, height: 0.76 },
  { id: 'tree-9-trunk', position: [-1.85, 1.18, 3.18], radius: 0.42, height: 2.2 }
]

export const LOGS = [
  {
    id: 'starter-log',
    position: [6.2, 0.38, -5.2],
    rotation: [0, 0, Math.PI / 2],
    length: 3.8,
    radius: 0.38,
    color: '#755436'
  },
  {
    id: 'cross-log',
    position: [9.2, 0.44, -7.2],
    rotation: [0, -0.85, Math.PI / 2],
    length: 3.1,
    radius: 0.43,
    color: '#5d4028'
  },
  {
    id: 'jump-log',
    position: [11.2, 0.58, -4.9],
    rotation: [0, 0.35, Math.PI / 2],
    length: 2.8,
    radius: 0.54,
    color: '#8a6644'
  }
]

export const PUSHABLES = [
  { id: 'crate-a', type: 'crate', position: [4.1, 0.55, 2.7], size: [0.9, 0.9, 0.9], mass: 2.6, color: '#9b6b43' },
  { id: 'crate-b', type: 'crate', position: [5.6, 0.55, 3.9], size: [0.8, 0.8, 0.8], mass: 2.1, color: '#6f5137' },
  { id: 'stone-a', type: 'stone', position: [-3.8, 0.58, 1.6], radius: 0.55, mass: 3.2, color: '#8f9792' }
]

export const BREAKABLES = [
  { id: 'break-a', position: [1.6, 0.58, -6.1], size: [0.95, 0.95, 0.95], threshold: 3.6, color: '#b77946' },
  { id: 'break-b', position: [2.8, 0.5, -7.2], size: [0.8, 0.8, 0.8], threshold: 3.2, color: '#93613c' }
]

export const CLIMBABLES = [
  { id: 'step-1', position: [-4.8, 0.16, -3.7], size: [1.2, 0.32, 1.2], color: '#697561' },
  { id: 'step-2', position: [-6.05, 0.34, -3.7], size: [1.2, 0.68, 1.2], color: '#75816b' },
  { id: 'step-3', position: [-7.3, 0.54, -3.7], size: [1.2, 1.08, 1.2], color: '#879279' },
  { id: 'lookout', position: [-8.9, 0.88, -3.7], size: [2.1, 0.28, 2.1], color: '#596451' },
  { id: 'ramp', position: [-5.9, 0.35, -1.8], size: [3.2, 0.28, 1.2], rotation: [0, 0, -0.28], color: '#7a6a52' }
]
