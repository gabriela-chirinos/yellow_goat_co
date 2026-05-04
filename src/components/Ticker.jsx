const disciplines = [
  { text: 'Strategy',     filled: true  },
  { text: 'Web Design',   filled: false },
  { text: 'Build',        filled: true  },
  { text: 'Launch Page',  filled: false },
  { text: 'Site Redesign',filled: true  },
  { text: 'Custom Build', filled: false },
  { text: 'Motion',       filled: true  },
  { text: 'Brand Work',   filled: false },
]

function TickerItem({ text, filled }) {
  return (
    <span className="ticker-item">
      <span className={`ticker-text ${filled ? 'filled' : 'outline'}`}>{text}</span>
      <span className="ticker-dot" aria-hidden="true" />
    </span>
  )
}

export default function Ticker() {
  const items = [...disciplines, ...disciplines]
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {items.map((item, i) => (
          <TickerItem key={i} text={item.text} filled={item.filled} />
        ))}
      </div>
    </div>
  )
}
