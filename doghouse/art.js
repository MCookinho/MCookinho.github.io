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
function tx(t,x,y,c,fs){const g=$ctx;g.fillStyle=c;g.font=fs+'px Georgia';g.textAlign='center';g.fillText(t,x,y)}

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
  const lit=window.__game&&window.__game.candleLit
  rect(0,430,800,170,lit?PAL.stone_d:PAL.ink_m)
  rect(0,428,800,2,PAL.shadow_d)
  rect(0,430,800,1,PAL.ink)
  for(let row=0;row<6;row++){
    for(let col=0;col<12;col++){
      const fx=col*70+(row%2)*35, fy=430+row*30
      const fw=64+Math.sin(col*3+row*7)*6, fh=24+Math.sin(col*5+row*2)*4
      rect(fx+2,fy+2,fw,fh,lit?PAL.stone:PAL.stone_d)
      rect(fx+3,fy+3,fw-2,fh-2,lit?PAL.stone_l:PAL.stone)
      wln(fx,fy,fx+fw,fy,PAL.ink_l,0.5,t)
      wln(fx,fy,fx,fy+fh,PAL.ink_l,0.5,t)
      if(lit){
        wln(fx+4,fy+4,fx+fw-4,fy+4,PAL.sepia_d,0.4,t,0.2)
        wln(fx+2,fy+8,fx+fw-6,fy+8,PAL.sepia_d,0.3,t,0.2)
        const knotX=fx+fw*0.3+Math.sin(col*7+row*11)*5
        const knotY=fy+fh*0.6+Math.sin(col*13+row*3)*4
        circle(knotX,knotY,1.5,PAL.sepia)
        circle(knotX,knotY,0.6,PAL.dark)
      }
    }
  }
  for(let i=0;i<(lit?12:6);i++){
    const fx=(i*157+23)%760, fy=440+(i*89)%130
    rect(fx,fy,2,3,PAL.ink_m)
  }
  if(lit){
    rect(0,430,800,6,grad(0,430,0,436,'rgba(120,90,50,0.06)','rgba(0,0,0,0)'))
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
  const dx=270,dy=8,dw=260,dh=440
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

  // Door shadow on floor (perspective fix)
  $ctx.fillStyle='rgba(0,0,0,0.25)'
  $ctx.beginPath()
  $ctx.moveTo(dx+10,430);$ctx.lineTo(dx+dw-10,430)
  $ctx.lineTo(dx+dw+20,480);$ctx.lineTo(dx-20,480);$ctx.closePath()
  $ctx.fill()
  // darker line at door base
  $ctx.strokeStyle='rgba(0,0,0,0.4)'
  $ctx.lineWidth=2
  $ctx.beginPath()
  $ctx.moveTo(dx,430);$ctx.lineTo(dx+dw,430)
  $ctx.stroke()

  // padlock on center chain
  circle(dx+130,dy+320,10,PAL.rust)
  circle(dx+130,dy+320,6,PAL.rust_l)
  rect(dx+128,dy+310,4,10,PAL.rust)

  // Grate (left) — iron bars (sketch style)
  rect(50,190,110,160,PAL.ink_l)
  rect(55,195,100,150,PAL.ink)

  // Vertical bars (wavy hand-drawn lines)
  for(let i=0;i<4;i++){
    const bx=65+i*25
    wln(bx-2,195,bx-2,345,'rgba(40,20,10,0.4)',2.5,t)
    wln(bx,195,bx,345,PAL.rust,4,t)
    wln(bx+1.5,195,bx+1.5,345,'rgba(160,106,58,0.2)',1.5,t)
  }
  // Horizontal crossbars
  for(let i=0;i<4;i++){
    const gy=197+i*44
    wln(53,gy,157,gy,PAL.rust,3.5,t)
    wln(54,gy+0.5,156,gy+0.5,'rgba(160,106,58,0.15)',2,t)
    for(let j=0;j<4;j++)circle(65+j*25,gy,2.5,PAL.rust_l)
  }

  // Window (right)
  rect(580,130,100,90,PAL.ink_m)
  for(let i=0;i<2;i++)ln(605+i*50,130,605+i*50,220,PAL.ink_l,2)
  ln(580,170,680,170,PAL.ink_l,2)

  // Wall crucifix
  rect(640,250,12,50,PAL.ink_l)
  rect(630,260,32,8,PAL.ink_l)

  // Metal toolbox — on the floor right of the door
  if(!window.__game||!window.__game.hasObtained('ferro')){
    const tx=555,ty=395,tw=115,th=72
    // Shadow
    $ctx.fillStyle='rgba(0,0,0,0.25)'
    $ctx.beginPath()
    $ctx.ellipse(tx+tw/2,ty+th+4,58,10,0,0,Math.PI*2)
    $ctx.fill()
    // Toolbox body
    const mg=$ctx.createLinearGradient(tx,ty,tx,ty+th)
    mg.addColorStop(0,'#4a4238');mg.addColorStop(0.25,'#6a6252')
    mg.addColorStop(0.55,'#4a4238');mg.addColorStop(1,'#3a3228')
    rect(tx,ty,tw,th,mg)
    rect(tx-1,ty-1,tw+2,th+2,PAL.ink_m)
    // Metallic sheen
    rect(tx+6,ty+3,tw-12,4,'rgba(180,170,155,0.2)')
    rect(tx+4,ty+th-3,tw-8,2,'rgba(180,170,155,0.1)')
    // Horizontal grain lines
    for(let i=0;i<5;i++){
      const ly=ty+12+i*13
      rect(tx+6,ly,tw-12,1,'rgba(160,150,135,0.06)')
    }
    // Rust spots
    circle(tx+18,ty+th-15,5,'rgba(130,70,35,0.25)')
    circle(tx+tw-20,ty+20,4,'rgba(130,70,35,0.2)')
    circle(tx+50,ty+th-8,3,'rgba(130,70,35,0.15)')
    // Lid (slightly open — angled up)
    $ctx.fillStyle=PAL.ink_m
    $ctx.beginPath()
    $ctx.moveTo(tx-1,ty-8);$ctx.lineTo(tx+tw+1,ty-8)
    $ctx.lineTo(tx+tw-4,ty-1);$ctx.lineTo(tx+4,ty-1);$ctx.closePath()
    $ctx.fill()
    $ctx.fillStyle=PAL.ink
    $ctx.beginPath()
    $ctx.moveTo(tx+2,ty-7);$ctx.lineTo(tx+tw-2,ty-7)
    $ctx.lineTo(tx+tw-6,ty-2);$ctx.lineTo(tx+6,ty-2);$ctx.closePath()
    $ctx.fill()
    // Handle (arched metal bar)
    $ctx.save()
    $ctx.strokeStyle=PAL.rust_l
    $ctx.lineWidth=5
    $ctx.beginPath()
    $ctx.arc(tx+tw/2,ty-14,28,0.25,Math.PI-0.25,false)
    $ctx.stroke()
    $ctx.strokeStyle='rgba(160,106,58,0.3)'
    $ctx.lineWidth=2
    $ctx.beginPath()
    $ctx.arc(tx+tw/2,ty-14,28,0.25,Math.PI-0.25,false)
    $ctx.stroke()
    $ctx.restore()
    // Handle brackets (where handle attaches to lid)
    rect(tx+tw/2-12,ty-8,4,6,PAL.rust)
    rect(tx+tw/2+8,ty-8,4,6,PAL.rust)
    // Latches (two metal clasps)
    rect(tx+25,ty-2,16,6,PAL.rust_l)
    rect(tx+24,ty-3,18,8,PAL.ink_m)
    rect(tx+tw-41,ty-2,16,6,PAL.rust_l)
    rect(tx+tw-42,ty-3,18,8,PAL.ink_m)
    // Latch hooks
    rect(tx+30,ty-7,6,6,PAL.rust)
    rect(tx+tw-36,ty-7,6,6,PAL.rust)
    // Rivets on body
    for(let i=0;i<3;i++)circle(tx+15+i*42,ty+6,1.5,PAL.rust_l)
    for(let i=0;i<3;i++)circle(tx+15+i*42,ty+th-6,1.5,PAL.rust_l)
    // Inside darkness (visible through gap under lid)
    rect(tx+10,ty-4,tw-20,6,PAL.dark)
    // Iron bar (ferro) — lying diagonally inside, visible through opening
    $ctx.save()
    $ctx.translate(tx+tw/2+4,ty-2)
    $ctx.rotate(-0.08)
    rect(-42,-3,84,6,PAL.rust)
    rect(-41,-2.5,82,5,PAL.rust_l)
    rect(-41,-2,82,1.5,'rgba(160,106,58,0.3)')
    rect(-41,1,82,1.5,'rgba(40,20,10,0.3)')
    // Curved hook end
    $ctx.beginPath()
    $ctx.arc(42,0,6,Math.PI*1.15,Math.PI*1.85)
    $ctx.strokeStyle=PAL.rust
    $ctx.lineWidth=4.5
    $ctx.stroke()
    $ctx.beginPath()
    $ctx.arc(42,0,6,Math.PI*1.15,Math.PI*1.85)
    $ctx.strokeStyle=PAL.rust_l
    $ctx.lineWidth=2.5
    $ctx.stroke()
    $ctx.restore()
    // Wrench handle protruding from inside
    wln(tx+28,ty-1,tx+20,ty+22,'rgba(90,80,70,0.5)',2.5,t)
    rect(tx+18,ty+20,6,8,PAL.rust)
    // Dark inner shadow on body top
    rect(tx+2,ty,6,th-2,'rgba(0,0,0,0.1)')
    rect(tx+tw-8,ty,6,th-2,'rgba(0,0,0,0.08)')
  }

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
  // Candle (visible until picked up)
  if(!window.__game||!window.__game.hasObtained('vela')){
    const cx=202, cy=107
    rect(cx-5,cy-12,10,30,PAL.sepia_d)
    rect(cx-6,cy-8,3,10,PAL.sepia)
    rect(cx+4,cy-4,3,8,PAL.sepia)
    rect(cx-2,cy-13,4,4,PAL.ink)
  }
  rect(260,92,30,33,PAL.dark) // box
  rect(80,185,50,35,PAL.paper_d)
  rect(150,190,35,30,PAL.sepia_d)
  rect(220,185,40,35,PAL.ink_m)
  // cobwebs on shelves
  cobweb(35,75,40,30,t)
  cobweb(340,175,30,25,t)

  // Claw marks on bottom shelf — hint for drawer code
  $ctx.strokeStyle='rgba(60,30,15,0.25)'
  $ctx.lineWidth=1.5
  $ctx.beginPath();$ctx.arc(90,376,5,0,Math.PI*2);$ctx.stroke()
  $ctx.beginPath();$ctx.arc(175,376,5.5,0,Math.PI*2);$ctx.stroke()
  $ctx.fillStyle='rgba(60,30,15,0.18)'
  $ctx.beginPath();$ctx.arc(175,376,4.5,0,Math.PI*2);$ctx.fill()
  wln(250,373,270,379,'rgba(60,30,15,0.25)',1.8,t,0.3)

  // Mirror (right side)
  const mirrorBroken=window.__game&&window.__game.hasObtained('caco_vidro')
  const mx=435,my=85,mw=210,mh=270
  rect(mx-5,my-5,mw+10,mh+10,PAL.ink_l)

  $ctx.save()
  $ctx.beginPath()
  $ctx.rect(mx,my,mw,mh)
  $ctx.clip()
  // Reflection of west room (workbench + drawer)
  rect(mx,my,mw,mh,'rgba(36,28,20,0.95)')
  for(let row=0;row<5;row++){
    for(let col=0;col<3;col++){
      const bx=mx+col*70+(row%2)*35,by=my+row*55
      rect(bx,by,60,48,'rgba(52,42,32,0.3)')
      rect(bx+2,by+2,54,44,'rgba(42,34,26,0.15)')
    }
  }
  // Workbench (horizontal plank, reflected)
  rect(mx+10,my+140,190,20,'rgba(26,18,10,0.5)')
  rect(mx+10,my+158,190,8,'rgba(20,14,8,0.4)')
  // Workbench legs
  rect(mx+15,my+166,8,40,'rgba(26,18,10,0.3)')
  rect(mx+187,my+166,8,40,'rgba(26,18,10,0.3)')
  // Drawer above bench
  rect(mx+50,my+130,110,14,'rgba(26,18,10,0.4)')
  rect(mx+90,my+133,28,4,'rgba(58,34,18,0.4)') // handle
  // Diary/book on bench
  rect(mx+100,my+143,35,12,'rgba(42,34,16,0.3)')
  // Rope on wall (right side, simplified)
  for(let i=0;i<4;i++){
    const ry=my+20+i*30
    wln(mx+190,ry,mx+200,ry+12,'rgba(106,90,74,0.2)',1.5,t)
  }
  // Reflective glint
  $ctx.fillStyle='rgba(184,160,128,0.04)'
  $ctx.fillRect(mx+3,my,2,mh)
  $ctx.fillRect(mx+50,my,1,mh)

  if(mirrorBroken){
    // Crack lines overlay
    const ix=540,iy=200
    $ctx.strokeStyle='rgba(184,160,128,0.25)'
    $ctx.lineWidth=1.5
    for(let i=0;i<6;i++){
      const a=i*1.1+0.2,l=50+Math.sin(i*4)*20
      $ctx.beginPath()
      $ctx.moveTo(ix,iy)
      let px=ix,py=iy
      for(let j=0;j<4;j++){
        px+=Math.cos(a+Math.sin(i+j*2)*0.5)*l/4
        py+=Math.sin(a+Math.cos(i+j*2)*0.5)*l/4
        $ctx.lineTo(px,py)
      }
      $ctx.stroke()
    }
    // Distortion: slight offset of the reflection
    rect(mx+10,my+142,190,20,'rgba(26,18,10,0.15)')
    // Offset glint
    $ctx.fillStyle='rgba(184,160,128,0.05)'
    $ctx.fillRect(480,110,2,2)
    $ctx.fillRect(570,240,2,2)
  }

  $ctx.restore()

  // Mirror frame ornate (always on top of mirror surface)
  wln(mx-5,my-5,mx+mw+5,my-5,PAL.rust,1.5,t)
  wln(mx+mw+5,my-5,mx+mw+5,my+mh+5,PAL.rust,1.5,t)
  wln(mx+mw+5,my+mh+5,mx-5,my+mh+5,PAL.rust,1.5,t)
  wln(mx-5,my+mh+5,mx-5,my-5,PAL.rust,1.5,t)

  // Dark recess in the stone wall
  const bx=555,by=375,bw=40,bh=40
  rect(bx,by,bw,bh,PAL.dark)
  rect(bx+2,by+2,bw-4,bh-4,'rgba(0,0,0,0.2)')
  // Rough edges around the hole
  wln(bx,by,bx+bw,by,'rgba(15,8,4,0.5)',1.2,t)
  wln(bx,by+bh,bx+bw,by+bh,'rgba(15,8,4,0.5)',1.2,t)
  wln(bx,by,bx,by+bh,'rgba(15,8,4,0.5)',1.2,t)
  wln(bx+bw,by,bx+bw,by+bh,'rgba(15,8,4,0.5)',1.2,t)
  // Key fragment visible only with candle and not yet picked up
  const keyLit=window.__game&&window.__game.candleLit
  const keyHere=keyLit&&(!window.__game||!window.__game.hasObtained('chave_1'))
  if(keyHere){
    const gl=0.2+Math.sin(t*0.003)*0.12
    $ctx.fillStyle=`rgba(184,150,80,${gl})`
    $ctx.beginPath();$ctx.arc(bx+bw/2,by+bh/2-2,18,0,Math.PI*2);$ctx.fill()
    // Key fragment
    circle(bx+20,by+15,5,PAL.gold)
    circle(bx+20,by+15,2,PAL.dark)
    ln(bx+20,by+15,bx+20,by+30,PAL.gold,1.5)
    ln(bx+20,by+21,bx+26,by+21,PAL.gold,1.2)
    ln(bx+20,by+24,bx+23,by+24,PAL.gold,1.2)
    ln(bx+20,by+27,bx+25,by+27,PAL.gold,1.2)
    // Sparkle
    circle(bx+18,by+12,1.5,'rgba(255,240,200,0.7)')
  }

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
  const fbRaised=window.__game&&window.__game.floorboardRaised
  if(fbRaised){
    // Board tilted up — leaning against the wall on the left side
    $ctx.fillStyle=PAL.ink_l
    $ctx.beginPath()
    $ctx.moveTo(225,463);$ctx.lineTo(245,460);$ctx.lineTo(247,496);$ctx.lineTo(225,500);$ctx.closePath()
    $ctx.fill()
    wln(225,463,225,498,PAL.stone_l,1,t)
    wln(245,460,247,496,PAL.stone_l,0.6,t)
    // wood grain on raised board
    wln(230,470,242,468,PAL.sepia_d,0.5,t,0.3)
    wln(228,482,243,480,PAL.sepia_d,0.5,t,0.3)
    wln(229,492,244,490,PAL.sepia_d,0.5,t,0.3)
    // nail on raised board
    circle(234,477,1.5,PAL.rust_l)
    // Shadow of raised board on floor
    $ctx.fillStyle='rgba(0,0,0,0.35)'
    $ctx.beginPath()
    $ctx.ellipse(260,501,45,5,0,0,Math.PI*2)
    $ctx.fill()
    // Cavity in floor
    rect(248,468,110,32,PAL.dark)
    wln(248,468,358,468,PAL.ink_l,0.5,t)
    wln(248,500,358,500,PAL.ink_l,0.5,t)
    wln(248,468,248,500,PAL.ink_l,0.5,t)
    wln(358,468,358,500,PAL.ink_l,0.5,t)
    // Ball inside — if not yet obtained
    if(!window.__game||!window.__game.hasObtained('bola')){
      circle(300,485,10,PAL.sepia_l)
      $ctx.strokeStyle=PAL.rust_l
      $ctx.lineWidth=1
      $ctx.beginPath()
      $ctx.ellipse(300,485,10,10,0,0,Math.PI*2)
      $ctx.stroke()
      // Highlight on ball
      circle(296,481,2.5,`rgba(200,180,160,0.3)`)
      // Seam
      wln(292,477,308,493,`rgba(100,80,60,0.3)`,0.5,t)
    }
  }else{
    wln(240,465,360,465,PAL.ink_l,0.8,t)
    wln(240,465,240,500,PAL.ink_l,0.8,t)
    wln(240,500,360,500,PAL.ink_l,0.8,t)
    wln(360,465,360,500,PAL.ink_l,0.8,t)
    circle(250,480,2,PAL.rust_l)
    circle(350,480,2,PAL.rust_l)
  }

  // Stone (item) — visible until picked up
  if(!window.__game||!window.__game.hasObtained('pedra')){
    // Irregular rock shape
    const sp=[[95,465],[130,460],[150,472],[145,490],[130,500],[105,502],[88,492],[85,475]]
    pl(sp,PAL.stone)
    pl([[95,465],[130,460],[150,472],[145,490],[130,500],[105,502],[88,492],[85,475]],'rgba(36,28,20,0.6)')
    // Highlight face (top-left)
    pl([[95,465],[130,460],[120,470],[88,475]],'rgba(74,66,56,0.4)')
    // Dark face (bottom)
    pl([[145,490],[130,500],[105,502],[88,492],[95,482]],'rgba(20,14,10,0.4)')
    // Crack lines
    wln(105,485,120,470,PAL.ink_l,0.6,t)
    wln(112,492,130,478,PAL.ink_l,0.4,t)
    wln(95,478,110,488,PAL.ink_l,0.3,t)
    // Outline
    wln(95,465,130,460,PAL.ink_l,0.8,t)
    wln(130,460,150,472,PAL.ink_l,0.8,t)
    wln(150,472,145,490,PAL.ink_l,0.8,t)
    wln(145,490,130,500,PAL.ink_l,0.8,t)
    wln(130,500,105,502,PAL.ink_l,0.6,t)
    wln(105,502,88,492,PAL.ink_l,0.6,t)
    wln(88,492,85,475,PAL.ink_l,0.6,t)
    wln(85,475,95,465,PAL.ink_l,0.8,t)
    // Shadow under stone
    $ctx.fillStyle='rgba(0,0,0,0.25)'
    $ctx.beginPath()
    $ctx.ellipse(120,503,30,5,0,0,Math.PI*2)
    $ctx.fill()
  }

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

  // Workbench — larger body
  rect(70,275,580,100,PAL.ink_l)
  rect(75,280,570,90,PAL.ink)
  wln(70,275,650,275,PAL.ink_m,0.8,t)
  wln(70,375,650,375,PAL.ink_m,0.6,t)
  // wood grain
  for(let i=0;i<8;i++){
    const gy=285+i*10
    wln(85,gy,635,gy,PAL.ink_m,0.25,t,0.3)
  }
  // legs
  rect(90,375,30,55,PAL.ink_l)
  rect(600,375,30,55,PAL.ink_l)
  rect(92,375,26,55,PAL.ink)
  rect(602,375,26,55,PAL.ink)
  // shadow under bench
  rect(70,418,580,16,grad(0,418,0,434,'rgba(0,0,0,0.4)','rgba(0,0,0,0)'))

  // Drawer — properly inset into bench face
  const drawerSolved=typeof PUZZLES!=='undefined'&&PUZZLES.drawer&&PUZZLES.drawer.solved
  if(drawerSolved){
    // Empty cavity — dark hole inside the bench
    rect(220,298,180,62,PAL.dark)
    rect(220,298,180,12,grad(0,298,0,310,'rgba(0,0,0,0.4)','rgba(0,0,0,0)'))
    // Bottom inner shadow
    rect(220,350,180,10,grad(0,350,0,360,'rgba(0,0,0,0)','rgba(0,0,0,0.3)'))
    // Drawer face pulled down and tilted — sits below the cavity
    rect(215,345,190,45,PAL.ink_l)
    rect(220,348,180,37,PAL.ink)
    wln(215,345,405,345,PAL.ink_m,0.6,t)
    wln(215,390,405,390,PAL.ink_m,0.4,t)
    // handle (shifted down with drawer face)
    rect(295,362,30,6,PAL.rust)
    rect(293,360,34,10,PAL.rust_l)
    circle(310,365,3,PAL.rust_l)
    // Match inside the cavity (visible until picked up)
    if(!window.__game||!window.__game.hasObtained('fosforo')){
      rect(255,312,28,3,PAL.paper_d)
      circle(255,313,2,'rgba(180,60,30,0.6)')
    }
  }else{
    rect(220,295,180,65,PAL.ink_l)
    rect(225,300,170,55,PAL.ink)
    wln(220,295,400,295,PAL.ink_m,0.8,t)
    wln(220,360,400,360,PAL.ink_m,0.6,t)
    wln(220,295,220,360,PAL.ink_m,0.4,t)
    wln(400,295,400,360,PAL.ink_m,0.4,t)
    // handle
    rect(295,322,30,6,PAL.rust)
    rect(293,320,34,10,PAL.rust_l)
    circle(310,325,3,PAL.rust_l)
    // keyhole
    rect(270,308,5,10,PAL.dark)
    circle(272,313,3,PAL.dark)
    rect(220,293,180,4,'rgba(0,0,0,0.15)')
  }

  // Diary on bench — leather book with pages and ribbon
  // Shadow
  rect(400,274,80,6,'rgba(0,0,0,0.2)')
  // Page edges (cream stack)
  rect(406,240,66,33,PAL.paper_l)
  rect(408,242,62,29,PAL.paper)
  for(let i=0;i<6;i++){
    const ly=242+i*5
    rect(408,ly,62,1,'rgba(200,180,150,0.15)')
  }
  // Cover (leather, slightly larger)
  rect(402,238,72,37,PAL.rust_d)
  rect(404,240,68,33,'rgba(60,30,15,0.6)')
  // Spine (left edge)
  rect(402,238,8,37,PAL.rust)
  wln(402,238,410,238,PAL.gold,0.4,t)
  wln(402,275,410,275,PAL.gold,0.4,t)
  ln(406,242,406,272,PAL.gold,0.5)
  ln(408,242,408,272,PAL.gold,0.3)
  // Gold cross on cover
  ln(440,244,440,272,PAL.gold,0.6)
  ln(428,255,452,255,PAL.gold,0.6)
  // Ribbon bookmark
  const ry=274+Math.sin(t*0.001)*2
  rect(452,ry,4,18,PAL.blood_s)
  rect(452,ry+15,4,5,'rgba(120,40,30,0.3)')
  // slight corner wear
  rect(468,238,4,3,'rgba(20,12,8,0.3)')

  // Rope hanging on wall
  // Wall hook/nail (always visible)
  circle(620,65,4,PAL.rust)
  circle(620,65,2,PAL.rust_l)
  rect(618,60,4,8,PAL.rust)
  // Rope itself (visible until picked up)
  if(!window.__game||!window.__game.hasObtained('corda')){
    const rx=620,ry=60
    for(let i=0;i<8;i++){
      const ry2=ry+i*25
      const sw=2+Math.sin(i)*0.5
      wln(rx-6+Math.sin(t*0.001+i)*2,ry2,rx+6+Math.cos(t*0.001+i)*2,ry2+12,PAL.sepia,sw,t)
    }
    ln(rx,ry+4,rx,ry+220,PAL.sepia,2.5)
    circle(rx,ry+6,6,PAL.sepia)
  }

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

/* ─── CEILING — Gothic vault ─── */
function drCeiling(ctx,t){
  $ctx=ctx
  const lit=window.__game&&window.__game.candleLit
  const hatchOpen=window.__game&&window.__game.hasObtained('osso')
  const so=window.__game&&window.__game.shivaOffered||{eye:false,mouth:false,paw:false}

  rect(0,0,800,600,rgrad(400,300,450,lit?'#120a06':'#050302',lit?'#1a1008':'#0a0806'))

  // Vaulted stone ribs
  for(let i=0;i<14;i++){
    const a=-Math.PI/3+i*0.2
    const x1=400+Math.cos(a)*460, y1=300+Math.sin(a)*390
    const x2=400+Math.cos(a-0.03)*470, y2=300+Math.sin(a-0.03)*400
    if(x1<0||x1>800)continue
    const ri=0.15+Math.sin(t*0.0008+i)*0.05
    wln(x1,y1,400,30,lit?`rgba(50,38,28,${ri})`:PAL.ink_m,1,t,0.5)
    wln(x2,y2,400,30,lit?`rgba(60,48,36,${ri*0.6})`:PAL.ink_l,0.6,t,0.4)
  }
  // Boss at apex
  circle(400,30,lit?20:16,lit?PAL.stone:PAL.stone_d)
  circle(400,30,lit?12:10,lit?PAL.stone_l:PAL.ink_m)
  if(lit){
    wln(400,18,400,42,PAL.sepia_d,0.4,t,0.2)
    wln(388,30,412,30,PAL.sepia_d,0.4,t,0.2)
  }

  // Horizontal beams
  for(let i=0;i<4;i++){
    const ty=80+i*100
    const bc=lit?PAL.stone_l:PAL.ink_l
    wln(40+Math.sin(i)*12,ty,760+Math.sin(i+1)*12,ty,bc,0.8,t,0.5)
    for(let j=0;j<7;j++){
      const bx=60+j*110
      wln(bx,ty-3,bx+18,ty-8,lit?PAL.sepia_d:PAL.ink_m,0.4,t,0.3)
      if(lit)wln(bx+2,ty-2,bx+8,ty-10,PAL.sepia_d,0.2,t,0.2)
    }
  }

  // ─── CHAIN & HOOK ───
  // Ring at top
  circle(400,28,5,lit?PAL.rust_l:PAL.rust)
  circle(400,28,3,lit?PAL.gold:PAL.rust_l)
  // Chain links
  for(let i=0;i<10;i++){
    const cy=40+i*20,cw=7+Math.sin(i*0.7)*2
    wln(400-cw,cy,400+cw,cy+7,lit?PAL.rust_l:PAL.rust,1.2,t)
    wln(400+cw,cy+7,400-cw,cy+14,lit?PAL.rust_l:PAL.rust,1.2,t)
    circle(400,cy+3.5,2.5,lit?PAL.gold:PAL.rust_l)
  }
  // Vertical chain line
  wln(400,28,400,240,lit?PAL.rust_l:PAL.rust,1.5,t)
  // Hook
  pl([[394,235],[406,235],[406,240],[394,240]],lit?PAL.rust_l:PAL.rust)
  wln(400,240,400,255,lit?PAL.rust_l:PAL.rust,2,t)
  wln(400,255,390,268,lit?PAL.rust_l:PAL.rust,2,t)
  wln(390,268,380,272,lit?PAL.rust_l:PAL.rust,1.5,t)
  circle(382,272,2,lit?PAL.gold:PAL.rust_l)
  // Hook barb
  wln(400,255,410,268,lit?PAL.rust_l:PAL.rust,1.5,t)
  wln(410,268,415,272,lit?PAL.rust_l:PAL.rust,1,t)
  // Rust spots on chain
  if(lit)for(let i=0;i<6;i++){
    const rx=395+Math.sin(i*13)*6, ry=50+i*28
    circle(rx,ry,1.5,PAL.rust_d)
  }

  // ─── HATCH ───
  if(hatchOpen){
    // Open hatch — dark opening
    rect(300,300,200,80,PAL.dark)
    // Frame
    wln(300,300,500,300,PAL.stone_l,1,t)
    wln(300,300,300,380,PAL.stone_l,1,t)
    wln(300,380,500,380,PAL.stone_l,1,t)
    wln(500,300,500,380,PAL.stone_l,1,t)
    // Darkness inside
    rect(305,305,190,70,rgrad(400,340,120,'#020101','#050302'))
    // Depth shadow
    rect(305,305,190,4,grad(305,305,305,309,'rgba(0,0,0,0.6)','rgba(0,0,0,0)'))
    rect(305,375,190,4,grad(305,375,305,379,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))
    // Open door panel hanging down on left side
    pl([[297,295],[303,296],[303,385],[297,383]],PAL.stone_d)
    wln(297,295,297,383,PAL.stone_l,0.8,t)
    // Ladder rungs visible in opening
    for(let i=0;i<3;i++){
      const ly=320+i*20
      ln(350,ly,450,ly,`rgba(100,80,60,${0.2+Math.sin(t*0.001+i)*0.1})`,1)
    }
    // Faint draft lines from opening
    const dr=0.04+Math.sin(t*0.002)*0.03
    $ctx.fillStyle=`rgba(160,140,120,${dr})`
    $ctx.beginPath()
    $ctx.ellipse(425,380,40,4,0,0,Math.PI*2)
    $ctx.fill()
    // Chain now hangs down into the opening
    wln(400,28,400,310,PAL.rust,1,t)
    circle(400,310,3,PAL.rust_l)
  }else{
    // Closed hatch
    wln(300,300,500,300,PAL.ink_l,1,t)
    wln(300,300,300,380,PAL.ink_l,1,t)
    wln(300,380,500,380,PAL.ink_l,1,t)
    wln(500,300,500,380,PAL.ink_l,1,t)
    // Hatch handle
    rect(390,322,20,36,PAL.rust)
    circle(400,340,4,PAL.rust_l)
    // Bolt/rivet corners
    circle(308,308,2,PAL.rust_l)
    circle(492,308,2,PAL.rust_l)
    circle(308,372,2,PAL.rust_l)
    circle(492,372,2,PAL.rust_l)
    // Plank lines on hatch
    wln(305,335,495,335,PAL.ink_m,0.4,t)
    wln(305,355,495,355,PAL.ink_m,0.4,t)
  }

  // ─── EYES IN DARKNESS ───
  if(lit){
    // Faint suggestion of eyes — barely there
    const ep=0.08+Math.sin(t*0.001)*0.04
    $ctx.fillStyle=`rgba(184,106,58,${ep})`
    circle(240,168,6,PAL.rust_l)
    circle(290,173,6,PAL.rust_l)
    // Ambient reflection
    $ctx.fillStyle=`rgba(184,106,58,${ep*0.4})`
    circle(238,166,1.5,PAL.gold)
    circle(288,171,1.5,PAL.gold)
  }else{
    // Glowing eyes in dark
    const p=0.2+Math.sin(t*0.001)*0.12
    $ctx.fillStyle=`rgba(184,106,58,${p*0.3})`
    circle(245+Math.sin(t*0.0005)*3,168,9,PAL.rust_l)
    circle(295+Math.sin(t*0.0005+1)*3,173,9,PAL.rust_l)
    $ctx.fillStyle=PAL.dark
    circle(245+Math.sin(t*0.0005)*3,168,4,PAL.dark)
    circle(295+Math.sin(t*0.0005+1)*3,173,4,PAL.dark)
    circle(243+Math.sin(t*0.0005)*3,166,1.5,PAL.gold)
    circle(293+Math.sin(t*0.0005+1)*3,171,1.5,PAL.gold)
  }

  // Distant eyes
  const p2=0.1+Math.sin(t*0.001+1)*0.08
  $ctx.fillStyle=`rgba(184,106,58,${p2*0.15})`
  circle(580,155,5,PAL.rust_l)
  circle(610,160,5,PAL.rust_l)
  $ctx.fillStyle=PAL.dark
  circle(580,155,2,PAL.dark)
  circle(610,160,2,PAL.dark)

  // ─── OFFERING SPOTS (lit only) ───
  if(lit){
    // SPOT 1: Eye — caco_vidro
    const eyeOffered=so.eye
    if(!eyeOffered){
      const sa=0.4+Math.sin(t*0.003)*0.2
      $ctx.fillStyle=`rgba(200,160,80,${sa*0.18})`
      $ctx.beginPath()
      $ctx.ellipse(227,147,18,14,0,0,Math.PI*2)
      $ctx.fill()
      $ctx.strokeStyle=`rgba(200,160,80,${sa*0.35})`
      $ctx.lineWidth=0.8
      $ctx.beginPath()
      $ctx.ellipse(227,147,16,12,0,0,Math.PI*2)
      $ctx.stroke()
      circle(227,147,2,`rgba(220,180,100,${sa*0.6})`)
      for(let i=0;i<3;i++){
        const ang=t*0.0015+i*2.1
        circle(227+Math.cos(ang)*18,147+Math.sin(ang)*14,1,`rgba(200,160,80,${0.15+Math.sin(t*0.002+i)*0.08})`)
      }
    }else{
      circle(227,147,4,`rgba(140,120,180,0.35)`)
      circle(225,146,1.5,'rgba(200,180,240,0.3)')
    }

    // SPOT 2: Mouth — bola
    if(!so.mouth){
      const sa=0.4+Math.sin(t*0.003+1)*0.2
      $ctx.fillStyle=`rgba(200,160,80,${sa*0.15})`
      $ctx.beginPath()
      $ctx.ellipse(195,182,16,12,0,0,Math.PI*2)
      $ctx.fill()
      circle(195,182,2.5,`rgba(220,180,100,${sa*0.6})`)
      for(let i=0;i<3;i++){
        const ang=t*0.0015+i*2.1+1
        circle(195+Math.cos(ang)*18,182+Math.sin(ang)*14,1,`rgba(200,160,80,${0.15+Math.sin(t*0.002+i+1)*0.08})`)
      }
    }else{
      circle(195,182,5,`rgba(140,110,80,0.4)`)
    }

    // SPOT 3: Paw — osso
    if(!so.paw){
      const sa=0.4+Math.sin(t*0.003+2)*0.2
      $ctx.fillStyle=`rgba(200,160,80,${sa*0.15})`
      $ctx.beginPath()
      $ctx.ellipse(300,245,18,14,0.15,0,Math.PI*2)
      $ctx.fill()
      circle(300,245,2,`rgba(220,180,100,${sa*0.6})`)
      for(let i=0;i<3;i++){
        const ang=t*0.0015+i*2.1+2
        circle(300+Math.cos(ang)*18,245+Math.sin(ang)*16,1,`rgba(200,160,80,${0.15+Math.sin(t*0.002+i+2)*0.08})`)
      }
    }else{
      circle(300,245,4,`rgba(160,130,100,0.3)`)
    }
  }

  // ─── CORNER SHADOWS ───
  rect(0,0,60,600,grad(0,0,60,0,`rgba(0,0,0,${lit?0.5:0.75})`,`rgba(0,0,0,0)`))
  rect(740,0,60,600,grad(740,0,800,0,`rgba(0,0,0,${lit?0.5:0.75})`,`rgba(0,0,0,0)`))
  rect(0,480,800,120,grad(0,480,0,600,'rgba(0,0,0,0)',`rgba(0,0,0,${lit?0.75:0.85})`))

  hatch(0,0,80,600,-45,14,PAL.shadow,t)
  hatch(720,0,80,600,45,14,PAL.shadow,t)

  // ─── CANDLE WARM GLOW (lit) ───
  if(lit){
    const flicker=0.08+Math.sin(t*0.005)*0.04
    const warmG=rgrad(400,550,480,`rgba(255,160,60,${flicker*0.2})`,'rgba(255,160,60,0)')
    $ctx.fillStyle=warmG
    $ctx.fillRect(0,0,800,600)
  }

  paperGrain(7)
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

/* ─── SHELF CLOSE-UP ─── */
function drShelfCloseup(ctx,t,cup){
  $ctx=ctx
  rect(0,0,800,600,PAL.ink)
  rect(80,80,640,420,PAL.ink_l)
  rect(85,85,630,410,PAL.ink)
  rect(80,280,640,12,PAL.ink_l)
  wln(80,280,720,280,PAL.ink_m,0.8,t)
  for(let i=0;i<8;i++)wln(100,290+i*5,700,290+i*5,PAL.ink_m,0.3,t,0.3)

  rect(80,80,640,60,grad(80,80,80,140,'rgba(0,0,0,0.6)','rgba(0,0,0,0)'))
  rect(80,460,640,40,grad(80,460,80,500,'rgba(0,0,0,0)','rgba(0,0,0,0.6)'))

  if(cup.step<2){
    const cg=rgrad(400,230,70,'rgba(255,200,100,0.2)','rgba(255,200,100,0)')
    $ctx.fillStyle=cg
    $ctx.beginPath();$ctx.arc(400,230,70,0,Math.PI*2);$ctx.fill()
    $ctx.fillStyle=rgrad(400,230,35,'rgba(255,200,100,0.12)','rgba(255,200,100,0)')
    $ctx.beginPath();$ctx.arc(400,230,35,0,Math.PI*2);$ctx.fill()
    rect(394,210,12,48,PAL.sepia_d)
    rect(392,218,4,12,PAL.sepia)
    rect(408,222,3,10,PAL.sepia)
    $ctx.fillStyle=PAL.sepia
    $ctx.beginPath()
    $ctx.ellipse(394,225,3,5,0,0,Math.PI*2)
    $ctx.fill()
    ln(400,210,400,203,PAL.ink,1.5)
    const fl=0.7+Math.sin(t*0.006)*0.2
    $ctx.fillStyle=`rgba(255,180,60,${fl})`
    $ctx.beginPath();$ctx.ellipse(400,198,6,12,0,0,Math.PI*2);$ctx.fill()
    $ctx.fillStyle=`rgba(255,220,160,${fl*0.5})`
    $ctx.beginPath();$ctx.ellipse(400,194,3,7,0,0,Math.PI*2);$ctx.fill()
  }

  if(cup.step===1){
    const elapsed=Math.min(1,(t-cup.stepTime)/600)
    const handOff=80*(1-elapsed)
    $ctx.strokeStyle=PAL.sepia_d
    $ctx.lineWidth=10
    $ctx.lineCap='round'
    $ctx.beginPath()
    $ctx.moveTo(400,80+handOff)
    $ctx.quadraticCurveTo(430,90+handOff,400,120+handOff)
    $ctx.stroke()
    $ctx.lineWidth=4
    $ctx.beginPath()
    $ctx.moveTo(396,108+handOff)
    $ctx.quadraticCurveTo(390,115+handOff,396,122+handOff)
    $ctx.stroke()
    $ctx.beginPath()
    $ctx.moveTo(404,108+handOff)
    $ctx.quadraticCurveTo(410,115+handOff,404,122+handOff)
    $ctx.stroke()
    $ctx.fillStyle=PAL.sepia_d
    $ctx.beginPath()
    $ctx.ellipse(400,125+handOff,12,8,0,0,Math.PI*2)
    $ctx.fill()
  }

  if(cup.step===0){
    const ha=0.35+Math.sin(t*0.003)*0.1
    $ctx.fillStyle=`rgba(184,160,128,${ha})`
    $ctx.font='15px Georgia'
    $ctx.textAlign='center'
    $ctx.fillText('[ Clique para pegar a vela ]',400,560)
  }

  paperGrain(3)
  vignette(ctx)
}

function drawPickupToast(ctx,t,anim){
  if(!anim)return
  const elapsed=t-anim.startTime
  const dur=anim.duration||800
  const progress=Math.min(1,elapsed/dur)
  if(progress>=1)return
  const alpha=1-progress
  const yOff=-40*progress
  ctx.save()
  ctx.globalAlpha=alpha
  ctx.font='24px Georgia'
  ctx.textAlign='center'
  ctx.fillStyle=PAL.gold
  ctx.fillText('+ '+(anim.icon||'·'),400+(anim.xOff||0),280+yOff)
  ctx.font='14px Georgia'
  ctx.fillStyle=PAL.sepia_l
  ctx.fillText(anim.name||'Item',400+(anim.xOff||0),305+yOff)
  ctx.restore()
}

const VIEW_DRAW = {
  north: drNorth,
  east: drEast,
  south: drSouth,
  west: drWest,
  ceiling: drCeiling
}
