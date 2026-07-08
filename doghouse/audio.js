class AudioSys{
  constructor(){
    this.ctx=null;this.initialized=false
    this.volumes={sfx:0.18}
  }
  init(){
    if(this.initialized)return
    try{
      this.ctx=new(window.AudioContext||window.webkitAudioContext)()
      this.initialized=true
    }catch(e){}
  }
  resume(){
    if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()
  }
  _t(f){return{type:'sine',freq:f||440}}
  _n(dur,g,f,Q){
    const sr=this.ctx.sampleRate,len=Math.floor(sr*dur)
    const buf=this.ctx.createBuffer(1,len,sr),d=buf.getChannelData(0)
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1
    const s=this.ctx.createBufferSource();s.buffer=buf
    const gN=this.ctx.createGain()
    gN.gain.setValueAtTime((g||0.08)*this.volumes.sfx,this.ctx.currentTime)
    gN.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur)
    if(f){
      const flt=this.ctx.createBiquadFilter()
      flt.type=f.t||'lowpass';flt.frequency.value=f.f||1000;flt.Q.value=f.Q||1
      s.connect(flt);flt.connect(gN);gN.connect(this.ctx.destination)
    }else{s.connect(gN);gN.connect(this.ctx.destination)}
    s.start();s.stop(this.ctx.currentTime+dur)
  }
  _o(freq,type,dur,gain,slide){
    const o=this.ctx.createOscillator();o.type=type||'sine'
    const g=this.ctx.createGain()
    const t=this.ctx.currentTime
    o.frequency.setValueAtTime(freq,t)
    if(slide)o.frequency.linearRampToValueAtTime(slide,t+dur)
    g.gain.setValueAtTime((gain||0.08)*this.volumes.sfx,t)
    if(typeof slide==='string'&&slide==='hold'){}
    else g.gain.exponentialRampToValueAtTime(0.001,t+dur)
    o.connect(g);g.connect(this.ctx.destination)
    o.start(t);o.stop(t+dur)
  }

  /* ---- sfx ---- */
  click(){this._n(0.015,0.04,{t:'highpass',f:3000,Q:3})}
  pickup(){
    this._o(1200,'sine',0.06,0.07,1500)
    this._n(0.03,0.03,{t:'bandpass',f:2000,Q:6})
  }
  wrong(){
    this._n(0.12,0.06,{t:'lowpass',f:250,Q:2})
    this._o(150,'sawtooth',0.15,0.06,80)
  }
  unlock(){
    this._o(600,'triangle',0.08,0.06,750)
    setTimeout(()=>{
      this._o(800,'sine',0.12,0.05,900)
      this._n(0.04,0.03,{t:'bandpass',f:1200,Q:5})
    },120)
  }
  door(){
    this._n(0.25,0.07,{t:'lowpass',f:350,Q:2})
    this._o(130,'sine',0.3,0.08,80)
  }
  step(){this._n(0.05,0.03,{t:'bandpass',f:180,Q:3})}
  key(){
    this._o(2000,'sine',0.25,0.06,1800)
    this._o(2500,'sine',0.15,0.04,2300)
    this._n(0.02,0.02,{t:'highpass',f:4000,Q:5})
  }
  paper(){this._n(0.12,0.02,{t:'bandpass',f:4000,Q:3})}
  shiva(){
    this._o(50,'sawtooth',2,0.06,35)
    this._n(2,0.03,{t:'lowpass',f:150,Q:2})
    this._o(800,'sine',0.4,0.02,900)
  }
  radio(freq){
    this._n(0.1,0.03,{t:'bandpass',f:(freq||400),Q:30})
    if(freq)this._o(freq,'sine',0.15,0.05,freq*1.01)
  }
  clock(){
    this._n(0.03,0.04,{t:'bandpass',f:2500,Q:10})
    this._o(350,'triangle',0.2,0.06,500)
    setTimeout(()=>{this._o(500,'sine',0.3,0.04,700);this._n(0.02,0.02,{t:'bandpass',f:2000,Q:8})},150)
  }
  heart(){
    this._o(160,'sine',0.15,0.06,200)
    setTimeout(()=>this._o(180,'sine',0.15,0.04,220),200)
  }
  chime(){
    [880,1100,1320,1760].forEach((f,i)=>{
      this._o(f,'sine',0.6-i*0.06,0.06-i*0.01,f*1.003)
    })
    this._n(0.02,0.02,{t:'highpass',f:5000,Q:5})
  }
  candle(){this._n(0.15,0.02,{t:'bandpass',f:500,Q:4})}
  grave(){
    this._n(0.4,0.06,{t:'lowpass',f:120,Q:3})
    this._o(70,'sawtooth',0.4,0.06,45)
  }
  water(){this._n(0.5,0.03,{t:'bandpass',f:400,Q:3})}
  wind(){this._n(1.2,0.02,{t:'lowpass',f:250,Q:2})}
  crow(){
    this._o(450,'square',0.1,0.05,350)
    setTimeout(()=>this._o(300,'square',0.12,0.04,250),120)
  }
  bell(){
    [600,750,900,1200].forEach((f,i)=>{
      this._o(f,'sine',1-i*0.1,0.05-i*0.008,f*1.002)
    })
    this._n(0.02,0.015,{t:'highpass',f:6000,Q:5})
  }
  final(){
    this._o(400,'triangle',2,0.08,800)
    this._o(600,'sine',1.5,0.04,1000)
    this._n(2,0.03,{t:'lowpass',f:400,Q:3})
  }

  /* ---- musica tema procedural ---- */
  startDrone(sceneId){
    if(!this.ctx||this.muted)return
    this.stopDrone()
    const themes={
      corridor:{n:'Corredor',bpm:50,scale:[0,2,3,5,7,8,10],root:55,pat:'bass'},
      cellar:{n:'Porao',bpm:45,scale:[0,3,5,7,10],root:44,pat:'arp'},
      kitchen:{n:'Cozinha',bpm:60,scale:[0,2,3,5,7],root:65,pat:'arp'},
      church:{n:'Capela',bpm:40,scale:[0,3,5,7,8,10],root:110,pat:'pad'},
      graveyard:{n:'Cemiterio',bpm:38,scale:[0,3,5,6,8,10],root:41,pat:'arp'},
      mansion:{n:'Solar',bpm:42,scale:[0,3,5,7,8,10],root:98,pat:'pad'},
      library:{n:'Biblioteca',bpm:35,scale:[0,2,4,5,7,9],root:73,pat:'pad'},
      tower:{n:'Torre',bpm:30,scale:[0,2,3,5,7,8,10,12],root:130,pat:'arp'},
      tunnel:{n:'Tunel',bpm:25,scale:[0,1,3,4,6,7,9,10],root:38,pat:'arp'},
      default:{n:'Vazio',bpm:40,scale:[0,3,5,7],root:50,pat:'bass'}
    }
    const th=themes[sceneId]||themes.default
    const bpmMs=60000/th.bpm
    const gMaster=this.ctx.createGain()
    gMaster.gain.value=0
    this.masterGain=gMaster
    gMaster.connect(this.ctx.destination)
    const voices=[];let step=0
    const tick=(ba=0)=>{
      if(!this.masterGain)return
      const t=this.ctx.currentTime+ba
      const notes=th.scale
      if(th.pat==='arp'){
        const ni=step%notes.length
        const n=notes[ni],freq=th.root*Math.pow(2,n/12)
        const o=this.ctx.createOscillator();o.type='triangle'
        o.frequency.setValueAtTime(freq,t)
        const g=this.ctx.createGain()
        g.gain.setValueAtTime(0,t)
        g.gain.linearRampToValueAtTime(0.04,t+0.05)
        g.gain.exponentialRampToValueAtTime(0.001,t+bpmMs/1000*0.8)
        const lfo=this.ctx.createOscillator();lfo.type='sine';lfo.frequency.value=0.1
        const lfoG=this.ctx.createGain();lfoG.gain.value=freq*0.003
        lfo.connect(lfoG);lfoG.connect(o.frequency);lfo.start(t);lfo.stop(t+bpmMs/1000)
        o.connect(g);g.connect(gMaster);o.start(t);o.stop(t+bpmMs/1000)
        voices.push({o,g,lfo})
        if(ni===0){
          const o2=this.ctx.createOscillator();o2.type='sine'
          o2.frequency.setValueAtTime(th.root/2,t)
          const g2=this.ctx.createGain()
          g2.gain.setValueAtTime(0.03,t)
          g2.gain.linearRampToValueAtTime(0.01,t+bpmMs/1000*4)
          g2.gain.exponentialRampToValueAtTime(0.001,t+bpmMs/1000*8)
          o2.connect(g2);g2.connect(gMaster);o2.start(t);o2.stop(t+bpmMs/1000*8)
          voices.push({o:o2,g:g2})
        }
        step++
        const nextMs=bpmMs/4+(Math.random()-0.5)*20
        this.musicTimer=setTimeout(()=>tick(),nextMs)
      }else if(th.pat==='bass'){
        const ni=step%notes.length
        const n=notes[ni],freq=th.root*Math.pow(2,n/12)
        const o=this.ctx.createOscillator();o.type='sawtooth'
        o.frequency.setValueAtTime(freq/2,t)
        const g=this.ctx.createGain()
        g.gain.setValueAtTime(0,t)
        g.gain.linearRampToValueAtTime(0.02,t+0.1)
        g.gain.exponentialRampToValueAtTime(0.001,t+bpmMs/1000*1.5)
        const flt=this.ctx.createBiquadFilter();flt.type='lowpass';flt.frequency.value=200
        o.connect(flt);flt.connect(g);g.connect(gMaster);o.start(t);o.stop(t+bpmMs/1000*1.5)
        voices.push({o,g})
        if(ni%2===0){
          const o2=this.ctx.createOscillator();o2.type='triangle'
          o2.frequency.setValueAtTime(freq*1.5,t)
          const g2=this.ctx.createGain()
          g2.gain.setValueAtTime(0.008,t)
          g2.gain.exponentialRampToValueAtTime(0.001,t+bpmMs/1000*2)
          o2.connect(g2);g2.connect(gMaster);o2.start(t);o2.stop(t+bpmMs/1000*2)
          voices.push({o:o2,g:g2})
        }
        step++
        const nextMs=bpmMs/2+(Math.random()-0.5)*30
        this.musicTimer=setTimeout(()=>tick(),nextMs)
      }else{
        notes.forEach((n,i)=>{
          const freq=th.root*Math.pow(2,n/12)
          const o=this.ctx.createOscillator();o.type='sine'
          o.frequency.setValueAtTime(freq,t)
          const g=this.ctx.createGain()
          const attack=0.5+i*0.3
          g.gain.setValueAtTime(0,t)
          g.gain.linearRampToValueAtTime(0.015,t+attack)
          g.gain.setValueAtTime(0.015,t+4)
          g.gain.exponentialRampToValueAtTime(0.001,t+6)
          const lfo=this.ctx.createOscillator();lfo.type='sine';lfo.frequency.value=0.05+Math.random()*0.1
          const lfoG=this.ctx.createGain();lfoG.gain.value=freq*0.005
          lfo.connect(lfoG);lfoG.connect(o.frequency);lfo.start(t);lfo.stop(t+6)
          o.connect(g);g.connect(gMaster);o.start(t);o.stop(t+6)
          voices.push({o,g,lfo})
        })
        step++
        this.musicTimer=setTimeout(()=>tick(),bpmMs*4+(Math.random()-0.5)*500)
      }
    }
    gMaster.gain.linearRampToValueAtTime(0.5,this.ctx.currentTime+4)
    tick(0.5)
    this.musicVoices=voices;this.musicTheme=th
  }
  stopDrone(){
    if(this.musicTimer){clearTimeout(this.musicTimer);this.musicTimer=null}
    if(this.masterGain){
      try{this.masterGain.gain.linearRampToValueAtTime(0,this.ctx.currentTime+1)}
      catch(e){}
    }
    setTimeout(()=>{
      if(this.musicVoices)this.musicVoices.forEach(v=>{
        try{v.o.stop()}catch(e){}
        try{if(v.lfo)v.lfo.stop()}catch(e){}
      })
      this.musicVoices=null;this.masterGain=null;this.musicTheme=null
    },1200)
  }
}
