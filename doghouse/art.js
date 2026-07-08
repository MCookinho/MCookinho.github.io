const PAL = {
  paper:'#1a140e', paper_d:'#14100a', paper_l:'#2a2016',
  ink:'#0a0806', ink_l:'#1a140e', ink_m:'#14100a',
  sepia:'#6a5a4a', sepia_l:'#9a8a7a', sepia_d:'#2a1a0e',
  rust:'#7a4a2a', rust_l:'#a06a3a', rust_d:'#4a2a1a',
  shadow:'rgba(0,0,0,0.5)', shadow_d:'rgba(0,0,0,0.85)', shadow_m:'rgba(0,0,0,0.6)',
  dark:'#050302', stone:'#2a2218', stone_l:'#3a3226', stone_d:'#1a140e',
  moss:'#2a3a1a', gold:'#b89860',
  blood:'rgba(74,26,14,0.3)', blood_s:'rgba(74,26,14,0.6)'
}

const C = ()=>800, H = ()=>600

function rect(x,y,w,h,c){const g=$ctx;g.fillStyle=c;g.fillRect(x,y,w,h)}
function circle(x,y,r,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function grad(x1,y1,x2,y2,c1,c2){const g=$ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rgrad(x,y,r,c1,c2){const g=$ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function ln(x1,y1,x2,y2,c,w){const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function pl(pts,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill()}

function wln(x1,y1,x2,y2,c,w,t,amp){
  amp=amp||1.5;const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1
  g.beginPath();const steps=Math.max(4,Math.abs(x2-x1)/4|0)
  for(let i=0;i<=steps;i++){
    const f=i/steps
    const px=x1+(x2-x1)*f+Math.sin(t*0.002+x1*f*0.05)*amp
    const py=y1+(y2-y1)*f+Math.sin(t*0.002+y2*f*0.05+1)*amp
    i===0?g.moveTo(px,py):g.lineTo(px,py)
  }
  g.stroke()
}

function hatch(x,y,w,h,a,s,color,t){
  const g=$ctx;g.strokeStyle=color||PAL.shadow;g.lineWidth=0.4
  const rad=a*Math.PI/180,steps=Math.max(w,h)/s
  for(let i=-steps;i<steps;i++){
    const off=i*s
    const x1=x+Math.cos(rad)*off,x2=x1+w
    const y1=y+Math.sin(rad)*off,y2=y1+h
    g.beginPath();g.moveTo(x1,y1+Math.sin(t*0.001+i)*1.5);g.lineTo(x2,y2+Math.sin(t*0.001+i+1)*1.5);g.stroke()
  }
}

function paperGrain(seed){
  for(let i=0;i<80;i++){
    const x=(i*137+seed)%800,y=(i*251+seed)%600
    $ctx.fillStyle=`rgba(26,18,10,${0.01+Math.sin(seed+i*3.7)*0.02})`
    $ctx.fillRect(x,y,5+Math.sin(seed+i*1.3)*6,1)
  }
}

function vignette(ctx){
  const g=ctx.createRadialGradient(400,300,150,400,300,500)
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.5,'rgba(0,0,0,0.1)');g.addColorStop(1,'rgba(0,0,0,0.85)')
  ctx.fillStyle=g;ctx.fillRect(0,0,800,600)
}

let $ctx

/* ─── STONE WALL ─── */
function stoneWall(t){
  rect(0,0,800,600,PAL.stone_d)
  for(let row=0;row<14;row++){
    for(let col=0;col<9;col++){
      const bw=86+Math.sin(row*3+col*7)*6, bh=38+Math.sin(row*5+col*2)*4
      const bx=col*92+(row%2)*46-bw/2+46, by=row*44
      const ox=Math.sin(t*0.0003+row*3+col*7)*2, oy=Math.sin(t*0.0004+row*5+col*2)*1.5
      const ci=Math.sin(row*4+col*9)*0.08
      rect(bx+2+ox,by+2+oy,bw,bh,PAL.stone_d)
      rect(bx+3+ox,by+3+oy,bw-2,bh-2,`rgba(42,34,24,${0.5+ci})`)
      wln(bx+ox,by+oy,bx+bw+ox,by+oy,PAL.ink_l,0.6,t)
      wln(bx+ox,by+oy,bx+ox,by+bh+oy,PAL.ink_l,0.6,t)
      if(Math.sin(row*7+col*11)>0.7){
        const cx=bx+bw*0.3+Math.sin(t*0.001+row+col)*5,cy=by+bh*0.3
        wln(cx,cy,cx+8,cy+3,PAL.ink_m,0.4,t)
        wln(cx+3,cy+2,cx+5,cy+8,PAL.ink_m,0.4,t)
      }
    }
  }
}

/* ─── FLOOR ─── */
function floor(t){
  rect(0,430,800,170,PAL.ink_m)
  for(let row=0;row<6;row++){
    for(let col=0;col<12;col++){
      const fx=col*70+(row%2)*35, fy=430+row*30
      const fw=64+Math.sin(col*3+row*7)*6, fh=24+Math.sin(col*5+row*2)*4
      rect(fx+2,fy+2,fw,fh,PAL.stone_d)
      rect(fx+3,fy+3,fw-2,fh-2,PAL.stone)
      wln(fx,fy,fx+fw,fy,PAL.ink_l,0.5,t)
      wln(fx,fy,fx,fy+fh,PAL.ink_l,0.5,t)
    }
  }
  for(let i=0;i<6;i++){
    const fx=(i*157+23)%760, fy=440+(i*89)%130
    rect(fx,fy,2,3,PAL.ink_m)
  }
}

/* ─── DUST MOTES ─── */
function dustMotes(t){
  for(let i=0;i<12;i++){
    const dx=(i*137+Math.sin(t*0.0003+i*5)*400)%760+20
    const dy=(i*251+Math.cos(t*0.0002+i*7)*300)%550+50
    const ds=1.5+Math.sin(t*0.001+i*3)*0.8
    const da=0.03+Math.sin(t*0.0008+i*4)*0.02
    circle(dx,dy,ds,`rgba(110,90,70,${da})`)
  }
}

/* ─── COBWEB ─── */
function cobweb(x,y,w,h,t){
  for(let i=0;i<5;i++){
    const a=Math.PI*0.5+i*0.3
    wln(x,y,x+Math.cos(a)*w,y+Math.sin(a)*h,PAL.shadow,0.3,t,0.5)
  }
  for(let j=0;j<3;j++){
    const r=10+j*8
    for(let a=0;a<Math.PI*1.5;a+=0.2){
      const cx=x+Math.cos(a+Math.sin(t*0.0005)*0.3)*r
      const cy=y+Math.sin(a+Math.sin(t*0.0005)*0.3)*r*0.5
      $ctx.fillStyle=`rgba(110,90,70,${0.03+Math.sin(t*0.001+j)*0.02})`
      $ctx.fillRect(cx,cy,0.5,0.5)
    }
  }
}

/* ─── VIEWS ─── */

/* ─── NORTH: Porta, grade, janela ─── */
function drNorth(ctx,t){
  $ctx=ctx
  stoneWall(t);floor(t);dustMotes(t)

  // Shadow overlay (corners darker)
  rect(0,0,800,600,grad(0,0,800,0,'rgba(0,0,0,0.3)','rgba(0,0,0,0)'))
  rect(0,0,800,600,grad(0,0,0,600,'rgba(0,0,0,0.2)','rgba(0,0,0,0)'))

  // Door
  const dx=270,dy=70,dw=260,dh=440
  rect(dx-4,dy-4,dw+8,dh+8,PAL.ink_l)
  rect(dx,dy,dw,dh,PAL.ink)
  // wood grain
  for(let i=0;i<8;i++){
    const gy=dy+20+i*55
    wln(dx+5+Math.sin(i)*10,gy+Math.sin(t*0.001)*3,dx+dw-10,gy+Math.sin(t*0.001+1)*3,PAL.ink_l,0.4,t,0.3)
  }
  // iron bands
  for(let i=0;i<3;i++){
    const by=dy+40+i*170
    rect(dx-10,by,dw+20,6,PAL.rust)
    rect(dx-10,by-2,dw+20,10,grad(0,by,0,by+6,'rgba(60,30,15,0.6)','rgba(40,20,10,0.8)'))
    // rivets
    for(let r=0;r<4;r++)circle(dx+20+r*75,by+5,3,PAL.rust_l)
  }
  // 3 keyholes
  for(let k=0;k<3;k++){
    const kx=dx+80+k*50,ky=dy+140+k*130
    rect(kx-6,ky-8,12,16,PAL.dark)
    circle(kx,ky,4,PAL.dark)
    rect(kx-2,ky-4,4,8,PAL.dark)
    circle(kx,ky,2,PAL.rust_l)
    wln(kx-6,ky-8,kx+6,ky-8,PAL.rust,0.5,t)
    wln(kx+6,ky-8,kx+6,ky+8,PAL.rust,0.5,t)
    wln(kx+6,ky+8,kx-6,ky+8,PAL.rust,0.5,t)
    wln(kx-6,ky+8,kx-6,ky-8,PAL.rust,0.5,t)
  }
  // door window (upper)
  rect(dx+60,dy+50,140,80,PAL.ink_m)
  rect(dx+60,dy+50,140,80,grad(dx+60,dy+50,dx+200,dy+130,'rgba(20,14,10,0.8)','rgba(5,3,2,0.95)'))
  for(let i=0;i<4;i++)ln(dx+80+i*30,dy+50,dx+80+i*30,dy+130,PAL.rust,2)
  ln(dx+60,dy+90,dx+200,dy+90,PAL.rust,2)

  // Chains on door
  for(let i=0;i<3;i++){
    const cy=dy+60+i*130
    wln(dx-5,cy,dx+dw+5,cy+Math.sin(i)*8,PAL.rust,1.5,t)
    for(let j=0;j<4;j++)circle(dx-10+j*70,cy+Math.sin(i+j)*3,3,PAL.rust_l)
  }
  // padlock on center chain
  circle(dx+130,dy+320,10,PAL.rust)
  circle(dx+130,dy+320,6,PAL.rust_l)
  rect(dx+128,dy+310,4,10,PAL.rust)

  // Grate (left)
  rect(50,190,110,160,PAL.ink_l)
  rect(55,195,100,150,PAL.dark)
  for(let i=0;i<4;i++)ln(65+i*25,195,65+i*25,345,PAL.rust,2)
  for(let i=0;i<4;i++){
    const gy=205+i*40
    ln(55,gy,155,gy,PAL.rust,1.5)
  }
  // darkness behind grate
  rect(60,200,90,140,PAL.ink)

  // Window (right)
  rect(580,130,100,90,PAL.ink_m)
  for(let i=0;i<2;i++)ln(605+i*50,130,605+i*50,220,PAL.ink_l,2)
  ln(580,170,680,170,PAL.ink_l,2)

  // Wall crucifix
  rect(640,250,12,50,PAL.ink_l)
  rect(630,260,32,8,PAL.ink_l)

  // Shadows
  rect(0,0,30,600,PAL.shadow_d)
  rect(770,0,30,600,PAL.shadow_d)
  rect(0,530,800,70,grad(0,530,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))
  hatch(0,0,800,100,45,12,PAL.shadow,t)
  paperGrain(1)
  vignette(ctx)
}

/* ─── EAST: Prateleiras, espelho, vela ─── */
function drEast(ctx,t){
  $ctx=ctx
  stoneWall(t);floor(t);dustMotes(t)
  rect(0,0,800,600,grad(0,0,800,0,'rgba(0,0,0,0.15)','rgba(0,0,0,0)'))

  // Shelves unit
  rect(30,70,320,380,PAL.ink_l)
  rect(35,75,310,370,PAL.ink)
  // shelf planks
  for(let i=0;i<4;i++){
    const sy=75+i*100
    rect(35,sy,310,8,PAL.ink_l)
    wln(35,sy,345,sy,PAL.ink_m,0.6,t)
    // bracket
    rect(45,sy+8,6,12,PAL.rust)
    rect(330,sy+8,6,12,PAL.rust)
  }
  // items on shelves
  rect(80,85,30,40,PAL.paper_d) // book
  rect(120,95,45,30,PAL.paper_l) // book
  rect(190,90,25,35,PAL.sepia_d) // candle spot
  rect(260,92,30,33,PAL.dark) // box
  rect(80,185,50,35,PAL.paper_d)
  rect(150,190,35,30,PAL.sepia_d)
  rect(220,185,40,35,PAL.ink_m)
  // cobwebs on shelves
  cobweb(35,75,40,30,t)
  cobweb(340,175,30,25,t)

  // Broken mirror (right side)
  rect(430,80,220,280,PAL.ink_l)
  rect(435,85,210,270,PAL.dark)
  // mirror frame (ornate)
  wln(430,80,650,80,PAL.rust,1.5,t)
  wln(650,80,650,360,PAL.rust,1.5,t)
  wln(650,360,430,360,PAL.rust,1.5,t)
  wln(430,360,430,80,PAL.rust,1.5,t)
  // mirror shards (reflective)
  const mp=Math.sin(t*0.0008)*3
  const sp=[[460,105],[620,95],[630,330],[470,350]]
  pl(sp,PAL.sepia_l)
  for(let i=0;i<8;i++){
    const sx=450+Math.sin(i*37+Math.floor(t*0.01)%100)*100
    const sy=110+Math.sin(i*53+Math.floor(t*0.01)%100)*200
    const sa=Math.sin(t*0.003+i)*0.2+0.1
    $ctx.globalAlpha=sa
    wln(sx,sy,sx+Math.sin(t*0.002+i)*10,sy-20+Math.cos(t*0.002+i)*10,PAL.sepia_l,0.8,t)
    $ctx.globalAlpha=1
  }
  // cracked reflection
  $ctx.globalAlpha=0.08
  $ctx.fillStyle=PAL.gold
  $ctx.fillRect(465,115,5,5)
  $ctx.fillRect(510,180,5,5)
  $ctx.fillRect(580,250,5,5)
  $ctx.globalAlpha=1

  // Loose brick highlight
  const briAlpha=0.4+Math.sin(t*0.002)*0.15
  wln(555,375,595,375,PAL.sepia_l,briAlpha,t,1)
  wln(555,375,555,415,PAL.sepia_l,briAlpha,t,1)
  wln(555,415,595,415,PAL.sepia_l,briAlpha,t,1)
  wln(595,375,595,415,PAL.sepia_l,briAlpha,t,1)

  // Shadows
  rect(0,0,30,600,PAL.shadow_d)
  rect(770,0,30,600,PAL.shadow_d)
  rect(0,530,800,70,grad(0,530,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))
  hatch(0,0,800,450,-45,15,PAL.shadow,t)
  paperGrain(3)
  vignette(ctx)
}

/* ─── SOUTH: Ralo, inscricao, goteira ─── */
function drSouth(ctx,t){
  $ctx=ctx
  stoneWall(t);floor(t);dustMotes(t)
  rect(0,0,800,600,grad(0,0,0,600,'rgba(0,0,0,0.2)','rgba(0,0,0,0)'))

  // Water stains
  for(let i=0;i<6;i++){
    const sx=100+Math.sin(i*37)*350,sy=60+Math.sin(i*53)*200
    const sr=25+Math.sin(i*71)*15
    $ctx.fillStyle=`rgba(42,34,26,${0.08+Math.sin(t*0.001+i)*0.04})`
    $ctx.beginPath();$ctx.arc(sx,sy,sr,0,Math.PI*2);$ctx.fill()
    $ctx.fillStyle=`rgba(42,34,26,${0.04+Math.sin(t*0.001+i+1)*0.03})`
    $ctx.beginPath();$ctx.arc(sx-5,sy+5,sr*0.6,0,Math.PI*2);$ctx.fill()
  }

  // Dripping water
  const dp=Math.sin(t*0.003)*12
  circle(400,70+dp,4,`rgba(160,140,120,${0.15+Math.sin(t*0.004)*0.05})`)
  circle(300,120+Math.sin(t*0.004)*10,3,`rgba(160,140,120,${0.12})`)
  circle(550,90+Math.sin(t*0.005+1)*8,3,`rgba(160,140,120,${0.1})`)
  // water on floor
  circle(400,500+dp,10,`rgba(160,140,120,${0.06})`)
  circle(400,510,20,`rgba(160,140,120,${0.03})`)

  // Wall inscription: ESQUEÇA
  $ctx.fillStyle=PAL.rust_l
  $ctx.font='28px Georgia'
  $ctx.textAlign='center'
  for(let i=0;i<7;i++){
    const letters='ESQUEÇA'
    const la=0.25+Math.sin(t*0.002+i*0.5)*0.15
    $ctx.globalAlpha=la
    $ctx.fillText(letters[i],165+i*55+Math.sin(t*0.001+i)*2,310+Math.sin(t*0.0015+i)*2)
    // drip effect under each letter
    if(i%2===0)$ctx.fillRect(165+i*55+Math.sin(t*0.001)*2-2+Math.sin(i)*5,315+Math.sin(i*3)*3,1,5+Math.sin(t*0.01+i)*3)
  }
  $ctx.globalAlpha=1

  // Claw marks
  for(let i=0;i<5;i++){
    const cx=580+Math.sin(i*2)*40,cy=200+Math.sin(i*3)*30
    $ctx.strokeStyle=PAL.blood
    $ctx.lineWidth=2
    $ctx.beginPath()
    $ctx.moveTo(cx,cy)
    $ctx.quadraticCurveTo(cx+Math.sin(t*0.001+i)*20,cy+20,cx+Math.sin(t*0.001+i+1)*30,cy+50+Math.sin(t*0.001)*5)
    $ctx.stroke()
    // claw tips
    for(let j=0;j<3;j++){
      ln(cx+Math.sin(t*0.001+i)*20+j*3,cy+45+Math.sin(t*0.001)*5,
         cx+Math.sin(t*0.001+i)*20+j*5,cy+55+Math.sin(t*0.001)*5,PAL.blood_s,1)
    }
  }

  // Drain
  rect(330,470,140,50,PAL.ink_l)
  rect(335,475,130,40,PAL.dark)
  for(let i=0;i<5;i++)ln(345+i*30,475,345+i*30,515,PAL.rust,1.5)
  for(let i=0;i<3;i++){
    const gy=480+i*12
    ln(340,gy,460,gy,PAL.rust,1)
  }
  // water in drain
  circle(400,500,15,`rgba(10,8,6,0.8)`)
  circle(400,500,12,`rgba(26,18,14,0.6)`)

  // Floorboard
  wln(240,465,360,465,PAL.ink_l,0.8,t)
  wln(240,465,240,500,PAL.ink_l,0.8,t)
  wln(240,500,360,500,PAL.ink_l,0.8,t)
  wln(360,465,360,500,PAL.ink_l,0.8,t)
  // nail
  circle(250,480,2,PAL.rust_l)
  circle(350,480,2,PAL.rust_l)

  // Stone (item)
  pl([[95,465],[145,468],[140,498],[90,495]],PAL.stone_l)
  wln(95,465,140,498,PAL.ink_l,0.5,t)
  wln(140,468,90,495,PAL.ink_l,0.5,t)

  // Shadows
  rect(0,0,30,600,PAL.shadow_d)
  rect(770,0,30,600,PAL.shadow_d)
  rect(0,530,800,70,grad(0,530,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))
  hatch(0,350,800,250,30,10,PAL.shadow,t)
  paperGrain(5)
  vignette(ctx)
}

/* ─── WEST: Bancada, gaveta, ferramentas ─── */
function drWest(ctx,t){
  $ctx=ctx
  stoneWall(t);floor(t);dustMotes(t)

  // Workbench
  rect(80,270,560,60,PAL.ink_l)
  rect(85,275,550,50,PAL.ink)
  wln(80,270,640,270,PAL.ink_m,0.8,t)
  wln(80,330,640,330,PAL.ink_m,0.5,t)
  // wood grain on bench
  for(let i=0;i<6;i++){
    const gy=280+i*5
    wln(100,gy,620,gy,PAL.ink_m,0.3,t,0.3)
  }
  // legs
  rect(100,330,25,90,PAL.ink_l)
  rect(595,330,25,90,PAL.ink_l)
  // shadow under
  rect(70,410,580,20,grad(0,410,0,430,'rgba(0,0,0,0.5)','rgba(0,0,0,0)'))

  // Drawer
  rect(220,250,180,60,PAL.ink_l)
  rect(225,255,170,50,PAL.ink)
  wln(220,250,400,250,PAL.ink_m,0.8,t)
  wln(220,310,400,310,PAL.ink_m,0.5,t)
  // drawer handle
  rect(295,278,30,6,PAL.rust)
  rect(295,276,30,10,PAL.rust_l)
  circle(310,281,3,PAL.rust_l)
  // keyhole on drawer
  rect(270,260,5,10,PAL.dark)
  circle(272,265,3,PAL.dark)

  // Diary on bench
  rect(400,265,70,40,PAL.paper)
  wln(400,265,470,265,PAL.ink_l,0.6,t)
  wln(400,265,400,305,PAL.ink_l,0.6,t)
  wln(400,305,470,305,PAL.ink_l,0.6,t)
  wln(470,265,470,305,PAL.ink_l,0.6,t)
  // pages texture
  for(let i=0;i<5;i++){
    const px=405+Math.sin(i)*3,py=275+i*5
    wln(px,py,px+55,py,PAL.ink_l,0.3,t,0.2)
  }
  // cross on diary
  ln(435,270,435,300,PAL.ink_l,0.5)
  ln(425,280,445,280,PAL.ink_l,0.5)

  // Rope hanging on wall
  const rx=620,ry=60
  for(let i=0;i<8;i++){
    const ry2=ry+i*25
    const sw=2+Math.sin(i)*0.5
    wln(rx-6+Math.sin(t*0.001+i)*2,ry2,rx+6+Math.cos(t*0.001+i)*2,ry2+12,PAL.sepia,sw,t)
  }
  ln(rx,ry,rx,ry+220,PAL.sepia,2.5)
  // rope knot at top
  circle(rx,ry+5,8,PAL.sepia)
  circle(rx-2,ry+8,4,PAL.sepia_d)

  // Tool pile
  rect(560,350,120,100,PAL.ink_m)
  rect(565,355,110,90,PAL.ink)
  // iron bar
  wln(575,365,635,400,PAL.rust,3,t)
  wln(575,365,635,400,PAL.rust_l,1.5,t)
  // hammer head
  rect(580,360,25,15,PAL.rust)
  // chain piece
  for(let i=0;i<4;i++)circle(610+i*8,390+i*5,3,PAL.rust)
  // saw blade
  wln(590,380,620,395,PAL.ink_l,0.8,t)

  // Dark shape under bench
  const sa=0.06+Math.sin(t*0.0005)*0.04
  $ctx.fillStyle=`rgba(10,8,6,${sa})`
  $ctx.beginPath()
  $ctx.ellipse(400+Math.sin(t*0.0007)*15,440+Math.sin(t*0.0009)*8,70+Math.sin(t*0.0006)*12,30,0,0,Math.PI*2)
  $ctx.fill()

  // Shadow movement hint
  const ea=0.08+Math.sin(t*0.0005)*0.05
  $ctx.fillStyle=`rgba(184,106,58,${ea})`
  circle(380+Math.sin(t*0.0008)*30,460+Math.sin(t*0.001)*10,2,PAL.rust_l)
  circle(420+Math.sin(t*0.0008+1)*30,465+Math.sin(t*0.001+1)*10,2,PAL.rust_l)

  rect(0,0,30,600,PAL.shadow_d)
  rect(770,0,30,600,PAL.shadow_d)
  rect(0,530,800,70,grad(0,530,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))
  hatch(0,0,100,600,-45,8,PAL.shadow,t)
  hatch(700,0,100,600,45,8,PAL.shadow,t)
  paperGrain(7)
  vignette(ctx)
}

/* ─── CEILING (DARK) ─── */
function drCeiling(ctx,t){
  $ctx=ctx
  rect(0,0,800,600,rgrad(400,300,500,PAL.dark,PAL.ink))

  // Stone arch lines
  for(let i=0;i<8;i++){
    const a=Math.PI/2+i*0.12
    const px=400+Math.cos(a)*350,py=300+Math.sin(a)*250
    const px2=400+Math.cos(a)*380,py2=300+Math.sin(a)*280
    wln(px,py,px2,py2,PAL.ink_l,0.6,t,0.5)
  }
  for(let i=0;i<6;i++){
    const y=40+i*90
    wln(60+Math.sin(i)*10,y,740+Math.sin(i+1)*10,y,PAL.ink_l,0.4,t,0.5)
    // tile lines
    for(let j=0;j<8;j++){
      const tx=100+j*80+Math.sin(i+j)*5
      wln(tx,y,tx+30,y-20,PAL.ink_m,0.3,t,0.3)
    }
  }

  // Chain hanging
  for(let i=0;i<10;i++){
    const cy=40+i*22
    const cw=8+Math.sin(i*0.8)*2
    wln(400-cw,cy,400+cw,cy+8,PAL.rust,1.5,t)
    wln(400+cw,cy+8,400-cw,cy+16,PAL.rust,1.5,t)
    circle(400,cy+4,3,PAL.rust_l)
  }
  wln(400,40,400,260,PAL.rust,2,t)

  // Hook
  pl([[396,250],[404,250],[400,285],[396,260]],PAL.rust_l)
  wln(396,250,404,250,PAL.rust,2,t)
  wln(400,275,400,285,PAL.rust,2,t)

  // Hatch
  wln(300,300,500,300,PAL.ink_l,1,t)
  wln(300,300,300,380,PAL.ink_l,1,t)
  wln(300,380,500,380,PAL.ink_l,1,t)
  wln(500,300,500,380,PAL.ink_l,1,t)
  // hatch handle
  rect(390,320,20,40,PAL.rust)
  circle(400,340,4,PAL.rust_l)

  // Eyes in darkness (Shiva watching)
  const ea=0.25+Math.sin(t*0.0015)*0.15
  const eo=Math.sin(t*0.0008)*4
  $ctx.fillStyle=`rgba(184,160,128,${ea*0.4})`
  circle(250+eo,170,10+Math.sin(t*0.002)*2,PAL.rust_l)
  circle(295+eo,175,10+Math.sin(t*0.002+1)*2,PAL.rust_l)
  $ctx.fillStyle=PAL.dark
  circle(250+eo,170,4,PAL.dark)
  circle(295+eo,175,4,PAL.dark)
  // pupil glint
  $ctx.fillStyle=`rgba(184,160,128,${ea*0.6})`
  circle(248+eo,168,1.5,PAL.gold)
  circle(293+eo,173,1.5,PAL.gold)

  // More eyes scattered
  const ea2=0.15+Math.sin(t*0.001+2)*0.1
  $ctx.fillStyle=`rgba(184,160,128,${ea2*0.2})`
  circle(560+Math.sin(t*0.001)*3,140+Math.sin(t*0.001)*2,6,PAL.rust_l)
  circle(590+Math.sin(t*0.001)*3,145+Math.sin(t*0.001)*2,6,PAL.rust_l)
  $ctx.fillStyle=PAL.dark
  circle(560+Math.sin(t*0.001)*3,140+Math.sin(t*0.001)*2,2.5,PAL.dark)
  circle(590+Math.sin(t*0.001)*3,145+Math.sin(t*0.001)*2,2.5,PAL.dark)

  // Corner shadows
  rect(0,0,60,600,PAL.shadow_d)
  rect(740,0,60,600,PAL.shadow_d)

  paperGrain(9)
  vignette(ctx)
}

/* ─── CEILING WITH LANTERN (Shiva revealed) ─── */
function drCeilingLantern(ctx,t,game){
  drCeiling(ctx,t)

  // Draw Shiva's full demonic golden retriever body spanning the ceiling
  const g=$ctx
  const pulse=Math.sin(t*0.0015)*0.08
  const baseAlpha=0.7+pulse

  // Body — large elongated form
  g.save()

  // Fur texture base
  g.fillStyle=`rgba(42,26,14,${baseAlpha*0.9})`
  g.beginPath()
  g.ellipse(420,160,220,70+Math.sin(t*0.0008)*5,0,0,Math.PI*2)
  g.fill()

  // Body outline (sketch style)
  g.strokeStyle=`rgba(90,58,30,${baseAlpha})`
  g.lineWidth=2.5
  g.beginPath()
  g.ellipse(420,160,218,68+Math.sin(t*0.0008)*5,0,0,Math.PI*2)
  g.stroke()

  // Fur lines on body
  for(let i=0;i<20;i++){
    const fx=300+Math.sin(i*5)*200, fy=140+Math.sin(i*3)*40
    const fa=0.08+Math.sin(t*0.001+i)*0.04
    g.strokeStyle=`rgba(110,70,30,${fa})`
    g.lineWidth=0.8
    g.beginPath()
    g.moveTo(fx,fy)
    g.lineTo(fx+Math.sin(i*7+t*0.002)*15,fy+8+Math.sin(i)*3)
    g.stroke()
  }

  // Head (large, demonic)
  g.fillStyle=`rgba(52,30,14,${baseAlpha})`
  g.beginPath()
  g.ellipse(240,150,55,40+Math.sin(t*0.001)*2,0.2,0,Math.PI*2)
  g.fill()
  g.strokeStyle=`rgba(100,60,25,${baseAlpha})`
  g.lineWidth=2
  g.stroke()

  // Snout
  g.fillStyle=`rgba(60,34,16,${baseAlpha})`
  g.beginPath()
  g.ellipse(200,170,30,18,0,0,Math.PI*2)
  g.fill()
  g.strokeStyle=`rgba(100,60,25,${baseAlpha})`
  g.stroke()

  // Open mouth with teeth
  g.fillStyle=`rgba(10,5,3,${baseAlpha})`
  g.beginPath()
  g.ellipse(195,178,22,10,0,0,Math.PI*2)
  g.fill()
  // teeth
  for(let i=0;i<5;i++){
    const tx=180+i*8,ty=175
    g.fillStyle=`rgba(184,160,128,${baseAlpha*0.8})`
    g.beginPath()
    g.moveTo(tx-3,ty);g.lineTo(tx+3,ty);g.lineTo(tx,ty+12);g.closePath()
    g.fill()
    g.strokeStyle=`rgba(80,60,40,${baseAlpha*0.5})`
    g.lineWidth=0.5;g.stroke()
  }
  // lower teeth
  for(let i=0;i<4;i++){
    const tx=183+i*8,ty=182
    g.fillStyle=`rgba(184,160,128,${baseAlpha*0.6})`
    g.beginPath()
    g.moveTo(tx-2,ty);g.lineTo(tx+2,ty);g.lineTo(tx,ty-8);g.closePath()
    g.fill()
  }
  // tongue
  g.fillStyle=`rgba(90,30,20,${baseAlpha*0.5})`
  g.beginPath()
  g.ellipse(198,185,8,5,0,0,Math.PI*2)
  g.fill()

  // Ears (pointed, demonic)
  g.fillStyle=`rgba(42,22,10,${baseAlpha})`
  // left ear
  g.beginPath()
  g.moveTo(220,130);g.lineTo(195,95);g.lineTo(235,120);g.closePath()
  g.fill()
  g.strokeStyle=`rgba(80,50,20,${baseAlpha})`;g.lineWidth=1.5;g.stroke()
  // right ear
  g.beginPath()
  g.moveTo(265,130);g.lineTo(285,100);g.lineTo(275,135);g.closePath()
  g.fill()
  g.stroke()

  // 3 glowing eyes on head
  for(let e=0;e<3;e++){
    const ex=215+e*22,ey=148+Math.sin(e)*3
    g.fillStyle=`rgba(184,106,58,${0.6+Math.sin(t*0.003+e)*0.2})`
    g.beginPath()
    g.ellipse(ex,ey,7+Math.sin(t*0.002+e)*1.5,5,0,0,Math.PI*2)
    g.fill()
    g.fillStyle=PAL.dark
    g.beginPath()
    g.ellipse(ex,ey,3,4,0,0,Math.PI*2)
    g.fill()
    // glint
    g.fillStyle=`rgba(255,200,150,${0.6+Math.sin(t*0.003+e)*0.2})`
    g.beginPath()
    g.ellipse(ex-1,ey-1,1.5,1,0,0,Math.PI*2)
    g.fill()
  }

  // Foreground legs (2 visible)
  for(let l=0;l<2;l++){
    const lx=300+l*120,ly=170+Math.sin(t*0.001+l)*8
    g.fillStyle=`rgba(52,30,14,${baseAlpha*0.85})`
    g.beginPath()
    g.ellipse(lx,ly,15,40+Math.sin(t*0.001+l)*3,0.2+Math.sin(l)*0.1,0,Math.PI*2)
    g.fill()
    // claws
    for(let c=0;c<3;c++){
      g.fillStyle=`rgba(60,35,18,${baseAlpha})`
      g.beginPath()
      g.moveTo(lx-5+c*5,ly+38);g.lineTo(lx-8+c*5,ly+45);g.lineTo(lx-3+c*5,ly+42);g.closePath()
      g.fill()
      g.strokeStyle=`rgba(40,20,10,${baseAlpha*0.5})`;g.lineWidth=0.5;g.stroke()
    }
  }

  // Hind legs
  for(let l=0;l<2;l++){
    const lx=500+l*80,ly=170+Math.sin(t*0.001+l+2)*6
    g.fillStyle=`rgba(42,22,10,${baseAlpha*0.7})`
    g.beginPath()
    g.ellipse(lx,ly,18,30+Math.sin(t*0.001+l)*4,0,0,Math.PI*2)
    g.fill()
    g.strokeStyle=`rgba(80,50,20,${baseAlpha*0.4})`
    g.lineWidth=1
    g.stroke()
  }

  // Tail
  g.strokeStyle=`rgba(74,42,18,${baseAlpha*0.7})`
  g.lineWidth=6
  g.beginPath()
  g.moveTo(620,150)
  g.quadraticCurveTo(680,140,700,120+Math.sin(t*0.002)*8)
  g.stroke()
  g.lineWidth=3
  g.strokeStyle=`rgba(100,60,25,${baseAlpha*0.5})`
  g.beginPath()
  g.moveTo(620,150)
  g.quadraticCurveTo(680,140,700,120+Math.sin(t*0.002)*8)
  g.stroke()

  g.restore()

  // GLOWING OFFERING SPOTS (for ceiling puzzle)
  const so=game.shivaOffered||{eye:false,mouth:false,paw:false}
  const eye=so.eye,mouth=so.mouth,paw=so.paw
  // Spot 1: Eye (head) — needs caco_vidro
  if(!eye){
      const sa=0.5+Math.sin(t*0.004)*0.3
      g.fillStyle=`rgba(255,200,100,${sa*0.3})`
      g.beginPath()
      g.ellipse(227,148,15,12,0,0,Math.PI*2)
      g.fill()
      g.strokeStyle=`rgba(255,200,100,${sa*0.6})`
      g.lineWidth=1.5
      g.beginPath()
      g.ellipse(227,148,14,11,0,0,Math.PI*2)
      g.stroke()
      tx('●',227,152,'rgba(255,200,100,0.8)',18)
    }else{
      // Offered — glass shard in eye
      g.fillStyle=`rgba(184,160,128,0.4)`
      pl([[218,140],[234,148],[225,158],[215,150]],PAL.sepia_l)
      g.strokeStyle=PAL.sepia_l
      g.lineWidth=1
      g.stroke()
    }

    // Spot 2: Mouth — needs bola
    if(!mouth){
      const sa=0.5+Math.sin(t*0.004+1)*0.3
      g.fillStyle=`rgba(255,200,100,${sa*0.3})`
      g.beginPath()
      g.ellipse(195,178,18,12,0,0,Math.PI*2)
      g.fill()
      g.strokeStyle=`rgba(255,200,100,${sa*0.6})`
      g.lineWidth=1.5
      g.beginPath()
      g.ellipse(195,178,17,11,0,0,Math.PI*2)
      g.stroke()
      tx('●',195,182,'rgba(255,200,100,0.8)',18)
    }else{
      // Offered — ball in mouth
      circle(195,178,7,PAL.sepia_l)
      g.strokeStyle=PAL.rust_l
      g.lineWidth=1.5
      g.beginPath()
      g.ellipse(195,178,7,7,0,0,Math.PI*2)
      g.stroke()
    }

    // Spot 3: Paw — needs osso
    if(!paw){
      const sa=0.5+Math.sin(t*0.004+2)*0.3
      g.fillStyle=`rgba(255,200,100,${sa*0.3})`
      g.beginPath()
      g.ellipse(300,245,18,12,0,0,Math.PI*2)
      g.fill()
      g.strokeStyle=`rgba(255,200,100,${sa*0.6})`
      g.lineWidth=1.5
      g.beginPath()
      g.ellipse(300,245,17,11,0,0,Math.PI*2)
      g.stroke()
      tx('●',300,249,'rgba(255,200,100,0.8)',18)
    }else{
      // Offered — bone on paw
      g.fillStyle=PAL.sepia_l
      g.fillRect(290,238,20,5)
      g.fillRect(293,233,4,15)
      circle(292,233,3,PAL.sepia_l)
      circle(308,233,3,PAL.sepia_l)
    }

  // Título da criatura
  g.fillStyle=`rgba(184,106,58,${0.15+Math.sin(t*0.002)*0.08})`
  g.font='12px Georgia'
  g.textAlign='center'
  g.fillText('SHIVA',400,580)

  // Red glow from the body
  const gl=0.04+Math.sin(t*0.0015)*0.03
  g.fillStyle=`rgba(184,58,30,${gl})`
  g.beginPath()
  g.ellipse(400,160,300,100,0,0,Math.PI*2)
  g.fill()

  // Additional glow overlay
  const glowGrad=rgrad(400,160,350,'rgba(184,106,58,0.03)','rgba(184,106,58,0)')
  g.fillStyle=glowGrad
  g.beginPath()
  g.ellipse(400,160,350,120,0,0,Math.PI*2)
  g.fill()

  vignette(ctx)
}

/* ─── SHIVA APPEARANCES (rare, peripheral) ─── */
function drawShivaAppearance(ctx,viewNum,phase,t){
  const a=0.2+Math.sin(t*0.002+phase)*0.12
  if(a<0.04)return
  $ctx=ctx

  if(viewNum===0){
    $ctx.fillStyle=`rgba(90,42,26,${a*0.4})`
    circle(400,160,30,PAL.rust_l)
    $ctx.fillStyle=`rgba(184,160,128,${a*0.5})`
    circle(390,155,5,PAL.sepia_l)
    circle(410,155,5,PAL.sepia_l)
    $ctx.strokeStyle=`rgba(90,42,26,${a*0.3})`
    $ctx.lineWidth=2
    $ctx.beginPath()
    $ctx.moveTo(392,168);$ctx.lineTo(408,168);$ctx.stroke()
  }else if(viewNum===1){
    $ctx.strokeStyle=`rgba(60,30,18,${a*0.4})`
    $ctx.lineWidth=5
    $ctx.beginPath()
    $ctx.moveTo(655+Math.sin(t*0.003)*5,220+Math.sin(t*0.004)*3)
    $ctx.lineTo(620+Math.sin(t*0.003+1)*3,265+Math.sin(t*0.004+1)*3)
    $ctx.lineTo(600+Math.sin(t*0.003+2)*3,285+Math.sin(t*0.004+2)*3)
    $ctx.stroke()
    for(let i=0;i<3;i++){
      ln(600+Math.sin(t*0.003+2)*3+i*5,285+Math.sin(t*0.004+2)*3,
         590+Math.sin(t*0.003+3+i)*3+i*8,310+Math.sin(t*0.004+3+i)*3,PAL.rust_l,2)
    }
  }else if(viewNum===2){
    $ctx.fillStyle=`rgba(184,160,128,${a*0.4})`
    circle(200+Math.sin(t*0.001)*5,100+Math.sin(t*0.002)*3,8,PAL.rust_l)
    circle(235+Math.sin(t*0.001+1)*5,105+Math.sin(t*0.002+1)*3,8,PAL.rust_l)
    $ctx.fillStyle=`rgba(90,42,26,${a*0.2})`
    $ctx.font='28px Georgia'
    $ctx.textAlign='center'
    $ctx.fillText('ESQUEÇA',300,300)
  }else if(viewNum===3){
    $ctx.fillStyle=`rgba(10,8,6,${a*0.3})`
    $ctx.beginPath()
    $ctx.ellipse(400+Math.sin(t*0.002)*20,470+Math.sin(t*0.003)*10,80+Math.sin(t*0.001)*15,40,0,0,Math.PI*2)
    $ctx.fill()
    $ctx.fillStyle=`rgba(184,106,58,${a*0.4})`
    circle(380+Math.sin(t*0.002)*25,460+Math.sin(t*0.0015)*10,5,PAL.rust_l)
    circle(420+Math.sin(t*0.002+1)*25,465+Math.sin(t*0.0015+1)*10,5,PAL.rust_l)
  }else if(viewNum===4){
    for(let i=0;i<7;i++){
      const ex=100+((t*0.02+i*157)%600)
      const ey=50+((t*0.015+i*263)%200)
      $ctx.fillStyle=`rgba(184,160,128,${a*0.2})`
      circle(ex,ey,4+Math.sin(t*0.003+i)*2,PAL.rust_l)
    }
  }
}

/* ─── LIGHTING OVERLAYS ─── */
function drawCandleLight(ctx,t,lit){
  if(!lit)return
  const flicker=0.08+Math.sin(t*0.005)*0.04+Math.sin(t*0.013)*0.02
  const g=ctx.createRadialGradient(400,300,30,400,300,400)
  g.addColorStop(0,`rgba(255,180,80,${flicker*0.6})`)
  g.addColorStop(0.3,`rgba(184,106,58,${flicker*0.25})`)
  g.addColorStop(0.7,`rgba(140,80,40,${flicker*0.08})`)
  g.addColorStop(1,'rgba(140,80,40,0)')
  ctx.fillStyle=g
  ctx.fillRect(0,0,800,600)
}

function drawLanternLight(ctx,t,on){
  if(!on)return
  const flicker=0.12+Math.sin(t*0.004)*0.05+Math.sin(t*0.011+1)*0.025
  const g=ctx.createRadialGradient(400,300,50,400,300,500)
  g.addColorStop(0,`rgba(255,210,120,${flicker*0.7})`)
  g.addColorStop(0.2,`rgba(230,170,90,${flicker*0.4})`)
  g.addColorStop(0.5,`rgba(184,130,70,${flicker*0.15})`)
  g.addColorStop(0.8,`rgba(140,90,50,${flicker*0.05})`)
  g.addColorStop(1,'rgba(100,70,40,0)')
  ctx.fillStyle=g
  ctx.fillRect(0,0,800,600)

  // Extra warm tint
  ctx.fillStyle=`rgba(255,180,80,${flicker*0.03})`
  ctx.fillRect(0,0,800,600)
}

const VIEW_DRAW = {
  north: drNorth,
  east: drEast,
  south: drSouth,
  west: drWest,
  ceiling: drCeiling
}
