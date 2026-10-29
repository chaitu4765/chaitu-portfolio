const fs = require('node:fs');
const sharp = require('sharp');
async function main() {
 const {width,height,points}=JSON.parse(fs.readFileSync('public/images/portrait-particles.json','utf8'));
 const packed=Buffer.alloc(points.length*8);
 points.forEach(([x,y,a,r,s],i)=>{const o=i*8;packed.writeUInt16LE(Math.round(x*64),o);packed.writeUInt16LE(Math.round(y*64),o+2);packed[o+4]=Math.round(a*255);packed[o+5]=Math.round(r*100);packed.writeUInt16LE(Math.round(s*65535),o+6);});
 fs.writeFileSync('public/images/portrait-particles.bin',packed);
 // Rasterize with coverage antialiasing at 3x; avoid an expensive SVG filter tree.
 const outputWidth=width*3, outputHeight=height*3, pixels=Buffer.alloc(outputWidth*outputHeight*4);
 for(const [x,y,a,r] of points){
  const left=x*3,top=y*3,right=left+r*1.75*3,bottom=top+r*1.75*3;
  for(let py=Math.floor(top);py<Math.min(outputHeight,Math.ceil(bottom));py++)for(let px=Math.floor(left);px<Math.min(outputWidth,Math.ceil(right));px++){
   const coverage=(Math.min(px+1,right)-Math.max(px,left))*(Math.min(py+1,bottom)-Math.max(py,top));
   const offset=(py*outputWidth+px)*4,alpha=a*coverage;
   pixels[offset]=231;pixels[offset+1]=237;pixels[offset+2]=245;
   pixels[offset+3]=Math.round((alpha+(pixels[offset+3]/255)*(1-alpha))*255);
  }
 }
 await sharp(pixels,{raw:{width:outputWidth,height:outputHeight,channels:4}}).webp({quality:93,alphaQuality:100,effort:4}).toFile('public/images/portrait-fallback.webp');
 console.log(JSON.stringify({particles:points.length,jsonBytes:fs.statSync('public/images/portrait-particles.json').size,binaryBytes:packed.length,fallbackBytes:fs.statSync('public/images/portrait-fallback.webp').size,fallbackResolution:width*3+'x'+height*3}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
