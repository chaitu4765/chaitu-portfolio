import json,math,subprocess
from PIL import ImageChops
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import imageio_ffmpeg
from pathlib import Path
W,H=1280,720
portrait=json.loads(Path('public/images/portrait-particles.json').read_text());points=portrait['points']
font='C:/Windows/Fonts/arialbd.ttf'; regular='C:/Windows/Fonts/arial.ttf'
bold=ImageFont.truetype(font,150);namefont=ImageFont.truetype(font,104);small=ImageFont.truetype(regular,10);role=ImageFont.truetype(font,24)
def ease(x):return 1-(1-max(0,min(1,x)))**3
def text(im,word,xy,f,opacity=1,reveal=1):
 mask=Image.new('L',(W,H));d=ImageDraw.Draw(mask);d.text(xy,word,font=f,fill=int(255*opacity),anchor='mt')
 mask.paste(0,(int(W*(.12+.76*reveal)),0,W,H)) if reveal<1 else None
 grad=Image.new('RGB',(W,H));gd=ImageDraw.Draw(grad);height=f.size
 for y in range(H):
  a=max(0,min(1,(y-xy[1])/height));v=int(250-155*a);gd.line((0,y,W,y),fill=(v,min(255,v+3),min(255,v+8)))
 im.paste(grad,(0,0),mask)
def scene(t):
 im=Image.new('RGB',(W,H),(3,5,5));d=ImageDraw.Draw(im)
 # faint center light, same shape as the live scene
 for r in range(530,0,-8):
  v=int(3+9*(1-r/530));d.ellipse((W/2-r,H/2-r*.7,W/2+r,H/2+r*.7),fill=(v,v+2,v+2))
 settle=ease((t-4.5)/2.1);opacity=max(0,min(1,(t-4.4)*2));ph=H*.95;sc=ph/portrait['height'];ox=(W-portrait['width']*sc)/2;oy=H-ph
 if opacity:
  for x,y,a,r,s in points:
   ang=s*math.pi*28;px=ox+x*sc+math.cos(ang)*W*(1-settle)*(.2+s);py=oy+y*sc+math.sin(ang)*H*(1-settle)*(.1+s)
   v=int(237*a*opacity);rr=max(.7,r*sc*1.75);d.rectangle((px,py,px+rr,py+rr),fill=(v,min(255,v+2),min(255,v+5)))
 if t<2.15:
  if t<.99: yy=-45+(H*.48+45)*min(1,(t/.99)**2)
  elif t<1.34: yy=H*.48-35*math.sin((t-.99)/.35*math.pi/2)
  else: yy=H*.48-35*(1-min(1,(t-1.34)/.3))
  alpha=min(1,t/.2)*max(0,min(1,(2.15-t)/.5)); glow=Image.new('RGB',(W,H));gd=ImageDraw.Draw(glow)
  for rad in range(100,0,-2):
   val=int(45*alpha*(1-rad/100)**2);gd.ellipse((640-rad,yy-rad,640+rad,yy+rad),fill=(val,int(val*.95),val))
  im=ImageChops.add(im,glow);d=ImageDraw.Draw(im)
  if t<1: d.line((640,yy-70,640,yy),fill=(80,87,100),width=3)
  d.ellipse((632,yy-8,648,yy+8),fill=(int(255*alpha),)*3)
 progress=max(0,min(1,(t-1.6)/1.85))
 if 1.4<t<4.55:
  opacity=min(1,(t-1.4)/.4)*max(0,min(1,(4.55-t)/.65))
  text(im,'PORTFOLIO',(640,H*.43),namefont,opacity,progress)
 if 1.25<t<4.05:
  alpha=min(1,(t-1.25)/.25)*min(1,(4.05-t)/.55);xx=W*(.12+.76*progress)
  glow=Image.new('RGB',(W,H));gd=ImageDraw.Draw(glow);gd.line((xx,H*.43-7,xx,H*.43+125),fill=(int(130*alpha),)*3,width=10);glow=glow.filter(ImageFilter.GaussianBlur(10));im=ImageChops.add(im,glow);d=ImageDraw.Draw(im);d.line((xx,H*.43-7,xx,H*.43+125),fill=(int(250*alpha),)*3,width=3)
 if t>=4.1:
  progress=ease((t-4.4)/1.2);f=ImageFont.truetype(font,int(145*(.8+.2*progress)));top=H*(.43+.25*progress);text(im,'CHAITANYA',(640,top),f,min(1,(t-4.1)/.85))
  if t>5.1:
   v=int(235*min(1,(t-5.1)/.7));d=ImageDraw.Draw(im);d.text((175,top+140),'Full-stack Developer',font=role,fill=(v,v,v));d.text((1040,top+158),'Contact',font=small,fill=(v,v,v))
 if t>5.1:
  d=ImageDraw.Draw(im);v=int(230*min(1,(t-5.1)/.8));d.text((38,27),'GANTA KRISHNA CHAITANYA',font=small,fill=(v,v,v));d.text((830,27),'HOME     ABOUT     PROJECTS     EXPERIENCE     CONTACT',font=small,fill=(v,v,v))
 return im
cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','public/media/portfolio-opening-v2.mp4']
p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
for i in range(270):p.stdin.write(scene(i/30).tobytes())
p.stdin.close();assert p.wait()==0
scene(8).save('.reference/portrait-opening-v2.jpg')
frames=[scene(t).resize((640,360)) for t in [.5,1,2.5,3.4,4.4,8]]
sheet=Image.new('RGB',(1920,720))
for i,f in enumerate(frames):sheet.paste(f,((i%3)*640,(i//3)*360))
sheet.save('.reference/opening-v2-frames.jpg')
print('Rendered 9-second portrait opening to public/media/portfolio-opening-v2.mp4')
