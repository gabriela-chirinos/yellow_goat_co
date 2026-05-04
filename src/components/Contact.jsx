import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  business: '',
  website: '',
  serviceType: '',
  projectType: '',
  budget: '',
  timeline: '',
  goals: '',
}

const serviceTypes = [
  'Service business',
  'Consulting or expert-led business',
  'Local or appointment-based business',
  'Boutique firm or agency',
  'Other premium business',
]

const projectTypes = [
  'Launch page',
  'Website redesign',
  'Custom website',
  'Front-end implementation',
]

const timelines = [
  '3-4 days',
  '1-2 weeks',
  '2+ weeks',
  'Just exploring',
]

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [note, setNote] = useState({ type: '', text: 'A few details now make our first conversation flow smoothly.' })

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitInquiry = (event) => {
    event.preventDefault()
    const words = form.goals.trim().split(/\s+/).filter(Boolean)

    if (words.length < 12) {
      setNote({ type: 'error', text: 'Give me a little more context so I can understand what needs to change.' })
      return
    }

    const subject = encodeURIComponent(`Yellow Goat Co. inquiry from ${form.business || form.name}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Business: ${form.business}`,
        `Website: ${form.website || 'Not provided'}`,
        `Service type: ${form.serviceType}`,
        `Project type: ${form.projectType}`,
        `Budget: ${form.budget}`,
        `Timeline: ${form.timeline}`,
        '',
        'Goals:',
        form.goals,
      ].join('\n')
    )

    setNote({ type: 'success', text: 'Inquiry ready. Opening an email with your project details.' })
    window.location.href = `mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  const renderChipGroup = (name, legend, options) => (
    <fieldset className="choice-field">
      <legend>{legend}</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <label key={option} className="choice-chip">
            <input
              type="radio"
              name={name}
              value={option}
              required
              checked={form[name] === option}
              onChange={updateField}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )

  return (
    <section id="contact" className="contact section-shell">
      <div className="contact-layout">
        <div className="contact-left reveal">
          <p className="contact-display">Let's<br />Chat.</p>
          <div className="contact-avail-wrap" aria-label="Availability status">
            <div className="contact-avail-track">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="contact-avail-item">
                  <span className="contact-avail-dot" />
                  Available · Open to New Work
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="contact-right reveal">
          <form className="inquiry-form" onSubmit={submitInquiry}>
            <div className="form-heading">
              <p className="form-kicker">Project Inquiry</p>
              <h2>Tell me what is changing.</h2>
              <p>
                Share the useful stuff first: who you serve, what feels off, and where the site needs to pull more weight.
              </p>
            </div>

            <div className="form-row">
              <label className="form-label">
                Name
                <input name="name" autoComplete="name" required value={form.name} onChange={updateField} />
              </label>
              <label className="form-label">
                Email
                <input type="email" name="email" autoComplete="email" required value={form.email} onChange={updateField} />
              </label>
            </div>
            <div className="form-row">
              <label className="form-label">
                Business name
                <input name="business" required value={form.business} onChange={updateField} />
              </label>
              <label className="form-label">
                Current website
                <input type="url" name="website" placeholder="https://" value={form.website} onChange={updateField} />
              </label>
            </div>

            {renderChipGroup('serviceType', 'Service type', serviceTypes)}
            {renderChipGroup('projectType', 'Project type', projectTypes)}

            <div className="form-row">
              <label className="form-label">
                Budget comfort zone
                <input
                  name="budget"
                  required
                  placeholder="Whatever range feels comfortable to share"
                  value={form.budget}
                  onChange={updateField}
                />
              </label>
              {renderChipGroup('timeline', 'Timeline', timelines)}
            </div>
            <label className="form-label">
              What needs to change?
              <textarea
                name="goals"
                rows="6"
                required
                placeholder="Share the offer, what isn't working, and what a better site should fix."
                value={form.goals}
                onChange={updateField}
              />
            </label>
            <p className={`form-note ${note.type ? `is-${note.type}` : ''}`}>{note.text}</p>
            <button className="button button-primary" type="submit">
              Start the Conversation
            </button>
          </form>
        </div>
      </div>

    </section>
  )
}
