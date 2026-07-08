const PAL = {
  bg:'#0a0505',d:'#1a0a0a',w:'#2a1010',m:'#3a1a1a',
  bm:'#4a2a2a',bl:'#5a3a3a',g:'#6a4a4a',r:'#8a3a3a',
  o:'#a85a3a',y:'#c4a46c',s:'#e8d4a8',pd:'#2a1a3a',
  pm:'#3a2a5a',pl:'#5a4a7a',bd:'#1a2a3a',bg2:'#3a5a6a'
}

let $ctx
function C(){return 800}
function H(){return 600}
function rect(x,y,w,h,c){$ctx.fillStyle=c;$ctx.fillRect(x,y,w,h)}
function circle(x,y,r,c){$ctx.fillStyle=c;$ctx.beginPath();$ctx.arc(x,y,r,0,Math.PI*2);$ctx.fill()}
function grad(x1,y1,x2,y2,c1,c2){const g=$ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rg(x,y,r,c1,c2){const g=$ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function rr(x,y,w,h,r2,c){$ctx.fillStyle=c;$ctx.beginPath();$ctx.moveTo(x+r2,y);$ctx.lineTo(x+w-r2,y);$ctx.quadraticCurveTo(x+w,y,x+w,y+r2);$ctx.lineTo(x+w,y+h-r2);$ctx.quadraticCurveTo(x+w,y+h,x+w-r2,y+h);$ctx.lineTo(x+r2,y+h);$ctx.quadraticCurveTo(x,y+h,x,y+h-r2);$ctx.lineTo(x,y+r2);$ctx.quadraticCurveTo(x,y,x+r2,y);$ctx.fill()}
function ln(x1,y1,x2,y2,c,w){$ctx.strokeStyle=c;$ctx.lineWidth=w||1;$ctx.beginPath();$ctx.moveTo(x1,y1);$ctx.lineTo(x2,y2);$ctx.stroke()}
function pl(pts,c){$ctx.fillStyle=c;$ctx.beginPath();$ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)$ctx.lineTo(pts[i][0],pts[i][1]);$ctx.closePath();$ctx.fill()}
function g2(x,y,r,c,alpha){const g=rg(x,y,r,c,`rgba(10,5,5,0)`);$ctx.fillStyle=g;$ctx.beginPath();$ctx.arc(x,y,r,0,Math.PI*2);$ctx.fill()}

function drawCorridor1(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  const wg = grad(0,0,0,300,PAL.pd,PAL.bg)
  rect(0,0,C(),300,wg)
  rect(0,380,C(),220,PAL.d)
  pl([[280,150],[520,150],[500,480],[300,480]],PAL.m)
  pl([[290,155],[510,155],[492,476],[308,476]],PAL.d)
  const off = 30
  for (let i = 0; i < 3; i++) {
    const sy = 200 + i * 90
    rr(330 + i * 60, sy, 30, 50, 3, PAL.bm)
    circle(345 + i * 60, sy + 25, 8, PAL.d)
    circle(345 + i * 60, sy + 25, 4, PAL.r)
  }
  for (let i = 0; i < 6; i++) {
    const ly = 80 + i * 50
    g2(50, ly, 30, PAL.y, 0.08)
    circle(50, ly, 4, PAL.y)
    g2(750, ly, 30, PAL.y, 0.08)
    circle(750, ly, 4, PAL.y)
  }
  const sw = Math.sin(time * 0.002) * 2
  g2(400, 60, 50, PAL.o, 0.1)
  circle(400 + sw, 60, 5, PAL.o)
  const pts = [[350,400],[450,400],[445,420],[355,420]]
  pl(pts, PAL.m)
  rect(352,402,96,16,PAL.bg)
  ctx.fillStyle = PAL.r
  ctx.font = '9px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('†', 400, 412)
}

function drawCellar(ctx, time) {
  rect(0,0,C(),H(),'#0d0606')
  rect(0,0,C(),300,grad(0,0,0,300,PAL.bd,'#0d0606'))
  rect(0,380,C(),220,PAL.d)
  const dp = Math.sin(time * 0.003) * 3 + 4
  for (let i = 0; i < 8; i++) {
    const dx = 80 + i * 90, dy = 200 + Math.sin(time * 0.001 + i) * 4
    rect(dx, dy, 3, 8 + Math.random() * 4, PAL.bg2)
  }
  circle(400, 420, 160, rg(400, 420, 160, PAL.bd, PAL.bg))
  circle(400, 420, 145, PAL.d)
  circle(400, 420, 130, PAL.bg)
  const rx = 400 + Math.sin(time * 0.001) * 6
  const ry = 420 + Math.cos(time * 0.0008) * 4
  g2(rx, ry, 30, PAL.o, 0.2)
  circle(rx, ry, 6, PAL.o)
  const pts = [[340,250],[460,250],[450,280],[350,280]]
  pl(pts, PAL.m)
  rect(345,252,110,26,PAL.bg)
  ctx.fillStyle = PAL.bl
  ctx.font = '8px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('⦿', 400, 270)
}

function drawCorridor2(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  rect(0,0,C(),180,grad(0,0,0,180,PAL.w,PAL.bg))
  rect(0,390,C(),210,PAL.d)
  for (let i = 0; i < 6; i++) {
    const sy = 250 + i * 25
    rect(280 + Math.sin(time * 0.002 + i) * 2, sy, 240, 6, PAL.bm)
    rect(280 + Math.sin(time * 0.002 + i) * 2, sy + 1, 240, 2, PAL.m)
  }
  pl([[340,160],[460,160],[440,380],[360,380]], PAL.bm)
  pl([[345,162],[455,162],[437,378],[363,378]], PAL.d)
  rect(390,165,20,20,PAL.bg)
  ctx.fillStyle = PAL.o
  ctx.font = '10px Georgia'
  ctx.fillText('×', 400, 180)
  rect(620,100,50,60,PAL.bd)
  rect(625,105,40,50,PAL.bg)
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = PAL.r
    ctx.font = '8px Georgia'
    ctx.fillText('~', 645, 120 + i * 18)
  }
}

