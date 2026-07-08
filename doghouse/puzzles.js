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
    id:'drawer',solved:false,pins:[0,0,0],target:[1,2,3],err:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(10,8,6,0.92)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d
      ctx.fillRect(200,150,400,300)
      ctx.fillStyle=PAL.ink_m
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('GAVETA TRANCADA',400,185)

      for(let i=0;i<3;i++){
        const bx=240+i*130,by=220
        ctx.fillStyle=PAL.ink_l
        ctx.fillRect(bx,by,80,100)
        ctx.fillStyle=PAL.dark
        ctx.fillRect(bx+5,by+5,70,90)

        const syms=['⚬','⚫','○']
        ctx.fillStyle=this.pins[i]===0?PAL.sepia_d:this.pins[i]===1?PAL.rust_l:PAL.sepia_l
        ctx.font='28px Georgia'
        ctx.fillText(syms[this.pins[i]],bx+40,by+60)

        ctx.fillStyle=PAL.ink_l
        ctx.font='10px Georgia'
        ctx.fillText('▲',bx+40,by-5)
        ctx.fillText(this.err?'✗':'▼',bx+40,by+115)
      }

      if(this.solved){
        ctx.fillStyle=PAL.sepia_l
        ctx.font='18px Georgia'
        ctx.fillText('A gaveta range. Algo dentro.',400,380)
      }
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const bx=240+i*130,by=220
        if(x>=bx&&x<=bx+80&&y>=by&&y<=by+100){
          if(y<by+35)this.pins[i]=(this.pins[i]+1)%3
          else if(y>by+65)this.pins[i]=(this.pins[i]+2)%3
          else return

          if(this.pins[0]===this.target[0]&&
             this.pins[1]===this.target[1]&&
             this.pins[2]===this.target[2]){
            this.solved=true
            g.a.unlock()
            g.addItem('fosforo',true)
            g.engine.tooltip('Fósforo! Dentro da gaveta.',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }else{
            this.err=true
            g.a.wrong()
            g.engine.tooltip('Clique no topo para subir, base para descer.')
            setTimeout(()=>this.err=false,500)
          }
          return
        }
      }
    }
  }
}
