const REVEAL_DURATION = 2100;

export function portraitGeometry(width: number, height: number) {
 const mobile = width <= 720;
 const ph = mobile ? Math.min(height * .57, width * 1.2) : Math.min(height * .95, width * 1.07);
 const scale = ph / 640;
 return { scale, x: (width - 480 * scale) / 2, y: mobile ? height * .69 - ph : height - ph };
}

const vertexSource = `
attribute vec2 a_position;
attribute vec2 a_shape;
attribute float a_seed;
uniform vec2 u_viewport;
uniform vec2 u_origin;
uniform float u_scale;
uniform float u_dpr;
uniform float u_spread;
uniform float u_opacity;
varying float v_alpha;
void main() {
 float angle = a_seed * 87.9645943;
 float size = max(.7, a_shape.y * .01 * u_scale * 1.75);
 vec2 drift = vec2(cos(angle) * (.2 + a_seed), sin(angle) * (.1 + a_seed));
 vec2 p = u_origin + a_position / 64.0 * u_scale + drift * u_viewport * u_spread + size * .5;
 gl_Position = vec4(p / u_viewport * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
 gl_PointSize = size * u_dpr;
 v_alpha = a_shape.x / 255.0 * u_opacity;
}`;
const fragmentSource = `
precision mediump float;
varying float v_alpha;
void main() { gl_FragColor = vec4(.90588, .92941, .96078, v_alpha); }
`;

