const PAL = {
  bg:'#0a0505',brownD:'#1a0a0a',wineD:'#2a1010',wine:'#3a1a1a',
  brownM:'#4a2a2a',brownL:'#5a3a3a',grayB:'#6a4a4a',blood:'#8a3a3a',
  rust:'#a85a3a',gold:'#c4a46c',sand:'#e8d4a8',purpleD:'#2a1a3a',
  purpleM:'#3a2a5a',purpleL:'#5a4a7a',blueD:'#1a2a3a',blueG:'#3a5a6a'
}

function C(ctx){return ctx.canvas.width}
function H(ctx){return ctx.canvas.height}

function rect(ctx,x,y,w,h,color){
  ctx.fillStyle=color;ctx.fillRect(x,y,w,h)
}
function grad(ctx,x1,y1,x2,y2,c1,c2){
  const g=ctx.createLinearGradient(x1,y1,x2,y2)
  g.addColorStop(0,c1);g.addColorStop(1,c2);return g
}
function radGrad(ctx,x,y,r,c1,c2){
  const g=ctx.createRadialGradient(x,y,0,x,y,r)
  g.addColorStop(0,c1);g.addColorStop(1,c2);return g
}
function circle(ctx,x,y,r,color){
  ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()
}
function line(ctx,x1,y1,x2,y2,color,w){
  ctx.strokeStyle=color;ctx.lineWidth=w||1
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()
}
function roundRect(ctx,x,y,w,h,r,color){
  ctx.fillStyle=color;ctx.beginPath()
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r)
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.fill()
}
function path(ctx,pts,color,close){
  ctx.fillStyle=color;ctx.beginPath()
  ctx.moveTo(pts[0][0],pts[0][1])
  for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1])
  if(close)ctx.closePath();ctx.fill()
}
function shadow(ctx,x,y,w,h,intensity){
  ctx.fillStyle=`rgba(10,5,5,${intensity||0.3})`
  ctx.fillRect(x,y,w,h)
}

function drawFloor(ctx,y,color1,color2){
  const g=grad(ctx,0,y,0,H(ctx),color1,color2)
  rect(ctx,0,y,C(ctx),H(ctx)-y,g)
}
function drawCeiling(ctx,h,color1,color2){
  const g=grad(ctx,0,0,0,h,color1,color2)
  rect(ctx,0,0,C(ctx),h,g)
}
function drawWall(ctx,color){
  rect(ctx,0,0,C(ctx),H(ctx),color)
}
function drawDoor(ctx,x,y,w,h,color1,color2,frames){
  const g=grad(ctx,x,y,x+w,y,color1,color2)
  roundRect(ctx,x,y,w,h,3,g)
  if(frames){
    ctx.strokeStyle=PAL.wine;ctx.lineWidth=1
    ctx.strokeRect(x+4,y+4,w-8,h-8)
    ctx.beginPath();ctx.arc(x+w/2,y+h/2,8,0,Math.PI*2);ctx.stroke()
  }
}
function drawWindow(ctx,x,y,w,h,color1,color2,cross){
  const g=grad(ctx,x,y,x+w,y+h,color1,color2)
  roundRect(ctx,x,y,w,h,2,g)
  ctx.strokeStyle=PAL.wine;ctx.lineWidth=1
  ctx.strokeRect(x,y,w,h)
  if(cross){
    line(ctx,x+w/2,y,x+w/2,y+h,PAL.wine,1)
    line(ctx,x,y+h/2,x+w,y+h/2,PAL.wine,1)
  }
}
function drawGlow(ctx,x,y,r,color,intensity){
  const g=radGrad(ctx,x,y,r,color,`rgba(10,5,5,0)`)
  ctx.fillStyle=g
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()
}

