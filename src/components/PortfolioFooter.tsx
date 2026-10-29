'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { site } from '@/data/site-config';

const CrewFooter = dynamic(() => import('@/components/ui/doodle-crew-footer'), {ssr:false,loading:FooterPlaceholder});
function FooterPlaceholder() {
 return <footer className="footer-placeholder"><span>CHAITANYA</span><Link href="/#contact" aria-haspopup="dialog">Let’s build something useful.</Link><a href="#top">Back to top ↑</a></footer>;
}
export default function PortfolioFooter() {
 const ref=useRef<HTMLDivElement>(null);
 const [ready,setReady]=useState(false);
 useEffect(() => {
  const observer=new IntersectionObserver(([entry]) => {
   if(entry.isIntersecting) { setReady(true); observer.disconnect(); }
  },{rootMargin:'700px'});
  if(ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
 },[]);
 return <div id="contact" ref={ref} className="portfolio-footer">
  {ready?<CrewFooter
   wordmark="CHAITANYA"
   brand="Chaitanya"
   blurb="Full-stack and Android developer based in Visakhapatnam."
   tagline="Have an idea? Let’s build something useful."
   preset="night"
   palette={{background:'#070909',ink:'#e8eaed',accent:'#b9c2d0'}}
   fontFamily="'DM Sans', sans-serif"
   serifFamily="'Instrument Serif', Georgia, serif"
   height="680px"
   columns={[
    {title:'Explore',links:[{label:'Home',href:'/#home'},{label:'Projects',href:'/#projects'},{label:'About',href:'/#about'},{label:'Experience',href:'/#experience'}]},
    {title:'Connect',links:[{label:'GitHub',href:site.github},{label:'LinkedIn',href:site.linkedin},{label:'Email',href:`mailto:${site.email}`},{label:'Call',href:`tel:${site.phoneHref}`}]}
   ]}
   actions={[{label:'View projects',href:'/#projects',icon:'sparkle',variant:'outline'},{label:'Say hello',href:'/#contact',icon:'plane',variant:'solid'}]}
   copyright={`© ${new Date().getFullYear()} Ganta Krishna Chaitanya`}
   legal={[]}
   socials={[]}
  />:<FooterPlaceholder/>}
 </div>;
}
