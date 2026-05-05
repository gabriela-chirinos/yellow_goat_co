import { services } from '../data/projects.js'

export default function Services() {
  return (
    <section id="services" className="services section-shell">
      <div className="section-intro reveal" data-reveal-speed="slow">
        <p className="eyebrow">Services</p>
        <h2>Every project is different.</h2>
        <p>
         Three different scopes. One level of attention. Whether you're building from zero, fixing what's broken, or doing something that doesn't fit a template, every project gets the same strategic focus. Not sure which fits your situation? Let's chat!
        </p>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <article key={service.title} className={`service-card ${service.featured ? 'featured' : ''} reveal`}>
            <div className="service-card-top">
              <p className="card-kicker">{service.kicker}</p>
              <span className="price">{service.note}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ul>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