function drawCorridor1(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const gC=grad(ctx,0,0,0,H(ctx),PAL.purpleD,PAL.bg)
  rect(ctx,0,0,C(ctx),250,gC)
  drawFloor(ctx,380,PAL.brownD,PAL.bg)
  drawDoor(ctx,300,180,200,300,PAL.brownM,PAL.wineD,true)
  for(let i=0;i<6;i++){
    const yy=120+i*50
    circle(ctx,50,yy,5,PAL.gold)
    circle(ctx,750,yy,5,PAL.gold)
    drawGlow(ctx,50,yy,30,`rgba(196,164,108,0.05)`,0.5)
  }
  const wave=Math.sin(time*0.002)*3
  circle(ctx,400,100,8,PAL.gold)
  drawGlow(ctx,400,100,60,`rgba(196,164,108,0.08)`)
  ctx.fillStyle=PAL.sand
  ctx.font='11px Georgia,serif'
  ctx.textAlign='center'
  ctx.fillText('O PASSEIO COMEÇA ONDE A LUZ TERMINA',400,560)
}

function drawCellar(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  drawWall(ctx,`#0d0808`)
  const drip=Math.sin(time*0.003)*2
  for(let i=0;i<20;i++){
    const xx=30+Math.random()*740|0,yy=Math.random()*300|0
    if(Math.random()>0.98)rect(ctx,xx,yy,2,6+Math.random()*4,PAL.blueG)
  }
  const gW=radGrad(ctx,400,420,180,PAL.blueD,PAL.bg)
  circle(ctx,400,420,180,gW)
  circle(ctx,400,420,170,PAL.brownD)
  circle(ctx,400,420,160,PAL.bg)
  const rTime=time*0.001
  const rx=400+Math.sin(rTime)*5,ry=420+Math.cos(rTime*0.7)*3
  circle(ctx,rx,ry,8,PAL.rust)
  drawGlow(ctx,rx,ry,25,`rgba(168,90,58,0.15)`)
  rect(ctx,300,200,200,4,PAL.wine)
  rect(ctx,300,200,4,60,PAL.wine)
  rect(ctx,496,200,4,60,PAL.wine)
  for(let i=0;i<4;i++){
    rect(ctx,304+i*48,204,44,3,PAL.brownM)
  }
  drawDoor(ctx,350,450,100,150,PAL.brownM,PAL.wine)
  ctx.fillStyle=PAL.blueG;ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('• • •',400,drip+100)
}

function drawCorridor2(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const gC=grad(ctx,0,0,0,200,PAL.wineD,PAL.bg)
  rect(ctx,0,0,C(ctx),200,gC)
  drawFloor(ctx,400,PAL.brownD,PAL.bg)
  const steps=[300,330,360,390,420,450]
  steps.forEach((y,i)=>{
    rect(ctx,280,y,240,8,PAL.brownM)
    rect(ctx,280+Math.sin(time*0.002+i)*2,y,240,3,PAL.wineD)
  })
  drawDoor(ctx,350,150,100,200,PAL.brownM,PAL.wineD,true)
  drawWindow(ctx,620,100,60,80,PAL.blueD,PAL.bg)
  for(let i=0;i<3;i++){
    const fX=650+Math.sin(time*0.002+i)*10
    ctx.fillStyle=PAL.blood;ctx.font='10px Georgia'
    ctx.fillText('~',fX,110+i*20)
  }
}

function drawKitchen(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.brownD)
  drawWall(ctx,PAL.wineD)
  drawFloor(ctx,400,PAL.brownM,PAL.bg)
  const stoveX=80,stoveY=200
  rect(ctx,stoveX,stoveY,160,200,PAL.brownM)
  rect(ctx,stoveX+10,stoveY+10,140,180,PAL.bg)
  circle(ctx,stoveX+80,stoveY+60,30,PAL.brownD)
  for(let i=0;i<3;i++){
    circle(ctx,stoveX+30+i*40,stoveY+30,18,PAL.bg)
    circle(ctx,stoveX+30+i*40,stoveY+30,12,PAL.brownD)
  }
  const radioX=550,radioY=280
  rect(ctx,radioX,radioY,120,80,PAL.brownM)
  rect(ctx,radioX+10,radioY+10,100,60,PAL.bg)
  circle(ctx,radioX+60,radioY+30,18,PAL.brownD)
  line(ctx,radioX+60,radioY+30,radioX+60+Math.cos(time*0.001)*15,radioY+30-8,PAL.rust,1)
  rect(ctx,radioX+40,radioY+55,40,8,PAL.wineD)
  const sinkX=280,sinkY=300
  rect(ctx,sinkX,sinkY,100,100,PAL.brownM)
  rect(ctx,sinkX+10,sinkY+15,80,40,PAL.blueD)
  const drop=Math.sin(time*0.005)*20
  circle(ctx,sinkX+50,sinkY+40+drop,3,PAL.blueG)
  drawDoor(ctx,350,430,100,170,PAL.brownM,PAL.wineD)
  rect(ctx,520,430,60,170,PAL.wineD)
  ctx.fillStyle=Math.sin(time*0.003)>0?PAL.rust:PAL.bg
  ctx.font='8px Georgia';ctx.textAlign='center'
  ctx.fillText('TOC... TOC... TOC...',sinkX+50,sinkY+100)
}

