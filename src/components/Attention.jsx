import { useEffect, useRef, useState } from 'react'

const pairs = [
  {
    rough: 'Traffic is coming in.',
    sharp: 'Inquiries are not.',
  },
  {
    rough: 'Your site looks fine.',
    sharp: "It's quietly costing you clients.",
  },
]

export default function Attention() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.28 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`attention-section ${visible ? 'is-visible' : ''}`}
      aria-label="Brand transition"
    >
      <div className="attention-inner">
        <div className="attention-frame">
          <p className="attention-kicker reveal">Most sites don't have a design problem. They have a conversion problem.</p>
          <p className="attention-note reveal">
            Visitors are landing. Reading. Leaving. The issue is not awareness — it is what happens after the click.
          </p>
        </div>

        <div className="attention-copy reveal" data-reveal-speed="slow">
          {pairs.map((pair, index) => (
            <div className="attention-pair" key={pair.sharp}>
              <span className="attention-rough" style={{ '--i': index }}>
                {pair.rough}
              </span>
              <span className="attention-mark" aria-hidden="true" style={{ '--i': index }} />
              <span className="attention-sharp" style={{ '--i': index }}>
                {pair.sharp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
