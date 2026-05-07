import { Suspense, lazy, useEffect, useState } from 'react'

// Kick off the network fetch immediately — don't wait for React to render first
const signatureMarkImport = import('./SignatureMark.jsx')
const SignatureMark = lazy(() => signatureMarkImport)
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
          Websites for service businesses that need clearer positioning, stronger trust, and more qualified inquiries.
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
        <Suspense fallback={<div className="hero-visual" aria-hidden="true" />}>
          <SignatureMark />
        </Suspense>
      )}
    </section>
  )
}
