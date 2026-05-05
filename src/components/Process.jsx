const steps = [
  {
    number: '01',
    title: 'Discovery',
    body: 'Clarify your goals, audience, offer, and where the current site is losing momentum.',
  },
  {
    number: '02',
    title: 'Conversion Strategy',
    body: 'Map the structure, message, and user flow around what visitors need to understand, trust, and do.',
  },
  {
    number: '03',
    title: 'Design Direction',
    body: 'Create a refined visual system that feels like your brand and supports the sale, not just the screenshot.',
  },
  {
    number: '04',
    title: 'Build & Polish',
    body: 'Bring it to life with responsive development, clean interactions, and the details that make it feel trustworthy.',
  },
]

export default function Process() {
  return (
    <section id="process" className="process section-shell">
      <div className="process-top">
        <div className="section-intro reveal" data-reveal-speed="slow">
          <p className="eyebrow">Process</p>
          <h2>Data is the signal through the noise</h2>
          <p>
            Design is more than aesthetics. It's about building trust and driving the right people to action.
          </p>
        </div>
        <p className="process-note reveal">
          Every phase is designed to turn momentum into conversion.
        </p>
      </div>
      <ol className="process-steps">
        {steps.map((step, index) => (
          <li className="reveal" key={step.title}>
            <div className="process-node">
              <span className="process-number">{step.number}</span>
              <h3>{step.title}</h3>
            </div>
            <p>{step.body}</p>
            {index < steps.length - 1 && (
              <svg className="process-connector" viewBox="0 0 120 52" aria-hidden="true" focusable="false">
                <path d="M6 40 C 34 6, 86 6, 114 40" />
                <path d="M104 34 L114 40 L102 44" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