function drawPantry(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.brownD)
  drawWall(ctx,PAL.wine)
  drawFloor(ctx,420,PAL.brownM,PAL.bg)
  for(let i=0;i<5;i++){
    const sx=100+i*140
    rect(ctx,sx,150,120,20,PAL.brownM)
    rect(ctx,sx+10,170,100,14,PAL.wineD)
    rect(ctx,sx+10,184,100,14,PAL.wineD)
  }
  const shX=420,shY=200
  rect(ctx,shX,shY,80,60,PAL.brownM)
  rect(ctx,shX+10,shY+10,60,40,PAL.bg)
  circle(ctx,shX+40,shY+20,15,`rgba(90,58,58,0.6)`)
  rect(ctx,550,360,80,150,PAL.brownM)
  rect(ctx,555,365,70,140,PAL.wineD)
  drawDoor(ctx,350,430,100,170,PAL.brownM,PAL.wineD)
}

function drawCorridor3(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const gC=grad(ctx,0,0,0,180,PAL.purpleD,PAL.bg)
  rect(ctx,0,0,C(ctx),180,gC)
  drawFloor(ctx,380,PAL.brownD,PAL.bg)
  drawDoor(ctx,300,130,200,300,PAL.purpleM,PAL.wineD,true)
  ctx.fillStyle=PAL.gold;ctx.font='16px Georgia'
  ctx.textAlign='center';ctx.fillText('†',400,100)
  for(let i=0;i<5;i++){
    const bX=50+i*170
    if(bX<900){
      circle(ctx,bX,160,4,PAL.gold)
      drawGlow(ctx,bX,160,20,`rgba(196,164,108,0.06)`)
    }
  }
}

function drawChurch(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.purpleD)
  const gWall=grad(ctx,0,0,0,H(ctx),PAL.purpleD,PAL.bg)
  rect(ctx,0,0,C(ctx),300,gWall)
  drawFloor(ctx,400,PAL.brownD,PAL.bg)
  const pulse=Math.sin(time*0.001)*5
  path(ctx,[
    [350,280+pulse],[450,280+pulse],[420,350+pulse],[380,350+pulse]
  ],PAL.brownM,true)
  rect(ctx,360,290+pulse,80,30,PAL.bg)
  circle(ctx,400,310+pulse,25,PAL.wine)
  circle(ctx,360,420,25,PAL.brownM);circle(ctx,400,420,25,PAL.brownM);circle(ctx,440,420,25,PAL.brownM)
  for(let i=0;i<3;i++){
    circle(ctx,360+i*40,415,8,PAL.blood)
  }
  const cX=400+Math.sin(time*0.002)*20
  const cY=250+Math.sin(time*0.001)*30
  ctx.fillStyle=PAL.gold;ctx.font='20px Georgia';ctx.textAlign='center'
  ctx.fillText('✦',cX,cY)
  drawGlow(ctx,cX,cY,30,`rgba(196,164,108,0.08)`)
  drawDoor(ctx,350,430,100,170,PAL.brownM,PAL.wineD)
}

