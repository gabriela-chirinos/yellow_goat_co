const proofItems = [
  [
    '01',
    'High traffic. Low intent.',
    'People are finding you. They are landing, looking around, and disappearing. Something on the path is breaking trust before it can build. Data reveals the invisible leaks in your funnel.',
  ],
  [
    '02',
    'Strong offer. Silent exit.',
    'If your site does not answer your customers quiet objections, on price, process or fit, usually users move on. Silence isn’t a "no" it’s a missed opportunity to build trust.`'
  ],
  [
    '03',
    'Find the Hidden Revenue.',
    'Every unconverted visitor is a real cost. We pinpoint the friction points — from messaging to mechanics, stop the drop-off and turn traffic into profit.',
  ],
]

export default function Fit() {
  return (
    <section id="fit" className="fit section-shell">
      <div className="fit-copy reveal" data-reveal-speed="slow">
        <p className="eyebrow">Who it is for</p>
        <h2>For businesses with real traction and a site that isn’t keeping up.</h2>
        <p>
          You've built momentum in the real world, but on the screen, you’re watching authority (and revenue) slip through the cracks.
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
