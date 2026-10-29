'use client';

// Adapted from Cnippet UI (MIT). See licenses/cnippet-ui.txt.
import { useAnimate, useReducedMotion, type AnimationOptions } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type RandomLetterSwapProps = {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  className?: string;
};

const defaultTransition: AnimationOptions = { duration: 0.6, type: 'spring' };

export function RandomLetterSwap({ label, reverse = true, transition = defaultTransition, staggerDuration = 0.025, className }: RandomLetterSwapProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const blocked = useRef(false);
  const sequence = useRef({ value: 0 });
  const controls = useRef<ReturnType<typeof animate>[]>([]);
  const letters = Array.from(label);

  const start = useCallback(() => {
    if (blocked.current || reduced || !scope.current || document.hidden) return;
    blocked.current = true;
    const run = ++sequence.current.value;
    const order = Array.from({ length: Array.from(label).length }, (_, i) => i);
    // Shuffle only on interaction, so server and initial client markup always agree.
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    controls.current = order.map((index, position) => animate(
      `[data-letter="${index}"]`,
      { y: reverse ? '100%' : '-100%' },
      { ...transition, delay: position * staggerDuration },
    ));
    void Promise.all(controls.current).then(() => {
      if (run !== sequence.current.value || !scope.current) return;
      // Reset Motion's values as well as the DOM so repeated hovers replay correctly.
      controls.current = [animate('[data-letter]', { y: 0 }, { duration: 0 })];
      blocked.current = false;
    });
  }, [animate, label, reduced, reverse, scope, staggerDuration, transition]);

  useEffect(() => {
    const root = scope.current;
    const currentSequence = sequence.current;
    const trigger = root?.closest('a,button') ?? root;
    if (!trigger) return;
    const enter = (event: Event) => { if ((event as PointerEvent).pointerType !== 'touch') start(); };
    trigger.addEventListener('pointerenter', enter);
    trigger.addEventListener('focus', start);
    return () => {
      trigger.removeEventListener('pointerenter', enter);
      trigger.removeEventListener('focus', start);
      currentSequence.value++;
      controls.current.forEach(control => control.stop());
      controls.current = [];
      root?.querySelectorAll<HTMLElement>('[data-letter]').forEach(letter => { letter.style.transform = ''; });
      blocked.current = false;
    };
  }, [scope, start]);

  return <span ref={scope} className={cn('random-letter-swap', className)}>
    <span className="sr-only">{label}</span>
    <span className="random-letter-swap-visual" aria-hidden="true">
      {letters.map((letter, index) => <span className="random-letter-swap-cell" key={index}>
        <span data-letter={index} className="random-letter-swap-glyph">{letter}</span>
        <span data-letter={index} className="random-letter-swap-glyph random-letter-swap-copy" style={{ top: reverse ? '-100%' : '100%' }}>{letter}</span>
      </span>)}
    </span>
  </span>;
}
