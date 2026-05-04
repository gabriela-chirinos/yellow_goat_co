import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Attention from './components/Attention.jsx'
import Work from './components/Work.jsx'
import Services from './components/Services.jsx'
import Fit from './components/Fit.jsx'
import Process from './components/Process.jsx'
import Philosophy from './components/Philosophy.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useReveal } from './hooks/useReveal.js'

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Attention />
        <Work />
        <Services />
        <Fit />
        <Process />
        <Philosophy />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
