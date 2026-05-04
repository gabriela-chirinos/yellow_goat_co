import { Suspense, lazy, useEffect, useState } from 'react'
import hiremeUrl from '../assets/hireme.png'

const SignatureMark = lazy(() => import('./SignatureMark.jsx'))
const HERO_VISUAL_QUERY = '(min-width: 1100px)'

function useHeroVisual() {
  const [showVisual, setShowVisual] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia(HERO_VISUAL_QUERY).matches : true
  ))

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const query = window.matchMedia(HERO_VISUAL_QUERY)
    const updateVisual = () => setShowVisual(query.matches)

    updateVisual()
    query.addEventListener('change', updateVisual)
    return () => query.removeEventListener('change', updateVisual)
  }, [])

  return showVisual
}

export default function Hero() {
  const showVisual = useHeroVisual()

  return (
    <section id="top" className="hero section-shell">
      <div className="hero-copy">
        <p className="eyebrow reveal">Yellow Goat Co. / Solo web studio</p>
        <h1 className="hero-title reveal" data-reveal-speed="slow">DESIGN IS INTELLIGENCE MADE VISIBLE.</h1>
        <p className="hero-subtitle reveal">
          Building digital experiences that help businesses connect with their customers.
        </p>
        <div className="hero-actions reveal">
          <a className="button button-primary" href="#contact">
            Start a Project
          </a>
          <a className="button button-secondary" href="#work">
            View the Work
          </a>
        </div>
      </div>
      {showVisual && (
        <Suspense
          fallback={
            <div className="hero-visual reveal hero-visual-fallback" aria-label="Yellow Goat Co. brand mark">
              <div className="fallback-mark">YG</div>
              <img src={hiremeUrl} alt="Hire me — Yellow Goat Co." className="hero-badge" />
            </div>
          }
        >
          <SignatureMark />
        </Suspense>
      )}
    </section>
  )
}