function drawKitchen(ctx, time) {
  rect(0,0,C(),H(),PAL.w)
  rect(0,0,C(),200,grad(0,0,0,200,PAL.m,PAL.w))
  rect(0,420,C(),180,PAL.d)
  rect(60,200,140,200,PAL.bm)
  rect(70,210,120,180,PAL.bg)
  for (let i = 0; i < 3; i++) {
    circle(100 + i * 30, 230, 14, PAL.d)
    circle(100 + i * 30, 230, 8, PAL.bg)
  }
  const rx = 550, ry = 270
  rect(rx, ry, 110, 70, PAL.bm)
  rect(rx + 8, ry + 8, 94, 54, PAL.d)
  circle(rx + 55, ry + 30, 16, PAL.bg)
  ln(rx + 55, ry + 30, rx + 55 + Math.cos(time * 0.001) * 12, ry + 30 - 6, PAL.o, 1.5)
  rect(rx + 40, ry + 52, 30, 6, PAL.m)
  rect(280, 300, 100, 100, PAL.bm)
  rect(290, 310, 80, 30, PAL.bd)
  const tp = Math.sin(time * 0.004) * 15
  g2(330, 325 + tp, 10, PAL.bg2, 0.3)
  circle(330, 325 + tp, 2, PAL.bg2)
  rect(600, 300, 30, 50, PAL.bm)
  rect(605, 305, 20, 40, PAL.bg)
  circle(615, 325, 4, PAL.r)
  rect(360, 420, 80, 60, PAL.bm)
  rect(365, 425, 70, 50, PAL.m)
}

