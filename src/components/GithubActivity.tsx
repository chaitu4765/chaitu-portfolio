'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import Skyline, { type ContributionDay } from '@/components/ui/contribution-skyline';
import { parseContributions } from '@/lib/github';
import { site } from '@/data/site-config';
import snapshot from '../../public/github-contributions.json';

type Activity = { days: ContributionDay[]; end: string; loadedAt: string; snapshot: boolean };
const savedDays = parseContributions(snapshot);
const savedActivity: Activity = { days: savedDays, end: savedDays[savedDays.length - 1].date, loadedAt: snapshot.capturedAt, snapshot: true };

export default function GithubActivity() {
 const sectionRef = useRef<HTMLElement>(null);
 const [inView,setInView] = useState(false);
 const [activity,setActivity] = useState<Activity>(savedActivity);
 const [refreshFailed,setRefreshFailed] = useState(false);
 const [attempt,setAttempt] = useState(0);
 useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
   if(entry.isIntersecting) { setInView(true); observer.disconnect(); }
  }, {rootMargin:'240px'});
  if(sectionRef.current) observer.observe(sectionRef.current);
  return () => observer.disconnect();
 }, []);
 useEffect(() => {
  if(!inView) return;
  const controller = new AbortController();
  let current = true;
  const timer = setTimeout(() => controller.abort(),8000);
  async function refresh() {
   try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(site.githubUsername)}?y=last`,{signal:controller.signal});
    if(!response.ok) throw new Error('Activity service unavailable');
    const days = parseContributions(await response.json());
    if(current) {
     setActivity({days,end:days[days.length-1].date,loadedAt:new Date().toLocaleDateString('en-IN'),snapshot:false});
     setRefreshFailed(false);
    }
   } catch {
    // Keep the existing skyline visible throughout slow or failed refreshes.
    if(current) setRefreshFailed(true);
   } finally { clearTimeout(timer); }
  }
  void refresh();
  return () => { current=false; clearTimeout(timer); controller.abort(); };
 },[attempt,inView]);
 return <section ref={sectionRef} id="github" className="github-section page-width">
  <div className="section-heading"><h2>A little, <em>every day.</em></h2><a className="text-link" href={site.github} target="_blank" rel="noreferrer">@{site.githubUsername} on GitHub <ArrowUpRight size={16}/></a></div>
  <p className="github-intro">The small steps behind the projects. Explore my public contribution history in two dimensions—or give it a little perspective.</p>
  <Skyline data={activity.days} endDate={activity.end} palette="grape" defaultView="3d" className="github-skyline"/>
  {activity.snapshot?<p className="snapshot-notice">Showing saved public activity from {activity.loadedAt}. {refreshFailed?'Live refresh is unavailable right now.':'Live activity refreshes in the background.'} <button className="text-link" onClick={()=>setAttempt(a=>a+1)}>Refresh activity <RefreshCw size={12}/></button></p>:null}
  <div className="github-source"><span>Public GitHub data via <a href="https://github.com/grubersjoe/github-contributions-api" target="_blank" rel="noreferrer">GitHub Contributions API</a>. Counts reflect the returned date range.</span><span>{activity.snapshot?'Saved snapshot':'Loaded'} {activity.loadedAt} · through {activity.end}</span></div>
 </section>;
}

