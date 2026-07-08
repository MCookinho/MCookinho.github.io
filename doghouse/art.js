const PAL = {
  paper:'#1a140e', paper_d:'#14100a', paper_l:'#2a2016',
  ink:'#0a0806', ink_l:'#1a140e', ink_m:'#14100a',
  sepia:'#6a5a4a', sepia_l:'#9a8a7a', sepia_d:'#2a1a0e',
  rust:'#7a4a2a', rust_l:'#a06a3a',
  shadow:'rgba(0,0,0,0.5)', shadow_d:'rgba(0,0,0,0.8)',
  dark:'#050302', stone:'#2a2218', stone_l:'#3a3226'
}

const C = () => 800
const H = () => 600

function rect(x,y,w,h,c){const g=$ctx;g.fillStyle=c;g.fillRect(x,y,w,h)}
function circle(x,y,r,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function grad(x1,y1,x2,y2,c1,c2){const g=$ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rg(x,y,r,c1,c2){const g=$ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function ln(x1,y1,x2,y2,c,w){const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function pl(pts,c){const g=$ctx;g.fillStyle=c;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill()}
function tx(str,x,y,c,sz){$ctx.fillStyle=c;$ctx.font=(sz||14)+'px Georgia';$ctx.textAlign='center';$ctx.fillText(str,x,y)}

function rln(x1,y1,x2,y2,c,w,t){
  const wobble=2+Math.sin(t*0.001+x1*0.01+y2*0.01)*0.8
  const g=$ctx;g.strokeStyle=c;g.lineWidth=w||1
  g.beginPath()
  const steps=8
  for(let i=0;i<=steps;i++){
    const f=i/steps
    const wx=Math.sin(t*0.002+x1*f*2)*wobble
    const wy=Math.sin(t*0.002+y2*f*2)*wobble
    const px=x1+(x2-x1)*f+wx,py=y1+(y2-y1)*f+wy
    i===0?g.moveTo(px,py):g.lineTo(px,py)
  }
  g.stroke()
}

function rrect(x,y,w,h,c,t){
  rln(x,y,x+w,y,c,1,t);rln(x+w,y,x+w,y+h,c,1,t)
  rln(x+w,y+h,x,y+h,c,1,t);rln(x,y+h,x,y,c,1,t)
  if(c){rect(x,y,w,h,c)}
}

function hatch(x,y,w,h,a,s,color,t){
  const g=$ctx;g.strokeStyle=color||PAL.shadow;g.lineWidth=0.5
  const rad=a*Math.PI/180,steps=Math.max(w,h)/s
  for(let i=-steps;i<steps;i++){
    const off=i*s
    const x1=x+Math.cos(rad)*off,x2=x1+w
    const y1=y+Math.sin(rad)*off,y2=y1+h
    g.beginPath();g.moveTo(x1,y1+Math.sin(t*0.001+i)*2);g.lineTo(x2,y2+Math.sin(t*0.001+i+1)*2);g.stroke()
  }
}

function paperGrain(seed){
  for(let i=0;i<60;i++){
    const x=(i*137+seed)%800,y=(i*251+seed)%600
    const r=Math.sin(seed+i*3.7)*0.5+0.5
    $ctx.fillStyle=`rgba(26,18,10,${0.015+r*0.03})`
    $ctx.fillRect(x,y,6+Math.sin(seed+i*1.3)*8,1)
  }
}

function vignette(ctx){
  const g=ctx.createRadialGradient(400,300,100,400,300,500)
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.6,'rgba(0,0,0,0.15)');g.addColorStop(1,'rgba(0,0,0,0.8)')
  ctx.fillStyle=g;ctx.fillRect(0,0,800,600)
}

let $ctx

function stoneWall(wobble,t){
  rect(0,0,800,600,PAL.stone)
  for(let row=0;row<15;row++){
    for(let col=0;col<10;col++){
      const bx=col*90+(row%2)*45,by=row*45
      const offx=Math.sin(t*0.0003+row*3+col*7)*3,offy=Math.sin(t*0.0004+row*5+col*2)*2
      rect(bx+2+offx,by+2+offy,86,41,PAL.ink_m)
      rln(bx+offx,by+offy,bx+86+offx,by+offy,PAL.ink_l,0.8,t)
      rln(bx+offx,by+offy,bx+offx,by+41+offy,PAL.ink_l,0.8,t)
    }
  }
}

function floor(wobble,t){
  rect(0,450,800,150,PAL.ink_m)
  for(let i=0;i<20;i++){
    const fx=i*45
    ln(fx,450,fx,600,PAL.shadow,0.5)
  }
  for(let i=0;i<5;i++){
    rect(0,450+i*30,800,1,PAL.shadow)
  }
}

/* ─── NORTH VIEW: Door, chains, window ─── */
function drNorth(ctx,t){
  $ctx=ctx
  stoneWall(0,t)
  floor(0,t)

  // Door
  rect(270,80,260,420,PAL.ink_l)
  rln(270,80,530,80,PAL.ink,1.5,t)
  rln(530,80,530,500,PAL.ink,1.5,t)
  rln(530,500,270,500,PAL.ink,1.5,t)
  rln(270,500,270,80,PAL.ink,1.5,t)

  // Door panels
  rect(290,100,100,170,PAL.dark)
  rect(410,100,100,170,PAL.dark)
  rect(290,300,100,170,PAL.dark)
  rect(410,300,100,170,PAL.dark)

  // Door window (barred)
  rect(350,120,100,80,PAL.ink_m)
  for(let i=0;i<3;i++)ln(370+i*30,120,370+i*30,200,PAL.rust,2)
  ln(350,150,450,150,PAL.rust,2)

  // Chains across door
  for(let i=0;i<4;i++){
    const cy=150+i*90
    ln(260,cy,540,cy+Math.sin(i)*10,PAL.rust,2)
    circle(270+i*80,cy+Math.sin(i)*5,5,PAL.rust_l)
  }
  circle(400,200,8,PAL.rust_l)
  ln(400,200,400,280,PAL.rust,2)
  ln(380,280,420,280,PAL.rust,2)

  // Crucifix/symbol on wall
  rect(620,120,20,60,PAL.ink_l)
  rect(605,140,50,10,PAL.ink_l)

  // Grate (with collar behind)
  rect(60,200,100,150,PAL.ink_l)
  for(let i=0;i<4;i++)ln(70+i*25,200,70+i*25,350,PAL.rust,1.5)
  ln(60,220,160,220,PAL.rust,1.5)
  ln(60,250,160,250,PAL.rust,1.5)
  ln(60,280,160,280,PAL.rust,1.5)
  ln(60,310,160,310,PAL.rust,1.5)

  // Darkness at edges
  rect(0,0,40,600,PAL.shadow_d)
  rect(760,0,40,600,PAL.shadow_d)

  hatch(0,0,800,120,45,10,PAL.shadow,t)
  paperGrain(1)
  vignette(ctx)
}

/* ─── EAST VIEW: Shelves, mirror, candle ─── */
function drEast(ctx,t){
  $ctx=ctx
  stoneWall(0,t)
  floor(0,t)

  // Shelves
  rect(50,80,300,40,PAL.ink_l)
  rect(50,200,300,30,PAL.ink_l)
  rect(50,320,300,30,PAL.ink_l)
  rect(40,80,15,300,PAL.ink_l)
  rect(340,80,15,300,PAL.ink_l)

  // Items on shelves
  rect(100,90,40,30,PAL.dark) // book
  rect(160,90,50,30,PAL.dark) // book
  rect(250,85,30,35,PAL.sepia_d) // candle spot

  // Broken mirror
  rect(450,100,200,250,PAL.ink_l)
  const mp=Math.sin(t*0.001)*5
  pl([[460,110+mp],[640,120-mp],[630,340+mp],[470,330-mp]],PAL.dark)
  for(let i=0;i<6;i++){
    const cx=480+Math.random()*120,cy=130+Math.random()*180
    ln(cx,cy,cx+Math.sin(t*0.002+i)*20,cy+Math.cos(t*0.002+i)*20,PAL.sepia_l,0.5)
  }

  // Spider webs
  for(let i=0;i<4;i++){
    const wx=420+Math.sin(i*2)*30,wy=70+Math.sin(i*3)*20
    for(let j=0;j<5;j++)ln(wx,wy,wx+Math.cos(j*1.26)*80,wy+Math.sin(j*1.26)*60,PAL.shadow,0.3)
    for(let j=0;j<4;j++)circle(wx+Math.cos(t*0.0005+j)*40,wy+Math.sin(t*0.0005+j)*30,2+Math.sin(t*0.002+j)*1,PAL.shadow)
  }

  // Loose brick outline
  rln(560,380,600,380,PAL.ink_l,0.8,t)
  rln(560,380,560,420,PAL.ink_l,0.8,t)
  rln(560,420,600,420,PAL.ink_l,0.8,t)
  rln(600,380,600,420,PAL.ink_l,0.8,t)

  // Dark corners
  rect(0,0,40,600,PAL.shadow_d)
  rect(760,0,40,600,PAL.shadow_d)

  hatch(0,400,800,200,30,12,PAL.shadow,t)
  paperGrain(3)
  vignette(ctx)
}

/* ─── SOUTH VIEW: Back wall, drain, writing ─── */
function drSouth(ctx,t){
  $ctx=ctx
  stoneWall(0,t)
  floor(0,t)

  // Water stains
  for(let i=0;i<5;i++){
    const sx=100+Math.random()*600,sy=50+Math.random()*300
    circle(sx,sy,20+Math.random()*40,`rgba(42,34,26,${0.1+Math.sin(t*0.001+i)*0.05})`)
  }

  // Dripping water
  const dp=Math.sin(t*0.003)*8
  circle(400,100+dp,3,PAL.sepia_d)
  circle(300,150+Math.sin(t*0.004)*10,2,PAL.sepia_d)
  circle(550,80+Math.sin(t*0.005+1)*7,2,PAL.sepia_d)

  // Drain/grate
  rect(340,480,120,40,PAL.ink_l)
  for(let i=0;i<4;i++)ln(350+i*30,480,350+i*30,520,PAL.rust,1.5)
  ln(340,490,460,490,PAL.rust,1.5)
  ln(340,510,460,510,PAL.rust,1.5)

  // Writing on wall: ESQUEÇA
  $ctx.fillStyle=PAL.rust_l
  $ctx.font='26px Georgia'
  $ctx.textAlign='center'
  $ctx.globalAlpha=0.3+Math.sin(t*0.002)*0.1
  for(let i=0;i<7;i++){
    const letters='ESQUEÇA'
    $ctx.fillText(letters[i],200+i*45+Math.sin(t*0.001+i)*2,300+Math.sin(t*0.0015+i)*2)
  }
  $ctx.globalAlpha=1

  // Claw marks
  const ca=0.15+Math.sin(t*0.0008)*0.1
  for(let i=0;i<4;i++){
    const cx=600+Math.sin(i*2)*30,cy=200+Math.sin(i*3)*40
    $ctx.strokeStyle=`rgba(90,42,26,${ca})`
    $ctx.lineWidth=1.5
    $ctx.beginPath()
    $ctx.moveTo(cx,cy)
    $ctx.lineTo(cx+Math.sin(t*0.001+i)*25,cy+40+Math.sin(t*0.001+i+1)*15)
    $ctx.stroke()
  }

  // Loose floorboard outline
  rln(250,470,350,470,PAL.ink_l,0.8,t)
  rln(250,470,250,500,PAL.ink_l,0.8,t)
  rln(250,500,350,500,PAL.ink_l,0.8,t)
  rln(350,470,350,500,PAL.ink_l,0.8,t)

  rect(0,0,40,600,PAL.shadow_d)
  rect(760,0,40,600,PAL.shadow_d)

  hatch(0,0,800,450,-45,15,PAL.shadow,t)
  paperGrain(5)
  vignette(ctx)
}

/* ─── WEST VIEW: Workbench, tools, diary ─── */
function drWest(ctx,t){
  $ctx=ctx
  stoneWall(0,t)
  floor(0,t)

  // Workbench/table
  rect(120,280,500,40,PAL.ink_l)
  rect(120,320,500,20,PAL.ink_m)
  rect(140,340,40,100,PAL.ink_l)
  rect(560,340,40,100,PAL.ink_l)

  // Drawer
  rect(240,260,160,50,PAL.ink_l)
  rect(245,265,150,40,PAL.dark)
  circle(310,285,3,PAL.rust_l) // handle
  rln(245,265,395,265,PAL.ink,0.8,t)
  rln(245,265,245,305,PAL.ink,0.8,t)
  rln(245,305,395,305,PAL.ink,0.8,t)
  rln(395,265,395,305,PAL.ink,0.8,t)

  // Diary on table
  rect(360,260,80,50,PAL.paper_l)
  ln(365,265,435,265,PAL.ink_l,0.5)
  ln(365,275,425,275,PAL.ink_l,0.5)
  ln(365,285,430,285,PAL.ink_l,0.5)
  ln(360,260,360,310,PAL.ink_l,0.5)
  ln(440,260,440,310,PAL.ink_l,0.5)

  // Rope hanging on wall
  for(let i=0;i<6;i++){
    const rx=620,ry=80+i*30
    ln(rx-5+Math.sin(i)*5,ry,rx+5+Math.cos(i)*5,ry+10,PAL.sepia,1.5)
  }
  ln(620,80,620,260,PAL.sepia,2)

  // Tool pile
  rect(580,360,100,90,PAL.ink_m)
  ln(590,370,640,365,PAL.rust,2)
  ln(610,375,660,390,PAL.rust,1.5)
  ln(620,380,650,395,PAL.ink_l,2)

  // Shadow under table
  rect(100,420,600,30,PAL.shadow)

  // Dark shapes (Shiva hint movement)
  const sa=0.08+Math.sin(t*0.0005)*0.06
  $ctx.fillStyle=`rgba(10,8,6,${sa})`
  $ctx.beginPath()
  $ctx.arc(400+Math.sin(t*0.0007)*20,460+Math.sin(t*0.0009)*10,60+Math.sin(t*0.0006)*15,0,Math.PI*2)
  $ctx.fill()

  rect(0,0,40,600,PAL.shadow_d)
  rect(760,0,40,600,PAL.shadow_d)

  hatch(0,0,800,280,-45,12,PAL.shadow,t)
  paperGrain(7)
  vignette(ctx)
}

/* ─── CEILING VIEW ─── */
function drCeiling(ctx,t){
  $ctx=ctx

  // Dark ceiling gradient
  rect(0,0,800,600,grad(0,0,0,600,PAL.dark,PAL.ink))

  // Stone arch lines
  for(let i=0;i<6;i++){
    const a=Math.PI/2+i*0.15
    ln(400+Math.cos(a)*350,300+Math.sin(a)*250,400+Math.cos(a)*380,300+Math.sin(a)*280,PAL.ink_l,0.8)
  }
  for(let i=0;i<5;i++){
    const y=50+i*120
    ln(50+Math.sin(i)*20,y,750+Math.sin(i+1)*20,y,PAL.ink_l,0.5)
  }

  // Chain hanging
  for(let i=0;i<8;i++){
    const cy=60+i*25
    ln(400-10+Math.sin(i)*8,cy,400+10+Math.cos(i)*8,cy+10,PAL.rust,2)
  }
  ln(400,60,400,260,PAL.rust,2)
  // Hook
  pl([[395,250],[405,250],[400,280],[395,260]],PAL.rust_l)

  // Hatch outline
  rln(320,300,480,300,PAL.ink_l,1,t)
  rln(320,300,320,380,PAL.ink_l,1,t)
  rln(320,380,480,380,PAL.ink_l,1,t)
  rln(480,300,480,380,PAL.ink_l,1,t)

  // Shadows in corners
  rect(0,0,60,600,PAL.shadow_d)
  rect(740,0,60,600,PAL.shadow_d)

  // Shiva eyes in darkness (animated)
  const ea=0.3+Math.sin(t*0.0015)*0.2
  const eo=Math.sin(t*0.0008)*3
  $ctx.fillStyle=`rgba(184,160,128,${ea*0.5})`
  circle(250+eo,180,8+Math.sin(t*0.002)*2,PAL.rust_l)
  circle(290+eo,185,8+Math.sin(t*0.002+1)*2,PAL.rust_l)
  circle(250+eo,180,3,PAL.dark)
  circle(290+eo,185,3,PAL.dark)

  // More eyes
  const ea2=0.2+Math.sin(t*0.001+2)*0.15
  $ctx.fillStyle=`rgba(184,160,128,${ea2*0.3})`
  circle(550+Math.sin(t*0.001)*5,150+Math.sin(t*0.001)*3,6,PAL.rust_l)
  circle(580+Math.sin(t*0.001)*5,155+Math.sin(t*0.001)*3,6,PAL.rust_l)

  paperGrain(9)
  vignette(ctx)
}

/* ─── SHIVA APPEARANCES ─── */
function drawShivaAppearance(ctx,view,phase,t){
  const a=0.25+Math.sin(t*0.002+phase)*0.15
  if(a<0.05)return

  $ctx=ctx
  if(view===0){
    // North: Face in the window
    $ctx.fillStyle=`rgba(90,42,26,${a*0.5})`
    circle(400,160,25,PAL.rust_l)
    $ctx.fillStyle=`rgba(184,160,128,${a*0.6})`
    circle(390,155,4,PAL.sepia_l)
    circle(410,155,4,PAL.sepia_l)
    $ctx.strokeStyle=`rgba(90,42,26,${a*0.4})`
    $ctx.lineWidth=1.5
    $ctx.beginPath()
    $ctx.moveTo(395,170);$ctx.lineTo(405,170);$ctx.stroke()
  }else if(view===1){
    // East: Arm from behind mirror
    $ctx.strokeStyle=`rgba(60,30,18,${a*0.5})`
    $ctx.lineWidth=4
    $ctx.beginPath()
    $ctx.moveTo(650+Math.sin(t*0.003)*5,220+Math.sin(t*0.004)*3)
    $ctx.lineTo(620+Math.sin(t*0.003+1)*3,260+Math.sin(t*0.004+1)*3)
    $ctx.lineTo(600+Math.sin(t*0.003+2)*3,280+Math.sin(t*0.004+2)*3)
    $ctx.stroke()
    // Claws
    for(let i=0;i<3;i++){
      ln(600+Math.sin(t*0.003+2)*3+i*5,280+Math.sin(t*0.004+2)*3,
         590+Math.sin(t*0.003+3+i)*3+i*8,300+Math.sin(t*0.004+3+i)*3,PAL.rust_l,2)
    }
  }else if(view===2){
    // South: Eyes in the darkness
    $ctx.fillStyle=`rgba(184,160,128,${a*0.5})`
    circle(200+Math.sin(t*0.001)*5,100+Math.sin(t*0.002)*3,6,PAL.rust_l)
    circle(230+Math.sin(t*0.001+1)*5,105+Math.sin(t*0.002+1)*3,6,PAL.rust_l)
    // Writing intensifies
    $ctx.fillStyle=`rgba(90,42,26,${a*0.3})`
    $ctx.font='26px Georgia'
    $ctx.textAlign='center'
    $ctx.fillText('ESQUEÇA',300,300)
  }else if(view===3){
    // West: Shadow movement
    $ctx.fillStyle=`rgba(10,8,6,${a*0.4})`
    $ctx.beginPath()
    $ctx.arc(400+Math.sin(t*0.002)*30,480+Math.sin(t*0.003)*15,80+Math.sin(t*0.001)*20,0,Math.PI*2)
    $ctx.fill()
    // Red eyes in shadow
    $ctx.fillStyle=`rgba(184,106,58,${a*0.5})`
    circle(380+Math.sin(t*0.002)*25,470+Math.sin(t*0.0015)*10,4,PAL.rust_l)
    circle(420+Math.sin(t*0.002+1)*25,475+Math.sin(t*0.0015+1)*10,4,PAL.rust_l)
  }else if(view===4){
    const ea2=a*0.6
    for(let i=0;i<5;i++){
      const ex=100+((t*0.02+i*157)%600)
      const ey=50+((t*0.015+i*263)%200)
      $ctx.fillStyle=`rgba(184,160,128,${ea2*0.3})`
      circle(ex,ey,3+Math.sin(t*0.003+i)*2,PAL.rust_l)
    }
  }
}

/* ─── SPECIAL: CANDLE LIT OVERLAY ─── */
function drawCandleLight(ctx,t,lit){
  if(!lit)return
  const flicker=0.06+Math.sin(t*0.005)*0.03
  const g=ctx.createRadialGradient(400,300,50,400,300,450)
  g.addColorStop(0,`rgba(184,106,58,${flicker})`)
  g.addColorStop(0.5,`rgba(184,106,58,${flicker*0.3})`)
  g.addColorStop(1,'rgba(184,106,58,0)')
  ctx.fillStyle=g
  ctx.fillRect(0,0,800,600)
}

const VIEW_DRAW = {
  north: drNorth,
  east: drEast,
  south: drSouth,
  west: drWest,
  ceiling: drCeiling
}
