import { useEffect, useRef, useState } from 'react'

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
  { value: 'Service business', short: 'Service biz' },
  { value: 'Consulting or expert-led business', short: 'Expert-led' },
  { value: 'Local or appointment-based business', short: 'Local appt.' },
  { value: 'Boutique firm or agency', short: 'Boutique firm' },
  { value: 'Other premium business', short: 'Other premium' },
]

const projectTypes = [
  { value: 'Launch page', short: 'Launch' },
  { value: 'Website redesign', short: 'Redesign' },
  { value: 'Custom website', short: 'Custom' },
  { value: 'Front-end implementation', short: 'Frontend build' },
]

const timelines = [
  { value: '3-4 days', short: '3-4 days' },
  { value: '1-2 weeks', short: '1-2 weeks' },
  { value: '2+ weeks', short: '2+ weeks' },
  { value: 'Just exploring', short: 'Exploring' },
]

const mobileSteps = [
  { id: 'name', kicker: 'Start', title: 'What should I call you?', hint: 'Just your first name is fine.' },
  { id: 'email', kicker: 'Reply to', title: 'Where should I reply?', hint: 'Use the email you actually check.' },
  { id: 'business', kicker: 'Context', title: 'What business is this for?', hint: 'A business, studio, practice, or offer name is enough.' },
  { id: 'goals', kicker: 'The real ask', title: 'What needs to change?', hint: 'Give me the friction, the offer, and what a better site should make easier.' },
  { id: 'serviceType', kicker: 'Optional', title: 'What kind of business is it?', hint: 'Skip this if none of these feel quite right.' },
  { id: 'projectType', kicker: 'Optional', title: 'What kind of project are you imagining?', hint: 'A best guess is enough.' },
  { id: 'timeline', kicker: 'Optional', title: 'What timeline feels true?', hint: 'No pressure. This just frames urgency.' },
  { id: 'budget', kicker: 'Optional', title: 'Any budget range worth naming?', hint: 'A rough comfort zone is more useful than a perfect number.' },
  { id: 'website', kicker: 'Optional', title: 'Is there a current site?', hint: 'Drop a URL if there is one.' },
  { id: 'review', kicker: 'Ready', title: 'Everything look right?', hint: 'Hit send and your details will arrive pre-filled — ready to go.' },
]

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export default function Contact() {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'yellowgoatcreative@gmail.com'
  const desktopGoalsRef = useRef(null)
  const mobileGoalsRef = useRef(null)
  const mobileStepRef = useRef(null)
  const detailsTouchedRef = useRef(false)
  const [form, setForm] = useState(initialForm)
  const [note, setNote] = useState({ type: '', text: 'Your details will arrive pre-filled — just hit send.' })
  const [mobileStep, setMobileStep] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 681px)').matches : true
  ))

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const query = window.matchMedia('(min-width: 681px)')
    const updateDetails = () => {
      if (!detailsTouchedRef.current) setDetailsOpen(query.matches)
    }

    updateDetails()
    query.addEventListener('change', updateDetails)
    return () => query.removeEventListener('change', updateDetails)
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (note.type === 'error') setNote({ type: '', text: 'Your details will arrive pre-filled — just hit send.' })
  }

  const setMobileChoice = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    if (note.type === 'error') setNote({ type: '', text: 'Your details will arrive pre-filled — just hit send.' })
  }

  const validateStep = (stepId) => {
    if (stepId === 'name' && !form.name.trim()) return 'Add your name first.'
    if (stepId === 'email') {
      if (!form.email.trim()) return 'Add an email so I know where to reply.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Use a complete email address.'
    }
    if (stepId === 'business' && !form.business.trim()) return 'Add the business or offer name.'
    if (stepId === 'goals' && countWords(form.goals) < 12) {
      return 'Give me a little more context so I can understand what needs to change.'
    }
    return ''
  }

  const goToMobileStep = (nextStep) => {
    setMobileStep(nextStep)
    setNote({ type: '', text: 'Your details will arrive pre-filled — just hit send.' })
    window.requestAnimationFrame(() => {
      mobileStepRef.current?.focus()
    })
  }

  const nextMobileStep = () => {
    const current = mobileSteps[mobileStep]
    const error = validateStep(current.id)

    if (error) {
      setNote({ type: 'error', text: error })
      if (current.id === 'goals') mobileGoalsRef.current?.focus()
      return
    }

    goToMobileStep(Math.min(mobileStep + 1, mobileSteps.length - 1))
  }

  const handleMobileSubmit = (event) => {
    if (mobileStep < mobileSteps.length - 1) {
      event.preventDefault()
      nextMobileStep()
      return
    }

    submitInquiry(event, 'mobile')
  }

  const previousMobileStep = () => {
    goToMobileStep(Math.max(mobileStep - 1, 0))
  }

  const submitInquiry = (event, source = 'desktop') => {
    event.preventDefault()

    const requiredSteps = ['name', 'email', 'business', 'goals']
    const firstErrorStep = requiredSteps.find((stepId) => validateStep(stepId))
    if (firstErrorStep) {
      const error = validateStep(firstErrorStep)
      setNote({ type: 'error', text: error })
      if (source === 'mobile') {
        setMobileStep(mobileSteps.findIndex((step) => step.id === firstErrorStep))
        window.requestAnimationFrame(() => {
          if (firstErrorStep === 'goals') mobileGoalsRef.current?.focus()
          else mobileStepRef.current?.focus()
        })
      } else if (firstErrorStep === 'goals') {
        desktopGoalsRef.current?.focus()
      }
      return
    }

    if (countWords(form.goals) < 12) {
      setNote({ type: 'error', text: 'Give me a little more context so I can understand what needs to change.' })
      if (source === 'mobile') {
        setMobileStep(mobileSteps.findIndex((step) => step.id === 'goals'))
        window.requestAnimationFrame(() => mobileGoalsRef.current?.focus())
      } else {
        desktopGoalsRef.current?.focus()
      }
      return
    }

    const subject = encodeURIComponent(`Yellow Goat Co. inquiry from ${form.business || form.name}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Business: ${form.business}`,
        `Website: ${form.website || 'Not provided'}`,
        `Service type: ${form.serviceType || 'Not provided'}`,
        `Project type: ${form.projectType || 'Not provided'}`,
        `Budget: ${form.budget || 'Not provided'}`,
        `Timeline: ${form.timeline || 'Not provided'}`,
        '',
        'Goals:',
        form.goals,
      ].join('\n')
    )

    setNote({ type: 'success', text: 'Your email app should open with everything filled in — just hit send.' })
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }

  const renderSelect = (name, label, options) => (
    <label className="form-label">
      {label}
      <select name={name} value={form[name]} onChange={updateField}>
        <option value="">Not sure yet</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.value}</option>
        ))}
      </select>
    </label>
  )

  const renderMobileChoices = (name, options) => (
    <div className="mobile-choice-list" role="radiogroup" aria-label={mobileSteps[mobileStep].title}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`mobile-choice ${form[name] === option.value ? 'is-selected' : ''}`}
          aria-pressed={form[name] === option.value}
          onClick={() => setMobileChoice(name, option.value)}
        >
          <span>{option.value}</span>
        </button>
      ))}
    </div>
  )

  const renderMobileStepField = () => {
    const step = mobileSteps[mobileStep]

    if (step.id === 'name') {
      return (
        <input
          name="name"
          autoComplete="name"
          required
          placeholder="Your name"
          value={form.name}
          onChange={updateField}
        />
      )
    }

    if (step.id === 'email') {
      return (
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          value={form.email}
          onChange={updateField}
        />
      )
    }

    if (step.id === 'business') {
      return (
        <input
          name="business"
          required
          placeholder="Business or offer name"
          value={form.business}
          onChange={updateField}
        />
      )
    }

    if (step.id === 'goals') {
      return (
        <textarea
          ref={mobileGoalsRef}
          name="goals"
          rows="6"
          required
          aria-describedby="mobile-form-note"
          aria-invalid={note.type === 'error'}
          placeholder="Share the offer, what isn't working, and what a better site should fix."
          value={form.goals}
          onChange={updateField}
        />
      )
    }

    if (step.id === 'serviceType') return renderMobileChoices('serviceType', serviceTypes)
    if (step.id === 'projectType') return renderMobileChoices('projectType', projectTypes)
    if (step.id === 'timeline') return renderMobileChoices('timeline', timelines)

    if (step.id === 'budget') {
      return (
        <input
          name="budget"
          placeholder="Whatever range feels comfortable"
          value={form.budget}
          onChange={updateField}
        />
      )
    }

    if (step.id === 'website') {
      return (
        <input
          name="website"
          autoComplete="url"
          inputMode="url"
          placeholder="yourwebsite.com or https://"
          value={form.website}
          onChange={updateField}
        />
      )
    }

    return (
      <div className="mobile-review">
        <p><strong>Name</strong><span>{form.name}</span></p>
        <p><strong>Email</strong><span>{form.email}</span></p>
        <p><strong>Business</strong><span>{form.business}</span></p>
        <p><strong>Project</strong><span>{form.projectType || 'Not provided'}</span></p>
        <p><strong>Timeline</strong><span>{form.timeline || 'Not provided'}</span></p>
      </div>
    )
  }

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
          <form className="inquiry-form desktop-inquiry-form" onSubmit={submitInquiry}>
            <div className="form-heading">
              <p className="form-kicker">Project Inquiry</p>
              <h2>Tell me what needs work.</h2>
              <p>
                Share the useful stuff first: who you serve, what feels off, and where the site needs to pull more weight.
              </p>
            </div>

            <div className="form-group">
              <p className="form-group-title">Your info</p>
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
            </div>

            <div className="form-group">
              <p className="form-group-title">The business</p>
              <div className="form-row">
                <label className="form-label">
                  Business name
                  <input name="business" required value={form.business} onChange={updateField} />
                </label>
                <label className="form-label">
                  Current website
                  <input
                    name="website"
                    autoComplete="url"
                    inputMode="url"
                    placeholder="yourwebsite.com or https://"
                    value={form.website}
                    onChange={updateField}
                  />
                </label>
              </div>
            </div>

            <label className="form-label">
              What needs to change?
              <textarea
                ref={desktopGoalsRef}
                name="goals"
                rows="5"
                required
                aria-describedby="desktop-form-note"
                aria-invalid={note.type === 'error'}
                placeholder="Share the offer, what isn't working, and what a better site should fix."
                value={form.goals}
                onChange={updateField}
              />
            </label>

            <details
              className="project-details"
              open={detailsOpen}
              onToggle={(event) => {
                if (event.nativeEvent?.isTrusted) detailsTouchedRef.current = true
                setDetailsOpen(event.currentTarget.open)
              }}
            >
              <summary>
                <span>
                  Project details
                  <small>Optional, but useful if you know them.</small>
                </span>
              </summary>
              <div className="project-details-body compact-details">
                <div className="form-row">
                  {renderSelect('serviceType', 'Service type', serviceTypes)}
                  {renderSelect('projectType', 'Project type', projectTypes)}
                </div>
                <div className="form-row">
                  {renderSelect('timeline', 'Timeline', timelines)}
                  <label className="form-label">
                    Budget comfort zone
                    <input
                      name="budget"
                      placeholder="Whatever range feels comfortable to share"
                      value={form.budget}
                      onChange={updateField}
                    />
                  </label>
                </div>
              </div>
            </details>

            <p
              id="desktop-form-note"
              className={`form-note ${note.type ? `is-${note.type}` : ''}`}
              role={note.type === 'error' ? 'alert' : undefined}
              aria-live={note.type === 'error' ? 'assertive' : 'polite'}
            >
              {note.text}
            </p>
            <button className="button button-primary" type="submit">
              Send Inquiry
            </button>
          </form>

          <form className="mobile-inquiry-form" onSubmit={handleMobileSubmit}>
            <div className="mobile-form-top">
              <p className="form-kicker">Project Inquiry</p>
              <div className="mobile-progress" aria-label={`Step ${mobileStep + 1} of ${mobileSteps.length}`}>
                <span style={{ width: `${((mobileStep + 1) / mobileSteps.length) * 100}%` }} />
              </div>
            </div>

            <div className="mobile-question" ref={mobileStepRef} tabIndex="-1">
              <p className="mobile-step-count">
                {String(mobileStep + 1).padStart(2, '0')} / {String(mobileSteps.length).padStart(2, '0')}
              </p>
              <p className="mobile-question-kicker">{mobileSteps[mobileStep].kicker}</p>
              <h2>{mobileSteps[mobileStep].title}</h2>
              <p>{mobileSteps[mobileStep].hint}</p>
              <div className="mobile-question-field">
                {renderMobileStepField()}
              </div>
            </div>

            <p
              id="mobile-form-note"
              className={`form-note ${note.type ? `is-${note.type}` : ''}`}
              role={note.type === 'error' ? 'alert' : undefined}
              aria-live={note.type === 'error' ? 'assertive' : 'polite'}
            >
              {note.text}
            </p>

            <div className="mobile-form-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={previousMobileStep}
                disabled={mobileStep === 0}
              >
                Back
              </button>
              {mobileStep < mobileSteps.length - 1 ? (
                <>
                  {mobileStep > 3 && (
                    <button className="button button-secondary mobile-skip" type="button" onClick={nextMobileStep}>
                      Skip
                    </button>
                  )}
                  <button className="button button-primary" type="button" onClick={nextMobileStep}>
                    Next
                  </button>
                </>
              ) : (
                <>
                  <p className="mobile-send-hint">Your email app will open with everything filled in — just hit send.</p>
                  <button className="button button-primary" type="submit">
                    Send Inquiry
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
