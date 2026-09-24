import { useEffect, useState } from 'react'
import { verbs } from '../content'

// Types one verb, holds, erases, moves to the next.
export function Verbs() {
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [erasing, setErasing] = useState(false)
  const word = verbs[i]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLen(word.length)
      return
    }
    let delay = erasing ? 45 : 95
    if (!erasing && len === word.length) delay = 2400
    if (erasing && len === 0) delay = 400
    const id = setTimeout(() => {
      if (!erasing && len === word.length) setErasing(true)
      else if (erasing && len === 0) {
        setErasing(false)
        setI((i + 1) % verbs.length)
      } else setLen(len + (erasing ? -1 : 1))
    }, delay)
    return () => clearTimeout(id)
  }, [len, erasing, i, word])

  return (
    <p className="verbs" aria-label={verbs.join(', ')}>
      <span className="verbs__prompt">&gt;</span> {word.slice(0, len)}
      <span className="verbs__caret" />
    </p>
  )
}
