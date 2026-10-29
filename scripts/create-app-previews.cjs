const fs=require('node:fs');
const sharp=require('sharp');
const directory='public/images/projects';
fs.mkdirSync(directory,{recursive:true});
const text=(x,y,size,content,fill='#e8eaed',weight=400)=>`<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${fill}" font-weight="${weight}">${content.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text>`;
const rect=(x,y,w,h,fill,r=0,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${r}" stroke="${stroke}"/>`;
const phone=(content,screen='#111a1e')=>rect(716,60,344,630,'#080c10',38,'#52606b')+rect(730,74,316,602,screen,28)+rect(839,85,98,19,'#080c10',10)+content+rect(834,653,108,5,'#78868e',3);
const row=(y,name,note,accent)=>rect(751,y,274,69,'#1b272c',10)+rect(767,y+20,27,27,accent,6)+text(808,y+28,17,name,'#f1f4f5',600)+text(808,y+51,12,note,'#aabac1');
const base=(title,description,accent,phoneContent,extra='')=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">${rect(0,0,1200,750,'#11191d')}${rect(0,0,10,750,accent)}${text(75,240,53,title,'#f4f5f6',700)}${description.map((line,i)=>text(78,291+i*34,25,line,'#b0bfc7')).join('')}${extra}${phone(phoneContent)}${text(78,686,14,'ILLUSTRATIVE APP PREVIEW','#84959f')}${text(78,627,17,'CHAITANYA / ANDROID',accent,600)}</svg>`;
const sources={
 'moto-stock':base('Moto Stock',['The showroom, connected.','Stock. Invoices. Sales.'],'#dbb47a',
  text(753,145,24,'Moto Stock','#f3f4f5',700)+text(753,171,13,'SHOWROOM WORKSPACE','#b6c1c8')+
  rect(751,195,274,106,'#dbb47a',12)+text(771,224,14,'STOCK MOVEMENT','#232c31',600)+
  '<g fill="none" stroke="#263239" stroke-width="4"><circle cx="799" cy="270" r="15"/><circle cx="970" cy="270" r="15"/><path d="M799 270l56-42h43l25 42h-75l-22-30m72-12h35l37 42m-101-42v-12h-28m84 12l-9-16h-20"/></g>'+
  row(322,'Incoming bikes','Track dealership stock','#c9ab76')+row(405,'Customer invoices','Keep every sale together','#d5b985')+row(488,'Stores & sales','A shared view of the showroom','#b89e72')+
  text(774,610,14,'Stock     Invoices     Stores','#cad4da'),
  rect(78,402,465,2,'#364047')+text(78,450,20,'Dealership ERP','#dbb47a',600)+text(78,484,18,'From incoming bikes to outgoing sales.','#aabac1')),
 'medistock':base('MediStock',['Pharmacy operations.','Ready when you are.'],'#98c9ac',
  text(753,145,24,'MediStock','#f3f4f5',700)+text(753,171,13,'PHARMACY WORKSPACE','#b6c1c8')+
  rect(751,195,274,100,'#98c9ac',12)+text(771,224,14,'OFFLINE-FIRST','#173b2e',600)+text(771,260,22,'Local operations','#173b2e',600)+
  row(320,'Medicines & stock','Inventory in one place','#99c4ad')+row(403,'Purchases & billing','The everyday pharmacy workflow','#b4d6be')+row(486,'Branches & reports','Operational visibility','#8fbca4')+
  text(774,610,14,'Stock       Billing       Reports','#cad4da'),
  '<g transform="translate(78 400)" stroke="#98c9ac" stroke-width="3" fill="none"><rect width="70" height="70" rx="16"/><path d="M22 35h26M35 22v26"/></g>'+text(170,429,20,'Built around local control.','#98c9ac',600)+text(170,461,18,'Inventory, billing, and branch workflows.','#aabac1')),
 'rakshak':base('Rakshak',['A second look,','before you tap.'],'#a9b8e0',
  text(753,145,24,'Rakshak','#f3f4f5',700)+text(753,171,13,'ON-DEVICE LINK ANALYSIS','#b6c1c8')+
  '<g transform="translate(848 199)" fill="none" stroke="#a9b8e0" stroke-width="3"><path d="M40 0L76 15v32C76 70 40 90 40 90S4 70 4 47V15Z"/><path d="M40 24v28m0 9v4"/></g>'+
  rect(751,318,274,108,'#1b272c',10)+text(768,345,13,'NOTIFICATION RECEIVED','#b6c1c8',600)+text(768,374,17,'Review your account','#eef1f4',600)+text(768,402,14,'account-check.example','#a9b8e0')+
  rect(751,446,274,110,'#352b21',10)+text(769,477,19,'Potential phishing','#edc68d',600)+text(769,509,14,'Review this link before opening.','#dacdb9')+text(769,537,13,'Analyzed locally with an SLM','#d3c5ae')+
  text(774,610,14,'Alerts       Activity       Settings','#cad4da'),
  rect(78,410,468,2,'#364047')+text(78,454,20,'Notification → Local SLM → Warning','#a9b8e0',600)+text(78,491,18,'Mobile security & applied AI research.','#aabac1'))
};

sources['opptrack']=base('OppTrack',['Find the opportunity','in the noise.'],'#b6b0df',
 text(753,145,24,'OppTrack','#f3f4f5',700)+text(753,171,13,'OPPORTUNITY WORKSPACE','#b6c1c8')+
 rect(751,195,274,106,'#b6b0df',12)+text(771,224,14,'FROM YOUR NOTIFICATIONS','#28243d',600)+text(771,262,22,'A clearer next step.','#28243d',600)+
 row(322,'Internships','Find your next experience','#b6b0df')+row(405,'Hackathons','Build something with a team','#c8c3e8')+row(488,'Saved opportunities','Keep your next steps together','#a39ccb')+
 text(774,610,14,'Discover       Saved       Activity','#cad4da'),
 rect(78,402,465,2,'#364047')+text(78,450,20,'Notifications → opportunities','#b6b0df',600)+text(78,484,18,'An on-device AI application concept.','#aabac1'))
 .replace('ILLUSTRATIVE APP PREVIEW','ILLUSTRATIVE CONCEPT PREVIEW');

sources['campusconnect']=base('CampusConnect',['Your campus.','A little more connected.'],'#8fc2cf',
 text(753,145,23,'CampusConnect','#f3f4f5',700)+text(753,171,13,'STUDENT WORKSPACE','#b6c1c8')+
 rect(751,195,274,106,'#8fc2cf',12)+text(771,224,14,'EXPLORE YOUR CAMPUS','#183a43',600)+
 '<g fill="none" stroke="#183a43" stroke-width="3"><path d="M811 263l58-23 58 23-58 23zM838 274v13q31 17 62 0v-13M927 263v30"/></g>'+
 row(322,'Library assistant','Find a useful starting point','#8fc2cf')+row(405,'Labs & workshops','Discover campus resources','#add6df')+row(488,'Career roadmaps','Explore your next step','#7eafbd')+
 text(774,610,14,'Campus       Explore       Profile','#cad4da'),
 rect(78,402,465,2,'#364047')+text(78,450,20,'Library. Labs. Career guidance.','#8fc2cf',600)+text(78,484,18,'A student-centered Android concept.','#aabac1'))
 .replace('ILLUSTRATIVE APP PREVIEW','ILLUSTRATIVE CONCEPT PREVIEW');

sources['weather-aware-fuel']=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
 ${rect(0,0,1200,750,'#11191d')}${rect(0,0,10,750,'#86b8d4')}
 ${text(75,218,49,'Weather-aware','#f4f5f6',700)}${text(75,276,49,'fuel prediction','#f4f5f6',700)}
 ${text(78,331,24,'Reading the conditions.','#b0bfc7')}${text(78,365,24,'Understanding the journey.','#b0bfc7')}
 ${rect(78,414,448,2,'#364047')}${text(78,458,20,'Wind. Waves. Ocean currents.','#86b8d4',600)}${text(78,494,18,'A maritime machine-learning study.','#aabac1')}
 ${text(78,627,17,'CHAITANYA / APPLIED RESEARCH','#86b8d4',600)}${text(78,686,14,'ILLUSTRATIVE RESEARCH PREVIEW','#84959f')}
 ${rect(625,115,515,520,'#080c10',20,'#52606b')}${rect(639,129,487,492,'#111a1e',12)}
 ${rect(639,129,487,44,'#1b272c',12)}<g fill="#71838e"><circle cx="659" cy="151" r="4"/><circle cx="674" cy="151" r="4"/><circle cx="689" cy="151" r="4"/></g>
 ${text(714,156,12,'MARITIME RESEARCH WORKSPACE','#c0cdd5',600)}
 ${text(662,209,24,'Conditions & consumption','#f3f4f5',600)}${text(662,234,12,'A weather-aware approach to fuel prediction','#aabac1')}
 ${['Wind','Waves','Current'].map((label,i)=>rect(662+i*151,255,137,66,'#1b272c',9)+text(677+i*151,281,14,label,'#c4d9e5',600)+text(677+i*151,305,11,'Weather input','#91a8b6')).join('')}
 ${rect(662,340,439,150,'#18252c',10)}${text(680,366,12,'MODEL EXPLORATION','#b7c9d4',600)}
 <g fill="none" stroke="#354a56" stroke-width="1"><path d="M681 391h397M681 423h397M681 455h397"/></g>
 <path d="M682 452C730 451 730 399 780 420S840 443 878 410S943 393 972 408S1037 402 1080 381" fill="none" stroke="#86b8d4" stroke-width="3"/>
 ${text(681,476,10,'ILLUSTRATIVE TREND — NOT EXPERIMENTAL RESULTS','#90a8b6')}
 <g transform="translate(679 517)" fill="none" stroke="#86b8d4" stroke-width="2.5"><path d="M0 35h143l-16 20H20zM18 35V15h29V3h22v32M48 15h20M80 35V19h41v16M0 67q18-12 36 0t36 0t36 0t36 0"/></g>
 ${text(849,548,17,'Physics + data','#d5e7ef',600)}${text(849,574,12,'Predict. Compare. Understand.','#aabac1')}
 </svg>`;
(async()=>{fs.mkdirSync('.reference',{recursive:true});for(const [slug,svg] of Object.entries(sources)){fs.writeFileSync(directory+'/'+slug+'.svg',svg);await sharp(Buffer.from(svg)).resize(960).png().toFile('.reference/'+slug+'-preview.png');} console.log('Created six scalable app and research illustrations.');})();

