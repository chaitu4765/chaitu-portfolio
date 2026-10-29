'use client';

import AnimatedBackground from '@/components/ui/animated-background';
import { experience } from '@/data/site-config';

export default function ExperienceSection() {
  return <section id="experience" className="experience-section experience-cards-section page-width">
    <div className="section-heading"><h2>Learning in<br/><em>good company.</em></h2><p>Professional experience and the<br/>communities that shape how I build.</p></div>
    <div className="experience-card-grid" role="list" aria-label="Experience and community roles">
      <AnimatedBackground className="experience-card-highlight" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} enableHover>
        {experience.map(item => <article key={item.company} data-id={item.company} role="listitem" tabIndex={0} className="experience-card">
          <div className="experience-card-period"><span>{item.period}</span>{item.period === 'Current' ? <span className="current-dot" aria-label="Current role"/> : null}</div>
          <h3>{item.role}</h3><h4>{item.company}</h4>
          {item.responsibilities.map(responsibility => <p key={responsibility}>{responsibility}</p>)}
        </article>)}
      </AnimatedBackground>
    </div>
  </section>;
}