// A static eight-byte vertex buffer keeps all particle work off the main thread.
export function mountPortrait(canvas: HTMLCanvasElement) {
 const showFallback = () => { if(canvas.parentElement) canvas.parentElement.dataset.fallback = 'true'; };
 if(canvas.parentElement) delete canvas.parentElement.dataset.fallback;
 const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
 if (!gl) { showFallback(); return () => {}; }
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
 const abort = new AbortController();
 let textComplete = reduced.matches;
 let revealStarted: number | null = null;
 let buffer: WebGLBuffer | null = null;
 let program: WebGLProgram | null = null;
 let shaders: WebGLShader[] = [];
 let data: ArrayBuffer | null = null;
 let locations: Record<string, WebGLUniformLocation | null> = {};
 let frame = 0, pointerFrame = 0, visible = true, disposed = false;
 let width = 1, height = 1, dpr = 1;

 function clearSchedule() {
  cancelAnimationFrame(frame); frame = 0;
 }
 function release() {
  shaders.forEach(shader => gl!.deleteShader(shader)); shaders = [];
  if (buffer) gl!.deleteBuffer(buffer);
  if (program) gl!.deleteProgram(program);
  buffer = program = null;
 }
 function initialize() {
  if (!data || disposed) return;
  release();
  try {
   const compile = (type: number, source: string) => {
    const shader = gl!.createShader(type);
    if (!shader) throw new Error('Shader unavailable');
    shaders.push(shader);
    gl!.shaderSource(shader, source); gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error('Shader unavailable');
    return shader;
   };
   program = gl!.createProgram();
   if (!program) throw new Error('Renderer unavailable');
   gl!.attachShader(program, compile(gl!.VERTEX_SHADER, vertexSource));
   gl!.attachShader(program, compile(gl!.FRAGMENT_SHADER, fragmentSource));
   gl!.linkProgram(program);
   if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) throw new Error('Renderer unavailable');
   gl!.useProgram(program);
   buffer = gl!.createBuffer();
   if (!buffer) throw new Error('Buffer unavailable');
   gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer); gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
   const attribute = (name: string, size: number, type: number, normalized: boolean, offset: number) => {
    const location = gl!.getAttribLocation(program!, name);
    gl!.enableVertexAttribArray(location);
    gl!.vertexAttribPointer(location, size, type, normalized, 8, offset);
   };
   attribute('a_position', 2, gl!.UNSIGNED_SHORT, false, 0);
   attribute('a_shape', 2, gl!.UNSIGNED_BYTE, false, 4);
   attribute('a_seed', 1, gl!.UNSIGNED_SHORT, true, 6);
   locations = Object.fromEntries(['viewport','origin','scale','dpr','spread','opacity'].map(name => [name, gl!.getUniformLocation(program!, 'u_' + name)]));
   gl!.enable(gl!.BLEND); gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA); gl!.clearColor(0, 0, 0, 0);
   resize();
  } catch {
   release(); delete canvas.dataset.loaded; showFallback();
  }
 }
 function draw(now: number) {
  frame = 0;
  if (!program || !data || disposed || !visible || document.hidden || gl!.isContextLost()) return;
  const elapsed = reduced.matches ? REVEAL_DURATION : now - (revealStarted ?? now);
  const phase = Math.max(0, Math.min(1, elapsed / REVEAL_DURATION));
  const { scale, x, y } = portraitGeometry(width, height);
  gl!.clear(gl!.COLOR_BUFFER_BIT);
  gl!.uniform2f(locations.viewport, width, height); gl!.uniform2f(locations.origin, x, y);
  gl!.uniform1f(locations.scale, scale); gl!.uniform1f(locations.dpr, dpr);
  gl!.uniform1f(locations.spread, Math.pow(1 - phase, 3));
  // Make the cloud visible on its first frame, without a second blank fade-in.
  gl!.uniform1f(locations.opacity, .24 + .76 * Math.max(0, Math.min(1, elapsed / 180)));
  gl!.drawArrays(gl!.POINTS, 0, data.byteLength / 8);
  canvas.dataset.loaded = 'true';
  if (elapsed < REVEAL_DURATION && !reduced.matches) frame = requestAnimationFrame(draw);
 }
 function schedule() {
  clearSchedule();
  if (!program || disposed || !visible || document.hidden || gl!.isContextLost()) return;
  if (!textComplete && !reduced.matches) return;
  if (revealStarted === null) revealStarted = performance.now() - (reduced.matches ? REVEAL_DURATION : 0);
  frame = requestAnimationFrame(draw);
 }
 function resize() {
  const bounds = canvas.getBoundingClientRect();
  width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
  // High-DPI detail, bounded framebuffer size on large displays.
  dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / (width * height)));
  const nextWidth = Math.round(width * dpr), nextHeight = Math.round(height * dpr);
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) { canvas.width = nextWidth; canvas.height = nextHeight; }
  gl!.viewport(0, 0, canvas.width, canvas.height);
  schedule();
 }
 const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
 const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }); intersectionObserver.observe(canvas);
 const onMotionChange = () => { canvas.style.transform = ''; schedule(); };
 const onLost = (event: Event) => { event.preventDefault(); clearSchedule(); delete canvas.dataset.loaded; showFallback(); };
 const onRestored = () => initialize();
 const onPointer = (event: PointerEvent) => {
  if (!finePointer.matches || reduced.matches || !visible || document.hidden || revealStarted === null || performance.now() - revealStarted < REVEAL_DURATION) return;
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
   canvas.style.transform = 'translate3d(' + (event.clientX / innerWidth - .5) * 3 + 'px,' + (event.clientY / innerHeight - .5) * 2 + 'px,0)';
  });
 };
 document.addEventListener('visibilitychange', schedule); reduced.addEventListener('change', onMotionChange);
 canvas.addEventListener('webglcontextlost', onLost); canvas.addEventListener('webglcontextrestored', onRestored);
 window.addEventListener('pointermove', onPointer, { passive: true });
 // CSS starts before hydration. Follow its actual completion instead of starting
 // another timer after mount; an already-finished animation resolves immediately.
 const title = canvas.closest('.cinematic-hero')?.querySelector('.cinematic-title');
 const textAnimation = title?.getAnimations().find(animation => 'animationName' in animation && animation.animationName === 'v2-title-position');
 const finishText = () => { if (!disposed) { textComplete = true; schedule(); } };
 if (!textAnimation || textAnimation.playState === 'finished' || reduced.matches) finishText();
 else void textAnimation.finished.then(finishText, finishText);
 fetch('/images/portrait-particles.bin', { signal: abort.signal, priority: 'high' }).then(response => {
  if (!response.ok) throw new Error('Portrait unavailable');
  return response.arrayBuffer();
 }).then(bytes => {
  if (disposed) return;
  if (!bytes.byteLength || bytes.byteLength % 8 !== 0) { showFallback(); return; }
  data = bytes; initialize();
 }).catch(() => { if(!disposed) showFallback(); });
 return () => {
  disposed = true; abort.abort(); clearSchedule(); cancelAnimationFrame(pointerFrame);
  resizeObserver.disconnect(); intersectionObserver.disconnect();
  document.removeEventListener('visibilitychange', schedule); reduced.removeEventListener('change', onMotionChange);
  canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRestored);
  window.removeEventListener('pointermove', onPointer); release(); delete canvas.dataset.loaded;
 };
}
