'use client';

import { Children, cloneElement, useId, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

type ItemProps = HTMLAttributes<HTMLElement> & { 'data-id': string; 'data-checked'?: 'true' | 'false'; children?: ReactNode };
type AnimatedBackgroundProps = {
  children: ReactElement<ItemProps>[] | ReactElement<ItemProps>;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export default function AnimatedBackground({ children, defaultValue, onValueChange, className, transition, enableHover = false }: AnimatedBackgroundProps) {
  const [selectedId, setSelectedId] = useState<string | null>(defaultValue ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const uniqueId = useId();
  const reduced = useReducedMotion();
  const activeId = enableHover ? hoveredId ?? focusedId ?? selectedId : selectedId;

  return Children.map(children, child => {
    const id = child.props['data-id'];
    return cloneElement(child, {
      key: child.key ?? id,
      className: cn('animated-background-item', child.props.className),
      'data-checked': activeId === id ? 'true' : 'false',
      onMouseEnter: event => {
        child.props.onMouseEnter?.(event);
        if (enableHover && !event.defaultPrevented) { setHoveredId(id); onValueChange?.(id); }
      },
      onMouseLeave: event => {
        child.props.onMouseLeave?.(event);
        if (enableHover && !event.defaultPrevented) { setHoveredId(null); onValueChange?.(focusedId ?? selectedId); }
      },
      onFocus: event => {
        child.props.onFocus?.(event);
        if (enableHover && !event.defaultPrevented) { setFocusedId(id); onValueChange?.(id); }
      },
      onBlur: event => {
        child.props.onBlur?.(event);
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        if (enableHover && !event.defaultPrevented) { setFocusedId(null); onValueChange?.(hoveredId ?? selectedId); }
      },
      onClick: event => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented && !enableHover) { setSelectedId(id); onValueChange?.(id); }
      },
    }, <>
      <AnimatePresence initial={false}>
        {activeId === id ? <motion.div
          aria-hidden="true"
          layoutId={reduced ? undefined : `background-${uniqueId}`}
          className={cn('animated-background-highlight', className)}
          transition={reduced ? { duration: 0 } : transition}
          initial={{ opacity: defaultValue ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/>: null}
      </AnimatePresence>
      <div className="animated-background-content">{child.props.children}</div>
    </>);
  });
}