function drawCorridor3(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  rect(0,0,C(),150,grad(0,0,0,150,PAL.pd,PAL.bg))
  rect(0,390,C(),210,PAL.d)
  pl([[300,120],[500,120],[480,400],[320,400]],PAL.pm)
  pl([[308,125],[492,125],[476,396],[324,396]],PAL.d)
  circle(400,130,12,PAL.y)
  g2(400,130,40,PAL.y,0.08)
  ctx.fillStyle = PAL.y
  ctx.font = '20px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('†', 400, 140)
  for (let i = 0; i < 5; i++) {
    g2(80 + i * 160, 170, 25, PAL.y, 0.05)
    circle(80 + i * 160, 170, 2, PAL.y)
  }
  rect(580, 350, 40, 25, PAL.bm)
  rect(585, 355, 30, 15, PAL.r)
  rect(640, 360, 30, 35, PAL.bm)
  rect(645, 365, 20, 25, PAL.r)
}

function drawChurch(ctx, time) {
  rect(0,0,C(),H(),PAL.pd)
  rect(0,0,C(),250,grad(0,0,0,250,PAL.pm,PAL.pd))
  rect(0,420,C(),180,PAL.d)
  const pts = [[340,280],[460,280],[430,350],[370,350]]
  pl(pts, PAL.bm)
  rect(350,285,100,25,PAL.bg)
  circle(400, 305, 20, PAL.d)
  circle(360, 430, 25, PAL.m)
  circle(400, 430, 25, PAL.m)
  circle(440, 430, 25, PAL.m)
  circle(360, 425, 6, PAL.r)
  circle(400, 425, 6, PAL.r)
  circle(440, 425, 6, PAL.r)
  const cx = 400 + Math.sin(time * 0.002) * 15
  const cy = 240 + Math.sin(time * 0.001) * 20
  g2(cx, cy, 40, PAL.y, 0.1)
  ctx.fillStyle = PAL.y
  ctx.font = '22px Georgia'
  ctx.fillText('✦', cx, cy)
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
}

