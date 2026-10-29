'use client';

import { useEffect, useRef } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

export default function ContactGlobe({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas || matchMedia('(max-width: 700px)').matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const controller = new AbortController();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0, rotation = -83.2, visible = false, disposed = false;
    let borders: ReturnType<typeof mesh> | undefined;
    const projection = geoOrthographic().clipAngle(90).precision(1.2);
    const path = geoPath(projection, context);
    const grid = geoGraticule10();
    const city: [number, number] = [83.2, 17.7];
    let size = 0;
    function paint() {
      if (!context || !canvas || !size) return;
      context.clearRect(0, 0, size, size);
      projection.translate([size / 2, size / 2]).scale(size * 0.46).rotate([rotation, -17.7]);
      context.beginPath(); path({ type: 'Sphere' }); context.fillStyle = '#101719'; context.fill();
      context.strokeStyle = '#465359'; context.lineWidth = 0.7; context.stroke();
      context.beginPath(); path(grid); context.strokeStyle = '#273338'; context.lineWidth = 0.6; context.stroke();
      if (borders) { context.beginPath(); path(borders); context.strokeStyle = '#9aaab1'; context.lineWidth = 0.7; context.stroke(); }
      if (geoDistance(city, [-rotation, 17.7]) < Math.PI / 2) {
        const point = projection(city);
        if (point) {
          context.beginPath(); context.arc(point[0], point[1], 7, 0, Math.PI * 2); context.fillStyle = '#d8e5ed22'; context.fill();
          context.beginPath(); context.arc(point[0], point[1], 2.5, 0, Math.PI * 2); context.fillStyle = '#ecf4f8'; context.fill();
        }
      }
    }
    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || motion.matches) return;
      if (now - last >= 50) {
        rotation += Math.min(now - last, 80) * 0.002;
        last = now; paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; last = performance.now();
      if (!disposed && visible && !document.hidden) {
        paint();
        if (!motion.matches) frame = requestAnimationFrame(tick);
      }
    }
    const resize = new ResizeObserver(() => {
      size = Math.min(360, canvas.clientWidth);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); paint();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    void fetch('/data/globe-countries.json', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Globe unavailable'); return response.json(); })
      .then((topology: Topology<{ countries: GeometryCollection }>) => {
        if (disposed) return;
        borders = mesh(topology, topology.objects.countries); paint();
      }).catch(() => { /* Decorative globe keeps its local wireframe if map data is unavailable. */ });
    return () => {
      disposed = true; controller.abort(); cancelAnimationFrame(frame);
      observer.disconnect(); resize.disconnect();
      document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync);
    };
  }, [active]);
  return <div className="contact-globe" aria-hidden="true"><canvas ref={canvasRef}/><div className="contact-globe-caption"><span/>Visakhapatnam, India<span>17.7° N · 83.2° E</span></div></div>;
}
