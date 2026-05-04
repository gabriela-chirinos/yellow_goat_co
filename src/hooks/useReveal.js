import { useEffect } from 'react'
import { gsap } from 'gsap'

export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = new WeakSet()
    let observer

    const getRevealConfig = (el) => {
      const speed = el.dataset.revealSpeed
      if (speed === 'slow') return { duration: 1.05, startY: 40 }
      if (speed === 'fast') return { duration: 0.55, startY: 20 }
      return { duration: 0.8, startY: 32 }
    }

    const reveal = (el) => {
      if (!el || el.dataset.revealed === 'true') return
      el.dataset.revealed = 'true'
      const { duration } = getRevealConfig(el)
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        ease: 'power3.out',
      })
    }

    if (reduce) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return undefined
    }

    const register = (el) => {
      if (!el || seen.has(el)) return
      seen.add(el)
      const { startY } = getRevealConfig(el)
      gsap.set(el, { opacity: 0, y: startY })
      observer.observe(el)
    }

    const revealVisible = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > -120) reveal(el)
      })
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '18% 0px 18% 0px', threshold: 0 }
    )

    document.querySelectorAll('.reveal').forEach(register)
    requestAnimationFrame(revealVisible)
    window.addEventListener('scroll', revealVisible, { passive: true })

    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll('.reveal').forEach(register)
      requestAnimationFrame(revealVisible)
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })
    const safety = window.setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(reveal)
    }, 2200)

    return () => {
      window.clearTimeout(safety)
      observer.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('scroll', revealVisible)
    }
  }, [])
}
