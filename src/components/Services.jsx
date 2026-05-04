import { services } from '../data/projects.js'

export default function Services() {
  return (
    <section id="services" className="services section-shell">
      <div className="section-intro reveal" data-reveal-speed="slow">
        <p className="eyebrow">Services</p>
        <h2>The scope changes. The attention doesn't.</h2>
        <p>
          Three different scopes. One level of attention. Whether you're building from zero, fixing what's broken, or doing something that doesn't fit a template — every project gets the same strategic focus from first call to launch day. Not sure which fits your situation? One conversation usually makes it obvious.
        </p>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <article key={service.title} className={`service-card ${service.featured ? 'featured' : ''} reveal`}>
            <p className="card-kicker">{service.kicker}</p>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ul>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="price">{service.note}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
