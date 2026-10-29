'use client';
import { useEffect, useRef } from 'react';
import { mountPortrait } from '@/lib/portrait-renderer';

export default function ParticleField() {
 const ref = useRef<HTMLCanvasElement>(null);
 useEffect(() => { if (ref.current) return mountPortrait(ref.current); }, []);
 return <div className="portrait-scene" aria-hidden="true"><div className="portrait-vector"/><noscript><div className="portrait-vector portrait-no-script"/></noscript><canvas className="particle-field" ref={ref}/></div>;
}
