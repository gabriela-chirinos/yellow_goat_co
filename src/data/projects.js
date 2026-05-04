import lustroCover from '../assets/projects/lustro.jpg'
import sokuCover from '../assets/projects/soku.jpg'
import panCover from '../assets/projects/pan.jpg'

export const projects = [
  {
    id: '01',
    title: 'Lustro Shoe Care',
    context: 'A polished homepage concept for a service-led product experience.',
    problem: 'The offer needed to feel sharper, calmer, and more trustworthy at a glance.',
    move: 'Editorial product framing, clear service value, and a polished visual rhythm.',
    linkLabel: 'Open live site',
    url: 'https://lustroshoecare.netlify.app/',
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
]

export const services = [
  {
    kicker: '01 / Launch',
    title: 'Launch Page',
    description:
      'You have an offer worth taking seriously. This gets it in front of people who will — designed and built to convert from day one.',
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