function drawCorridor4(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  rect(0,0,C(),140,grad(0,0,0,140,PAL.bd,PAL.bg))
  rect(0,380,C(),220,PAL.d)
  pl([[320,120],[480,120],[460,390],[340,390]],PAL.bm)
  pl([[328,125],[472,125],[455,386],[345,386]],PAL.d)
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(90,74,122,${0.05 + Math.random() * 0.1})`
    ctx.beginPath()
    ctx.arc(100 + Math.random() * 600, 200 + Math.random() * 150, 2 + Math.random() * 3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = PAL.g
  ctx.font = '10px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('⟡', 600, 300)
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
}

function drawGraveyard(ctx, time) {
  rect(0,0,C(),H(),PAL.bd)
  rect(0,0,C(),180,grad(0,0,0,180,PAL.pd,PAL.bd))
  rect(0,400,C(),200,PAL.d)
  for (let i = 0; i < 6; i++) {
    const gx = 60 + i * 115, gy = 320 + Math.sin(time * 0.001 + i * 1.5) * 3
    rect(gx, gy, 100, 65, PAL.bm)
    rect(gx + 8, gy + 8, 84, 48, PAL.m)
    ctx.strokeStyle = PAL.bm
    ctx.lineWidth = 1
    ctx.strokeRect(gx + 10, gy + 10, 80, 44)
    ctx.fillStyle = PAL.bl
    ctx.font = '8px Georgia'
    ctx.textAlign = 'center'
    const lbs = ['MEMÓRIA', 'TEMPO', 'NOME', 'MEDO', 'DESEJO', '???']
    ctx.fillText(lbs[i], gx + 50, gy + 38)
  }
  rect(360, 80, 80, 60, PAL.bm)
  rect(365, 85, 70, 50, PAL.m)
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = `rgba(90,74,122,${0.05 + Math.random() * 0.1})`
    ctx.beginPath()
    ctx.arc(Math.random() * 800, Math.random() * 200, 1 + Math.random() * 2, 0, Math.PI * 2)
    ctx.fill()
  }
  rect(280, 380, 8, 60, PAL.bm)
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + Math.sin(time * 0.001 + i) * 0.2
    ln(284, 390 + i * 12, 284 + Math.cos(a) * 35, 390 + i * 12 - Math.sin(a) * 30, PAL.bm, 2)
    ctx.fillStyle = PAL.r
    ctx.font = '6px Georgia'
    ctx.fillText('~', 284 + Math.cos(a) * 35, 390 + i * 12 - Math.sin(a) * 30)
  }
}

function drawCorridor5(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  rect(0,0,C(),180,grad(0,0,0,180,PAL.bl,PAL.bg))
  rect(0,390,C(),210,PAL.d)
  pl([[310,110],[490,110],[470,400],[330,400]],PAL.bm)
  pl([[318,115],[482,115],[464,396],[336,396]],PAL.d)
  for (let i = 0; i < 6; i++) {
    g2(60, 80 + i * 50, 25, PAL.y, 0.06)
    circle(60, 80 + i * 50, 3, PAL.y)
    g2(740, 80 + i * 50, 25, PAL.y, 0.06)
    circle(740, 80 + i * 50, 3, PAL.y)
  }
  rect(200, 420, 400, 20, PAL.m)
  ctx.fillStyle = PAL.y
  ctx.font = '12px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('✧', 400, 170)
}

function drawMansion(ctx, time) {
  rect(0,0,C(),H(),PAL.m)
  rect(0,0,C(),200,grad(0,0,0,200,PAL.w,PAL.m))
  rect(0,420,C(),180,PAL.d)
  rr(270, 70, 260, 310, 4, PAL.g)
  rr(280, 80, 240, 290, 2, PAL.bd)
  const delay = Math.sin(time * 0.0008) * 12
  const rx = 390 + delay
  circle(rx, 220, 30, PAL.d)
  circle(400, 220, 30, PAL.m)
  rect(395, 250, 10, 30, PAL.d)
  rr(560, 110, 55, 75, 3, PAL.bm)
  circle(587, 148, 18, PAL.y)
  ln(587, 148, 587, 135, PAL.d, 1.5)
  ln(587, 148, 600, 148, PAL.d, 1.5)
  for (let i = 0; i < 4; i++) {
    rect(40 + i * 80, 180, 60, 75, PAL.bm)
    rect(45 + i * 80, 185, 50, 65, PAL.m)
    circle(70 + i * 80, 200, 6, PAL.r)
  }
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
}

function drawLibrary(ctx, time) {
  rect(0,0,C(),H(),PAL.w)
  rect(0,0,C(),180,grad(0,0,0,180,PAL.d,PAL.w))
  rect(0,420,C(),180,PAL.d)
  for (let i = 0; i < 4; i++) {
    const sx = 40 + i * 190
    rect(sx, 90, 170, 310, PAL.bm)
    for (let j = 0; j < 6; j++) {
      rect(sx + 8, 100 + j * 48, 154, 42, PAL.m)
      rect(sx + 12 + Math.sin(time * 0.001 + i + j) * 2, 104 + j * 48, 146, 34, PAL.w)
    }
  }
  rr(270, 250, 160, 100, 4, PAL.bm)
  rr(280, 260, 140, 80, 2, PAL.d)
  ctx.fillStyle = PAL.s
  ctx.font = '10px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('Cérbero: Guardião do Subumano', 350, 290)
  ctx.fillText('Três cabeças: ciúme, vigilância, punição', 350, 310)
  ctx.fillText('Shiva herdou o dever', 350, 330)
  rect(60, 470, 60, 60, PAL.bm)
  rect(65, 475, 50, 50, PAL.m)
}

function drawCorridor6(ctx, time) {
  rect(0,0,C(),H(),PAL.pd)
  rect(0,0,C(),150,grad(0,0,0,150,PAL.pm,PAL.pd))
  rect(0,400,C(),200,PAL.d)
  const sp = time * 0.003
  for (let i = 0; i < 30; i++) {
    const a = sp + i * 0.25, r = 80 + i * 9
    const sx = 400 + Math.cos(a) * Math.min(r, 300)
    const sy = 280 + Math.sin(a) * Math.min(r, 160)
    circle(sx, sy, 1.5, PAL.pm)
  }
  pl([[320,70],[480,70],[460,280],[340,280]],PAL.pm)
  pl([[328,75],[472,75],[454,276],[346,276]],PAL.d)
  circle(400, 280, 15, PAL.y)
  g2(400, 280, 40, PAL.y, 0.08)
  ctx.fillStyle = PAL.y
  ctx.font = '16px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('◈', 400, 290)
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
}

function drawTower(ctx, time) {
  rect(0,0,C(),H(),PAL.pd)
  rect(0,0,C(),200,grad(0,0,0,200,PAL.pm,PAL.pd))
  rect(0,420,C(),180,PAL.d)
  rr(260, 130, 280, 260, 4, PAL.m)
  rr(270, 140, 260, 240, 2, PAL.w)
  for (let i = 0; i < 6; i++) {
    const cy = 160 + i * 35
    rect(290, cy, 220, 28, PAL.pd)
    g2(400, cy + 14, 15, PAL.o, 0.15)
    circle(400, cy + 14, Math.sin(time * 0.002 + i) > 0 ? 5 : 2, PAL.o)
  }
  const ex = 400 + Math.sin(time * 0.001) * 4
  const ey = 300 + Math.sin(time * 0.0007) * 2
  circle(ex, ey, 25, PAL.bg)
  circle(ex, ey, 16, PAL.r)
  circle(ex, ey, 6, PAL.bg)
  circle(ex, ey, 3, PAL.y)
  ctx.fillStyle = PAL.y
  ctx.font = '12px Georgia'
  ctx.textAlign = 'center'
  ctx.fillText('☾', 400, 105)
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
  ctx.fillStyle = PAL.r
  ctx.font = '8px Georgia'
  ctx.fillText('◎', 400, 400)
}

function drawTunnel(ctx, time) {
  rect(0,0,C(),H(),PAL.bg)
  const p = Math.sin(time * 0.001) * 0.5 + 0.5
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(138,58,58,${0.04 + p * 0.06})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(400, 350, 150 + i * 30, 0, Math.PI * 2)
    ctx.stroke()
  }
  g2(400, 300, 120, PAL.r, 0.06 + p * 0.06)
  rr(340, 270, 120, 120, 4, PAL.m)
  rr(350, 280, 100, 100, 2, PAL.d)
  circle(400, 310, 20, PAL.bg)
  for (let i = 0; i < 3; i++) {
    circle(375 + i * 25, 305, 5, PAL.r)
  }
  const er = 18 + Math.sin(time * 0.002) * 4
  circle(400, 180, er, PAL.r)
  circle(400, 180, er * 0.6, PAL.o)
  circle(400, 180, er * 0.3, PAL.y)
  g2(400, 180, 70, PAL.r, 0.1)
  const lp = 0.3 + Math.sin(time * 0.002) * 0.15
  ctx.fillStyle = `rgba(196,164,108,${lp})`
  ctx.beginPath()
  ctx.moveTo(680, 180)
  ctx.lineTo(750, 100)
  ctx.lineTo(750, 260)
  ctx.fill()
  rect(360, 480, 80, 60, PAL.bm)
  rect(365, 485, 70, 50, PAL.m)
}

function drawScene(ctx, sceneId, time) {
  $ctx = ctx
  const fns = {
    corridor_1: drawCorridor1, cellar: drawCellar,
    corridor_2: drawCorridor2, kitchen: drawKitchen,
    corridor_3: drawCorridor3, church: drawChurch,
    corridor_4: drawCorridor4, graveyard: drawGraveyard,
    corridor_5: drawCorridor5, mansion: drawMansion,
    library: drawLibrary, corridor_6: drawCorridor6,
    tower: drawTower, tunnel: drawTunnel
  }
  if (fns[sceneId]) fns[sceneId](ctx, time)
  else { rect(0, 0, 800, 600, PAL.bg)
    ctx.fillStyle = PAL.r
    ctx.font = '30px Georgia'
    ctx.textAlign = 'center'
    ctx.fillText('◈', 400, 300) }
}
