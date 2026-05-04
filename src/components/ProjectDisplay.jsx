import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ProjectDisplay({ project }) {
  const stageRef = useRef(null)
  const slabRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const slab = slabRef.current
    if (!stage || !slab) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(slab, { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0, y: 0 })
      return undefined
    }

    gsap.set(slab, { opacity: 0, y: 60, rotateX: 62, rotateY: -18, rotateZ: -4, transformPerspective: 900 })

    const playIntro = () => {
      gsap.to(slab, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        duration: 1.05,
        ease: 'power3.out',
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        playIntro()
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    )

    observer.observe(stage)

    const onMove = (event) => {
      const rect = stage.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5

      gsap.to(slab, {
        rotateY: x * 18,
        rotateX: y * -13,
        rotateZ: x * 1.5,
        y: -8,
        duration: 0.45,
        ease: 'power3.out',
        transformPerspective: 900,
      })
    }

    const onLeave = () => {
      gsap.to(slab, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)

    return () => {
      observer.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <span ref={stageRef} className={`project-stage ${project.tone}`}>
      <span ref={slabRef} className="project-slab">
        <span className="project-slab-shadow" aria-hidden="true" />
        <span className="project-window">
          <span className="project-menu" aria-hidden="true" />
          <span className="project-screen">
            <img
              src={project.image}
              alt={`${project.title} website`}
              className="project-screenshot"
              loading="lazy"
            />
          </span>
        </span>
      </span>
    </span>
  )
}