function drawCorridor4(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const gC=grad(ctx,0,0,0,160,PAL.blueD,PAL.bg)
  rect(ctx,0,0,C(ctx),160,gC)
  drawFloor(ctx,360,PAL.brownD,PAL.bg)
  drawDoor(ctx,340,140,120,250,PAL.brownM,PAL.wine,true)
  ctx.fillStyle='#15202a'
  rect(ctx,0,180,C(ctx),180)
  for(let i=0;i<3;i++){
    const fX=100+Math.random()*600|0,fY=200+Math.random()*140|0
    ctx.fillStyle=`rgba(90,58,58,${0.1+Math.random()*0.15})`
    ctx.font=`${10+Math.random()*8|0}px Georgia`
    ctx.fillText('♢',fX,fY)
  }
  ctx.fillStyle=PAL.grayB;ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('⟡',600,300)
}

function drawGraveyard(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.blueD)
  drawCeiling(ctx,200,PAL.blueD,PAL.bg)
  drawFloor(ctx,380,PAL.brownD,PAL.bg)
  const fogX=Math.sin(time*0.0005)*20
  for(let i=0;i<6;i++){
    const gx=80+i*120,fgy=340+Math.sin(time*0.002+i)*5
    rect(ctx,gx,fgy,100,70,PAL.brownM)
    rect(ctx,gx+10,fgy+10,80,50,PAL.wineD)
    const arc=Math.sin(time*0.001+i)*2
    ctx.fillStyle=PAL.brownL;ctx.beginPath()
    ctx.arc(gx+50,fgy,40,Math.PI,0)
    ctx.fill()
    ctx.fillStyle=PAL.wine;ctx.font='9px Georgia';ctx.textAlign='center'
    const labels=['MEMÓRIA','TEMPO','NOME','MEDO','DESEJO','???']
    ctx.fillText(labels[i],gx+50,fgy+45)
  }
  drawDoor(ctx,350,50,100,150,PAL.brownM,PAL.wineD)
  for(let i=0;i<8;i++){
    const cx=Math.random()*800|0,cy=Math.random()*200|0
    ctx.fillStyle=`rgba(90,74,122,${0.1+Math.random()*0.2})`
    ctx.beginPath();ctx.arc(cx,cy,2+Math.random()*3,0,Math.PI*2);ctx.fill()
  }
  const cX=300,trunkY=380
  rect(ctx,cX,trunkY,12,60,PAL.brownM)
  for(let i=0;i<5;i++){
    const angle=Math.PI/4+Math.sin(time*0.001+i)*0.2
    ctx.strokeStyle=PAL.brownM;ctx.lineWidth=3
    ctx.beginPath();ctx.moveTo(cX+6,trunkY+i*12)
    const ex=cX+6+Math.cos(angle)*50,ey=trunkY+i*12-Math.sin(angle)*40
    ctx.lineTo(ex,ey);ctx.stroke()
    ctx.fillStyle=PAL.blood;ctx.font='6px Georgia'
    ctx.fillText('~',ex,ey)
  }
}

function drawCorridor5(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const gC=grad(ctx,0,0,0,200,PAL.brownL,PAL.bg)
  rect(ctx,0,0,C(ctx),200,gC)
  drawFloor(ctx,380,PAL.brownM,PAL.bg)
  drawDoor(ctx,310,120,180,300,PAL.brownM,PAL.wine,true)
  for(let i=0;i<6;i++){
    const yy=100+i*50
    circle(ctx,80,yy,4,PAL.gold)
    circle(ctx,720,yy,4,PAL.gold)
    drawGlow(ctx,80,yy,25,`rgba(196,164,108,0.05)`)
  }
  for(let i=0;i<3;i++){
    const ts=Math.sin(time*0.002+i*2)*3
    ctx.fillStyle=PAL.gold;ctx.font='10px Georgia'
    ctx.fillText('✧',400+ts*5,160+i*80)
  }
}

