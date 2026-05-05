import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { projects } from '../data/projects.js'
import ProjectDisplay from './ProjectDisplay.jsx'

const CYCLE_INTERVAL = 3000

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const cardRef = useRef(null)
  const visualRef = useRef(null)
  const metaRef = useRef(null)
  const animatingRef = useRef(false)
  const activeProject = projects[activeIndex]

  const showProject = (nextIndex) => {
    if (nextIndex === activeIndex || animatingRef.current) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setActiveIndex(nextIndex)
      return
    }

    const card = cardRef.current
    const visual = visualRef.current
    const meta = metaRef.current
    if (!card || !visual || !meta) {
      setActiveIndex(nextIndex)
      return
    }

    animatingRef.current = true

    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          animatingRef.current = false
        },
      })
      .to(visual, {
        y: 72,
        rotateX: 18,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.34,
        ease: 'power2.in',
      })
      .to(
        meta,
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.22,
          ease: 'power2.in',
        },
        '<'
      )
      .add(() => {
        setActiveIndex(nextIndex)
      })
      .set(card, { transformPerspective: 1200 })
      .fromTo(
        visual,
        {
          y: -118,
          rotateX: -24,
          rotateZ: nextIndex % 2 === 0 ? -1.4 : 1.4,
          scale: 1.035,
          autoAlpha: 0,
          transformOrigin: '50% 0%',
        },
        {
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.74,
        }
      )
      .fromTo(
        meta,
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.52 },
        '-=0.42'
      )
  }

  const showNext = () => {
    showProject((activeIndex + 1) % projects.length)
  }

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      showProject((activeIndex + 1) % projects.length)
    }, CYCLE_INTERVAL)

    return () => window.clearInterval(timer)
  }, [activeIndex, isPaused])

  return (
    <section id="work" className="work section-shell">
      <div className="section-intro reveal" data-reveal-speed="slow">
        <p className="eyebrow">Selected work</p>
        <h2>Influence that precedes presence</h2>
        <p>
      We don't just build sites, we engineer perspectives. Through sharp positioning and thoughtful design, we move visitors from curiosity to conviction.
        </p>
      </div>

      <div
        className="work-viewer reveal"
      >
        <div className="work-index" aria-label="Selected work projects">
          {projects.map((project, index) => (
            <button
              key={project.id}
              className={`work-index-button ${index === activeIndex ? 'is-active' : ''}`}
              type="button"
              onClick={() => {
                setIsPaused(true)
                showProject(index)
              }}
              aria-pressed={index === activeIndex}
            >
              <span>{project.id}</span>
              <span className="work-index-title">{project.title}</span>
            </button>
          ))}
        </div>

        <article ref={cardRef} className="project-card project-card-featured" aria-live="polite">
          <div ref={visualRef} className="work-rolodex-card">
            <a
              className={`project-visual ${activeProject.tone}`}
              href={activeProject.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${activeProject.title} — opens in new tab`}
            >
              <ProjectDisplay project={activeProject} />
            </a>
          </div>
          <div ref={metaRef} className="project-meta">
            <p className="project-number">{activeProject.id}</p>
            <h3>{activeProject.title}</h3>
            <p className="project-context">{activeProject.context}</p>
            <dl>
              <div>
                <dt>Problem</dt>
                <dd>{activeProject.problem}</dd>
              </div>
              <div>
                <dt>Move</dt>
                <dd>{activeProject.move}</dd>
              </div>
            </dl>
            <div className="work-actions">
              <a
                className="work-next work-next--ghost"
                href={activeProject.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${activeProject.linkLabel} — opens in new tab`}
                onFocus={() => setIsPaused(true)}
                onMouseEnter={() => setIsPaused(true)}
              >
                {activeProject.linkLabel}
              </a>
              <button
                className="work-next"
                type="button"
                onClick={() => {
                  setIsPaused(true)
                  showNext()
                }}
              >
                Next project
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
