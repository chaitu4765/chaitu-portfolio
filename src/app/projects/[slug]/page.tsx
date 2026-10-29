import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { Header, Footer, Preview } from '@/components/Portfolio';

export function generateStaticParams(){ return projects.map(p => ({slug:p.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=projects.find(p=>p.slug===slug);
 return {title:p?.title??'Project not found',description:p?.description};
}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const p=projects.find(p=>p.slug===slug); if(!p)notFound();
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 const live=Boolean(p.screenshot);
 const app=Boolean(p.overviewOnly);
 const concise=live || app;
 const sections=concise ? [['Overview',p.description],...(app?[['How it works',p.solution]]:[]),['My role',p.contribution]] : [
  ['Overview',p.solution],['Problem statement',p.description],['Intended users',p.users],
  ['Technology choices',p.rationale],['My contribution',p.contribution],
  ['Engineering challenges & solutions',p.challenges],['Testing & validation',p.validation],
  ['Current status & limitations',p.limitations],['What I learned',p.learning],['Future improvements',p.future]
 ];
 return <div id="top"><Header detail/><main id="main" className="case-main page-width">
  <Link href="/#projects" className="text-link"><ArrowLeft size={16}/>Back to selected work</Link>
  <div className="case-heading"><span className="case-category">{p.category} / {live?'Website':app?'Mobile application':'Project study'}</span><h1>{p.title}<span>.</span></h1><p>{p.subtitle}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
  {live?<a className="project-visit text-link" href={p.demo} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16}/></a>:null}</div>
  <Preview project={p} large/>
  <div className="case-notice"><strong>{p.status}</strong><p>{live?'Actual public homepage captured on 29 October 2026. Visit the website to explore its current design and interactions.':app?'Illustrative app preview based on the supplied project description. It is not a screenshot of the released interface.':'This study is based on the supplied project context. The preview is an illustrative concept, not a working application screenshot. Source code and results have not been independently verified.'}</p></div>
  <div className="case-layout"><aside aria-label="Project contents"><strong>In this project</strong>
  {sections.map(([title],i)=><a key={title} href={`#study-${i}`}>{title}</a>)}
  {!concise?<a href="#architecture">Design & architecture</a>:null}<a href="#features">{live?'On the website':app?'Application features':'Feature scope'}</a><a href="#source">{live?'Visit website':app?'Availability':'Source & demo'}</a></aside>
  <div className="case-body">{sections.map(([title,body],i)=><section id={`study-${i}`} key={title}><h2>{title}</h2><p>{body}</p></section>)}
  {!concise?<section id="architecture"><h2>Design & architecture</h2><p className="muted">Conceptual structure — verify against the current codebase.</p><div className="architecture">{p.architecture.map((a,i)=><div key={a}><span>{a}</span>{i<p.architecture.length-1?<ArrowRight size={18}/>:null}</div>)}</div></section>:null}
  <section id="features"><h2>{live?'On the website':app?'Application features':'Feature scope'}</h2>{!concise?<p>Historical or intended features; current implementation requires confirmation.</p>:null}<ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul></section>
  <section id="source"><h2>{live?'Explore the website':app?'Availability':'Source & live demo'}</h2>{p.repo?<a className="text-link" href={p.repo}>View source <ArrowUpRight size={16}/></a>:!concise?<p>Repository link has not been provided.</p>:null}{p.demo?<a className="text-link" href={p.demo} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={16}/></a>:<p>{app?'A public download link has not been added yet.':'A verified live demo is not available yet.'}</p>}</section></div></div>
  <Link className="next-project" href={`/projects/${next.slug}`}><span>Explore the next project<strong>{next.title}</strong></span><ArrowUpRight size={40}/></Link>
 </main><Footer/></div>;
}

