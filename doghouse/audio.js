class AudioSys{
  constructor(){
    this.ctx=null;this.initialized=false
    this.volumes={sfx:0.18,amb:0.04,bg:0.03}
    this.ambients={};this.drone=null;this.droneGain=0
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

  /* ---- drone ambiental sutil ---- */
  startDrone(sceneId){
    if(!this.ctx||this.muted)return
    this.stopDrone()
    const cfg={
      cellar:{f:50,type:'sine'},corridor_1:{f:45,type:'sine'},
      corridor_2:{f:52,type:'sine'},kitchen:{f:60,type:'sine'},
      corridor_3:{f:58,type:'sine'},church:{f:100,type:'sine'},
      corridor_4:{f:55,type:'sine'},graveyard:{f:42,type:'sine'},
      corridor_5:{f:65,type:'sine'},mansion:{f:90,type:'sine'},
      corridor_6:{f:70,type:'sine'},library:{f:80,type:'triangle'},
      tower:{f:110,type:'triangle'},tunnel:{f:38,type:'sawtooth'},
      default:{f:50,type:'sine'}
    }
    const c=cfg[sceneId]||cfg.default
    const gDrone=this.ctx.createGain()
    gDrone.gain.value=0
    this.droneGain=gDrone
    gDrone.connect(this.ctx.destination)
    const oscs=[]
    const freqs=[c.f*1,c.f*1.01,c.f*0.99]
    for(let i=0;i<3;i++){
      const o=this.ctx.createOscillator();o.type=c.type
      o.frequency.value=freqs[i]+(Math.random()-0.5)*0.5
      const g=this.ctx.createGain()
      g.gain.value=this.volumes.bg*(0.5-i*0.15)
      const lfo=this.ctx.createOscillator();lfo.type='sine';lfo.frequency.value=0.08+Math.random()*0.15
      const lfoG=this.ctx.createGain();lfoG.gain.value=freqs[i]*0.01
      lfo.connect(lfoG);lfoG.connect(o.frequency);lfo.start()
      o.connect(g);g.connect(gDrone);o.start()
      oscs.push({o,g,lfo})
    }
    const amb=this.ctx.createBufferSource()
    amb.buffer=(()=>{
      const sr=this.ctx.sampleRate,len=sr*6
      const buf=this.ctx.createBuffer(1,len,sr),d=buf.getChannelData(0)
      for(let i=0;i<len;i++)d[i]=Math.random()*2-1
      return buf
    })()
    amb.loop=true
    const ambF=this.ctx.createBiquadFilter()
    ambF.type='lowpass';ambF.frequency.value=100+c.f*0.5;ambF.Q.value=1.5
    const ambG=this.ctx.createGain()
    ambG.gain.value=this.volumes.amb*0.6
    const ambLfo=this.ctx.createOscillator();ambLfo.type='sine';ambLfo.frequency.value=0.03
    const ambLfoG=this.ctx.createGain();ambLfoG.gain.value=50
    ambLfo.connect(ambLfoG);ambLfoG.connect(ambF.frequency);ambLfo.start()
    amb.connect(ambF);ambF.connect(ambG);ambG.connect(gDrone);amb.start()
    gDrone.gain.linearRampToValueAtTime(1,this.ctx.currentTime+3)
    this.drone={oscs,amb,ambLfo,g:gDrone}
  }
  stopDrone(){
    if(!this.drone)return
    if(this.drone.g)this.drone.g.gain.linearRampToValueAtTime(0,this.ctx.currentTime+0.5)
    setTimeout(()=>{
      if(!this.drone)return
      this.drone.oscs.forEach(o=>{try{o.o.stop()}catch(e){};try{o.lfo.stop()}catch(e){}})
      try{this.drone.amb.stop()}catch(e){}
      try{this.drone.ambLfo.stop()}catch(e){}
      this.drone=null
    },500)
  }
}
