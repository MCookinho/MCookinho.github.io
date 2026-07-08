const PAL = {
  paper:'#f2e6d0', paper_d:'#e0d0b4', paper_l:'#faf0dc',
  ink:'#2a1f14', ink_l:'#4a3a2a', ink_m:'#3a2a1a',
  sepia:'#8a7050', sepia_l:'#b8a080', sepia_d:'#5a4a30',
  rust:'#8a4a2a', rust_l:'#b86a3a',
  shadow:'rgba(42,31,20,0.3)', shadow_d:'rgba(42,31,20,0.6)',
  dark:'#1a1410'
}

let $ctx
function C(){return 800}
function H(){return 600}
function rect(x,y,w,h,c){$ctx.fillStyle=c;$ctx.fillRect(x,y,w,h)}
function circle(x,y,r,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function grad(x1,y1,x2,y2,c1,c2){const g=$ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rg(x,y,r,c1,c2){const g=$ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function ln(x1,y1,x2,y2,c,w){const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function pl(pts,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill()}
function tx(str,x,y,c,sz){$ctx.fillStyle=c;$ctx.font=(sz||14)+'px Georgia';$ctx.textAlign='center';$ctx.fillText(str,x,y)}

const PT = {
  dust:(t,i)=>({x:Math.sin(t*0.0003+i*2.7)*300+400,y:Math.sin(t*0.0005+i*1.3)*150+200+Math.random()*200,s:0.5+Math.random()*1.5,a:0.02+Math.random()*0.04,c:'#8a7a6a'}),
  ember:(t,i)=>({x:Math.sin(t*0.003+i*1.7)*20+400+Math.sin(i)*20,y:300+Math.sin(t*0.002+i*2.3)*200+Math.random()*50,s:1+Math.random()*2,a:0.3+Math.sin(t*0.005+i)*0.2,c:PAL.rust_l}),
  firefly:(t,i)=>({x:Math.sin(t*0.001+i*3.7)*250+400+Math.sin(i*5)*80,y:Math.sin(t*0.0008+i*2.9)*120+250+Math.random()*150,s:2+Math.random()*2,a:0.3+Math.sin(t*0.004+i*1.3)*0.3,c:PAL.sepia_l}),
  mist:(t,i)=>({x:Math.sin(t*0.0001+i*1.1)*500+400+Math.sin(i*7)*200,y:Math.sin(t*0.00015+i*0.7)*300+300+Math.random()*200,s:10+Math.random()*20,a:0.01+Math.random()*0.02,c:'#8a7a6a'}),
  leaf:(t,i)=>({x:(t*0.05+i*100)%900-50,y:Math.sin(t*0.002+i*2.3)*50+100+Math.random()*350,s:3+Math.random()*4,a:0.2+Math.random()*0.1,c:PAL.sepia})
}

let particles={}
function ensureParticles(id,type,n){
  const k=id+'_'+type
  if(!particles[k])particles[k]=[]
  while(particles[k].length<(n||20))particles[k].push(Math.random())
}
function drawParticles(ctx,id,t){
  for(const k of Object.keys(particles)){
    if(!k.startsWith(id+'_'))continue
    const type=k.split('_').slice(1).join('_'),fn=PT[type]
    if(!fn)continue
    for(const v of particles[k]){
      const p=fn(t,v)
      ctx.fillStyle=`rgba(${hr(p.c)},${p.a})`
      ctx.beginPath();ctx.arc(p.x,p.y,Math.max(p.s,0.5),0,Math.PI*2);ctx.fill()
    }
  }
}
function hr(h){const v=parseInt(h.slice(1),16);return (v>>16)+','+((v>>8)&255)+','+(v&255)}

function paperBG(ctx, seed){
  rect(0,0,C(),H(),PAL.paper)
  for(let i=0;i<60;i++){
    const x=(i*137+seed)%800,y=(i*251+seed)%600
    ctx.fillStyle=`rgba(200,190,170,${0.02+Math.random()*0.04})`
    ctx.fillRect(x,y,20+Math.random()*40,1)
  }
}

function vignette(ctx){
  const g=ctx.createRadialGradient(400,300,100,400,300,500)
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(30,20,10,0.5)')
  ctx.fillStyle=g;ctx.fillRect(0,0,800,600)
}

function drawScene(ctx, sid, t){
  $ctx=ctx
  const f={corridor:drCorridor,cellar:drCellar,kitchen:drKitchen,church:drChurch,crypt:drCrypt,graveyard:drGraveyard,mansion:drMansion,library:drLibrary,tower:drTower,tunnel:drTunnel}
  ctx.save()
  if(f[sid]){f[sid](ctx,t);drawParticles(ctx,sid,t);vignette(ctx)}
  else{rect(0,0,800,600,'#2a1f14');tx('◈',400,300,PAL.sepia_l,24)}
  ctx.restore()
}

function drCorridor(ctx,t){
  paperBG(ctx,1)
  rect(0,0,200,600,PAL.ink_l);rect(600,0,200,600,PAL.ink_l)
  rect(0,480,800,120,PAL.ink_m)
  for(let i=0;i<30;i++){ln(0,100+i*15,200,100+i*15,PAL.shadow,1)}
  rect(400,100,20,380,PAL.ink_m)
  circle(410,480,20,PAL.dark)
  for(let i=0;i<5;i++){
    const y=150+i*80
    ctx.fillStyle=PAL.sepia;ctx.beginPath();ctx.arc(300,y,8+Math.sin(t*0.002+i)*2,0,Math.PI*2);ctx.fill()
    ctx.fillStyle=PAL.rust;ctx.beginPath();ctx.arc(300,y,4,0,Math.PI*2);ctx.fill()
  }
  rect(350,400,100,80,PAL.ink_l)
  ctx.fillStyle=PAL.sepia;ctx.font='10px Georgia'
  tx('CHAVE NO CHÃO',400,440,PAL.sepia_l,10)
  tx('†',400,80,PAL.rust,18)
  tx('O PASSEIO',400,60,PAL.ink_m,12)
  ensureParticles('corridor','dust',15)
}

function drCellar(ctx,t){
  paperBG(ctx,7)
  rect(0,0,800,400,grad(0,0,0,400,PAL.ink_l,PAL.paper_d))
  for(let i=0;i<8;i++){
    rect(40+i*95,150,80,300,PAL.ink_m)
    for(let j=0;j<4;j++){ln(45+i*95,170+j*40,115+i*95,170+j*40,PAL.shadow,1)}
  }
  rect(600,200,60,60,PAL.ink_l);rect(608,208,44,44,PAL.dark)
  circle(630,230,6,PAL.sepia_l)
  rect(200,300,400,180,PAL.dark)
  ctx.fillStyle='rgba(42,31,20,0.1)'
  for(let i=0;i<5;i++){circle(350+Math.sin(i)*80,380+Math.cos(i)*60,30+Math.sin(i)*15,'rgba(42,31,20,0.1)')}
  tx('~',630,260,PAL.sepia_l,16)
  tx('CORRENTE',630,280,PAL.sepia,8)
  rect(300,400,60,20,PAL.ink_l);tx('⦿',330,415,PAL.sepia_l,12)
  ensureParticles('cellar','mist',10)
}

function drKitchen(ctx,t){
  paperBG(ctx,3)
  rect(0,0,800,200,grad(0,0,0,200,PAL.sepia,PAL.paper_d))
  rect(0,450,800,150,PAL.ink_m)
  rect(120,180,180,270,PAL.ink_l);rect(130,190,160,250,PAL.paper_d)
  circle(210,220,15,PAL.dark);circle(210,220,8,PAL.sepia)
  rect(350,200,100,250,PAL.ink_l);rect(360,210,80,40,PAL.ink_m)
  circle(400,230,12,PAL.sepia_l);circle(400,230,6,PAL.rust)
  const dp=Math.sin(t*0.004)*10
  ctx.fillStyle=PAL.sepia_l;ctx.beginPath();ctx.arc(400,230+dp,3+Math.sin(t*0.005)*1,0,Math.PI*2);ctx.fill()
  rect(500,180,80,120,PAL.ink_l);rect(505,185,70,110,PAL.paper_d)
  rect(500,180,80,20,PAL.ink_m)
  rect(600,280,40,60,PAL.ink_l);rect(605,285,30,50,PAL.dark)
  tx('≡',540,230,PAL.sepia,16)
  tx('PIA',400,350,PAL.sepia_l,10)
  ensureParticles('kitchen','ember',8)
}

function drChurch(ctx,t){
  paperBG(ctx,5)
  pl([[250,200],[550,200],[520,350],[280,350]],PAL.ink_m)
  rect(260,210,280,30,PAL.dark)
  rect(340,260,120,90,PAL.ink_l);rect(350,270,100,70,PAL.paper_d)
  circle(400,310,20,PAL.sepia_d)
  rect(80,330,120,80,PAL.ink_l);rect(85,335,110,70,PAL.paper_d)
  rect(600,120,80,120,PAL.ink_l);rect(605,125,70,110,PAL.dark)
  const wc=0.3+Math.sin(t*0.002)*0.2
  ctx.fillStyle=`rgba(138,112,80,${wc})`;ctx.font='18px Georgia';ctx.textAlign='center'
  ctx.fillText('◈',640,190)
  circle(400,260,15+Math.sin(t*0.001)*3,PAL.sepia_l)
  circle(280,370,8,PAL.sepia_l);circle(340,370,8,PAL.sepia_l);circle(460,370,8,PAL.sepia_l)
  tx('ALTAR',400,350,PAL.sepia,10)
  tx('PENA',130,370,PAL.sepia_l,8)
  ensureParticles('church','firefly',8)
}

function drCrypt(ctx,t){
  paperBG(ctx,2)
  rect(0,0,800,600,grad(0,0,0,600,PAL.ink,PAL.dark))
  for(let i=0;i<4;i++){
    rect(80+i*200,80,40,500,PAL.ink_m)
    rect(90+i*200,90,20,480,PAL.ink_l)
  }
  rect(200,280,400,120,PAL.ink_l);rect(210,290,380,100,PAL.dark)
  rect(250,300,300,60,PAL.ink_m)
  for(let i=0;i<6;i++){
    const cx=280+i*70
    rect(cx-10,320,20,30,PAL.ink_l)
    ctx.fillStyle=PAL.sepia_l;ctx.beginPath();ctx.arc(cx,330,5,0,Math.PI*2);ctx.fill()
  }
  circle(400,200,30,PAL.ink_m);circle(400,200,20,PAL.dark)
  tx('☗',400,208,PAL.sepia_l,18)
  const fl=0.15+Math.sin(t*0.0015)*0.1
  for(let i=0;i<6;i++){ctx.fillStyle=`rgba(184,160,128,${fl+Math.sin(t*0.002+i)*0.05})`;circle(280+i*70,330,3+Math.sin(t*0.003+i)*1,'')}
  ensureParticles('crypt','dust',20)
}

function drGraveyard(ctx,t){
  paperBG(ctx,11)
  rect(0,350,800,250,PAL.ink_m)
  for(let i=0;i<6;i++){
    const gx=60+i*115
    rect(gx,260,100,90,PAL.ink_l);rect(gx+5,265,90,80,PAL.paper_d)
    ctx.fillStyle=PAL.sepia;ctx.font='8px Georgia';ctx.textAlign='center'
    tx(['MEMÓRIA','TEMPO','NOME','MEDO','DESEJO','???'][i],gx+50,290,PAL.ink_m,8)
  }
  rect(200,230,60,30,PAL.ink_m)
  for(let i=0;i<5;i++){ln(230,240+i,230+Math.sin(t*0.001+i)*15,240+i-10,PAL.ink_l,1)}
  circle(400,100,80,PAL.sepia_d)
  ctx.fillStyle=PAL.sepia_l;ctx.beginPath();ctx.arc(400,100,60,0,Math.PI);ctx.fill()
  for(let i=0;i<30;i++){ctx.fillStyle=`rgba(74,58,42,${0.05+Math.sin(t*0.0005+i)*0.08})`;circle(50+Math.sin(t*0.0002+i*5)*350,50+Math.sin(t*0.0003+i*3)*150,1+Math.sin(t*0.001+i)*2,'')}
  ensureParticles('graveyard','leaf',10)
}

function drMansion(ctx,t){
  paperBG(ctx,13)
  rect(0,0,800,250,grad(0,0,0,250,PAL.sepia,PAL.paper_d))
  rect(200,100,400,350,PAL.ink_l);rect(210,110,380,330,PAL.paper_d)
  circle(390,240,30,PAL.dark);circle(400,240,30,PAL.ink_l)
  rect(395,270,10,35,PAL.dark)
  rect(560,110,55,75,PAL.ink_l);circle(587,148,15,PAL.sepia_l)
  ln(587,148,587,132,PAL.dark,2);ln(587,148,603,148,PAL.dark,2)
  for(let i=0;i<4;i++){rect(40+i*80,180,60,75,PAL.ink_l);rect(45+i*80,185,50,65,PAL.paper_d);circle(70+i*80,200,5+Math.sin(t*0.002+i)*2,PAL.rust)}
  rect(600,350,80,100,PAL.ink_l);rect(605,355,70,90,PAL.paper_d)
  tx('⚙',640,400,PAL.sepia,16)
  tx('666',640,390,PAL.sepia_l,10)
  ensureParticles('mansion','dust',12)
}

function drLibrary(ctx,t){
  paperBG(ctx,17)
  for(let i=0;i<4;i++){
    const sx=40+i*190
    rect(sx,90,170,310,PAL.ink_l)
    for(let j=0;j<6;j++){rect(sx+8,100+j*48,154,42,PAL.paper_d);rect(sx+12+Math.sin(t*0.0008+i+j)*3,104+j*48,146,34,PAL.paper)}
  }
  rect(270,250,160,100,PAL.ink_l);rect(280,260,140,80,PAL.paper_d)
  tx('Cérbero: Guardião',350,290,PAL.ink_m,9)
  tx('do Subumano',350,310,PAL.ink_m,9)
  rect(680,350,35,45,PAL.ink_l);rect(683,355,29,35,PAL.paper_d)
  tx('🔥',697,380,PAL.rust_l,16)
  ensureParticles('library','dust',15)
}

function drTower(ctx,t){
  paperBG(ctx,19)
  rect(0,0,200,600,PAL.ink_l);rect(600,0,200,600,PAL.ink_l)
  rect(0,480,800,120,PAL.ink_m)
  rect(200,100,400,400,PAL.ink_m);rect(210,110,380,380,PAL.paper_d)
  for(let i=0;i<6;i++){
    const cy=140+i*50
    rect(250,cy,300,30,PAL.ink_l)
    const lit=Math.sin(t*0.002+i*1.5)>-0.3
    ctx.fillStyle=lit?PAL.rust_l:PAL.ink_m
    circle(400,cy+15,8+Math.sin(t*0.003+i)*2,'')
  }
  circle(400,80,20,PAL.sepia_d)
  tx('☾',400,85,PAL.sepia_l,16)
  rect(100,250,180,140,PAL.ink_l);rect(105,255,170,130,PAL.paper_d)
  rect(550,80,100,100,PAL.ink_l)
  tx('◎',600,130,PAL.sepia_l,18)
  ensureParticles('tower','dust',10)
}

function drTunnel(ctx,t){
  paperBG(ctx,23)
  rect(0,0,800,600,grad(0,0,0,600,PAL.ink,PAL.dark))
  for(let i=0;i<8;i++){
    ctx.strokeStyle=`rgba(74,58,42,${0.05+Math.sin(t*0.0008+i)*0.05})`;ctx.lineWidth=1
    ctx.beginPath();ctx.arc(400,300,100+i*40,0,Math.PI*2);ctx.stroke()
  }
  rect(340,270,120,120,PAL.ink_l);rect(350,280,100,100,PAL.dark)
  circle(400,310,20,PAL.dark)
  for(let i=0;i<3;i++){circle(370+i*30,305,5+Math.sin(t*0.002+i)*2,PAL.rust_l)}
  const er=15+Math.sin(t*0.0015)*5
  circle(400,180,er,PAL.sepia_d);circle(400,180,er*0.6,PAL.rust_l);circle(400,180,er*0.3,PAL.sepia_l)
  for(let i=0;i<3;i++){const a=t*0.001+i*2.1;circle(400+Math.cos(a)*er*1.8,180+Math.sin(a)*er*1.8,2+Math.sin(t*0.003+i)*2,PAL.sepia_l)}
  ln(680,200,760,100,PAL.sepia_l,2);ln(680,200,760,300,PAL.sepia_l,2)
  rect(100,280,80,180,PAL.ink_l)
  tx('⛓',140,370,PAL.sepia_l,12)
  ctx.fillStyle=`rgba(184,160,128,${0.1+Math.sin(t*0.0015)*0.1})`
  ctx.fillRect(680,200,80,100)
  ensureParticles('tunnel','mist',15)
}
