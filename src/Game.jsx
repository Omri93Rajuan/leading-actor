import { Debug, useContactMaterial } from '@react-three/cannon'
import Floor from './elements/Floor'
import Man from './elements/Man'
import { useControls } from 'leva'
import Trees from './elements/Trees'
import CV from './elements/CV'


function ToggleDebug({ children }) {
  const debugRendererVisible = useControls('Debug Renderer', { visible: false })

  return <>{debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}</>
}

export default function Game() {
  useContactMaterial('ground', 'slippery', {
    friction: 0,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })

  return (
    <>
      <ToggleDebug>
        <Floor rotation={[-Math.PI / 2, 0, 0]} material={'ground'} />
        <Man position={[0, 1, 0]} linearDamping={0.95} material={'slippery'} />
        <Trees/>
        <CV/>

      </ToggleDebug>
    </>
  )
}
