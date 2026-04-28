import { useEffect, useState } from 'react'

const INPUT_KEYS = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  Space: 'jump'
}

const INITIAL_INPUT = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  shift: false,
  jump: false
}

export const useInput = () => {
  const [input, setInput] = useState(INITIAL_INPUT)

  useEffect(() => {
    const setKey = (code, isPressed) => {
      const inputName = INPUT_KEYS[code]

      if (!inputName) {
        return
      }

      setInput((current) => {
        if (current[inputName] === isPressed) {
          return current
        }

        return { ...current, [inputName]: isPressed }
      })
    }

    const handleKeyDown = (e) => {
      if (INPUT_KEYS[e.code]) {
        e.preventDefault()
      }

      setKey(e.code, true)
    }

    const handleKeyUp = (e) => {
      if (INPUT_KEYS[e.code]) {
        e.preventDefault()
      }

      setKey(e.code, false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return input
}