function drawMansion(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.wineD)
  drawWall(ctx,PAL.wine)
  drawFloor(ctx,380,PAL.brownM,PAL.bg)
  const mirrorX=280,mirrorY=80
  rect(ctx,mirrorX,mirrorY,240,300,PAL.gold)
  rect(ctx,mirrorX+10,mirrorY+10,220,280,PAL.blueD)
  const delay=Math.sin(time*0.001)*10
  const rX=mirrorX+110+delay
  ctx.fillStyle=PAL.brownD;ctx.beginPath()
  ctx.arc(rX,mirrorY+140,30,0,Math.PI*2);ctx.fill()
  ctx.fillStyle=PAL.rust;ctx.beginPath()
  ctx.arc(mirrorX+110,mirrorY+140,30,0,Math.PI*2);ctx.fill()
  rect(ctx,mirrorX+95,mirrorY+170,30,50,PAL.brownD)
  ctx.strokeStyle=PAL.gold;ctx.lineWidth=1
  ctx.strokeRect(mirrorX,mirrorY,240,300)
  ctx.strokeRect(mirrorX+5,mirrorY+5,230,290)
  const clockX=560,clockY=120
  rect(ctx,clockX,clockY,60,80,PAL.brownM)
  circle(ctx,clockX+30,clockY+40,22,PAL.gold)
  line(ctx,clockX+30,clockY+40,clockX+30,clockY+30,PAL.brownD,1)
  line(ctx,clockX+30,clockY+40,clockX+45,clockY+40,PAL.brownD,1)
  rect(ctx,600,350,80,120,PAL.brownM)
  for(let i=0;i<4;i++){
    rect(ctx,605,355+i*28,70,24,PAL.wineD)
  }
  drawDoor(ctx,350,430,100,170,PAL.brownM,PAL.wineD)
  rect(ctx,620,450,60,130,PAL.wineD)
  for(let i=0;i<3;i++){
    const pX=50+i*80
    rect(ctx,pX,180,60,80,PAL.brownM)
    rect(ctx,pX+5,185,50,70,PAL.wine)
    ctx.fillStyle=PAL.blood;ctx.beginPath()
    ctx.arc(pX+30,200,8,0,Math.PI*2);ctx.fill()
    ctx.fillStyle=PAL.bg;ctx.beginPath()
    ctx.arc(pX+30,200,3,0,Math.PI*2);ctx.fill()
  }
}

function drawLibrary(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.brownD)
  drawWall(ctx,PAL.wineD)
  drawFloor(ctx,400,PAL.brownM,PAL.bg)
  for(let i=0;i<4;i++){
    const sx=40+i*190
    rect(ctx,sx,100,170,300,PAL.brownM)
    for(let j=0;j<6;j++){
      const by=sx+10+j*28
      rect(ctx,by,110+Math.sin(time*0.001+i+j)*5,150,24,PAL.wineD)
      rect(ctx,by+3,113,144,18,PAL.wine)
    }
  }
  rect(ctx,250,370,300,20,PAL.brownM)
  rect(ctx,270,250,160,120,PAL.brownM)
  rect(ctx,280,260,140,100,PAL.wineD)
  ctx.fillStyle=PAL.sand;ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('Cérbero: Guardião do Subumano',310,290)
  ctx.fillText('Três cabeças: ciúme, vigilância, punição',310,310)
  ctx.fillText('Sua filha, Shiva, herdou o dever',310,330)
  drawDoor(ctx,50,430,80,170,PAL.brownM,PAL.wineD)
  for(let i=0;i<6;i++){
    ctx.fillStyle=`rgba(196,164,108,${0.03+Math.sin(time*0.001+i)*0.02})`
    ctx.fillRect(40+i*190,105,170,290)
  }
}

function drawCorridor6(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.purpleD)
  const spiral=time*0.005
  for(let i=0;i<40;i++){
    const angle=spiral+i*0.3
    const rad=100+i*8
    const sx=400+Math.cos(angle)*Math.min(rad,350)
    const sy=300+Math.sin(angle)*Math.min(rad,200)
    ctx.fillStyle=PAL.purpleM
    ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);ctx.fill()
  }
  drawDoor(ctx,340,80,120,200,PAL.purpleM,PAL.wineD)
  rect(ctx,200,380,400,80,PAL.brownD)
  rect(ctx,390,400,20,40,PAL.purpleM)
  ctx.fillStyle=PAL.gold;ctx.font='18px Georgia';ctx.textAlign='center'
  ctx.fillText('◈',400,350)
  drawGlow(ctx,400,350,40,`rgba(196,164,108,0.06)`)
  ctx.fillStyle=PAL.blood;ctx.font='9px Georgia'
  ctx.fillText('VOCÊ ESTÁ DIFERENTE',400,560)
}

