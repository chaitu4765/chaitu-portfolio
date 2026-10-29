const fs = require('node:fs');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('src/lib/portrait-renderer.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const packed = fs.readFileSync('public/images/portrait-particles.bin');
const original = JSON.parse(fs.readFileSync('public/images/portrait-particles.json','utf8'));
assert.equal(packed.length / 8, original.points.length);
original.points.forEach(([x,y,a,r,s],i)=>{
 const offset=i*8;
 assert.ok(Math.abs(packed.readUInt16LE(offset)/64-x)<=1/128+.000001);
 assert.ok(Math.abs(packed.readUInt16LE(offset+2)/64-y)<=1/128+.000001);
 assert.ok(Math.abs(packed[offset+4]/255-a)<=1/510+.000001);
 assert.ok(Math.abs(packed[offset+5]/100-r)<.000001);
 assert.ok(Math.abs(packed.readUInt16LE(offset+6)/65535-s)<=1/131070+.000001);
});
function target(extra={}) {
 const listeners=new Map();
 return Object.assign({addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type),emit:(type,event={})=>listeners.get(type)?.(event),listeners},extra);
}
async function fixture({reduced=false,noGPU=false,fetchFails=false,shaderFails=false,textAlreadyFinished=false,lateData=false}={}) {
 let now=0,id=0,draws=0,uploads=0,requested=0,lost=false,io,ro,lastCount=0;
 const frames=new Map(),timers=new Map(),uniforms={};
 const document=target({hidden:false});
 const motion=target({matches:reduced});
 const window=target({setTimeout:(fn,delay)=>{const key=++id;timers.set(key,{fn,at:now+delay});return key;}});
 const gl=new Proxy({
  createShader:()=>({}),getShaderParameter:()=>!shaderFails,createProgram:()=>({}),getProgramParameter:()=>true,createBuffer:()=>({}),
  getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,isContextLost:()=>lost,
  bufferData:()=>uploads++,drawArrays:(_,__,count)=>{draws++;lastCount=count;},
  uniform1f:(location,value)=>{uniforms[location]=value;}
 },{get:(obj,key)=>key in obj?obj[key]:(typeof key==='string' && key===key.toUpperCase()?1:()=>{})});
 let finishTitle, releaseData;
 const titleFinished = new Promise(resolve=>{finishTitle=resolve;});
 const dataReady = new Promise(resolve=>{releaseData=resolve;});
 const title={getAnimations:()=>[{animationName:'v2-title-position',playState:textAlreadyFinished?'finished':'running',finished:titleFinished}]};
 const canvas=target({width:0,height:0,style:{},dataset:{},parentElement:{dataset:{}},closest:()=>({querySelector:()=>title}),getContext:()=>noGPU?null:gl,getBoundingClientRect:()=>({width:390,height:844})});
 const context={exports:{},performance:{now:()=>now},matchMedia:query=>query.includes('reduced')?motion:{matches:true},
  AbortController,document,window,devicePixelRatio:3,innerWidth:390,innerHeight:844,
  requestAnimationFrame:fn=>{const key=++id;frames.set(key,fn);return key;},cancelAnimationFrame:key=>frames.delete(key),
  clearTimeout:key=>timers.delete(key),
  ResizeObserver:class{constructor(fn){ro=fn;}observe(){}disconnect(){}},
  IntersectionObserver:class{constructor(fn){io=fn;}observe(){}disconnect(){}},
  fetch:async()=>{requested++;if(fetchFails)throw Error('Offline');if(lateData)await dataReady;return {ok:true,arrayBuffer:async()=>packed.buffer.slice(packed.byteOffset,packed.byteOffset+packed.byteLength)};}
 };
 vm.runInNewContext(compiled,context);
 const stop=context.exports.mountPortrait(canvas);
 await new Promise(resolve=>setImmediate(resolve));
 function step(time){now=time;for(const [key,timer] of [...timers])if(timer.at<=time){timers.delete(key);timer.fn();}const pending=[...frames];frames.clear();for(const [,fn] of pending)fn(time);}
 return {step,stop,canvas,document,motion,uniforms,geometry:context.exports.portraitGeometry,
  finishText:async(time)=>{now=time;finishTitle();await new Promise(resolve=>setImmediate(resolve));},
  loadData:async(time)=>{now=time;releaseData();await new Promise(resolve=>setImmediate(resolve));},
  hide:()=>{document.hidden=true;document.emit('visibilitychange');},
  show:()=>{document.hidden=false;document.emit('visibilitychange');},
  intersect:value=>io([{isIntersecting:value}]),resize:()=>ro(),
  lose:()=>{lost=true;canvas.emit('webglcontextlost',{preventDefault(){}});},restore:()=>{lost=false;canvas.emit('webglcontextrestored');},
  stats:()=>({draws,uploads,requested,pending:frames.size+timers.size,lastCount,listeners:document.listeners.size+window.listeners.size+canvas.listeners.size+motion.listeners.size})
 };
}
(async()=>{
 const f=await fixture();
 assert.equal(f.stats().draws,0,'No rendering before the portrait reveal');
 f.step(5600);assert.equal(f.stats().draws,0,'Particles wait for the real text completion, not a fixed mount timer');
 await f.finishText(5600);
 f.step(5600);assert.equal(f.stats().draws,1);assert.equal(f.stats().lastCount,52042);
 assert.ok(f.uniforms.u_opacity>0,'The particle cloud is visible on the first frame after text completion');
 f.step(6000);assert.equal(f.stats().draws,2);assert.equal(f.stats().uploads,1,'Particle data uploaded once');
 f.hide();assert.equal(f.stats().pending,0,'Hidden tabs have no animation work');
 f.step(6500);assert.equal(f.stats().draws,2);
 f.show();f.step(6600);assert.equal(f.stats().draws,3);
 f.intersect(false);assert.equal(f.stats().pending,0,'Offscreen animation is paused');
 f.intersect(true);f.step(7700);assert.equal(f.uniforms.u_spread,0);assert.equal(f.uniforms.u_opacity,1);
 assert.equal(f.stats().pending,0,'Settled portrait has no continuous animation loop');
 const before=f.stats().draws;f.step(10000);assert.equal(f.stats().draws,before);
 f.resize();f.step(10001);assert.equal(f.stats().draws,before+1);assert.equal(f.stats().pending,0);
 f.lose();assert.equal(f.canvas.dataset.loaded,undefined);assert.equal(f.canvas.parentElement.dataset.fallback,'true');
 f.restore();f.step(10002);assert.equal(f.canvas.dataset.loaded,'true');assert.equal(f.stats().pending,0);
 f.stop();assert.equal(f.stats().pending,0);assert.equal(f.stats().listeners,0,'Cleanup removes event listeners');
 for(const width of [320,360,390,430,720])for(const height of [580,740,844,900]){
  const g=f.geometry(width,height);
  assert.ok(g.x>=0 && g.x+480*g.scale<=width+.001);
  assert.ok(g.y>=0 && g.y+640*g.scale<height*.73,'Mobile portrait ends above the name');
 }
 const staticView=await fixture({reduced:true});staticView.step(0);
 assert.equal(staticView.uniforms.u_spread,0);assert.equal(staticView.stats().pending,0);staticView.stop();
 const lateMount=await fixture({textAlreadyFinished:true});lateMount.step(0);
 assert.equal(lateMount.stats().draws,1,'Late hydration starts immediately after an already-completed text animation');lateMount.stop();
 const slowFetch=await fixture({lateData:true});await slowFetch.finishText(5600);slowFetch.step(5600);
 assert.equal(slowFetch.stats().draws,0);await slowFetch.loadData(6500);slowFetch.step(6500);
 assert.equal(slowFetch.stats().draws,1,'Late data starts immediately, without restarting the old 4.4-second delay');
 assert.equal(slowFetch.uniforms.u_spread,1,'Late data still plays the full particle formation');slowFetch.stop();
 for(const options of [{noGPU:true},{fetchFails:true},{shaderFails:true}]){
  const fallback=await fixture(options);
  assert.equal(fallback.canvas.parentElement.dataset.fallback,'true');
  assert.equal(fallback.stats().pending,0);fallback.stop();
 }
 console.log('PASS: all 52,042 particles preserved; max coordinate error <0.008 source pixels.');
 console.log('PASS: single buffer upload; one draw call/frame; no idle, offscreen, or hidden-tab loop.');
 console.log('PASS: mobile geometry, reduced motion, network/GPU fallback, context restoration, and cleanup.');
 console.log('Payload: '+packed.length+' bytes vs '+fs.statSync('public/images/portrait-particles.json').size+' JSON bytes (76% smaller).');
})().catch(error=>{console.error(error);process.exitCode=1;});
