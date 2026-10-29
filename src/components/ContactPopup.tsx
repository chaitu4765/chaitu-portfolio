'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

const ContactWithGlobe = dynamic(() => import('@/components/ui/contact-with-globe'), {
  loading: () => <p className="contact-popup-loading" role="status">Opening the contact form…</p>,
});

export default function ContactPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const backdropPress = useRef(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const show = useCallback((trigger?: HTMLElement) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    triggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setReady(true);
    dialog.showModal();
    setOpen(true);
  }, []);

  // Central handling includes links rendered inside the supplied footer and case studies.
  // The anchors lead to the footer when the popup is unavailable.
  useEffect(() => {
    function onContactClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.hash !== '#contact' || !['/', location.pathname].includes(url.pathname)) return;
      event.preventDefault();
      show(anchor);
    }
    function onHashChange() { if (location.hash === '#contact') show(); }
    document.addEventListener('click', onContactClick, true);
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => {
      document.removeEventListener('click', onContactClick, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, width: '100%', overflow: 'hidden' });
    return () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [open]);

  function close() { dialogRef.current?.close(); }
  return <dialog
    ref={dialogRef}
    className="contact-popup"
    aria-labelledby="contact-popup-title"
    onClose={() => {
      setOpen(false);
      const trigger = triggerRef.current;
      const target = trigger?.getClientRects().length ? trigger : trigger?.closest('header')?.querySelector<HTMLElement>('.mobile-toggle');
      target?.focus({ preventScroll: true });
    }}
    onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
    onPointerUp={event => {
      if (backdropPress.current && event.target === event.currentTarget) close();
      backdropPress.current = false;
    }}
  >
    <div className="contact-popup-surface">
      <div className="contact-popup-bar"><span>LET’S MAKE SOMETHING USEFUL</span><button type="button" className="contact-popup-close" onClick={close} aria-label="Close contact form"><X size={20}/></button></div>
      <div className="contact-popup-heading"><h2 id="contact-popup-title">Let’s <em>talk.</em></h2><p>A project, an idea, or just a hello.</p></div>
      {ready ? <ContactWithGlobe active={open}/> : null}
    </div>
  </dialog>;
}
