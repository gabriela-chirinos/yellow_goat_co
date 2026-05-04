import { useEffect, useState } from 'react'
import iconUrl from '../assets/menu-icon.png'

const links = [
  ['Work', '#work'],
  ['Services', '#services'],
  ['Fit', '#fit'],
  ['Process', '#process'],
  ['Inquiry', '#contact'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="Yellow Goat Co. home">
          <span>Yellow Goat Co.</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-action">
          <a className="nav-cta" href="#contact">
            Start a Project
          </a>
          <span className="desktop-nav-icon" aria-hidden="true">
            <img src={iconUrl} alt="" />
          </span>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <img src={iconUrl} alt="" />
        </button>
      </header>

      <div
        className={`menu-panel ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false)
        }}
      >
        <div className="menu-panel-inner">
          <div className="menu-panel-top">
            <img src={iconUrl} alt="" />
            <p>Intentional websites for businesses ready to be chosen.</p>
          </div>
          <nav className="menu-links" aria-label="Mobile navigation">
            {links.map(([label, href], index) => (
              <a
                key={href}
                href={href}
                style={{ '--menu-i': index }}
                onClick={() => setOpen(false)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {label}
              </a>
            ))}
          </nav>
          <a className="menu-contact" href="#contact" onClick={() => setOpen(false)}>
            Start a Project
          </a>
        </div>
      </div>
    </>
  )
}
