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
  rect(0,430,800,170,PAL.ink_m)
  rect(0,428,800,2,PAL.shadow_d)
  rect(0,430,800,1,PAL.ink)
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
  wln(240,465,360,465,PAL.ink_l,0.8,t)
  wln(240,465,240,500,PAL.ink_l,0.8,t)
  wln(240,500,360,500,PAL.ink_l,0.8,t)
  wln(360,465,360,500,PAL.ink_l,0.8,t)
  // nail
  circle(250,480,2,PAL.rust_l)
  circle(350,480,2,PAL.rust_l)

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

/* ─── CEILING (DARK) — Gothic vault ─── */
function drCeiling(ctx,t){
  $ctx=ctx
  rect(0,0,800,600,rgrad(400,300,450,'#050302','#0a0806'))

  // Vaulted stone ribs — cathedral arches
  for(let i=0;i<12;i++){
    const a=-Math.PI/3+i*0.22
    const x1=400+Math.cos(a)*450, y1=300+Math.sin(a)*380
    const x2=400+Math.cos(a-0.04)*460, y2=300+Math.sin(a-0.04)*390
    if(x1<0||x1>800)continue
    wln(x1,y1,400,30,PAL.ink_m,0.9,t,0.5)
    wln(x2,y2,400,30,PAL.ink_l,0.5,t,0.4)
  }
  // Boss at center
  circle(400,30,16,PAL.stone_d)
  circle(400,30,10,PAL.ink_m)

  // Horizontal beams
  for(let i=0;i<4;i++){
    const ty=80+i*100
    wln(40+Math.sin(i)*12,ty,760+Math.sin(i+1)*12,ty,PAL.ink_l,0.7,t,0.5)
    for(let j=0;j<7;j++){
      const bx=60+j*110
      wln(bx,ty-3,bx+18,ty-8,PAL.ink_m,0.3,t,0.3)
    }
  }

  // Chain
  for(let i=0;i<10;i++){
    const cy=40+i*22,cw=8+Math.sin(i*0.8)*2
    wln(400-cw,cy,400+cw,cy+8,PAL.rust,1.5,t)
    wln(400+cw,cy+8,400-cw,cy+16,PAL.rust,1.5,t)
    circle(400,cy+4,3,PAL.rust_l)
  }
  wln(400,40,400,260,PAL.rust,2,t)
  pl([[396,250],[404,250],[400,285],[396,260]],PAL.rust_l)

  // Hatch
  wln(300,300,500,300,PAL.ink_l,1.2,t)
  wln(300,300,300,380,PAL.ink_l,1.2,t)
  wln(300,380,500,380,PAL.ink_l,1.2,t)
  wln(500,300,500,380,PAL.ink_l,1.2,t)
  rect(390,320,20,40,PAL.rust)
  circle(400,340,4,PAL.rust_l)

  // Faint eyes in darkness
  const p=0.2+Math.sin(t*0.001)*0.12
  $ctx.fillStyle=`rgba(184,106,58,${p*0.3})`
  circle(245+Math.sin(t*0.0005)*3,168,9,PAL.rust_l)
  circle(295+Math.sin(t*0.0005+1)*3,173,9,PAL.rust_l)
  $ctx.fillStyle=PAL.dark
  circle(245+Math.sin(t*0.0005)*3,168,4,PAL.dark)
  circle(295+Math.sin(t*0.0005+1)*3,173,4,PAL.dark)
  circle(243+Math.sin(t*0.0005)*3,166,1.5,PAL.gold)
  circle(293+Math.sin(t*0.0005+1)*3,171,1.5,PAL.gold)

  // Distant eyes
  const p2=0.1+Math.sin(t*0.001+1)*0.08
  $ctx.fillStyle=`rgba(184,106,58,${p2*0.15})`
  circle(580,155,5,PAL.rust_l)
  circle(610,160,5,PAL.rust_l)
  $ctx.fillStyle=PAL.dark
  circle(580,155,2,PAL.dark)
  circle(610,160,2,PAL.dark)

  // Corner shadows
  rect(0,0,60,600,PAL.shadow_d)
  rect(740,0,60,600,PAL.shadow_d)
  rect(0,480,800,120,grad(0,480,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.85)'))

  hatch(0,0,80,600,-45,14,PAL.shadow,t)
  hatch(720,0,80,600,45,14,PAL.shadow,t)
  paperGrain(7)
  vignette(ctx)
}

/* ─── CEILING LIT — Shiva revealed ─── */
function drCeilingLantern(ctx,t,game){
  $ctx=ctx
  const so=game.shivaOffered||{eye:false,mouth:false,paw:false}

  // ─── ABYSS BACKGROUND ───
  rect(0,0,800,600,rgrad(400,300,450,'#0d0804','#050201'))
  rect(0,0,800,600,grad(0,0,0,600,'rgba(184,100,50,0.03)','rgba(0,0,0,0.35)'))

  // ─── STONE VAULT — cold ribs in shadow ───
  for(let i=0;i<14;i++){
    const a=-Math.PI/3+i*0.18
    const x1=400+Math.cos(a)*480, y1=300+Math.sin(a)*400
    if(x1<0||x1>800)continue
    const ri=0.15+Math.sin(t*0.0008+i)*0.05
    wln(x1,y1,400,30,`rgba(40,30,24,${ri})`,1.5,t,0.3)
  }
  // Horizontal beams — warped
  for(let i=0;i<5;i++){
    const ty=60+i*95
    const a=0.5+Math.sin(i*1.7)*0.3
    wln(30+Math.sin(i*2.1)*15,ty,770+Math.sin(i*2.7)*15,ty,`rgba(40,30,24,${a})`,1.2,t,0.3)
  }

  // ─── CORNER VOID ───
  rect(0,0,90,600,grad(0,0,90,0,'rgba(0,0,0,0.7)','rgba(0,0,0,0)'))
  rect(710,0,90,600,grad(710,0,800,0,'rgba(0,0,0,0.7)','rgba(0,0,0,0)'))
  rect(0,470,800,130,grad(0,470,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.8)'))

  // ─── SHIVA — HORROR FORM ───
  const sh=$ctx
  const breath=Math.sin(t*0.001)*0.03
  const ba=0.8+breath

  // ─── BODY — twisted, fused with shadow ───
  // Wide shadow presence
  for(let r=5;r>0;r--){
    const ra=`rgba(20,10,6,${0.06+r*0.015+Math.sin(t*0.0008+r)*0.02})`
    sh.fillStyle=ra
    sh.beginPath()
    sh.ellipse(410,135,300+r*14,85+r*10+Math.sin(t*0.0005+r)*4,0.04,0,Math.PI*2)
    sh.fill()
  }

  // Body mass — not an ellipse, an irregular twisted shape
  sh.fillStyle=`rgba(30,18,10,${ba})`
  pl([[180,160],[220,105],[340,88],[460,90],[580,108],[640,145],
      [620,175],[500,190],[380,190],[260,185],[195,180]],`rgba(30,18,10,${ba})`)

  // Darker core
  sh.fillStyle=`rgba(22,12,6,${ba*0.85})`
  pl([[250,145],[340,110],[450,108],[550,120],[580,150],
      [500,165],[380,168],[280,160]],`rgba(22,12,6,${ba*0.85})`)

  // Spine ridges — crooked vertebrae pushing against skin
  const spineRY=[105,100,97,96,97,100,104,109,115,122,130,140,152,165,178]
  for(let i=0;i<spineRY.length;i++){
    const sx=200+i*30, sy=spineRY[i]+Math.sin(t*0.001+i*0.7)*3
    const sa=0.2+Math.sin(t*0.0012+i*1.1)*0.08
    sh.fillStyle=`rgba(50,32,16,${sa})`
    sh.beginPath()
    sh.ellipse(sx,sy,3+Math.sin(i*1.3)*1.5,5+Math.cos(i*0.9)*1.5,0.1,0,Math.PI*2)
    sh.fill()
    // sharp tip
    sh.strokeStyle=`rgba(70,42,20,${sa*0.5})`
    sh.lineWidth=0.8
    sh.beginPath()
    sh.moveTo(sx-1,sy-2);sh.lineTo(sx+Math.sin(t*0.002+i)*1.5,sy-7-Math.sin(t*0.001+i)*1.5)
    sh.stroke()
  }

  // ─── RIBS — emerging from stone, becoming the vault ribs ───
  const ribX=[250,290,330,370,410,450,490,530,570]
  for(let i=0;i<ribX.length;i++){
    const rx=ribX[i], rbase=115+i*0.5+Math.sin(t*0.001+i)*3
    const ra2=0.15+Math.sin(t*0.0012+i*1.7)*0.07
    // Curved rib bone
    sh.strokeStyle=`rgba(55,35,18,${ra2})`
    sh.lineWidth=1.8+Math.sin(i*0.5)*0.6
    sh.beginPath()
    sh.moveTo(rx-8,rbase-3)
    if(i%2===0){
      sh.quadraticCurveTo(rx+10,rbase+12,rx-4,rbase+18)
    }else{
      sh.quadraticCurveTo(rx+5,rbase+18,rx-6,rbase+10)
    }
    sh.stroke()
    // Second rib line
    sh.strokeStyle=`rgba(45,28,14,${ra2*0.6})`
    sh.lineWidth=1
    sh.beginPath()
    sh.moveTo(rx-4,rbase-1)
    sh.quadraticCurveTo(rx+8,rbase+8,rx-2,rbase+15)
    sh.stroke()
  }

  // ─── FUR SHADOWS — tendrils reaching into darkness ───
  for(let i=0;i<30;i++){
    const fx=180+Math.sin(i*3.7)*60+i*16, fy=100+Math.sin(i*2.3+i*0.1)*18+Math.sin(t*0.0015+i)*4
    if(fx<30||fx>770)continue
    const fa=0.04+Math.sin(t*0.001+i*4)*0.03
    sh.strokeStyle=`rgba(60,35,18,${fa})`
    sh.lineWidth=1+Math.sin(i*1.7)*0.5
    sh.beginPath()
    sh.moveTo(fx,fy)
    const dx=fx+Math.sin(i*5.1+t*0.001)*14, dy=fy-8-Math.sin(i*3.3+t*0.001)*6
    sh.quadraticCurveTo(fx+Math.sin(i*4.1+t*0.0008)*8,fy-4,dx,dy)
    sh.stroke()
  }

  // ─── HEAD — too large, wrong ───
  sh.save()

  // Dark halo around head
  sh.fillStyle=`rgba(8,4,2,0.35)`
  sh.beginPath()
  sh.ellipse(230,140,85,65+Math.sin(t*0.0009)*3,0.15,0,Math.PI*2)
  sh.fill()

  // Skull base — elongated, malformed
  sh.fillStyle=`rgba(40,22,12,${ba})`
  sh.beginPath()
  sh.moveTo(180,165)
  sh.quadraticCurveTo(170,125,205,108)
  sh.quadraticCurveTo(230,98,260,102)
  sh.quadraticCurveTo(285,115,270,155)
  sh.quadraticCurveTo(255,175,220,178)
  sh.quadraticCurveTo(195,176,180,165)
  sh.fill()

  // Skull outline — sketchy, bony edges
  sh.strokeStyle=`rgba(80,48,22,${ba})`
  sh.lineWidth=1.5
  sh.beginPath()
  sh.moveTo(180,165)
  sh.quadraticCurveTo(168,120,205,106)
  sh.quadraticCurveTo(230,96,262,100)
  sh.quadraticCurveTo(288,115,272,158)
  sh.stroke()

  // Snout — elongated, cracked
  sh.fillStyle=`rgba(48,26,14,${ba})`
  sh.beginPath()
  sh.moveTo(190,152)
  sh.quadraticCurveTo(170,148,150,156)
  sh.quadraticCurveTo(140,164,148,174)
  sh.quadraticCurveTo(160,180,185,174)
  sh.closePath()
  sh.fill()
  sh.strokeStyle=`rgba(80,48,22,${ba*0.7})`
  sh.lineWidth=1
  sh.stroke()

  // Crack in snout
  wln(165,156,175,168,`rgba(20,10,5,0.4)`,0.8,t,0.3)

  // Nose — black, cracked
  sh.fillStyle=PAL.dark
  sh.beginPath()
  sh.ellipse(143,162,5,4,0,0,Math.PI*2)
  sh.fill()
  sh.strokeStyle='rgba(60,35,18,0.3)'
  sh.lineWidth=0.5
  sh.beginPath()
  sh.ellipse(143,162,5,4,0,0,Math.PI*2)
  sh.stroke()
  // Nose highlight — wet
  circle(141,160,1.2,'rgba(140,120,100,0.15)')

  // ─── BREATH — hot, visible mist ───
  const br=0.07+Math.sin(t*0.0025)*0.04
  sh.fillStyle=`rgba(160,120,80,${br})`
  sh.beginPath()
  sh.ellipse(130,168,14+Math.sin(t*0.003)*5,8+Math.sin(t*0.003+1)*4,0,0,Math.PI*2)
  sh.fill()
  sh.fillStyle=`rgba(120,90,60,${br*0.5})`
  sh.beginPath()
  sh.ellipse(122,174,10+Math.sin(t*0.003+2)*4,6+Math.sin(t*0.003+3)*3,0,0,Math.PI*2)
  sh.fill()

  // ─── 3 EYES — uneven, tracking ───
  const eyePositions=[[210,140],[235,138],[258,142]]
  const eyePulse=0.5+Math.sin(t*0.0025)*0.25
  for(let e=0;e<3;e++){
    const [ex,ey]=eyePositions[e]
    // Outer glow
    const eg=0.25+Math.sin(t*0.002+e*1.3)*0.12
    sh.fillStyle=`rgba(220,150,80,${eg})`
    sh.beginPath()
    sh.ellipse(ex,ey,11+Math.sin(t*0.0015+e)*1.5,7+Math.sin(t*0.0015+e+1)*1,0,0,Math.PI*2)
    sh.fill()
    // Sclera — bloodshot
    sh.fillStyle=`rgba(160,100,60,${eyePulse*0.4})`
    sh.beginPath()
    sh.ellipse(ex,ey,8,6,0,0,Math.PI*2)
    sh.fill()
    // Iris — amber glow
    sh.fillStyle=`rgba(200,120,60,${eyePulse*0.6})`
    sh.beginPath()
    sh.ellipse(ex,ey,5,5,0,0,Math.PI*2)
    sh.fill()
    // Slit pupil — vertical, wrong
    sh.fillStyle=PAL.dark
    sh.beginPath()
    sh.ellipse(ex-0.5,ey,1.2,4.5,0.15,0,Math.PI*2)
    sh.fill()
    // Pupil glint
    sh.fillStyle=`rgba(255,200,160,${0.5+Math.sin(t*0.002+e)*0.2})`
    sh.beginPath()
    sh.ellipse(ex-2,ey-2,1,0.7,0,0,Math.PI*2)
    sh.fill()
    // Blood vessels in sclera
    sh.strokeStyle=`rgba(180,60,40,${0.1+Math.sin(t*0.002+e*1.1)*0.05})`
    sh.lineWidth=0.4
    for(let v=0;v<3;v++){
      sh.beginPath()
      sh.moveTo(ex+Math.sin(v*2.1)*5,ey+Math.cos(v*1.7)*4)
      sh.lineTo(ex+Math.sin(v*2.1+t*0.001)*7,ey+Math.cos(v*1.7+t*0.001)*5)
      sh.stroke()
    }
  }

  // ─── EARS — tattered, torn ───
  // Left ear — ripped
  sh.fillStyle=`rgba(38,20,10,${ba})`
  sh.beginPath()
  sh.moveTo(215,118);sh.lineTo(182,78);sh.lineTo(196,62)
  sh.lineTo(210,72);sh.lineTo(206,56);sh.lineTo(228,82)
  sh.lineTo(240,105);sh.closePath()
  sh.fill()
  sh.strokeStyle=`rgba(70,42,18,${ba*0.6})`
  sh.lineWidth=1.2
  sh.stroke()
  // Tear wounds in ear
  wln(200,90,210,85,`rgba(25,12,6,0.4)`,0.8,t,0.3)
  wln(215,80,220,72,`rgba(25,12,6,0.4)`,0.8,t,0.3)

  // Right ear — folded, wrong angle
  sh.fillStyle=`rgba(42,24,12,${ba})`
  sh.beginPath()
  sh.moveTo(258,115);sh.lineTo(290,80);sh.lineTo(302,90)
  sh.lineTo(288,108);sh.lineTo(296,118);sh.lineTo(278,124);sh.closePath()
  sh.fill()
  sh.strokeStyle=`rgba(70,42,18,${ba*0.5})`
  sh.lineWidth=1;sh.stroke()

  // ─── MOUTH — gaping, unhinged (OFFERING SLOT: boca) ───
  const mouthOffered=so.mouth
  // Jaw shadow — too wide
  sh.fillStyle=`rgba(6,3,1,${ba})`
  sh.beginPath()
  sh.moveTo(165,165)
  sh.quadraticCurveTo(160,185,175,195)
  sh.quadraticCurveTo(195,202,215,198)
  sh.quadraticCurveTo(230,192,225,178)
  sh.quadraticCurveTo(210,175,195,178)
  sh.quadraticCurveTo(178,178,165,165)
  sh.fill()

  // Upper jaw teeth — jagged, uneven, multiple rows
  const upperTeeth=[[164,164],[172,161],[180,159],[188,158],[196,157],[204,158],[212,160],[220,163]]
  for(let i=0;i<upperTeeth.length;i++){
    const [tx,ty]=upperTeeth[i]
    const ts=3+Math.sin(i*1.3)*2+Math.sin(t*0.002+i)*1.5
    const tw=2+Math.sin(i*2.1)*1.5
    sh.fillStyle=`rgba(190,170,140,${0.5+Math.sin(t*0.002+i)*0.2})`
    sh.beginPath()
    sh.moveTo(tx-tw,ty);sh.lineTo(tx+tw,ty);sh.lineTo(tx+Math.sin(i*0.7)*1.5,ty-ts);sh.closePath()
    sh.fill()
    // Tooth outline
    sh.strokeStyle=`rgba(140,120,100,0.2)`
    sh.lineWidth=0.3
    sh.stroke()
  }
  // Bottom teeth — coming up from below
  const lowerTeeth=[[172,196],[180,198],[188,199],[196,200],[204,199],[212,197],[220,194]]
  for(let i=0;i<lowerTeeth.length;i++){
    const [tx,ty]=lowerTeeth[i]
    const ts=2+Math.sin(i*1.7)*1.5+Math.sin(t*0.002+i+1)*1
    sh.fillStyle=`rgba(190,170,140,${0.35+Math.sin(t*0.002+i+2)*0.15})`
    sh.beginPath()
    sh.moveTo(tx-1.5,ty);sh.lineTo(tx+1.5,ty);sh.lineTo(tx,ty+ts);sh.closePath()
    sh.fill()
  }

  // Inner mouth darkness — deeper, with throat
  sh.fillStyle=PAL.dark
  sh.beginPath()
  sh.ellipse(195,184,12,8,0,0,Math.PI*2)
  sh.fill()

  // Drool — viscous strands
  sh.strokeStyle=`rgba(150,130,110,${0.12+Math.sin(t*0.0025)*0.06})`
  sh.lineWidth=0.6
  for(let i=0;i<4;i++){
    const dx=178+i*10, dy=195+Math.sin(t*0.0015+i*2)*1.5
    sh.beginPath()
    sh.moveTo(dx,dy)
    sh.quadraticCurveTo(dx+Math.sin(t*0.001+i)*2,dy+10,dx-1+Math.sin(t*0.001+i+1)*2,dy+22+Math.sin(t*0.0015+i)*3)
    sh.stroke()
  }

  // Tongue — dark, thick
  sh.fillStyle=`rgba(70,20,12,${0.45+Math.sin(t*0.0015)*0.12})`
  sh.beginPath()
  sh.ellipse(195,188,8,5,0,0,Math.PI*2)
  sh.fill()
  sh.strokeStyle=`rgba(50,14,8,0.15)`
  sh.lineWidth=0.5
  sh.beginPath()
  sh.ellipse(195,188,8,5,0,0,Math.PI*2)
  sh.stroke()

  // ─── FORELEGS — wrong anatomy, extra joints ───
  // Front leg 1 (left) — bent backward at elbow
  const l1x=285, l1y=165
  sh.strokeStyle=`rgba(60,35,18,${ba*0.7})`
  sh.lineWidth=8
  sh.beginPath()
  sh.moveTo(l1x,l1y)
  sh.quadraticCurveTo(l1x-5,l1y+20,l1x+2,l1y+40)
  sh.stroke()
  sh.lineWidth=5
  sh.beginPath()
  sh.moveTo(l1x+2,l1y+40)
  sh.quadraticCurveTo(l1x-8,l1y+55,l1x-3,l1y+70)
  sh.stroke()
  // "Elbow" knob
  sh.fillStyle=`rgba(50,30,15,${ba*0.6})`
  sh.beginPath()
  sh.ellipse(l1x,l1y+38,5,4,0,0,Math.PI*2)
  sh.fill()

  // Front leg 2 (right) — too long, wrong angle (PAW OFFERING ZONE)
  const l2x=310, l2y=170
  sh.strokeStyle=`rgba(60,35,18,${ba*0.7})`
  sh.lineWidth=8
  sh.beginPath()
  sh.moveTo(l2x,l2y)
  sh.quadraticCurveTo(l2x+10,l2y+25,l2x+2,l2y+50)
  sh.stroke()
  sh.lineWidth=6
  sh.beginPath()
  sh.moveTo(l2x+2,l2y+50)
  sh.quadraticCurveTo(l2x-5,l2y+65,l2x,248)
  sh.stroke()
  // Elbow knob
  sh.fillStyle=`rgba(50,30,15,${ba*0.6})`
  sh.beginPath()
  sh.ellipse(l2x+2,l2y+48,5,4,0.2,0,Math.PI*2)
  sh.fill()

  // PAW — the massive paw at the offering spot
  {
    const px=300, py=238
    sh.fillStyle=`rgba(48,28,14,${ba})`
    sh.beginPath()
    sh.ellipse(px,py+6,22,14,0.15,0,Math.PI*2)
    sh.fill()
    sh.strokeStyle=`rgba(70,42,18,${ba*0.5})`
    sh.lineWidth=1
    sh.stroke()
    // Claws — hooked
    for(let c=0;c<5;c++){
      const cx=px-14+c*7, cy=py+15+Math.sin(c*1.1)*2
      sh.fillStyle=`rgba(50,30,14,${ba*0.9})`
      sh.beginPath()
      sh.moveTo(cx-1.5,cy);sh.lineTo(cx+1.5,cy);sh.lineTo(cx+Math.sin(t*0.002+c)*2,cy+9+Math.sin(t*0.001+c)*1.5);sh.closePath()
      sh.fill()
    }
  }

  // ─── HIND LEG region — suggestion of more limbs fading to dark ───
  for(let l=0;l<2;l++){
    const lx=480+l*90, ly=145+Math.sin(t*0.001+l)*5
    sh.fillStyle=`rgba(35,20,10,${ba*0.5})`
    sh.beginPath()
    sh.ellipse(lx,ly,20,28+Math.sin(t*0.001+l)*3,0.15+l*0.2,0,Math.PI*2)
    sh.fill()
    // Claw tips barely visible
    for(let c=0;c<3;c++){
      const cx=lx-8+c*7, cy=ly+24
      sh.fillStyle=`rgba(45,26,12,${ba*0.4})`
      sh.beginPath()
      sh.moveTo(cx-1,cy);sh.lineTo(cx+1,cy);sh.lineTo(cx,cy+5);sh.closePath()
      sh.fill()
    }
  }

  // ─── TAIL — serpentine, merging with shadow ───
  sh.strokeStyle=`rgba(60,36,18,${ba*0.5})`
  sh.lineWidth=8
  sh.beginPath()
  sh.moveTo(620,140)
  sh.quadraticCurveTo(690,145,730,95+Math.sin(t*0.0015)*12)
  sh.stroke()
  // Split tip
  sh.strokeStyle=`rgba(80,48,22,${ba*0.3})`
  sh.lineWidth=2
  sh.beginPath()
  sh.moveTo(720,102+Math.sin(t*0.0015)*12)
  sh.lineTo(735,92+Math.sin(t*0.0015+0.5)*12)
  sh.stroke()
  sh.beginPath()
  sh.moveTo(725,105+Math.sin(t*0.0015)*12)
  sh.lineTo(738,98+Math.sin(t*0.0015+1)*12)
  sh.stroke()

  sh.restore()

  // ─── CHAIN — wrapping, crushing ───
  for(let i=0;i<10;i++){
    const cy=30+i*18, cw=7+Math.sin(i*0.7)*2
    wln(400-cw,cy,400+cw,cy+6,PAL.rust,1.2,t)
    wln(400+cw,cy+6,400-cw,cy+12,PAL.rust,1.2,t)
    circle(400,cy+3,2.5,PAL.rust_l)
  }
  wln(400,30,400,200,PAL.rust,1.5,t)
  // Wraps around body
  wln(400,195,355,205,PAL.rust,2,t)
  wln(355,205,370,215,PAL.rust,2,t)
  wln(370,215,345,228,PAL.rust,2,t)

  // ─── HATCH ───
  ln(300,300,500,300,PAL.shadow_m,1.5)
  ln(300,300,300,380,PAL.shadow_m,1.5)
  ln(300,380,500,380,PAL.shadow_m,1.5)
  ln(500,300,500,380,PAL.shadow_m,1.5)
  rect(390,320,20,40,PAL.rust)
  circle(400,340,3,PAL.rust_l)

  // ─── OFFERING SPOTS — wounds of light ──
  // SPOT 1: CENTER EYE — caco_vidro
  const eyeOffered=so.eye
  if(!eyeOffered){
    const sa=0.35+Math.sin(t*0.003)*0.2
    // Fissure glow around the eye
    sh.fillStyle=`rgba(200,160,80,${sa*0.2})`
    sh.beginPath()
    sh.ellipse(227,147,22,16,0,0,Math.PI*2)
    sh.fill()
    // Cracked light lines radiating from eye
    sh.strokeStyle=`rgba(200,160,80,${sa*0.3})`
    sh.lineWidth=0.5
    for(let i=0;i<5;i++){
      const ang=i*1.3+t*0.0005
      sh.beginPath()
      sh.moveTo(227,147)
      sh.lineTo(227+Math.cos(ang)*24,147+Math.sin(ang)*18)
      sh.stroke()
    }
    // Small spark at center
    circle(227,147,2.5,`rgba(220,180,100,${sa*0.8})`)
    // Faint particle drift
    for(let i=0;i<3;i++){
      const ang=t*0.0015+i*2.1
      const px=227+Math.cos(ang)*24, py=147+Math.sin(ang)*16
      circle(px,py,1,`rgba(200,160,80,${0.2+Math.sin(t*0.002+i)*0.1})`)
    }
  }else{
    // Glass shard embedded in eye socket — cold glitter
    sh.fillStyle='rgba(140,120,180,0.35)'
    pl([[214,140],[236,146],[228,158],[211,152]],`rgba(140,120,180,0.35)`)
    sh.strokeStyle='rgba(180,160,220,0.3)'
    sh.lineWidth=0.6
    sh.beginPath()
    sh.moveTo(214,140);sh.lineTo(236,146);sh.lineTo(228,158);sh.lineTo(211,152);sh.closePath()
    sh.stroke()
    circle(225,148,1.5,'rgba(200,180,240,0.4)')
  }

  // SPOT 2: MOUTH — bola
  if(!mouthOffered){
    const sa=0.35+Math.sin(t*0.003+1)*0.2
    // Glow deep in throat
    sh.fillStyle=`rgba(200,160,80,${sa*0.15})`
    sh.beginPath()
    sh.ellipse(195,182,18,14,0,0,Math.PI*2)
    sh.fill()
    // Warm ember
    circle(195,182,3,`rgba(220,180,100,${sa*0.7})`)
    for(let i=0;i<3;i++){
      const ang=t*0.0015+i*2.1+1
      const px=195+Math.cos(ang)*22, py=182+Math.sin(ang)*16
      circle(px,py,1,`rgba(200,160,80,${0.2+Math.sin(t*0.002+i+1)*0.1})`)
    }
  }else{
    // Ball lodged in throat
    circle(195,182,7,`rgba(140,110,80,0.6)`)
    sh.strokeStyle='rgba(60,40,28,0.4)'
    sh.lineWidth=1
    sh.beginPath()
    sh.ellipse(195,182,7,7,0,0,Math.PI*2)
    sh.stroke()
  }

  // SPOT 3: PAW — osso
  const pawOffered=so.paw
  if(!pawOffered){
    const sa=0.35+Math.sin(t*0.003+2)*0.2
    // Fissure glow in the paw
    sh.fillStyle=`rgba(200,160,80,${sa*0.15})`
    sh.beginPath()
    sh.ellipse(300,245,22,16,0.15,0,Math.PI*2)
    sh.fill()
    // Crack lines
    sh.strokeStyle=`rgba(200,160,80,${sa*0.25})`
    sh.lineWidth=0.5
    for(let i=0;i<4;i++){
      const ang=i*1.6+t*0.0005+0.5
      sh.beginPath()
      sh.moveTo(300,245)
      sh.lineTo(300+Math.cos(ang)*24,245+Math.sin(ang)*18)
      sh.stroke()
    }
    circle(300,245,2.5,`rgba(220,180,100,${sa*0.7})`)
    for(let i=0;i<3;i++){
      const ang=t*0.0015+i*2.1+2
      const px=300+Math.cos(ang)*22, py=245+Math.sin(ang)*18
      circle(px,py,1,`rgba(200,160,80,${0.2+Math.sin(t*0.002+i+2)*0.1})`)
    }
  }else{
    // Bone laid on the paw
    sh.fillStyle=`rgba(160,130,100,0.4)`
    sh.fillRect(292,238,18,4)
    sh.fillRect(295,233,4,14)
    circle(293,233,3,`rgba(160,130,100,0.4)`)
    circle(307,233,3,`rgba(160,130,100,0.4)`)
    sh.strokeStyle='rgba(50,35,20,0.2)'
    sh.lineWidth=0.5
    sh.strokeRect(292,238,18,4)
  }

  // ─── AMBIENT EFFECTS ───

  // Candle glow from below — warm, trembling
  const flicker=0.1+Math.sin(t*0.005)*0.05
  const warmG=rgrad(400,520,500,`rgba(255,160,60,${flicker*0.25})`,'rgba(255,160,60,0)')
  sh.fillStyle=warmG
  sh.fillRect(0,0,800,600)

  // Faint blood-tinged aura from Shiva
  const rg=0.05+Math.sin(t*0.0012)*0.03
  sh.fillStyle=`rgba(150,40,20,${rg})`
  sh.beginPath()
  sh.ellipse(400,150,380,140,0,0,Math.PI*2)
  sh.fill()

  // Deep shadow edges
  rect(0,0,70,600,grad(0,0,70,0,'rgba(0,0,0,0.75)','rgba(0,0,0,0)'))
  rect(730,0,70,600,grad(730,0,800,0,'rgba(0,0,0,0.75)','rgba(0,0,0,0)'))
  rect(0,460,800,140,grad(0,460,0,600,'rgba(0,0,0,0)','rgba(0,0,0,0.85)'))

  paperGrain(6)
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
