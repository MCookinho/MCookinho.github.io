const PUZZLES = {
  gate: {
    id: 'gate', title: 'PORTÃO',
    init: function(){this.slots=[false,false,false];this.solved=false},
    render: function(ctx, time, g) {
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.m
      ctx.fillRect(250,120,300,360)
      ctx.fillStyle=PAL.d
      ctx.fillRect(260,130,280,340)
      ctx.fillStyle=PAL.bm
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('TRÊS FECHADURAS',400,170)
      for(let i=0;i<3;i++){
        const fx=310+i*80,fy=220
        ctx.fillStyle=PAL.m
        ctx.fillRect(fx,fy,40,80)
        ctx.fillStyle=this.slots[i]?PAL.y:PAL.bg
        ctx.fillRect(fx+5,fy+5,30,30)
        ctx.fillStyle=this.slots[i]?PAL.y:PAL.r
        ctx.font='18px Georgia'
        ctx.fillText(this.slots[i]?'●':'○',fx+20,fy+30)
        ctx.fillStyle=PAL.bm
        ctx.font='10px Georgia'
        ctx.fillText(i===0?'CELA 1':i===1?'CELA 2':'CELA 3',fx+20,fy+100)
      }
      ctx.fillStyle=PAL.r
      ctx.font='11px Georgia'
      ctx.fillText('SELECIONE UMA CHAVE E CLIQUE NA FECHADURA',400,400)
      if(this.solved){
        ctx.fillStyle=PAL.y
        ctx.font='18px Georgia'
        ctx.fillText('O PORTÃO SE ABRE',400,450)
      }
    },
    click: function(x,y,g){
      for(let i=0;i<3;i++){
        const fx=310+i*80,fy=220
        if(x>=fx&&x<=fx+40&&y>=fy&&y<=fy+80&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if((i===0&&item==='cellar_key')||(i===1&&item==='kitchen_key')||(i===2&&item==='church_key')){
              this.slots[i]=true
              g.removeItem(g.selectedItem)
              g.selectedItem=null
              g.engine.tooltip('Chave encaixada.')
              g.a.key()
              if(this.slots.every(Boolean)){
                this.solved=true
                g.a.unlock()
                g.engine.tooltip('Todas as fechaduras abertas!',3000)
                setTimeout(()=>{
                  g.engine.closePuzzle()
                  g.engine.tooltip('O portão range. Você pode passar.',3000)
                },1500)
              }
              return
            }
          }
          g.engine.tooltip('Chave errada.')
          g.a.wrong()
          return
        }
      }
    }
  },
  cellar_well: {
    id: 'cellar_well', solved: false,
    click: function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=300&&x<=500&&y>=300&&y<=500){
        this.solved=true
        g.a.water()
        g.obtained('cellar_key')
        g.addItem('cellar_key',true)
        g.engine.tooltip('Uma chave enferrujada emerge da água.',3000)
      }
    }
  },
  cellar_vent: {
    id: 'cellar_vent', solved: false,
    click: function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=600&&x<=660&&y>=200&&y<=260&&g.selectedItem!==null){
        const item=g.inventory[g.selectedItem]
        if(item==='wax'){
          this.solved=true
          g.removeItem(g.selectedItem)
          g.selectedItem=null
          g.a.unlock()
          g.engine.tooltip('A cera amolece as barras. Uma nota cai.',2000)
          setTimeout(()=>g.addNote('cellar'),500)
        }
      }
    }
  },
  kitchen_stove: {
    id: 'kitchen_stove', solved: false,
    click: function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=60&&x<=240&&y>=200&&y<=400){
        this.solved=true
        g.a.wind()
        g.obtained('kitchen_key')
        g.addItem('kitchen_key',true)
        g.engine.tooltip('As cinzas se dissipam. Uma chave brilha.',2000)
      }
    }
  },
  kitchen_radio: {
    id: 'kitchen_radio', solved: false, freq: 60, dragging: false, msg: '',
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      const rx=300,ry=200
      ctx.fillStyle=PAL.bm
      ctx.fillRect(rx,ry,200,180)
      ctx.fillStyle=PAL.d
      ctx.fillRect(rx+10,ry+10,180,160)
      ctx.fillStyle=PAL.bg
      ctx.fillRect(rx+30,ry+30,140,50)
      ctx.fillStyle=PAL.y
      ctx.font='24px Georgia'
      ctx.textAlign='center'
      ctx.fillText('MHz',rx+100,ry+25)
      ctx.fillStyle=PAL.s
      ctx.font='14px Georgia'
      ctx.fillText(this.freq.toFixed(1),rx+100,ry+60)
      ctx.fillStyle=PAL.bl
      ctx.fillRect(rx+30,ry+100,140,8)
      ctx.fillStyle=PAL.o
      const pos=(this.freq-60)/60*130
      ctx.fillRect(rx+30+pos,ry+96,4,16)
      ctx.fillStyle=PAL.g
      ctx.font='9px Georgia'
      ctx.fillText('60',rx+30,ry+130)
      ctx.fillText('120',rx+150,ry+130)
      if(this.msg){
        ctx.fillStyle=PAL.r
        ctx.font='11px Georgia'
        ctx.fillText(this.msg,rx+100,ry+165)
      }
    },
    click: function(x,y,g){
      const rx=300,ry=200
      if(x>=rx&&x<=rx+200&&y>=ry&&y<=ry+180){
        this.freq=60+((x-rx-30)/140)*60
        this.freq=Math.max(60,Math.min(120,this.freq))
        if(Math.abs(this.freq-88.5)<0.5&&!this.solved){
          this.solved=true
          g.a.radio(880)
          this.msg='...Shiva... três cabeças...'
          g.obtained('medallion')
          g.addItem('medallion',true)
          g.engine.tooltip('Um medalhão cai do rádio.',3000)
          setTimeout(()=>{g.engine.closePuzzle();this.msg=''},2000)
        }
      }
    }
  },
  kitchen_sink: {
    id: 'kitchen_sink', solved: false, seq: [3,5,2,4,1], pos: 0, err: false, ok: false,
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.bm
      ctx.fillRect(220,380,360,120)
      ctx.fillStyle=PAL.d
      ctx.fillRect(230,390,340,100)
      ctx.fillStyle=PAL.y
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('RITMO DA ÁGUA',400,420)
      const btns=[{x:270,y:430,w:60,h:30,l:'1'},{x:340,y:430,w:60,h:30,l:'2'},{x:410,y:430,w:60,h:30,l:'3'},{x:480,y:430,w:60,h:30,l:'4'},{x:550,y:430,w:60,h:30,l:'5'}]
      for(let i=0;i<5;i++){
        const b=btns[i]
        ctx.fillStyle=this.err?PAL.r:this.pos>i?PAL.o:PAL.g
        ctx.fillRect(b.x,b.y,b.w,b.h)
        ctx.fillStyle=PAL.s
        ctx.font='16px Georgia'
        ctx.fillText(b.l,b.x+30,b.y+22)
      }
    },
    click: function(x,y,g){
      if(this.solved||this.ok){g.engine.tooltip('Já fez isso.');return}
      const btn={
        '1':{x:270,y:430,w:60,h:30},'2':{x:340,y:430,w:60,h:30},
        '3':{x:410,y:430,w:60,h:30},'4':{x:480,y:430,w:60,h:30},
        '5':{x:550,y:430,w:60,h:30}
      }
      for(let k in btn){
        const b=btn[k]
        if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){
          const v=parseInt(k)
          if(v===this.seq[this.pos]){
            this.pos++
            g.a.water()
            if(this.pos>=this.seq.length){
              this.solved=true
              g.obtained('church_key')
              g.addItem('church_key',true)
              g.engine.tooltip('O ritmo está correto! Uma chave cai.',3000)
            }
          }else{
            this.pos=0
            this.err=true
            g.a.wrong()
            g.engine.tooltip('Ritmo errado. Recomece.')
            setTimeout(()=>this.err=false,500)
          }
          return
        }
      }
    }
  },
  church_altar: {
    id: 'church_altar', solved: false, slots: [null,null,null],
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.pd
      ctx.fillRect(250,180,300,240)
      ctx.fillStyle=PAL.pm
      ctx.fillRect(260,190,280,220)
      ctx.fillStyle=PAL.y
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('OFERENDAS',400,220)
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=250
        ctx.fillStyle=PAL.m
        ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle=PAL.d
        ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){
          ctx.fillStyle=PAL.y
          ctx.font='20px Georgia'
          ctx.fillText(this.slots[i]==='medallion'?'📿':this.slots[i]==='bell'?'🔔':'🪶',ox+30,oy+35)
        }else{
          ctx.fillStyle=PAL.bl
          ctx.font='24px Georgia'
          ctx.fillText('○',ox+30,oy+35)
        }
      }
      if(this.solved){
        ctx.fillStyle=PAL.y
        ctx.font='18px Georgia'
        ctx.fillText('✧ O ALTAR SE ABRE ✧',400,370)
      }else{
        ctx.fillStyle=PAL.g
        ctx.font='10px Georgia'
        ctx.fillText('Clique em um slot para colocar uma oferenda',400,410)
      }
    },
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=250
        if(x>=ox&&x<=ox+60&&y>=oy&&y<=oy+60&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if(['medallion','bell','feather'].includes(item)){
              this.slots[i]=item
              g.removeItem(g.selectedItem)
              g.selectedItem=null
              g.a.chime()
              if(this.slots.every(Boolean)){
                this.solved=true
                g.engine.tooltip('As oferendas se encaixam. O altar treme.',3000)
                g.flags.church_altar_done=true
                setTimeout(()=>g.engine.closePuzzle(),1500)
              }
              return
            }
          }
          g.engine.tooltip('Isso não serve como oferenda.')
        }
      }
    }
  },
  graveyard_tomb: {
    id: 'graveyard_tomb', solved: false, active: -1,
    graves: [
      {id:0,name:'MEMÓRIA',item:'graveyard_key',done:false},
      {id:1,name:'TEMPO',item:'photo',done:false},
      {id:2,name:'NOME',item:'ribbon',type:'text',done:false},
      {id:3,name:'MEDO',item:'mansion_key',done:false},
      {id:4,name:'DESEJO',item:'flower',done:false},
      {id:5,name:'???',item:null,note:true,done:false}
    ],
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<6;i++){
        const gx=60+i*115,gy=320
        if(x>=gx&&x<=gx+100&&y>=gy&&y<=gy+65&&!this.graves[i].done){
          const gr=this.graves[i]
          if(gr.type==='text'){
            const name=prompt('Qual o nome?')
            if(name&&name.toUpperCase()==='SHIVA'){
              gr.done=true;g.a.grave()
              g.obtained(gr.item);g.addItem(gr.item,true)
              g.engine.tooltip('A terra se move. Uma fita emerge.',2000)
              if(this.graves.filter(g=>g.done).length>=6){
                this.solved=true;g.engine.tooltip('Todos os túmulos abertos.',3000)
              }
            }else{g.a.wrong();g.engine.tooltip('Nome errado.')}
          }else if(gr.note){
            gr.done=true;g.addNote('graveyard')
            g.engine.tooltip('Uma nota revela seu símbolo.',2000)
          }else{
            gr.done=true;g.a.grave()
            g.obtained(gr.item);g.addItem(gr.item,true)
            g.engine.tooltip('Algo emerge da terra.',2000)
            if(this.graves.filter(g=>g.done).length>=6){
              this.solved=true;g.engine.tooltip('Todos os túmulos abertos.',3000)
            }
          }
        }
      }
    }
  },
  mansion_mirror: {
    id: 'mansion_mirror', solved: false, watching: false, targetTime: 0,
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.g
      ctx.fillRect(200,100,400,350)
      ctx.fillStyle=PAL.bd
      ctx.fillRect(210,110,380,330)
      const delay=Math.sin(time*0.002)*10
      ctx.fillStyle=PAL.d
      ctx.beginPath()
      ctx.arc(400+delay,270,35,0,Math.PI*2)
      ctx.fill()
      ctx.fillStyle=PAL.m
      ctx.beginPath()
      ctx.arc(400,270,35,0,Math.PI*2)
      ctx.fill()
      ctx.fillStyle=PAL.r
      ctx.font='12px Georgia'
      ctx.textAlign='center'
      ctx.fillText('CLIQUE QUANDO O REFLEXO SE DISTANCIAR',400,500)
      if(this.watching){
        ctx.fillStyle=PAL.y
        ctx.font='16px Georgia'
        ctx.fillText('AGORA!',400,530)
      }
    },
    click: function(x,y,g){
      if(this.solved)return
      const now=performance.now()
      const eTime=now-g.engine.puzzleStartTime
      if(x>=200&&x<=600&&y>=100&&y<=450){
        if(eTime>this.targetTime+100&&eTime<this.targetTime+500){
          this.solved=true
          g.a.chime()
          g.obtained('tower_key')
          g.addItem('tower_key',true)
          g.engine.tooltip('O vidro se distorce. Uma chave cai.',3000)
          setTimeout(()=>g.engine.closePuzzle(),1500)
        }else{
          g.a.wrong()
          g.engine.tooltip('Muito cedo...')
        }
      }
    },
    onOpen: function(e,g){
      this.watching=false
      this.targetTime=delayCalc()
      e.puzzleStartTime=performance.now()
      setTimeout(()=>this.watching=true,this.targetTime+100)
    }
  },
  mansion_cabinet: {
    id: 'mansion_cabinet', solved: false, digits:[0,0,0],
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.bm
      ctx.fillRect(250,200,300,200)
      ctx.fillStyle=PAL.d
      ctx.fillRect(260,210,280,180)
      ctx.fillStyle=PAL.y
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('COMBINAÇÃO',400,245)
      for(let i=0;i<3;i++){
        ctx.fillStyle=PAL.bg
        ctx.fillRect(280+i*90,270,60,60)
        ctx.fillStyle=PAL.s
        ctx.font='28px Georgia'
        ctx.fillText(this.digits[i],310+i*90,310)
        ctx.fillStyle=PAL.bl
        ctx.font='11px Georgia'
        ctx.fillText('▲',310+i*90,270)
        ctx.fillText('▼',310+i*90,340)
      }
      ctx.fillStyle=PAL.g
      ctx.font='10px Georgia'
      ctx.fillText('6 celas · 6 chaves · 6 símbolos',400,410)
    },
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        if(x>=280+i*90&&x<=340+i*90&&y>=270&&y<=330){
          if(y>=270&&y<=290)this.digits[i]=(this.digits[i]+1)%10
          else if(y>=310&&y<=330)this.digits[i]=(this.digits[i]+9)%10
          if(this.digits.every(d=>d===6)){
            this.solved=true
            g.a.unlock()
            g.obtained('collar');g.obtained('ring')
            g.addItem('collar',true);g.addItem('ring',true)
            g.engine.tooltip('As gavetas se abrem!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },
  mansion_clock: {
    id: 'mansion_clock', solved: false,
    click: function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=560&&x<=640&&y>=100&&y<=200&&g.selectedItem!==null){
        if(g.inventory[g.selectedItem]==='ribbon'){
          this.solved=true
          g.removeItem(g.selectedItem)
          g.selectedItem=null
          g.a.clock()
          g.addNote('mansion')
          g.engine.tooltip('O pêndulo balança. Uma nota cai.',3000)
        }
      }
    }
  },
  library_shelf: {
    id: 'library_shelf', solved: false, order:[], target:[0,1,2,3,4],
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.bm
      ctx.fillRect(100,100,600,320)
      ctx.fillStyle=PAL.d
      ctx.fillRect(110,110,580,300)
      const labels=['V','A','R','D','P']
      const colors=[PAL.r,PAL.bd,PAL.pm,PAL.y,PAL.bg]
      for(let i=0;i<5;i++){
        const bx=150+i*110,by=140
        ctx.fillStyle=colors[i]
        ctx.fillRect(bx,by,80,150)
        ctx.fillStyle=PAL.s
        ctx.font='24px Georgia'
        ctx.textAlign='center'
        ctx.fillText(labels[i],bx+40,by+90)
        if(this.order.includes(i)){
          ctx.fillStyle=PAL.y
          ctx.font='14px Georgia'
          ctx.fillText('✓',bx+40,by+40)
        }
      }
      const seq=this.target.map(i=>labels[i]).join(' → ')
      ctx.fillStyle=PAL.g
      ctx.font='10px Georgia'
      ctx.fillText('Vermelho → Azul → Roxo → Dourado → Preto',400,500)
      ctx.fillStyle=PAL.g
      ctx.font='9px Georgia'
      ctx.fillText('Clique nos livros na ordem correta',400,520)
    },
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<5;i++){
        const bx=150+i*110
        if(x>=bx&&x<=bx+80&&y>=140&&y<=290&&!this.order.includes(i)){
          this.order.push(i)
          g.a.click()
          const idx=this.order.length-1
          if(this.order[idx]!==this.target[idx]){
            this.order=[]
            g.a.wrong()
            g.engine.tooltip('Ordem errada. Recomece.')
          }else if(this.order.length>=5){
            this.solved=true
            g.a.bell()
            g.obtained('feather');g.obtained('tower_key')
            g.addItem('feather',true);g.addItem('tower_key',true)
            g.engine.tooltip('A estante range. Um compartimento secreto!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },
  tower_shrine: {
    id: 'tower_shrine', solved: false, current:0, order:[0,1,2,3,4,5],
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.pd
      ctx.fillRect(150,100,500,350)
      const labels=['PORÃO','COZINHA','CAPELA','CEMITÉRIO','SALÃO','TORRE']
      const litStates=[]
      for(let i=0;i<6;i++)litStates.push(i<this.current)
      for(let i=0;i<6;i++){
        const cx=180+i*80,cy=200
        ctx.fillStyle=PAL.m
        ctx.fillRect(cx,cy,50,120)
        ctx.fillStyle=litStates[i]?PAL.o:PAL.bg
        ctx.beginPath()
        ctx.arc(cx+25,cy+20,12,0,Math.PI*2)
        ctx.fill()
        if(litStates[i]){
          ctx.fillStyle=PAL.o
          g2(cx+25,cy+20,25,PAL.o,0.3)
        }
        ctx.fillStyle=PAL.bl
        ctx.font='8px Georgia'
        ctx.textAlign='center'
        ctx.fillText(labels[i],cx+25,cy+115)
      }
      ctx.fillStyle=PAL.g
      ctx.font='10px Georgia'
      ctx.fillText('Subterrâneo → Fogo → Tempo → Morte → Vaidade → Altura',400,530)
    },
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<6;i++){
        const cx=180+i*80
        if(x>=cx&&x<=cx+50&&y>=200&&y<=320&&i>=this.current){
          if(i===this.order[this.current]){
            this.current++
            g.a.candle()
            if(this.current>=6){
              this.solved=true
              g.a.chime()
              g.obtained('key6')
              g.addItem('key6',true)
              g.addNote('tower')
              g.engine.tooltip('As seis velas acendem! A chave dourada...',3000)
              setTimeout(()=>g.engine.closePuzzle(),1500)
            }
          }else{
            this.current=0
            g.a.wrong()
            g.engine.tooltip('Ordem errada. Recomece.')
          }
          return
        }
      }
    }
  },
  final_altar: {
    id: 'final_altar', solved: false, slots:[null,null,null],
    render: function(ctx, time, g){
      ctx.fillStyle='rgba(5,2,2,0.85)'
      ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.bm
      ctx.fillRect(250,200,300,220)
      ctx.fillStyle=PAL.d
      ctx.fillRect(260,210,280,200)
      ctx.fillStyle=PAL.y
      ctx.font='14px Georgia'
      ctx.textAlign='center'
      ctx.fillText('ALTAR FINAL',400,240)
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=270
        ctx.fillStyle=PAL.m
        ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle=PAL.d
        ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){
          ctx.fillStyle=PAL.y
          ctx.font='20px Georgia'
          ctx.fillText(this.slots[i]==='collar'?'📿':this.slots[i]==='ring'?'💍':'🌺',ox+30,oy+35)
        }else{
          ctx.fillStyle=PAL.bl
          ctx.font='24px Georgia'
          ctx.fillText('○',ox+30,oy+35)
        }
      }
      ctx.fillStyle=PAL.g
      ctx.font='10px Georgia'
      ctx.fillText('Três oferendas para três cabeças',400,420)
    },
    click: function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=270
        if(x>=ox&&x<=ox+60&&y>=oy&&y<=oy+60&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if(['collar','ring','flower'].includes(item)){
              this.slots[i]=item
              g.removeItem(g.selectedItem)
              g.selectedItem=null
              g.a.chime()
              if(this.slots.every(Boolean)){
                this.solved=true
                setTimeout(()=>g.checkEndings(),500)
              }
              return
            }
          }
          g.engine.tooltip('Isso não serve.')
        }
      }
    }
  }
}

function delayCalc(){return 1000+Math.sin(performance.now()*0.002)*300+200}
