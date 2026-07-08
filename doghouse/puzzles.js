const PUZZLES = {
  gate:{
    id:'gate',title:'PORTÃO',
    init:function(){this.slots=[false,false,false];this.solved=false},
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#2a1010';ctx.fillRect(250,120,300,360)
      ctx.fillStyle='#120808';ctx.fillRect(260,130,280,340)
      ctx.fillStyle='#4a2a2a';ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('TRÊS FECHADURAS',400,170)
      for(let i=0;i<3;i++){
        const fx=310+i*80,fy=220
        ctx.fillStyle='#3a1a1a';ctx.fillRect(fx,fy,40,80)
        ctx.fillStyle=this.slots[i]?'#c4a46c':'#0a0505';ctx.fillRect(fx+5,fy+5,30,30)
        ctx.fillStyle=this.slots[i]?'#c4a46c':'#8a3a3a';ctx.font='18px Georgia'
        ctx.fillText(this.slots[i]?'●':'○',fx+20,fy+30)
        ctx.fillStyle='#4a2a2a';ctx.font='9px Georgia'
        ctx.fillText(['PORÃO','COZINHA','CAPELA'][i],fx+20,fy+100)
      }
      ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia'
      ctx.fillText('SELECIONE UMA CHAVE NO INVENTÁRIO E CLIQUE NA FECHADURA',400,400)
      if(this.solved){ctx.fillStyle='#c4a46c';ctx.font='18px Georgia';ctx.fillText('O PORTÃO SE ABRE',400,450)}
    },
    click:function(x,y,g){
      for(let i=0;i<3;i++){
        const fx=310+i*80,fy=220
        if(x>=fx&&x<=fx+40&&y>=fy&&y<=fy+80&&!this.slots[i]){
          if(g.selectedItem!==null){
            const item=g.inventory[g.selectedItem]
            if((i===0&&item==='cellar_key')||(i===1&&item==='kitchen_key')||(i===2&&item==='church_key')){
              this.slots[i]=true;g.removeItem(g.selectedItem);g.selectedItem=null
              g.engine.tooltip('Chave encaixada.');g.a.key()
              if(this.slots.every(Boolean)){
                this.solved=true;g.a.unlock()
                g.engine.tooltip('Todas as fechaduras abertas!',3000)
                g.flags.gate_open=true
                setTimeout(()=>{g.engine.closePuzzle();g.engine.tooltip('O portão range. A passagem está livre.',3000)},1500)
              }
              return
            }
          }
          g.engine.tooltip('Chave errada.');g.a.wrong();return
        }
      }
    }
  },
  cellar_vent:{
    id:'cellar_vent',solved:false,
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=600&&x<=660&&y>=200&&y<=260&&g.selectedItem!==null){
        const item=g.inventory[g.selectedItem]
        if(item==='wax'){
          this.solved=true;g.removeItem(g.selectedItem);g.selectedItem=null
          g.a.unlock();g.engine.tooltip('A cera amolece as barras. Uma nota cai.',2000)
          setTimeout(()=>g.addNote('cellar'),500)
        }
      }
    }
  },
  kitchen_sink:{
    id:'kitchen_sink',solved:false,seq:[3,5,2,4,1],pos:0,err:false,
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#3a1a1a';ctx.fillRect(220,380,360,120)
      ctx.fillStyle='#120808';ctx.fillRect(230,390,340,100)
      ctx.fillStyle='#c4a46c';ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('RITMO DA ÁGUA',400,420)
      const btns=[{x:270,y:430,w:60,h:30,l:'1'},{x:340,y:430,w:60,h:30,l:'2'},{x:410,y:430,w:60,h:30,l:'3'},{x:480,y:430,w:60,h:30,l:'4'},{x:550,y:430,w:60,h:30,l:'5'}]
      for(let i=0;i<5;i++){
        const b=btns[i]
        ctx.fillStyle=this.err?'#8a3a3a':this.pos>i?'#a85a3a':'#4a2a2a'
        ctx.fillRect(b.x,b.y,b.w,b.h)
        ctx.fillStyle='#e8d4a8';ctx.font='16px Georgia';ctx.fillText(b.l,b.x+30,b.y+22)
      }
    },
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      const btn={1:{x:270,y:430,w:60,h:30},2:{x:340,y:430,w:60,h:30},3:{x:410,y:430,w:60,h:30},4:{x:480,y:430,w:60,h:30},5:{x:550,y:430,w:60,h:30}}
      for(let k in btn){
        const b=btn[k]
        if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){
          const v=parseInt(k)
          if(v===this.seq[this.pos]){this.pos++;g.a.water()
            if(this.pos>=this.seq.length){this.solved=true
              g.obtained('church_key');g.addItem('church_key',true)
              g.engine.tooltip('O ritmo está correto! A chave da capela cai da torneira.',3000)
            }
          }else{this.pos=0;this.err=true;g.a.wrong();g.engine.tooltip('Ritmo errado. Recomece.');setTimeout(()=>this.err=false,500)}
          return
        }
      }
    }
  },
  church_altar:{
    id:'church_altar',solved:false,slots:[null,null,null],
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#1a0a2a';ctx.fillRect(250,180,300,240)
      ctx.fillStyle='#2a1a3a';ctx.fillRect(260,190,280,220)
      ctx.fillStyle='#c4a46c';ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('OFERENDAS',400,220)
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=250
        ctx.fillStyle='#2a1010';ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle='#120808';ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){ctx.fillStyle='#c4a46c';ctx.font='20px Georgia'
          ctx.fillText(this.slots[i]==='medallion'?'📿':this.slots[i]==='bell'?'🔔':'🪶',ox+30,oy+35)
        }else{ctx.fillStyle='#4a2a2a';ctx.font='24px Georgia';ctx.fillText('○',ox+30,oy+35)}
      }
      if(this.solved){ctx.fillStyle='#c4a46c';ctx.font='18px Georgia';ctx.fillText('✧ O ALTAR SE ABRE ✧',400,370)}
      else{ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia';ctx.fillText('Clique em um slot para colocar uma oferenda do inventário',400,410)}
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
              if(this.slots.every(Boolean)){
                this.solved=true
                g.obtained('graveyard_key');g.addItem('graveyard_key',true)
                g.engine.tooltip('As oferendas se encaixam! A chave do cemitério cai.',3000)
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
  graveyard_tomb:{
    id:'graveyard_tomb',solved:false,
    graves:[
      {id:0,name:'MEMÓRIA',item:'mansion_key',done:false},
      {id:1,name:'TEMPO',item:'photo',done:false},
      {id:2,name:'NOME',item:'ribbon',type:'text',done:false},
      {id:3,name:'MEDO',item:'flower',done:false},
      {id:4,name:'DESEJO',item:'skull',done:false},
      {id:5,name:'???',note:true,done:false}
    ],
    click:function(x,y,g){
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
              g.engine.tooltip('A terra se move. Uma fitinha emerge.',2000)
              if(this.graves.filter(g=>g.done).length>=6){this.solved=true;g.engine.tooltip('Todos os túmulos abertos.',3000)}
            }else{g.a.wrong();g.engine.tooltip('Nome errado.')}
          }else if(gr.note){
            gr.done=true;g.addNote('graveyard')
            g.engine.tooltip('Uma nota revela seu símbolo.',2000)
          }else{
            gr.done=true;g.a.grave()
            g.obtained(gr.item);g.addItem(gr.item,true)
            g.engine.tooltip('Algo emerge da terra.',2000)
            if(this.graves.filter(g=>g.done).length>=6){this.solved=true;g.engine.tooltip('Todos os túmulos abertos.',3000)}
          }
        }
      }
    }
  },
  mansion_cabinet:{
    id:'mansion_cabinet',solved:false,digits:[0,0,0],
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#3a1a1a';ctx.fillRect(250,200,300,200)
      ctx.fillStyle='#120808';ctx.fillRect(260,210,280,180)
      ctx.fillStyle='#c4a46c';ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('COMBINAÇÃO',400,245)
      for(let i=0;i<3;i++){
        ctx.fillStyle='#0a0505';ctx.fillRect(280+i*90,270,60,60)
        ctx.fillStyle='#e8d4a8';ctx.font='28px Georgia';ctx.fillText(this.digits[i],310+i*90,310)
        ctx.fillStyle='#4a2a2a';ctx.font='11px Georgia'
        ctx.fillText('▲',310+i*90,270);ctx.fillText('▼',310+i*90,340)
      }
      ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia'
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
            g.obtained('collar');g.addItem('collar',true)
            g.obtained('ring');g.addItem('ring',true)
            g.engine.tooltip('As gavetas se abrem! Três itens!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },
  mansion_clock:{
    id:'mansion_clock',solved:false,
    click:function(x,y,g){
      if(this.solved){g.engine.tooltip('Já fez isso.');return}
      if(x>=560&&x<=640&&y>=100&&y<=200&&g.selectedItem!==null){
        if(g.inventory[g.selectedItem]==='ribbon'){
          this.solved=true;g.removeItem(g.selectedItem);g.selectedItem=null
          g.a.clock();g.addNote('mansion')
          g.engine.tooltip('O pêndulo balança. Uma nota cai.',3000)
        }
      }
    }
  },
  library_shelf:{
    id:'library_shelf',solved:false,order:[],target:[0,1,2,3,4],
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#3a1a1a';ctx.fillRect(100,100,600,320)
      ctx.fillStyle='#120808';ctx.fillRect(110,110,580,300)
      const labels=['V','A','R','D','P']
      const colors=['#8a3a3a','#0d1a2a','#2a1a3a','#c4a46c','#0a0505']
      for(let i=0;i<5;i++){
        ctx.fillStyle=colors[i];ctx.fillRect(150+i*110,140,80,150)
        ctx.fillStyle='#e8d4a8';ctx.font='24px Georgia';ctx.textAlign='center'
        ctx.fillText(labels[i],190+i*110,230)
        if(this.order.includes(i)){ctx.fillStyle='#c4a46c';ctx.font='14px Georgia';ctx.fillText('✓',190+i*110,180)}
      }
      ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia'
      ctx.fillText('Vermelho → Azul → Roxo → Dourado → Preto — clique na ordem correta',400,510)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<5;i++){
        const bx=150+i*110
        if(x>=bx&&x<=bx+80&&y>=140&&y<=290&&!this.order.includes(i)){
          this.order.push(i);g.a.click()
          const idx=this.order.length-1
          if(this.order[idx]!==this.target[idx]){this.order=[];g.a.wrong();g.engine.tooltip('Ordem errada. Recomece.')}
          else if(this.order.length>=5){
            this.solved=true;g.a.bell()
            g.obtained('tower_key');g.addItem('tower_key',true)
            g.engine.tooltip('A estante range. A chave da torre!',3000)
            setTimeout(()=>g.engine.closePuzzle(),1500)
          }
          return
        }
      }
    }
  },
  tower_shrine:{
    id:'tower_shrine',solved:false,current:0,order:[0,1,2,3,4,5],
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#1a0a2a';ctx.fillRect(150,100,500,350)
      const labels=['PORÃO','COZINHA','CAPELA','CEMITÉRIO','SALÃO','BIBLIOTECA']
      for(let i=0;i<6;i++){
        const cx=180+i*80,cy=200
        ctx.fillStyle='#2a1010';ctx.fillRect(cx,cy,50,120)
        const lit=i<this.current
        ctx.fillStyle=lit?'#a85a3a':'#0a0505'
        ctx.beginPath();ctx.arc(cx+25,cy+20,12,0,Math.PI*2);ctx.fill()
        if(lit){ctx.fillStyle='rgba(168,90,58,0.3)';ctx.beginPath();ctx.arc(cx+25,cy+20,25,0,Math.PI*2);ctx.fill()}
        ctx.fillStyle='#4a2a2a';ctx.font='7px Georgia';ctx.textAlign='center'
        ctx.fillText(labels[i],cx+25,cy+115)
      }
      ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia'
      ctx.fillText('Acenda na ordem da jornada',400,380)
    },
    click:function(x,y,g){
      if(this.solved)return
      for(let i=0;i<6;i++){
        const cx=180+i*80
        if(x>=cx&&x<=cx+50&&y>=200&&y<=320&&i>=this.current){
          if(i===this.order[this.current]){this.current++;g.a.candle()
            if(this.current>=6){this.solved=true;g.a.chime()
              g.addNote('tower')
              g.engine.tooltip('As seis velas acendem! A coleira de Cérbero...',3000)
              setTimeout(()=>g.engine.closePuzzle(),1500)
            }
          }else{this.current=0;g.a.wrong();g.engine.tooltip('Ordem errada. Recomece.')}
          return
        }
      }
    }
  },
  final_altar:{
    id:'final_altar',solved:false,slots:[null,null,null],
    render:function(ctx,t){
      ctx.fillStyle='rgba(5,2,2,0.85)';ctx.fillRect(0,0,800,600)
      ctx.fillStyle='#3a1a1a';ctx.fillRect(250,200,300,220)
      ctx.fillStyle='#120808';ctx.fillRect(260,210,280,200)
      ctx.fillStyle='#c4a46c';ctx.font='14px Georgia';ctx.textAlign='center'
      ctx.fillText('ALTAR FINAL',400,240)
      for(let i=0;i<3;i++){
        const ox=290+i*100,oy=270
        ctx.fillStyle='#2a1010';ctx.fillRect(ox,oy,60,60)
        ctx.fillStyle='#120808';ctx.fillRect(ox+5,oy+5,50,50)
        if(this.slots[i]){ctx.fillStyle='#c4a46c';ctx.font='20px Georgia'
          ctx.fillText(this.slots[i]==='collar'?'📿':this.slots[i]==='ring'?'💍':'🌺',ox+30,oy+35)
        }else{ctx.fillStyle='#4a2a2a';ctx.font='24px Georgia';ctx.fillText('○',ox+30,oy+35)}
      }
      ctx.fillStyle='#5a3a3a';ctx.font='10px Georgia'
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
              if(this.slots.every(Boolean)){this.solved=true;setTimeout(()=>g.checkEndings(),500)}
              return
            }
          }
          g.engine.tooltip('Isso não serve.')
        }
      }
    }
  }
}
