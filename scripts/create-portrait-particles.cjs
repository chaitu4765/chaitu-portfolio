const sharp = require('sharp');
const fs = require('node:fs');
(async()=>{
 const w=480,h=640;
 const {data}=await sharp('chaithu.jpeg').resize(w,h,{fit:'cover'}).normalise().sharpen({sigma:1}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const bg=new Uint8Array(w*h),stack=[];
 function add(i){if(i<0||i>=w*h||bg[i])return;const k=i*3;if(Math.min(data[k],data[k+1],data[k+2])<222)return;bg[i]=1;stack.push(i);}
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(stack.length){const i=stack.pop(),x=i%w; if(x)add(i-1);if(x<w-1)add(i+1);add(i-w);add(i+w);}
 function lum(x,y){const k=(Math.min(h-1,Math.max(0,y))*w+Math.min(w-1,Math.max(0,x)))*3;return (.2126*data[k]+.7152*data[k+1]+.0722*data[k+2])/255;}
 let seed=4765;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
 const points=[];
 for(let y=0;y<h;y+=1.75)for(let x=0;x<w;x+=1.75){const ix=Math.floor(x),iy=Math.floor(y);if(bg[iy*w+ix])continue;const l=lum(ix,iy);const edge=Math.abs(lum(ix+2,iy)-lum(ix-2,iy))+Math.abs(lum(ix,iy+2)-lum(ix,iy-2));const a=Math.min(1,.055+Math.pow(l,.85)*1.1+edge*.15);points.push([+(x+rand()*.55).toFixed(2),+(y+rand()*.55).toFixed(2),+a.toFixed(3),+(.56+rand()*.22).toFixed(2),+rand().toFixed(4)]);}

 fs.writeFileSync('public/images/portrait-particles.json',JSON.stringify({width:w,height:h,points}));
 fs.writeFileSync('public/images/portrait-particles.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Particle portrait of Ganta Krishna Chaitanya"><g fill="#dce3ed">${points.map(([x,y,a,r])=>`<circle cx="${x}" cy="${y}" r="${r}" opacity="${a}"/>`).join('')}</g></svg>`);
 console.log(`Generated ${points.length} portrait particles and a genuine vector SVG.`);
})();
