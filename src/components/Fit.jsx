const proofItems = [
  [
    '01',
    'High traffic. Low intent.',
    'People are finding you. They are landing, looking around, and disappearing. Something on the path is breaking trust before it can build. Data reveals the invisible leaks in your funnel.',
  ],
  [
    '02',
    'Strong offer. Silent exit.',
    "If your site does not answer your customers' quiet objections around price, process, or fit, they move on. Silence is not always a no. Sometimes it is a missed chance to build trust.",
  ],
  [
    '03',
    'Find the Hidden Revenue.',
    'Every unconverted visitor has a cost. We pinpoint the friction points — from messaging to mechanics — so the site can do a better job turning interest into inquiry.',
  ],
]

export default function Fit() {
  return (
    <section id="fit" className="fit section-shell">
      <div className="fit-copy reveal" data-reveal-speed="slow">
        <p className="eyebrow">Who it is for</p>
        <h2>For businesses with real traction and a site that isn’t keeping up.</h2>
        <p>
          You have momentum offline, in referrals, or in your existing audience. But online, too many visitors are
          leaving before they understand why they should choose you.
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
