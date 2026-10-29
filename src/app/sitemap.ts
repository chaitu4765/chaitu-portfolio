import type { MetadataRoute } from 'next';
import { site } from '@/data/site-config';
import { projects } from '@/data/projects';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap { if(!site.url)return []; const base=site.url.replace(/\/$/,''); return [{url:base},...projects.map(p=>({url:`${base}/projects/${p.slug}/`}))]; }
