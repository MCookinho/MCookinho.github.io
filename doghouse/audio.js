class AudioSys{
  constructor(){
    this.ctx=null;this.initialized=false
    this.volumes={sfx:0.25,amb:0.08,bg:0.06}
    this.ambients={};this.muted=false;this.drone=null
    this.t=0
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
  _now(){return this.ctx?this.ctx.currentTime:0}
  _filter(type,freq,Q){
    const f=this.ctx.createBiquadFilter()
    f.type=type||'lowpass';f.frequency.value=freq||1000;f.Q.value=Q||1
    return f
  }
  _gain(v){
    const g=this.ctx.createGain()
    g.gain.value=v||0
    return g
  }
  _noiseBuf(dur){
    const sr=this.ctx.sampleRate,len=Math.floor(sr*dur)
    const buf=this.ctx.createBuffer(1,len,sr),d=buf.getChannelData(0)
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1
    return buf
  }
  _playNoise(dur,gain,filterOpts,slideGain){
    const s=this.ctx.createBufferSource();s.buffer=this._noiseBuf(dur)
    const g=this._gain(0);const chain=[g]
    if(filterOpts){const f=this._filter(filterOpts.t,filterOpts.f,filterOpts.Q);g.connect(f);chain.push(f)}
    chain[chain.length-1].connect(this.ctx.destination)
    const t=this._now()
    g.gain.setValueAtTime((gain||0.1)*this.volumes.sfx,t)
    if(slideGain)g.gain.exponentialRampToValueAtTime(slideGain*this.volumes.sfx,t+dur)
    else g.gain.exponentialRampToValueAtTime(0.001,t+dur)
    s.connect(chain[0]);s.start(t);s.stop(t+dur)
    return s
  }
  _tone(freq,type,dur,gain,slideFreq,slideGain){
    const o=this.ctx.createOscillator()
    o.type=type||'sine'
    const g=this._gain(0);const t=this._now()
    o.frequency.setValueAtTime(freq,t)
    if(slideFreq)o.frequency.linearRampToValueAtTime(slideFreq,t+dur)
    g.gain.setValueAtTime((gain||0.1)*this.volumes.sfx,t)
    if(slideGain)g.gain.linearRampToValueAtTime(slideGain*this.volumes.sfx,t+dur)
    else g.gain.exponentialRampToValueAtTime(0.001,t+dur)
    o.connect(g);g.connect(this.ctx.destination)
    o.start(t);o.stop(t+dur)
    return o
  }
  _reverb(signal,gain,decay){
    const dry=this._gain(1);const wet=this._gain(0)
    signal.connect(dry);signal.connect(wet)
    const t=this._now()
    wet.gain.setValueAtTime(gain||0.3,t)
    const fb=this.ctx.createGain();fb.gain.value=0.5
    const delay=this.ctx.createDelay(1);delay.delayTime.value=0.08
    wet.connect(delay);delay.connect(fb);fb.connect(delay)
    fb.connect(this.ctx.destination)
    dry.connect(this.ctx.destination)
  }
  _impact(dur,filterFreq,filterQ,noiseGain,toneFreq,toneGain){
    this._playNoise(dur*0.3,noiseGain,{t:'lowpass',f:filterFreq,Q:filterQ})
    if(toneFreq)this._tone(toneFreq,'sine',dur,toneGain,undefined,0.001)
  }

  /* ---- realistic sound effects ---- */
  click(){
    const t=this._now()
    this._playNoise(0.02,0.06,{t:'highpass',f:2000,Q:2})
    this._tone(1200,'sine',0.04,0.08,800,0.001)
  }
  pickup(){
    const t=this._now()
    this._playNoise(0.05,0.08,{t:'bandpass',f:1500,Q:4})
    this._tone(800,'sine',0.08,0.12,1400,0.001)
    this._tone(1400,'sine',0.12,0.06,1800,0.001)
  }
  wrong(){
    this._playNoise(0.15,0.1,{t:'lowpass',f:300,Q:2})
    this._tone(180,'sawtooth',0.2,0.1,80,0.001)
  }
  unlock(){
    const t=this._now()
    this._playNoise(0.15,0.08,{t:'bandpass',f:800,Q:6})
    this._tone(600,'triangle',0.1,0.1,800,0.001)
    setTimeout(()=>{
      this._playNoise(0.1,0.06,{t:'bandpass',f:1000,Q:4})
      this._tone(900,'sine',0.15,0.08,1200,0.001)
    },150)
  }
  door(){
    const t=this._now()
    this._playNoise(0.3,0.12,{t:'lowpass',f:400,Q:2},0.02)
    this._tone(120,'sine',0.35,0.15,80,0.001)
    this._playNoise(0.08,0.04,{t:'highpass',f:3000,Q:2},0.01)
  }
  step(){
    this._playNoise(0.06,0.04,{t:'bandpass',f:200,Q:3})
    this._playNoise(0.03,0.02,{t:'highpass',f:4000,Q:2})
  }
  key(){
    const t=this._now()
    this._tone(1800,'sine',0.3,0.12,1600,0.001)
    this._tone(2400,'sine',0.2,0.08,2200,0.001)
    this._tone(1200,'sine',0.4,0.06,1100,0.002)
    this._playNoise(0.03,0.04,{t:'highpass',f:3000,Q:6})
  }
  paper(){
    this._playNoise(0.15,0.04,{t:'bandpass',f:3000,Q:3},0.005)
    this._playNoise(0.08,0.03,{t:'highpass',f:5000,Q:2},0.002)
  }
  shiva(){
    const t=this._now()
    this._tone(55,'sawtooth',2,0.12,40,0.02)
    this._tone(110,'sine',1.5,0.06,90,0.01)
    this._playNoise(2,0.06,{t:'lowpass',f:200,Q:2},0.005)
    this._tone(880,'sine',0.5,0.04,990,0.001)
  }
  radio(freq){
    this._playNoise(0.15,0.05,{t:'bandpass',f:(freq||400),Q:20},0.005)
    if(freq)this._tone(freq,'sine',0.2,0.08,freq*1.02,0.001)
  }
  clock(){
    const t=this._now()
    this._playNoise(0.04,0.06,{t:'bandpass',f:2000,Q:10})
    this._tone(400,'triangle',0.3,0.1,600,0.001)
    setTimeout(()=>{
      this._playNoise(0.03,0.04,{t:'bandpass',f:1500,Q:8})
      this._tone(350,'sine',0.2,0.06,500,0.001)
    },200)
    setTimeout(()=>this._tone(600,'sine',0.5,0.06,800,0.001),400)
  }
  heart(){
    this._tone(180,'sine',0.2,0.1,220,0.001)
    setTimeout(()=>this._tone(200,'sine',0.2,0.08,240,0.001),250)
  }
  chime(){
    const t=this._now();const notes=[880,1100,1320,1760]
    notes.forEach((f,i)=>{
      const d=0.8-i*0.1
      this._tone(f,'sine',d,0.12-i*0.02,f*1.005,0.002)
    })
    this._playNoise(0.02,0.03,{t:'highpass',f:4000,Q:4})
  }
  candle(){
    this._playNoise(0.2,0.04,{t:'bandpass',f:600,Q:3},0.008)
    this._tone(200,'sine',0.1,0.03,300,0.001)
  }
  grave(){
    this._playNoise(0.5,0.1,{t:'lowpass',f:150,Q:3},0.01)
    this._tone(80,'sawtooth',0.5,0.1,50,0.001)
  }
  water(){
    this._playNoise(0.6,0.06,{t:'bandpass',f:500,Q:3},0.01)
    this._playNoise(0.4,0.04,{t:'bandpass',f:1200,Q:4},0.005)
  }
  wind(){
    this._playNoise(1.5,0.04,{t:'lowpass',f:300,Q:2},0.008)
  }
  crow(){
    this._tone(500,'square',0.12,0.08,400,0.001)
    setTimeout(()=>this._tone(350,'square',0.15,0.06,280,0.001),150)
    this._playNoise(0.1,0.03,{t:'highpass',f:2000,Q:2})
  }
  bell(){
    const notes=[600,750,900,1200]
    notes.forEach((f,i)=>{
      const d=1.2-i*0.15
      this._tone(f,'sine',d,0.1-i*0.015,f*1.003,0.002)
    })
    this._playNoise(0.03,0.02,{t:'highpass',f:5000,Q:4})
  }
  final(){
    const t=this._now()
    this._tone(400,'triangle',2.5,0.15,800,0.01)
    this._tone(600,'sine',2,0.08,1000,0.005)
    this._playNoise(2,0.05,{t:'lowpass',f:500,Q:3},0.003)
  }

  /* ---- procedural ambient drone ---- */
  startDrone(sceneId){
    if(!this.ctx||this.muted)return
    this.stopDrone()
    const scenes={
      cellar:{f1:55,f2:62,f3:72,type:'sawtooth'},kitchen:{f1:65,f2:73,f3:82,type:'sine'},
      church:{f1:110,f2:123,f3:137,type:'sine'},graveyard:{f1:49,f2:55,f3:62,type:'sawtooth'},
      mansion:{f1:98,f2:110,f3:123,type:'sine'},library:{f1:73,f2:82,f3:92,type:'triangle'},
      tower:{f1:130,f2:147,f3:165,type:'triangle'},tunnel:{f1:41,f2:49,f3:55,type:'sawtooth'},
      default:{f1:45,f2:55,f3:65,type:'sine'}
    }
    const cfg=scenes[sceneId]||scenes.default
    const oscs=[];const lfos=[]
    for(let i=0;i<3;i++){
      const f=cfg.f1*(1+i*0.15)+(Math.random()-0.5)*2
      const o=this.ctx.createOscillator()
      o.type=cfg.type
      o.frequency.value=f
      const g=this._gain(0.008*this.volumes.bg)
      const lfo=this.ctx.createOscillator()
      lfo.type='sine';lfo.frequency.value=0.1+Math.random()*0.3
      const lfoG=this.ctx.createGain();lfoG.gain.value=f*0.02
      lfo.connect(lfoG);lfoG.connect(g.gain);lfo.start()
      o.connect(g);g.connect(this.ctx.destination);o.start()
      oscs.push({o,g,baseF:f});lfos.push(lfo)
    }
    const ambient=this.ctx.createBufferSource()
    ambient.buffer=this._noiseBuf(8)
    ambient.loop=true
    const ambG=this._gain(0.02*this.volumes.amb)
    const ambF=this._filter('lowpass',200+Math.random()*200,1.5)
    const ambLfo=this.ctx.createOscillator()
    ambLfo.type='sine';ambLfo.frequency.value=0.05
    const ambLfoG=this.ctx.createGain();ambLfoG.gain.value=80
    ambLfo.connect(ambLfoG);ambLfoG.connect(ambF.frequency);ambLfo.start()
    ambient.connect(ambF);ambF.connect(ambG);ambG.connect(this.ctx.destination)
    ambient.start()
    this.drone={oscs,lfos,ambient,ambF,ambG,ambLfo}
  }
  stopDrone(){
    if(!this.drone)return
    this.drone.oscs.forEach(o=>{try{o.o.stop()}catch(e){}})
    this.drone.lfos.forEach(l=>{try{l.stop()}catch(e){}})
    try{this.drone.ambient.stop()}catch(e){}
    try{this.drone.ambLfo.stop()}catch(e){}
    this.drone=null
  }
  startAmbient(id,freq,type){
    if(!this.ctx||this.muted)return
    if(this.ambients[id]){this.stopAmbient(id)}
    const o=this.ctx.createOscillator()
    const g=this.ctx.createGain()
    o.type=type||'sine'
    o.frequency.setValueAtTime(freq||200,this.ctx.currentTime)
    g.gain.setValueAtTime(this.volumes.amb,this.ctx.currentTime)
    o.connect(g);g.connect(this.ctx.destination)
    o.start()
    this.ambients[id]={osc:o,gain:g}
  }
  stopAmbient(id){
    if(this.ambients[id]){
      try{this.ambients[id].osc.stop()}catch(e){}
      delete this.ambients[id]
    }
  }
  stopAll(){
    Object.keys(this.ambients).forEach(k=>this.stopAmbient(k))
    this.stopDrone()
  }
}
