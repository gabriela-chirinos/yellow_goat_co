import lustroCover from '../assets/projects/lustro.jpg'
import sokuCover from '../assets/projects/soku.jpg'
import panCover from '../assets/projects/pan.jpg'
import lumiereCover from '../assets/projects/nailsalon.jpg'
import portalCover from '../assets/projects/portal.jpg'
import danielsCover from '../assets/projects/daniels.jpg'

export const projects = [
  {
    id: '01',
    title: 'Lustro Shoe Care',
    context: 'A polished homepage concept for a service-led product experience.',
    problem: 'The offer needed to feel sharper, calmer, and more trustworthy at a glance.',
    move: 'Editorial product framing, clear service value, and a polished visual rhythm.',
    linkLabel: 'View on GitHub',
    url: 'https://github.com/gabriela-chirinos/Lustro_Project',
    tone: 'lustro',
    image: lustroCover,
  },
  {
    id: '02',
    title: 'Soku Fitness Coach',
    context: 'A homepage direction for an expert-led service with a direct path to action.',
    problem: 'The offer needed clarity, confidence, and a better story.',
    move: 'Structured the experience around transformation, trust, and inquiry intent.',
    linkLabel: 'Open case study',
    url: 'https://gabriela-chirinos.github.io/fitnessCoach_casestudy/',
    tone: 'soku',
    offset: true,
    image: sokuCover,
  },
  {
    id: '03',
    title: 'Pan Bakery',
    context: 'A warm homepage concept with memorable pacing and a clear visual world.',
    problem: 'The brand needed appetite, detail, and a stronger sense of place.',
    move: 'Built a calm visual system with intentional moments of motion and product focus.',
    linkLabel: 'Open live site',
    url: 'https://gabriela-chirinos.github.io/japaneseBakery/',
    tone: 'pan',
    image: panCover,
  },
  {
    id: '04',
    title: 'Lumière Nail Atelier',
    context: 'A refined homepage concept for a boutique nail atelier with luxury positioning.',
    problem: 'The experience needed to feel as elevated as the service — editorial, precise, and appointment-driven.',
    move: 'Warm photography, editorial type, and a direct path to booking built around service confidence.',
    linkLabel: 'Open live site',
    url: 'https://gabriela-chirinos.github.io/nailSalon',
    tone: 'lumiere',
    image: lumiereCover,
  },
  {
    id: '05',
    title: "Daniel's Plumbing & Air",
    context: 'A conversion-focused redesign concept for an 18-year-old Austin service business with 2,597 Google reviews.',
    problem: 'A 12-field contact form was blocking 40–60% of inbound leads. Their best trust signals were invisible.',
    move: 'Rebuilt the hero around a 4-field booking form, surfaced 2,597 reviews above the fold, and restructured for mobile-first service calls.',
    linkLabel: 'Open concept',
    url: 'https://gabriela-chirinos.github.io/daniels-plumbing-concept/',
    tone: 'daniels',
    image: danielsCover,
  },
  {
    id: '06',
    title: 'EL Portal',

    context: 'A structured mockup for a content-forward portal experience with clear navigation.',
    problem: 'The layout needed to organize dense information without losing hierarchy or direction.',
    move: 'Clean sectioning, intentional type scale, and a visual flow that guides without overwhelming.',
    linkLabel: 'Open live site',
    url: 'https://gabriela-chirinos.github.io/EL_Portal_Mockup/',
    tone: 'portal',
    image: portalCover,
  },
]

export const services = [
  {
    kicker: '01 / Launch',
    title: 'Launch Page',
    description:
      'You have an offer worth taking seriously. This gets it in front of the right people with a page built for clarity, trust, and action.',
    items: ['Offer structure and page strategy', 'Responsive design and build', 'Inquiry or booking path'],
    note: 'Scoped after inquiry',
  },
  {
    kicker: '02 / Sharpen',
    title: 'Site Redesign',
    description:
      'Your work is strong. Your site is the reason clients hesitate. This fixes the gap — without starting from scratch or losing what\'s already working.',
    items: ['Trust-first page hierarchy', 'Visual redesign and copy structure', 'Launch support and QA'],
    note: 'Best fit for most businesses',
    featured: true,
  },
  {
    kicker: '03 / Custom',
    title: 'Custom Build',
    description:
      'When a template would be a ceiling, not a starting point. Built from scratch — around your structure, your logic, and how your buyers actually make decisions.',
    items: ['Custom interaction direction', 'Multi-page build', 'Performance-minded implementation'],
    note: 'Built to scope',
  },
]
