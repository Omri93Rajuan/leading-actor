import { useContactMaterial } from '@react-three/cannon'
import Floor from './elements/Floor'
import Man from './elements/Man'
import Trees from './elements/Trees'
import CV from './elements/CV'
import Logs from './elements/Logs'
import Sun from './elements/Sun'
import Interactables from './elements/Interactables'

export default function Game() {
  useContactMaterial('ground', 'player', {
    friction: 0.08,
    restitution: 0.02,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })
  useContactMaterial('solid', 'player', {
    friction: 0.46,
    restitution: 0.05,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })
  useContactMaterial('solid', 'solid', {
    friction: 0.62,
    restitution: 0.03,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  })

  return (
    <>
      <Floor rotation={[-Math.PI / 2, 0, 0]} material={'ground'} />
      <Man position={[8, 1, 1.5]} />
      <Trees />
      <Logs />
      <Interactables />
      <CV />
      <Sun />
    </>
  )
}
