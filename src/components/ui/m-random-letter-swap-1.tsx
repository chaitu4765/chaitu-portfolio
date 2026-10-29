'use client';

import { RandomLetterSwap } from '@/components/ui/random-letter-swap';
import { cn } from '@/lib/utils';

const links = ['Home', 'About', 'Projects', 'Experience', 'Contact'];
const transition = { duration: 0.6, type: 'spring' as const };

export default function RandomLetterSwapNav({ open = false, active = 'home', detail = false, onNavigate }: {
  open?: boolean;
  active?: string;
  detail?: boolean;
  onNavigate?: () => void;
}) {
  return <nav id="main-navigation" aria-label="Main navigation" className={cn('navigation random-letter-navigation', open && 'open')}
    onKeyDown={event => {
      if (event.key === 'Escape' && open) {
        onNavigate?.();
        event.currentTarget.closest('header')?.querySelector<HTMLButtonElement>('.mobile-toggle')?.focus();
      }
    }}>
    {links.map(link => <a
      href={`${detail ? '/' : ''}#${link.toLowerCase()}`}
      key={link}
      onClick={onNavigate}
      aria-current={!detail && active === link.toLowerCase() ? 'location' : undefined}
      aria-haspopup={link === 'Contact' ? 'dialog' : undefined}
    >
      <RandomLetterSwap className="cursor-pointer font-medium" label={link} staggerDuration={0.025} transition={transition}/>
    </a>)}
  </nav>;
}
