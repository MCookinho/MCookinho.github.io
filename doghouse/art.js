const PAL = {
  bg:'#0a0505', d:'#120808', m:'#1a0a0a', w:'#2a1010',
  bm:'#3a1a1a', bl:'#4a2a2a', g:'#5a3a3a', r:'#8a3a3a',
  o:'#a85a3a', y:'#c4a46c', s:'#e8d4a8',
  pd:'#1a0a2a', pm:'#2a1a3a', pl:'#3a2a5a',
  bd:'#0d1a2a', bg2:'#2a4a5a'
}

let $ctx
function C(){return 800}
function H(){return 600}
function rect(x,y,w,h,c){$ctx.fillStyle=c;$ctx.fillRect(x,y,w,h)}
function circle(x,y,r,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function grad(x1,y1,x2,y2,c1,c2){const g=$ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rg(x,y,r,c1,c2){const g=$ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rr(x,y,w,h,r2,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.moveTo(x+r2,y);g.lineTo(x+w-r2,y);g.quadraticCurveTo(x+w,y,x+w,y+r2);g.lineTo(x+w,y+h-r2);g.quadraticCurveTo(x+w,y+h,x+w-r2,y+h);g.lineTo(x+r2,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r2);g.lineTo(x,y+r2);g.quadraticCurveTo(x,y,x+r2,y);g.fill()}
function ln(x1,y1,x2,y2,c,w){const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function pl(pts,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill()}

function drw(d){for(const a of d){const m=a[0];if(m==='r')rect(a[1],a[2],a[3],a[4],a[5]);else if(m==='c')circle(a[1],a[2],a[3],a[4]);else if(m==='g'){$ctx.fillStyle=grad(a[1],a[2],a[3],a[4],a[5],a[6]);$ctx.fillRect(a[7]||0,a[8]||0,a[9]||C(),a[10]||H())}else if(m==='p')pl(a[1],a[2]);else if(m==='t'){$ctx.fillStyle=a[2];$ctx.font=a[3];$ctx.textAlign='center';$ctx.fillText(a[1],a[4],a[5])}}}

function glow(x,y,r,c){const g=$ctx;g.fillStyle=rg(x,y,r,c,'rgba(10,5,5,0)');g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}

const PARTICLE_TYPES = {
  dust:(t,i,ct)=>({x:Math.sin(t*0.0003+i*2.7)*300+400,y:Math.sin(t*0.0005+i*1.3)*150+200+r()*200,s:0.5+r()*1.5,a:0.02+r()*0.04,c:'#5a4a4a'}),
  ember:(t,i,ct)=>({x:Math.sin(t*0.003+i*1.7)*20+400+Math.sin(i)*20,y:300+Math.sin(t*0.002+i*2.3)*200+r()*50,s:1+r()*2,a:0.3+Math.sin(t*0.005+i)*0.2,c:'#a85a3a'}),
  water:(t,i,ct)=>({x:Math.sin(t*0.001+i*5.7)*300+400+Math.sin(i*3)*50,y:200+Math.sin(t*0.0007+i*3.1)*100+r()*200,s:1+r()*2,a:0.05+r()*0.05,c:'#3a5a6a'}),
  ash:(t,i,ct)=>({x:Math.sin(t*0.0002+i*6.3)*200+400+Math.sin(i*2)*100,y:Math.sin(t*0.0004+i*4.1)*200+300+r()*100,s:0.5+r()*1,a:0.02+r()*0.03,c:'#4a4a4a'}),
  firefly:(t,i,ct)=>({x:Math.sin(t*0.001+i*3.7)*250+400+Math.sin(i*5)*80,y:Math.sin(t*0.0008+i*2.9)*120+250+r()*150,s:2+r()*2,a:0.3+Math.sin(t*0.004+i*1.3)*0.3,c:'#e8d4a8'}),
  mist:(t,i,ct)=>({x:Math.sin(t*0.0001+i*1.1)*500+400+Math.sin(i*7)*200,y:Math.sin(t*0.00015+i*0.7)*300+300+r()*200,s:10+r()*20,a:0.01+r()*0.02,c:'#3a2a5a'}),
  leaf:(t,i,ct)=>({x:(t*0.05+i*100)%900-50,y:Math.sin(t*0.002+i*2.3)*50+100+r()*350,s:3+r()*4,a:0.2+r()*0.1,c:'#4a3a2a'})
}
const r=Math.random
let particles={}
let particleCounts={}
let particleStarted={}

function ensureParticles(sceneId,type,count){
  const k=sceneId+'_'+type
  if(particleStarted[k])return
  particleStarted[k]=true
  particleCounts[k]=count||20
  if(!particles[k])particles[k]=[]
  const arr=particles[k]
  while(arr.length<(count||20))arr.push(r())
}

function drawParticles(ctx,sceneId,time){
  for(const k of Object.keys(particles)){
    if(!k.startsWith(sceneId+'_'))continue
    const type=k.split('_').slice(1).join('_')
    const fn=PARTICLE_TYPES[type]
    if(!fn)continue
    const arr=particles[k]
    const cnt=particleCounts[k]||20
    while(arr.length<cnt)arr.push(r())
    for(let i=0;i<Math.min(arr.length,cnt);i++){
      const p=fn(time,i,arr[i])
      ctx.fillStyle=`rgba(${hexToRgb(p.c)},${p.a})`
      ctx.beginPath();ctx.arc(p.x,p.y,Math.max(p.s,0.5),0,Math.PI*2);ctx.fill()
    }
  }
}
function hexToRgb(h){
  const v=parseInt(h.slice(1),16);return (v>>16)+','+((v>>8)&255)+','+(v&255)
}

function drawScene(ctx, sceneId, time) {
  $ctx = ctx
  ctx.save()
  const fns = {
    corridor: drawCorridor, cellar: drawCellar,
    kitchen: drawKitchen, church: drawChurch,
    graveyard: drawGraveyard, mansion: drawMansion,
    library: drawLibrary, tower: drawTower,
    tunnel: drawTunnel
  }
  if(fns[sceneId]){
    fns[sceneId](ctx, time)
    drawParticles(ctx,sceneId,time)
  }else{
    rect(0,0,C(),H(),'#0a0505')
    ctx.fillStyle='#8a3a3a';ctx.font='24px Georgia';ctx.textAlign='center'
    ctx.fillText('◈',400,300)
  }
  ctx.restore()
}

function drawCorridor(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#0a0505')
  ctx.fillStyle=grad(0,0,0,400,'#1a0a2a','#0a0505');ctx.fillRect(0,0,C(),400)
  rect(0,400,C(),200,'#120808')
  pl([[200,100],[600,100],[550,480],[250,480]],'#2a1010')
  pl([[210,108],[590,108],[542,476],[258,476]],'#0a0505')
  for(let i=0;i<5;i++){
    const y=180+i*60
    rr(310+i*40,y,20,35,3,'#3a1a1a')
    circle(320+i*40,y+17,5,'#0a0505')
    circle(320+i*40,y+17,2,'#8a3a3a')
  }
  for(let i=0;i<8;i++){
    const ly=70+i*45
    glow(50+Math.sin(t*0.001+i*2)*3,ly,25,'#c4a46c')
    ctx.fillStyle='#5a3a3a'
    ctx.beginPath();ctx.arc(50+Math.sin(t*0.001+i*2)*3,ly,2,0,Math.PI*2);ctx.fill()
    glow(750+Math.sin(t*0.001+i*2+1)*3,ly,25,'#c4a46c')
    ctx.fillStyle='#5a3a3a'
    ctx.beginPath();ctx.arc(750+Math.sin(t*0.001+i*2+1)*3,ly,2,0,Math.PI*2);ctx.fill()
  }
  const sw=Math.sin(t*0.002)*3
  glow(400+sw,80,80,'#a85a3a')
  ctx.fillStyle='#c4a46c'
  ctx.beginPath();ctx.arc(400+sw,80,6+Math.sin(t*0.003)*1.5,0,Math.PI*2);ctx.fill()
  ctx.fillStyle='#e8d4a8';ctx.font='14px Georgia';ctx.textAlign='center'
  ctx.fillText('†',400+sw,85)
  rect(350,410,100,30,'#2a1010')
  ctx.fillStyle='#4a2a2a';ctx.font='10px Georgia'
  ctx.fillText('⋮',400,430)
  ensureParticles('corridor','dust',25)
}

function drawCellar(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#0d0606')
  ctx.fillStyle=grad(0,0,0,350,'#0d1a2a','#0d0606');ctx.fillRect(0,0,C(),350)
  rect(0,380,C(),220,'#120808')
  const dp=Math.sin(t*0.003)*4+5
  for(let i=0;i<10;i++){
    const dx=60+i*70,dy=200+Math.sin(t*0.001+i*2)*4
    ctx.fillStyle='#2a4a5a'
    ctx.fillRect(dx,dy,3,6+Math.sin(t*0.002+i*3)*3)
  }
  circle(400,420,180,rg(400,420,180,'#0d1a2a','#0d0606'))
  circle(400,420,160,'#120808')
  circle(400,420,140,'#0d0606')
  const rx=400+Math.sin(t*0.001)*8,ry=420+Math.cos(t*0.0008)*5
  glow(rx,ry,40,'#a85a3a')
  circle(rx,ry,8+Math.sin(t*0.002)*2,'#c4a46c')
  circle(rx,ry,4,'#e8d4a8')
  pl([[320,240],[480,240],[460,270],[340,270]],'#2a1010')
  ctx.fillStyle='#120808';ctx.fillRect(328,244,144,24)
  ctx.fillStyle='#4a2a2a';ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('⦿',400,260)
  rect(600,200,50,50,'#3a1a1a')
  rect(605,205,40,40,'#0d0606')
  for(let i=0;i<3;i++){ctx.fillStyle='#a85a3a';ctx.fillRect(612+i*12,212,6,6)}
  ensureParticles('cellar','water',15)
  ensureParticles('cellar','mist',8)
}

function drawKitchen(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#1a0a0a')
  ctx.fillStyle=grad(0,0,0,250,'#2a1010','#1a0a0a');ctx.fillRect(0,0,C(),250)
  rect(0,420,C(),180,'#120808')
  rect(60,200,140,200,'#3a1a1a');rect(70,210,120,180,'#120808')
  for(let i=0;i<3;i++){
    ctx.fillStyle='#0a0505';ctx.beginPath();ctx.arc(100+i*30,230,12,0,Math.PI*2);ctx.fill()
    ctx.fillStyle='#1a0a0a';ctx.beginPath();ctx.arc(100+i*30,230,6,0,Math.PI*2);ctx.fill()
  }
  rect(280,300,100,100,'#3a1a1a');rect(290,310,80,30,'#0d1a2a')
  const tp=Math.sin(t*0.004)*18
  glow(330,325+tp,15,'#2a4a5a')
  ctx.fillStyle='#3a5a6a';ctx.beginPath();ctx.arc(330,325+tp,3+Math.sin(t*0.005)*1,0,Math.PI*2);ctx.fill()
  rect(500,120,80,120,'#3a1a1a');rect(505,125,70,110,'#1a0a0a')
  ctx.fillStyle='#4a2a2a';ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('≡',540,180)
  rect(600,300,30,50,'#3a1a1a');rect(605,305,20,40,'#120808')
  ctx.fillStyle='#8a3a3a';ctx.beginPath();ctx.arc(615,325,3,0,Math.PI*2);ctx.fill()
  rect(350,430,100,40,'#3a1a1a');rect(355,435,90,30,'#2a1010')
  ctx.fillStyle='#4a2a2a';ctx.font='9px Georgia';ctx.fillText('⟐',400,454)
  ensureParticles('kitchen','ember',10)
  ensureParticles('kitchen','mist',5)
}

function drawChurch(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#1a0a2a')
  ctx.fillStyle=grad(0,0,0,300,'#2a1a3a','#1a0a2a');ctx.fillRect(0,0,C(),300)
  rect(0,420,C(),180,'#120808')
  pl([[320,260],[480,260],[450,340],[350,340]],'#3a1a1a')
  ctx.fillStyle='#0a0505';ctx.fillRect(330,268,140,28)
  circle(400,300,25,'#120808')
  circle(360,430,30,'#2a1010');circle(400,430,30,'#2a1010');circle(440,430,30,'#2a1010')
  circle(360,425,8+Math.sin(t*0.002)*2,'#8a3a3a')
  circle(400,425,8+Math.sin(t*0.0015)*2,'#8a3a3a')
  circle(440,425,8+Math.sin(t*0.0025)*2,'#8a3a3a')
  const cx=400+Math.sin(t*0.001)*25,cy=230+Math.sin(t*0.0007)*30
  glow(cx,cy,60,'#c4a46c')
  ctx.fillStyle='#e8d4a8';ctx.font='28px Georgia';ctx.textAlign='center'
  ctx.fillText('✦',cx,cy+8)
  rect(340,360,120,80,'#2a1010')
  ctx.fillStyle='#4a2a2a';ctx.font='9px Georgia'
  ctx.fillText('CÃO',400,400)
  rect(80,350,90,50,'#2a1010');ctx.fillStyle='#4a2a2a';ctx.fillText('🪶',125,380)
  rect(600,100,70,80,'#2a1010')
  const wc=0.3+Math.sin(t*0.002)*0.2
  ctx.fillStyle=`rgba(196,164,108,${wc})`;ctx.font='16px Georgia'
  ctx.fillText('◈',635,140)
  ensureParticles('church','firefly',10)
  ensureParticles('church','mist',12)
}

function drawGraveyard(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#0d1a2a')
  ctx.fillStyle=grad(0,0,0,200,'#1a0a2a','#0d1a2a');ctx.fillRect(0,0,C(),200)
  rect(0,400,C(),200,'#120808')
  for(let i=0;i<6;i++){
    const gx=60+i*115,gy=320+Math.sin(t*0.0008+i*1.5)*4
    rect(gx,gy,100,65,'#3a1a1a');rect(gx+8,gy+8,84,48,'#2a1010')
    ctx.strokeStyle='#3a1a1a';ctx.lineWidth=1;ctx.strokeRect(gx+10,gy+10,80,44)
    ctx.fillStyle='#4a2a2a';ctx.font='8px Georgia';ctx.textAlign='center'
    const lbs=['MEMÓRIA','TEMPO','NOME','MEDO','DESEJO','??']
    ctx.fillText(lbs[i],gx+50,gy+38)
  }
  rect(80,200,50,50,'#3a1a1a');rect(85,205,40,40,'#120808')
  ctx.fillStyle='#4a2a2a';ctx.font='8px Georgia'
  ctx.fillText('🔑',105,230)
  for(let i=0;i<25;i++){
    ctx.fillStyle=`rgba(90,74,122,${0.03+Math.sin(t*0.0005+i)*0.08})`
    ctx.beginPath();ctx.arc(50+Math.sin(t*0.0002+i*5)*350,50+Math.sin(t*0.0003+i*3)*150,1+Math.sin(t*0.001+i)*2,0,Math.PI*2);ctx.fill()
  }
  rect(250,330,8,70,'#3a1a1a')
  for(let i=0;i<4;i++){
    const a=Math.PI/4+Math.sin(t*0.0008+i)*0.3
    ln(254,340+i*14,254+Math.cos(a)*40,340+i*14-Math.sin(a)*35,'#3a1a1a',2)
    ctx.fillStyle='#8a3a3a';ctx.font='6px Georgia'
    ctx.fillText('~',254+Math.cos(a)*40,340+i*14-Math.sin(a)*35)
  }
  ensureParticles('graveyard','leaf',8)
  ensureParticles('graveyard','dust',15)
}

function drawMansion(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#1a0a0a')
  ctx.fillStyle=grad(0,0,0,250,'#2a1010','#1a0a0a');ctx.fillRect(0,0,C(),250)
  rect(0,420,C(),180,'#120808')
  rr(200,80,400,300,4,'#4a2a2a')
  rr(210,90,380,280,2,'#0d1a2a')
  const delay=Math.sin(t*0.0006)*15
  circle(390+delay,240,40,'#120808')
  circle(400,240,40,'#2a1010')
  rect(395,270,10,35,'#120808')
  rr(560,110,55,75,3,'#3a1a1a')
  circle(587,148,20,'#c4a46c')
  ln(587,148,587,132,'#120808',2);ln(587,148,603,148,'#120808',2)
  for(let i=0;i<4;i++){
    rect(40+i*80,180,60,75,'#3a1a1a');rect(45+i*80,185,50,65,'#2a1010')
    circle(70+i*80,200,5+Math.sin(t*0.002+i)*2,'#8a3a3a')
  }
  rect(600,350,80,100,'#3a1a1a');rect(605,355,70,90,'#1a0a0a')
  ctx.fillStyle='#4a2a2a';ctx.font='8px Georgia';ctx.textAlign='center'
  ctx.fillText('⚙',640,400)
  rect(360,440,80,40,'#3a1a1a');rect(365,445,70,30,'#2a1010')
  ensureParticles('mansion','dust',12)
  ensureParticles('mansion','firefly',6)
}

function drawLibrary(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#1a0a0a')
  ctx.fillStyle=grad(0,0,0,250,'#120808','#1a0a0a');ctx.fillRect(0,0,C(),250)
  rect(0,420,C(),180,'#120808')
  for(let i=0;i<4;i++){
    const sx=40+i*190
    rect(sx,90,170,310,'#3a1a1a')
    for(let j=0;j<6;j++){
      rect(sx+8,100+j*48,154,42,'#2a1010')
      rect(sx+12+Math.sin(t*0.0008+i+j)*3,104+j*48,146,34,'#1a0a0a')
    }
  }
  rr(270,250,160,100,4,'#3a1a1a');rr(280,260,140,80,2,'#120808')
  ctx.fillStyle='#4a2a2a';ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('Cérbero: Guardião do Subumano',350,290)
  ctx.fillText('Três cabeças: ciúme, vigilância, punição',350,310)
  ctx.fillText('Shiva herdou o dever',350,330)
  rect(680,350,35,45,'#3a1a1a');rect(683,355,29,35,'#120808')
  ctx.fillStyle='#a85a3a';ctx.font='16px Georgia';ctx.fillText('🔥',697,380)
  ensureParticles('library','dust',20)
  ensureParticles('library','ember',5)
}

function drawTower(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#1a0a2a')
  ctx.fillStyle=grad(0,0,0,250,'#2a1a3a','#1a0a2a');ctx.fillRect(0,0,C(),250)
  rect(0,420,C(),180,'#120808')
  rr(260,130,280,260,4,'#2a1010');rr(270,140,260,240,2,'#1a0a0a')
  for(let i=0;i<6;i++){
    const cy=160+i*35
    rect(290,cy,220,28,'#1a0a2a')
    const lit=Math.sin(t*0.002+i*1.5)>-0.3
    if(lit){glow(400,cy+14,20,'#a85a3a');ctx.fillStyle='#c4a46c'}
    else ctx.fillStyle='#3a1a1a'
    ctx.beginPath();ctx.arc(400,cy+14,6,0,Math.PI*2);ctx.fill()
  }
  const ex=400+Math.sin(t*0.0008)*5,ey=300+Math.sin(t*0.0005)*3
  circle(ex,ey,30,'#0a0505');circle(ex,ey,20,'#8a3a3a')
  circle(ex,ey,8,'#0a0505');circle(ex,ey,4,'#c4a46c')
  ctx.fillStyle='#c4a46c';ctx.font='16px Georgia';ctx.textAlign='center'
  ctx.fillText('☾',400,105)
  rect(100,250,180,140,'#120808');rect(105,255,170,130,'#0a0505')
  ctx.fillStyle='#4a2a2a';ctx.font='8px Georgia';ctx.fillText('◻',190,310)
  rect(550,80,100,100,'#2a1a3a')
  const wb=0.2+Math.sin(t*0.001)*0.15
  ctx.fillStyle=`rgba(196,164,108,${wb})`;ctx.font='18px Georgia'
  ctx.fillText('◎',600,130)
  rect(600,400,40,45,'#3a1a1a');rect(603,405,34,35,'#120808')
  ctx.fillStyle='#a85a3a';ctx.font='12px Georgia';ctx.fillText('🕯',620,428)
  ensureParticles('tower','ember',8)
  ensureParticles('tower','dust',10)
}

function drawTunnel(ctx, time) {
  const t=time
  rect(0,0,C(),H(),'#0a0505')
  const p=Math.sin(t*0.0008)*0.5+0.5
  for(let i=0;i<10;i++){
    ctx.strokeStyle=`rgba(138,58,58,${0.03+p*0.05})`;ctx.lineWidth=1
    ctx.beginPath();ctx.arc(400,320,130+i*35,0,Math.PI*2);ctx.stroke()
  }
  glow(400,300,150,'#8a3a3a')
  rr(340,270,120,120,4,'#2a1010');rr(350,280,100,100,2,'#0a0505')
  circle(400,310,25,'#0a0505')
  for(let i=0;i<3;i++){circle(375+i*25,305,6+Math.sin(t*0.002+i)*2,'#8a3a3a')}
  const er=20+Math.sin(t*0.0015)*5
  glow(400,180,80,'#8a3a3a')
  circle(400,180,er,'#8a3a3a');circle(400,180,er*0.6,'#a85a3a');circle(400,180,er*0.3,'#c4a46c')
  for(let i=0;i<3;i++){
    const a=t*0.001+i*2.1
    circle(400+Math.cos(a)*er*1.8,180+Math.sin(a)*er*1.8,3+Math.sin(t*0.003+i)*2,'#c4a46c')
  }
  const lp=0.2+Math.sin(t*0.0015)*0.15
  ctx.fillStyle=`rgba(196,164,108,${lp})`
  ctx.beginPath();ctx.moveTo(680,200);ctx.lineTo(760,100);ctx.lineTo(760,300);ctx.fill()
  rect(100,280,80,180,'#2a1010');ctx.fillStyle='#4a2a2a';ctx.font='8px Georgia';ctx.textAlign='center'
  ctx.fillText('⛓',140,370)
  ensureParticles('tunnel','ember',12)
  ensureParticles('tunnel','mist',20)
}