function drawTower(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.purpleD)
  const gT=radGrad(ctx,400,200,400,PAL.purpleM,PAL.purpleD)
  rect(ctx,0,0,C(ctx),350,gT)
  drawFloor(ctx,400,PAL.brownD,PAL.bg)
  rect(ctx,200,120,400,280,PAL.wineD)
  rect(ctx,220,140,360,240,PAL.wine)
  rect(ctx,300,200,200,120,PAL.brownM)
  for(let i=0;i<6;i++){
    const cy=230+i*14
    rect(ctx,310,cy,180,10,PAL.purpleD)
    circle(ctx,400,cy+5,Math.sin(time*0.002+i)>0?4:2,PAL.rust)
  }
  const eyeX=400+Math.sin(time*0.001)*5
  const eyeY=260+Math.sin(time*0.0007)*3
  circle(ctx,eyeX,eyeY,30,PAL.bg)
  circle(ctx,eyeX,eyeY,20,PAL.blood)
  circle(ctx,eyeX,eyeY,8,PAL.bg)
  circle(ctx,eyeX,eyeY,4,PAL.gold)
  rect(ctx,300,80,200,40,PAL.brownM)
  ctx.fillStyle=PAL.gold;ctx.font='12px Georgia';ctx.textAlign='center'
  ctx.fillText('☾',400,105)
  drawDoor(ctx,330,420,140,180,PAL.brownM,PAL.wineD)
}

function drawTunnel(ctx,time){
  rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
  const pulse=Math.sin(time*0.001)*0.5+0.5
  for(let i=0;i<10;i++){
    const rx=200+i*40,ry=100
    const alpha=0.05+pulse*0.08
    ctx.strokeStyle=`rgba(138,58,58,${alpha})`
    ctx.lineWidth=1
    ctx.beginPath();ctx.arc(400,350,rx,0,Math.PI*2);ctx.stroke()
  }
  drawGlow(ctx,400,300,100,`rgba(138,58,58,${0.05+pulse*0.08})`)
  rect(ctx,350,280,100,120,PAL.brownM)
  rect(ctx,360,290,80,100,PAL.wineD)
  circle(ctx,400,320,25,PAL.bg)
  for(let i=0;i<3;i++){
    circle(ctx,370+i*30,315,6,PAL.blood)
  }
  const eR=20+Math.sin(time*0.002)*5
  circle(ctx,400,200,eR,PAL.blood)
  circle(ctx,400,200,eR*0.7,PAL.rust)
  circle(ctx,400,200,eR*0.3,PAL.gold)
  drawGlow(ctx,400,200,80,`rgba(138,58,58,0.1)`)
  const lightPulse=0.3+Math.sin(time*0.002)*0.2
  ctx.fillStyle=`rgba(196,164,108,${lightPulse})`
  ctx.beginPath()
  ctx.moveTo(700,200);ctx.lineTo(780,100);ctx.lineTo(780,300)
  ctx.fill()
  drawDoor(ctx,0,430,100,170,PAL.brownM,PAL.wineD)
  ctx.fillStyle=PAL.blood;ctx.font='10px Georgia';ctx.textAlign='center'
  ctx.fillText('⟳',400,550)
}

const DRAW_FUNCS = {
  corridor_1:drawCorridor1,
  cellar:drawCellar,
  corridor_2:drawCorridor2,
  kitchen:drawKitchen,
  pantry:drawPantry,
  corridor_3:drawCorridor3,
  church:drawChurch,
  corridor_4:drawCorridor4,
  graveyard:drawGraveyard,
  corridor_5:drawCorridor5,
  mansion:drawMansion,
  library:drawLibrary,
  corridor_6:drawCorridor6,
  tower:drawTower,
  tunnel:drawTunnel
}

function drawDiorama(ctx,scene,time){
  const fn=DRAW_FUNCS[scene]
  if(fn)fn(ctx,time)
  else{
    rect(ctx,0,0,C(ctx),H(ctx),PAL.bg)
    ctx.fillStyle=PAL.blood;ctx.font='30px Georgia';ctx.textAlign='center'
    ctx.fillText('◈',400,300)
  }
}
