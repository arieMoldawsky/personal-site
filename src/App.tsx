import { ParticleField } from './components/ParticleField'
import { Verbs } from './components/Verbs'
import { corners, name } from './content'

export default function App() {
  return (
    <main className="stage">
      <ParticleField />
      <div className="grain" aria-hidden="true" />

      <span className="corner corner--tl">{corners.topLeft}</span>
      <span className="corner corner--tr">{corners.topRight}</span>
      <span className="corner corner--bl">© {new Date().getFullYear()}</span>
      <span className="corner corner--br">{corners.bottomRight}</span>

      <div className="ident">
        <h1 className="ident__name">{name}</h1>
        <Verbs />
      </div>
    </main>
  )
}
