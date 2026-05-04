const proofItems = [
  [
    '01',
    'Your offer has matured',
    'You are not trying to look legitimate for the first time. You need a site that reflects the depth, clarity, and value already present in the business.',
  ],
  [
    '02',
    'Your clients need context',
    'Premium buyers want to understand your approach before they reach out. The site makes your process, standards, and fit easier to trust.',
  ],
  [
    '03',
    'Your business grew. Your online presence should too.',
    'Instead of acting like a digital brochure, your website should guide decisions, answer quiet objections, and make inquiry feel like the natural next step.',
  ],
]

export default function Fit() {
  return (
    <section id="fit" className="fit section-shell">
      <div className="fit-copy reveal" data-reveal-speed="slow">
        <p className="eyebrow">Who it is for</p>
        <h2>For businesses doing great work with a website that isn’t.</h2>
        <p>
          Yellow Goat Co. is for service-based businesses with strong work, real client trust, and a site that is not
          doing enough to translate that value online.
        </p>
      </div>
      <div className="proof-list reveal">
        {proofItems.map(([number, title, body]) => (
          <div key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
