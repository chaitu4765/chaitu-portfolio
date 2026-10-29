import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/data/site-config';
import ContactPopup from '@/components/ContactPopup';
export const metadata: Metadata = { ...(site.url ? { metadataBase: new URL(site.url), alternates: { canonical: site.url } } : {}), title: { default: 'Chaitanya — Full-stack & Android developer', template: '%s — Chaitanya' }, description: 'Ganta Krishna Chaitanya. Computer Science student, web and app development intern, and builder of useful digital products.', openGraph: { title: 'Chaitanya — Ideas into useful things.', description: 'Full-stack and Android development, applied AI, and on-device security research.', type: 'website', ...(site.url ? { images: [{ url: `${site.url.replace(/\/$/,'')}/og.svg`, width: 1200, height: 630 }] } : {}) } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" data-theme="dark" suppressHydrationWarning><body>{children}<ContactPopup/></body></html>; }

