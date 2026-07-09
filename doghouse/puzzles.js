const COMBOS = {
  'fosforo+vela':'vela_acesa',
  'corda+gancho':'corda_gancho',
  'chave_1+chave_2':'chave_12',
  'chave_12+chave_3':'chave_completa'
}

function tryCombine(a,b){
  const r=COMBOS[a+'+'+b]||COMBOS[b+'+'+a]||null
  return r
}

const PUZZLES = {
  drawer:{
    id:'drawer',solved:false,pins:[0,0,0],target:[1,2,0],
    render:function(ctx,t){
      ctx.fillStyle='rgba(10,8,6,0.95)'
      ctx.fillRect(0,0,800,600)

      ctx.fillStyle=PAL.paper_d
      ctx.fillRect(200,120,400,360)
      ctx.strokeStyle=PAL.ink_m
      ctx.lineWidth=1
      ctx.strokeRect(200,120,400,360)

      ctx.fillStyle=PAL.ink_l
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('GAVETA TRANCADA — TRÊS PINOS',400,160)

      ctx.fillStyle=PAL.sepia_d
      ctx.font='10px Georgia'
      ctx.fillText('Clique na parte de cima de cada pino para subir, na parte de baixo para descer',400,175)

      for(let i=0;i<3;i++){
        const bx=240+i*130,by=200

        ctx.fillStyle=PAL.ink_l
        ctx.fillRect(bx,by,80,120)
        ctx.fillStyle=PAL.dark
        ctx.fillRect(bx+5,by+5,70,110)

        const syms=['—','⚬','◉']
        ctx.fillStyle=this.pins[i]===0?PAL.sepia_d:this.pins[i]===1?PAL.rust_l:PAL.sepia_l
        ctx.font='36px Georgia'
        ctx.fillText(syms[this.pins[i]],bx+40,by+75)

        ctx.fillStyle=PAL.ink_l
        ctx.font='12px Georgia'
        ctx.fillText('▲',bx+40,by-8)
        ctx.fillText('▼',bx+40,by+140)

        ctx.fillStyle=PAL.sepia_d
        ctx.font='9px Georgia'
        ctx.fillText('PINO '+(i+1),bx+40,by+110)
      }
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const bx=240+i*130,by=200
        if(x>=bx&&x<=bx+80&&y>=by&&y<=by+120){
          if(y<by+40)this.pins[i]=(this.pins[i]+1)%3
          else if(y>by+80)this.pins[i]=(this.pins[i]+2)%3
          else return

          if(this.pins[0]===this.target[0]&&
             this.pins[1]===this.target[1]&&
             this.pins[2]===this.target[2]){
            this.solved=true
            g.a.unlock()
            g.addItem('fosforo',true)
            g.engine.closePuzzle()
            g.engine.tooltip('Fósforo! Dentro da gaveta.',3000)
          }
          return
        }
      }
    }
  },

}
