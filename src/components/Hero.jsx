import { Suspense, lazy } from 'react'
import hiremeUrl from '../assets/hireme.png'

const SignatureMark = lazy(() => import('./SignatureMark.jsx'))

export default function Hero() {
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
    </section>
  )
}
