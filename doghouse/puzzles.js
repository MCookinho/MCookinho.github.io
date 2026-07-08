const COMBOS = {
  'wax+match':'lit_candle',
  'shovel+handle':'complete_shovel',
  'broken_key_A+broken_key_B':'complete_key',
  'shard+ribbon':'estilete',
  'oil+cloth':'oiled_cloth',
  'herb+pilao':'powder'
}

function tryCombine(a,b){return COMBOS[a+'+'+b]||COMBOS[b+'+'+a]||null}

const PUZZLES = {
  /* ─── CORREDOR: PORTÃO (armadilha) ─── */
  gate:{
    id:'gate',title:'PORTÃO',
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(250,120,300,360)
      ctx.fillStyle=PAL.paper;ctx.fillRect(260,130,280,340)
      ctx.fillStyle=PAL.ink_m;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('TRÊS FECHADURAS',400,170)
      for(let i=0;i<3;i++){
        const fx=310+i*80,fy=220
        ctx.fillStyle=PAL.ink_l;ctx.fillRect(fx,fy,40,80)
        const has=g&&g.obtainedItems&&g.obtainedItems.includes(['cellar_key','kitchen_key','church_key'][i])
        ctx.fillStyle=has?PAL.sepia_l:PAL.dark;ctx.fillRect(fx+5,fy+5,30,30)
        ctx.fillStyle=has?PAL.sepia_l:PAL.rust;ctx.font='18px Georgia'
        ctx.fillText(has?'●':'○',fx+20,fy+30)
        ctx.fillStyle=PAL.ink_l;ctx.font='9px Georgia'
        ctx.fillText(['PORÃO','COZINHA','CAPELA'][i],fx+20,fy+100)
      }
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('O portão tem três fechaduras. As chaves estão com você.',400,480)
      if(g&&g.obtainedItems&&['cellar_key','kitchen_key','church_key'].every(k=>g.obtainedItems.includes(k))){
        ctx.fillStyle=PAL.sepia_l;ctx.font='16px Georgia';ctx.fillText('✦ VOCÊ TEM TODAS AS CHAVES ✦',400,450)
      }
    },
    click:function(x,y,g){
      if(this.slots&&this.slots.every(Boolean)){g.engine.tooltip('O portão está aberto. Não há nada além.');return}
      g.engine.tooltip('O portão precisa de três chaves. Guarde-as — você vai precisar.')
      g.a.wrong()
    }
  },

  /* ─── PORÃO: BARRIS ─── */
  barrels:{
    id:'barrels',solved:false,order:[2,0,1],pos:0,err:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(150,120,500,360)
      ctx.fillStyle=PAL.ink_m;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('BARRIS',400,155)
      const syms=['⦿','⫸','◈']
      const cols=[PAL.rust,PAL.sepia,PAL.ink_l]
      for(let i=0;i<3;i++){
        const bx=200+i*180,by=200
        ctx.fillStyle=cols[i];ctx.fillRect(bx,by,120,180)
        ctx.fillStyle=this.err?PAL.rust_l:PAL.paper_d;ctx.fillRect(bx+10,by+10,100,160)
        ctx.fillStyle=PAL.ink_m;ctx.font='28px Georgia'
        ctx.fillText(syms[i],bx+60,by+110)
        ctx.fillStyle=PAL.sepia;ctx.font='9px Georgia'
        ctx.fillText(this.pos>i?'✓':'?',bx+60,by+170)
      }
      if(this.solved){
        ctx.fillStyle=PAL.sepia_l;ctx.font='16px Georgia'
        ctx.fillText('A ordem estava nos símbolos das notas.',400,430)
      }else{
        ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
        ctx.fillText('Clique nos barris na ordem dos símbolos',400,440)
      }
    },
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já resolveu.');return}
      for(let i=0;i<3;i++){
        const bx=200+i*180
        if(x>=bx&&x<=bx+120&&y>=200&&y<=380){
          if(i===this.order[this.pos]){this.pos++;g.a.water()
            if(this.pos>=3){this.solved=true
              g.obtained('kitchen_key');g.addItem('kitchen_key',true)
              g.engine.tooltip('A chave da cozinha cai de dentro do barril!',3000)
              setTimeout(()=>g.engine.closePuzzle(),1500)
            }
          }else{this.pos=0;this.err=true;g.a.wrong();g.engine.tooltip('Ordem errada.');setTimeout(()=>this.err=false,500)}
          return
        }
      }
    }
  },

  /* ─── COZINHA: PIA ─── */
  sink:{
    id:'sink',solved:false,seq:[3,5,2,4,1],pos:0,err:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(220,380,360,120)
      ctx.fillStyle=PAL.paper;ctx.fillRect(230,390,340,100)
      ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('RITMO DA ÁGUA',400,420)
      for(let i=0;i<5;i++){
        const b={x:270+i*70,y:430,w:60,h:30}
        ctx.fillStyle=this.err?PAL.rust:PAL.ink_l
        ctx.fillRect(b.x,b.y,b.w,b.h)
        ctx.fillStyle=PAL.sepia_l;ctx.font='16px Georgia';ctx.fillText(i+1,b.x+30,b.y+22)
      }
    },
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      for(let k=0;k<5;k++){
        const b={x:270+k*70,y:430,w:60,h:30}
        if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){
          const v=k+1
          if(v===this.seq[this.pos]){this.pos++;g.a.water()
            if(this.pos>=5){this.solved=true
              g.obtained('church_key');g.addItem('church_key',true)
              g.engine.tooltip('A chave da capela cai da torneira!',3000)
              setTimeout(()=>g.engine.closePuzzle(),1500)
            }
          }else{this.pos=0;this.err=true;g.a.wrong();g.engine.tooltip('Ritmo errado.');setTimeout(()=>this.err=false,500)}
          return
        }
      }
    }
  },

  /* ─── CAPELA: ALTAR ─── */
  altar:{
    id:'altar',solved:false,slots:[null,null,null],
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(250,180,300,240)
      ctx.fillStyle=PAL.paper;ctx.fillRect(260,190,280,220)
      ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('OFERENDAS',400,220)
      const icons={medallion:'📿',bell:'🔔',feather:'🪶'}
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=250
        ctx.fillStyle=PAL.ink_l;ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle=PAL.dark;ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){ctx.fillStyle=PAL.sepia_l;ctx.font='24px Georgia';ctx.fillText(icons[this.slots[i]],ox+30,oy+35)}
        else{ctx.fillStyle=PAL.ink_m;ctx.font='24px Georgia';ctx.fillText('○',ox+30,oy+35)}
      }
      if(this.solved)ctx.fillStyle=PAL.sepia_l;ctx.font='18px Georgia';ctx.fillText('✧ O ALTAR SE ABRE ✧',400,370)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=250
        if(x>=ox&&x<=ox+60&&y>=oy&&y<=oy+60&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if(['medallion','bell','feather'].includes(item)){
              this.slots[i]=item;g.removeItem(g.selectedItem);g.selectedItem=null;g.a.chime()
              if(this.slots.every(Boolean)){this.solved=true
                g.obtained('crypt_key');g.addItem('crypt_key',true)
                g.engine.tooltip('As oferendas se encaixam! A chave da cripta!',3000)
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

  /* ─── CRIPTA: VELAS ─── */
  crypt_candles:{
    id:'crypt_candles',solved:false,lit:[false,false,false,false,false,false],order:null,pos:0,
    init:function(){
      this.order=['cellar','kitchen','church','graveyard','mansion','tower']
    },
    render:function(ctx,t){
      ctx.fillStyle='rgba(20,15,10,0.95)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(100,100,600,400)
      ctx.fillStyle=PAL.ink_m;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('VELAS DA CRIPTA',400,130)
      const syms=['⦿','⫸','◈','⚔','꩜','◎']
      for(let i=0;i<6;i++){
        const cx=140+i*95,cy=200
        ctx.fillStyle=PAL.ink_l;ctx.fillRect(cx-8,cy,16,30)
        if(this.lit[i]){
          ctx.fillStyle=PAL.rust_l;ctx.beginPath();ctx.arc(cx,cy-10,8+Math.sin(t*0.003+i)*2,0,Math.PI*2);ctx.fill()
          ctx.fillStyle=`rgba(184,106,58,${0.2+Math.sin(t*0.004+i)*0.1})`;ctx.beginPath();ctx.arc(cx,cy-10,20,0,Math.PI*2);ctx.fill()
        }else{
          ctx.fillStyle=PAL.ink_m;ctx.beginPath();ctx.arc(cx,cy-10,6,0,Math.PI*2);ctx.fill()
        }
        ctx.fillStyle=this.lit[i]?PAL.rust_l:PAL.ink_l;ctx.font='16px Georgia';ctx.textAlign='center'
        ctx.fillText(syms[i],cx,cy+40)
      }
      if(!this.order){
        ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia';tx('Acenda na ordem das notas que encontrou',400,420,PAL.ink_l,10)
      }else if(this.solved){
        ctx.fillStyle=PAL.sepia_l;ctx.font='16px Georgia';tx('Todas as velas acendem! A chave do cemitério!',400,450,PAL.sepia_l,16)
      }
    },
    click:function(x,y,g){
      if(this.solved)return
      if(!this.order)return
      for(let i=0;i<6;i++){
        const cx=140+i*95
        if(x>=cx-15&&x<=cx+15&&y>=180&&y<=240&&!this.lit[i]){
          const noteOrder=this.order
          if(noteOrder[this.pos]===noteOrder[i]&&g.notes.includes(noteOrder[i])){
            if(g.selectedItem!==null&&g.inventory[g.selectedItem]==='lit_candle'){
              this.lit[i]=true;this.pos++;g.a.candle()
              if(this.pos>=6){this.solved=true
                g.obtained('graveyard_key');g.addItem('graveyard_key',true)
                g.engine.tooltip('A chave do cemitério!',3000)
                setTimeout(()=>g.engine.closePuzzle(),1500)
              }
            }else{g.engine.tooltip('Precisa de uma vela acesa.')}
          }else{g.a.wrong();g.engine.tooltip('Ordem errada ou nota não encontrada.')}
          return
        }
      }
    }
  },

  /* ─── CEMITÉRIO: TÚMULOS ─── */
  tombs:{
    id:'tombs',solved:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(40,200,720,200)
      ctx.fillStyle=PAL.paper;ctx.fillRect(50,210,700,180)
      ctx.fillStyle=PAL.ink_m;ctx.font='12px Georgia';ctx.textAlign='center'
      ctx.fillText('TÚMULOS',400,230)
      for(let i=0;i<6;i++){
        const gx=60+i*115,gr=this.graves[i]
        ctx.fillStyle=gr.done?PAL.sepia_l:PAL.ink_l;ctx.fillRect(gx,250,100,90)
        ctx.fillStyle=gr.done?PAL.sepia:PAL.dark;ctx.fillRect(gx+5,255,90,80)
        ctx.fillStyle=gr.done?PAL.paper:PAL.ink_m;ctx.font='9px Georgia'
        ctx.fillText(gr.done?'✓ '+gr.name:'? '+gr.name,gx+50,295)
      }
    },
    graves:[
      {id:0,name:'MEMÓRIA',item:'mansion_key',done:false,mode:'click',hint:'Clique para abrir'},
      {id:1,name:'TEMPO',item:'photo',done:false,mode:'click',hint:'O tempo revela'},
      {id:2,name:'NOME',item:'ribbon',done:false,mode:'text',answer:'SHIVA',hint:'Qual o nome?'},
      {id:3,name:'MEDO',item:'flower',done:false,mode:'shovel',hint:'Precisa cavar'},
      {id:4,name:'DESEJO',item:'skull',done:false,mode:'click',hint:'Desejo atendido'},
      {id:5,name:'???',item:null,done:false,mode:'all',hint:'Abra os outros cinco'}
    ],
    click:function(x,y,g){
      for(let i=0;i<6;i++){
        const gx=60+i*115
        if(x>=gx&&x<=gx+100&&y>=260&&y<=350&&!this.graves[i].done){
          const gr=this.graves[i]
          if(gr.mode==='click'){
            gr.done=true;g.a.grave()
            if(gr.item){g.obtained(gr.item);g.addItem(gr.item,true);g.engine.tooltip(gr.name+' — '+gr.hint,2000)}
            else g.engine.tooltip(gr.hint,2000)
          }else if(gr.mode==='text'){
            const name=prompt(gr.hint)
            if(name&&name.toUpperCase()===gr.answer){
              gr.done=true;g.a.grave()
              g.obtained(gr.item);g.addItem(gr.item,true);g.engine.tooltip(gr.name+' — aberto!',2000)
            }else{g.a.wrong();g.engine.tooltip('Nome errado.')}
          }else if(gr.mode==='shovel'){
            if(g.selectedItem!==null&&g.inventory[g.selectedItem]==='complete_shovel'){
              gr.done=true;g.a.dig();g.removeItem(g.selectedItem);g.selectedItem=null
              g.obtained(gr.item);g.addItem(gr.item,true);g.engine.tooltip('Uma flor emerge da terra.',2000)
            }else{g.engine.tooltip('Precisa de uma pá para cavar.')}
          }else if(gr.mode==='all'){
            if(this.graves.filter(g=>g.done&&g.id!==5).length>=5){
              gr.done=true;g.addNote('graveyard')
            }else{g.engine.tooltip('Abra os outros cinco primeiro.')}
          }
          if(this.graves.filter(g=>g.done).length>=6)this.solved=true
          return
        }
      }
    }
  },

  /* ─── SALÃO: ARMÁRIO ─── */
  cabinet:{
    id:'cabinet',solved:false,digits:[0,0,0],
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(250,200,300,200)
      ctx.fillStyle=PAL.paper;ctx.fillRect(260,210,280,180)
      ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('COMBINAÇÃO',400,245)
      for(let i=0;i<3;i++){
        ctx.fillStyle=PAL.dark;ctx.fillRect(280+i*90,270,60,60)
        ctx.fillStyle=PAL.sepia_l;ctx.font='28px Georgia';ctx.fillText(this.digits[i],310+i*90,310)
        ctx.fillStyle=PAL.ink_l;ctx.font='11px Georgia'
        ctx.fillText('▲',310+i*90,270);ctx.fillText('▼',310+i*90,340)
      }
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('6 celas · 6 chaves · 6 símbolos',400,410)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        if(x>=280+i*90&&x<=340+i*90&&y>=270&&y<=330){
          if(y>=270&&y<=290)this.digits[i]=(this.digits[i]+1)%10
          else if(y>=310&&y<=330)this.digits[i]=(this.digits[i]+9)%10
          if(this.digits.every(d=>d===6)){
            this.solved=true;g.a.unlock()
            g.obtained('library_key');g.addItem('library_key',true)
            g.obtained('ring');g.addItem('ring',true)
            g.engine.tooltip('As gavetas se abrem! Chave da biblioteca e anel!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },

  /* ─── SALÃO: RELÓGIO (opcional) ─── */
  clock:{
    id:'clock',solved:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(300,180,200,240)
      ctx.fillStyle=PAL.paper;ctx.fillRect(310,190,180,220)
      ctx.fillStyle=PAL.ink_m;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('RELÓGIO',400,220)
      ctx.fillStyle=PAL.sepia_l;ctx.font='48px Georgia';ctx.fillText('🕐',400,320)
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('O pêndulo parou.',400,370)
      if(this.solved){
        ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.fillText('Uma nota caiu.',400,400)
      }
    },
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=560&&x<=640&&y>=100&&y<=200&&g.selectedItem!==null){
        if(g.inventory[g.selectedItem]==='ribbon'){
          this.solved=true;g.removeItem(g.selectedItem);g.selectedItem=null
          g.a.clock();g.addNote('mansion')
          g.engine.tooltip('O pêndulo balança. Uma nota cai.',3000)
        }else{g.engine.tooltip('Isso não encaixa no relógio.')}
      }
    }
  },

  /* ─── BIBLIOTECA: ESTANTE ─── */
  shelf:{
    id:'shelf',solved:false,order:[],target:[0,1,2,3,4],
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(100,100,600,320)
      ctx.fillStyle=PAL.paper;ctx.fillRect(110,110,580,300)
      const labels=['V','A','R','D','P']
      const colors=['#8a4a3a','#3a4a5a','#4a3a5a','#8a7050','#2a1f14']
      for(let i=0;i<5;i++){
        ctx.fillStyle=colors[i];ctx.fillRect(150+i*110,140,80,150)
        ctx.fillStyle=PAL.sepia_l;ctx.font='24px Georgia';ctx.textAlign='center'
        ctx.fillText(labels[i],190+i*110,230)
        if(this.order.includes(i)){ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.fillText('✓',190+i*110,180)}
      }
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('Vermelho → Azul → Roxo → Dourado → Preto',400,510)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<5;i++){
        const bx=150+i*110
        if(x>=bx&&x<=bx+80&&y>=140&&y<=290&&!this.order.includes(i)){
          this.order.push(i);g.a.click()
          if(this.order[this.order.length-1]!==this.target[this.order.length-1]){this.order=[];g.a.wrong();g.engine.tooltip('Ordem errada.')}
          else if(this.order.length>=5){
            this.solved=true;g.a.bell()
            g.obtained('tower_key');g.addItem('tower_key',true)
            g.engine.tooltip('A chave da torre!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },

  /* ─── TORRE: SANTUÁRIO ─── */
  shrine:{
    id:'shrine',solved:false,current:0,order:[0,1,2,3,4,5],
    render:function(ctx,t){
      ctx.fillStyle='rgba(42,31,20,0.9)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(150,100,500,350)
      const labels=['PORÃO','COZINHA','CAPELA','CEMITÉRIO','SALÃO','BIBLIOTECA']
      for(let i=0;i<6;i++){
        const cx=180+i*80,cy=200
        ctx.fillStyle=PAL.ink_l;ctx.fillRect(cx,cy,50,120)
        const lit=i<this.current
        ctx.fillStyle=lit?PAL.rust_l:PAL.dark
        ctx.beginPath();ctx.arc(cx+25,cy+20,12,0,Math.PI*2);ctx.fill()
        if(lit){ctx.fillStyle=`rgba(184,106,58,${0.2+Math.sin(t*0.003)*0.1})`;ctx.beginPath();ctx.arc(cx+25,cy+20,25,0,Math.PI*2);ctx.fill()}
        ctx.fillStyle=PAL.ink_l;ctx.font='7px Georgia';ctx.textAlign='center'
        ctx.fillText(labels[i],cx+25,cy+115)
      }
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('Acenda na ordem da jornada',400,380)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<6;i++){
        const cx=180+i*80
        if(x>=cx&&x<=cx+50&&y>=200&&y<=320&&i>=this.current){
          if(i===this.order[this.current]){this.current++;g.a.candle()
            if(this.current>=6){
              this.solved=true;g.a.chime()
              g.obtained('collar');g.addItem('collar',true)
              g.addNote('tower')
              g.engine.tooltip('A coleira de Cérbero surge das chamas!',3000)
              setTimeout(()=>g.engine.closePuzzle(),1500)
            }
          }else{this.current=0;g.a.wrong();g.engine.tooltip('Ordem errada.')}
          return
        }
      }
    }
  },

  /* ─── TÚNEL: ALTAR FINAL ─── */
  final_altar:{
    id:'final_altar',solved:false,slots:[null,null,null],
    render:function(ctx,t){
      ctx.fillStyle='rgba(20,15,10,0.95)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle=PAL.paper_d;ctx.fillRect(250,200,300,220)
      ctx.fillStyle=PAL.paper;ctx.fillRect(260,210,280,200)
      ctx.fillStyle=PAL.sepia_l;ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('ALTAR FINAL',400,240)
      const icons={collar:'⛓️',ring:'💍',flower:'🌺'}
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=270
        ctx.fillStyle=PAL.ink_l;ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle=PAL.dark;ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){ctx.fillStyle=PAL.sepia_l;ctx.font='20px Georgia';ctx.fillText(icons[this.slots[i]]||'●',ox+30,oy+35)}
        else{ctx.fillStyle=PAL.ink_m;ctx.font='24px Georgia';ctx.fillText('○',ox+30,oy+35)}
      }
      ctx.fillStyle=PAL.ink_l;ctx.font='10px Georgia'
      ctx.fillText('Três oferendas para três cabeças',400,420)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=270
        if(x>=ox&&x<=ox+60&&y>=oy&&y<=oy+60&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if(['collar','ring','flower'].includes(item)){
              this.slots[i]=item;g.removeItem(g.selectedItem);g.selectedItem=null;g.a.chime()
              if(this.slots.every(Boolean)){this.solved=true;setTimeout(()=>g.checkEndings(),800)}
              return
            }
          }
          g.engine.tooltip('Isso não serve.')
        }
      }
    }
  }
}
