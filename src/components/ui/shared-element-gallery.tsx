'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageData = {
  id: string;
  src?: string;
  alt: string;
  title?: string;
  description?: string;
  caption?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};
type GalleryContextType = {
  selectedImage: ImageData | null;
  openImage: (image: ImageData, trigger: HTMLButtonElement) => void;
};
const GalleryContext = React.createContext<GalleryContextType | null>(null);
const spring = { type: 'spring' as const, stiffness: 350, damping: 35, mass: 1 };

export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null);
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const groupId = React.useId();
  const reduced = useReducedMotion();

  function openImage(image: ImageData, trigger: HTMLButtonElement) {
    if (dialogRef.current?.open) return;
    triggerRef.current = trigger;
    // Show the top layer before Motion measures the shared image's destination.
    dialogRef.current?.showModal();
    setOpen(true);
    setSelectedImage(image);
  }
  function close() { setSelectedImage(null); }
  function finishClose() {
    dialogRef.current?.close();
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  React.useEffect(() => {
    if (!open) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, width: '100%', overflow: 'hidden' });
    return () => { Object.assign(body.style, previous); window.scrollTo({ top: scrollY, behavior: 'instant' }); };
  }, [open]);

  return <GalleryContext.Provider value={{ selectedImage, openImage }}>
    <LayoutGroup id={groupId}>
      {children}
      <dialog ref={dialogRef} className="gallery-dialog" aria-labelledby={`${groupId}-title`}
        onCancel={event => { event.preventDefault(); close(); }}
        onClose={() => { setOpen(false); setSelectedImage(null); }}>
        <button type="button" className="gallery-close" onClick={close} aria-label="Close project preview"><X size={22}/></button>
        <AnimatePresence onExitComplete={finishClose}>
          {selectedImage ? <motion.div key={selectedImage.id} className="gallery-modal-layer" layoutRoot layoutScroll>
            <motion.div className="gallery-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.2 }} onClick={close}/>
            <div className="gallery-modal-position">
              <div className="gallery-modal-content">
                <motion.div className="gallery-drag-surface" drag={reduced ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.8}
                  onDragEnd={(_, info) => { if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 300) close(); }}>
                  <motion.div layoutId={reduced ? undefined : `image-${selectedImage.id}`} className="gallery-expanded-image" transition={reduced ? { duration: 0 } : spring}>
                    <GalleryMedia image={selectedImage} expanded/>
                  </motion.div>
                </motion.div>
                <motion.div className="gallery-expanded-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }}>
                  {selectedImage.caption ? <span>{selectedImage.caption}</span> : null}
                  <h2 id={`${groupId}-title`}>{selectedImage.title || selectedImage.alt}</h2>
                  {selectedImage.description ? <p>{selectedImage.description}</p> : null}
                  {selectedImage.actions ? <div className="gallery-project-actions">{selectedImage.actions}</div> : null}
                  {!reduced ? <small>Drag the preview up or down to close.</small> : null}
                </motion.div>
              </div>
            </div>
          </motion.div> : null}
        </AnimatePresence>
      </dialog>
    </LayoutGroup>
  </GalleryContext.Provider>;
}

export function GalleryGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('shared-gallery-grid', className)}>{children}</div>;
}

function GalleryMedia({ image, expanded = false }: { image: ImageData; expanded?: boolean }) {
  if (!image.src) return image.children;
  return <Image src={image.src} alt={image.alt} width={image.src.endsWith('.svg') ? 1200 : 1440} height={image.src.endsWith('.svg') ? 750 : 810}
    sizes={expanded ? '(max-width: 960px) 94vw, 1000px' : '(max-width: 560px) 92vw, (max-width: 900px) 44vw, (max-width: 1199px) 30vw, 22vw'}
    loading={expanded ? 'eager' : 'lazy'} draggable={false} unoptimized/>
}

export function GalleryImage({ id, src, alt = 'Project preview', title, description, caption, actions, children, className }: Omit<ImageData, 'alt'> & { alt?: string; className?: string }) {
  const context = React.useContext(GalleryContext);
  const reduced = useReducedMotion();
  if (!context) throw new Error('GalleryImage must be used within a Gallery');
  const image = { id, src, alt, title, description, caption, actions, children };
  return <motion.button type="button" className={cn('shared-gallery-image', className)}
    aria-label={`Expand ${title || alt}`} aria-haspopup="dialog"
    whileHover={reduced ? undefined : { scale: 0.98 }} whileTap={reduced ? undefined : { scale: 0.95 }} transition={spring}
    onClick={event => context.openImage(image, event.currentTarget)}>
    <motion.div className="shared-gallery-media" layoutId={reduced ? undefined : `image-${id}`} transition={reduced ? { duration: 0 } : spring}>
      <GalleryMedia image={image}/>
    </motion.div>
    <span className="gallery-expand-hint" aria-hidden="true"><Expand size={15}/></span>
  </motion.button>;
}
