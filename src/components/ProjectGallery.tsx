'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Code2, GraduationCap, Waves } from 'lucide-react';
import { Gallery, GalleryGrid, GalleryImage } from '@/components/ui/shared-element-gallery';
import { projects, matchesProjectFilter, type Project } from '@/data/projects';

const filters = ['All projects', 'Live websites', 'Mobile apps', 'Applied AI', 'Research'];

function StudyPreview({ project }: { project: Project }) {
  const Icon = project.visual === 'research' ? Waves : project.visual === 'campus' ? GraduationCap : Code2;
  return <div className={`project-study-cover study-${project.visual}`}>
    <Icon size={38} strokeWidth={1}/><strong>{project.title}</strong><span>{project.subtitle}</span>
    <small>{project.visual === 'research' ? 'RESEARCH EXPLORATION' : 'CONCEPT PREVIEW'}</small>
  </div>;
}

function ProjectActions({ project }: { project: Project }) {
  return <>
    {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={15}/></a> : null}
    <Link href={`/projects/${project.slug}/`}>View project <ArrowUpRight size={15}/></Link>
  </>;
}

export default function ProjectGallery() {
  const [filter, setFilter] = useState('All projects');
  const visible = projects.filter(project => matchesProjectFilter(project, filter));
  return <section id="projects" className="projects-section"><div className="page-width">
    <div className="section-heading"><h2>Selected <em>work.</em></h2><p>Websites, mobile apps, and applied research.<br/>Open a preview for a closer look.</p></div>
    <div className="filters" aria-label="Filter projects">{filters.map(item => <button type="button" key={item} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}{item === 'All projects' ? <span>{String(projects.length).padStart(2, '0')}</span> : null}</button>)}</div>
    <p className="sr-only" role="status">{visible.length} projects shown. {filter}.</p>
    <Gallery><GalleryGrid>
      {visible.map(project => <article className="gallery-project-card" key={project.slug}>
        <GalleryImage id={project.slug} src={project.screenshot || project.image}
          alt={project.screenshot ? `${project.title} — actual homepage` : project.image ? `${project.title} — illustrative project interface` : `${project.title} — concept preview`}
          title={project.title} description={project.description} caption={`${project.category} · ${project.status.split(' · ')[0]}`}
          actions={<ProjectActions project={project}/>}>
          <StudyPreview project={project}/>
        </GalleryImage>
        <div className="gallery-project-meta"><span>{project.category}</span><span>{project.status.split(' · ')[0]}</span></div>
        <Link href={`/projects/${project.slug}/`} className="gallery-project-title"><h3>{project.title}</h3><ArrowUpRight size={18}/></Link>
        <p className="gallery-project-description">{project.subtitle}</p>
        <div className="gallery-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        {project.demo ? <a className="gallery-project-visit" href={project.demo} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={13}/></a> : null}
      </article>)}
    </GalleryGrid></Gallery>
    <div className="project-disclosure"><span className="status-dot"/>Website previews show real homepages. App illustrations explain their workflows; concepts and research studies are labeled.</div>
  </div></section>;
}
