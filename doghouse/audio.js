class AudioSys{
  constructor(){
    this.ctx=null;this.initialized=false
    this.volumes={sfx:0.35,music:0.7}
    this.musicEl=null
  }
  init(){
    if(this.initialized)return
    try{
      this.ctx=new(window.AudioContext||window.webkitAudioContext)()
      this.initialized=true
      this._initMusic()
    }catch(e){}
  }
  resume(){
    if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()
    if(this.musicEl&&this.musicEl.paused){
      this.musicEl.play().catch(()=>{})
    }
  }
  _initMusic(){
    if(this.musicEl)return
    try{
      const el=document.createElement('audio')
      el.src='music.mp3'
      el.loop=true
      el.volume=this.volumes.music
      el.load()
      el.play().catch(()=>{})
      this.musicEl=el
    }catch(e){}
  }
  stopMusic(){
    if(this.musicEl){this.musicEl.pause();this.musicEl=null}
  }

  /* helpers */
  _noise(dur){
    const sr=this.ctx.sampleRate,len=Math.floor(sr*dur)
    const buf=this.ctx.createBuffer(1,len,sr),d=buf.getChannelData(0)
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1
    return buf
  }
  _buf(dur,fn){
    const sr=this.ctx.sampleRate,len=Math.floor(sr*dur)
    const buf=this.ctx.createBuffer(1,len,sr),d=buf.getChannelData(0)
    for(let i=0;i<len;i++)d[i]=fn(i/sr)
    return buf
  }
  _play(buf,gainEnv,flt){
    const t=this.ctx.currentTime
    const s=this.ctx.createBufferSource();s.buffer=buf
    const g=this.ctx.createGain()
    g.gain.setValueAtTime(0,t)
    if(typeof gainEnv==='function')gainEnv(g,t)
    else{g.gain.linearRampToValueAtTime(gainEnv||1,t+0.01);g.gain.exponentialRampToValueAtTime(0.001,t+0.5)}
    let dest=g
    if(flt){
      const f=this.ctx.createBiquadFilter()
      f.type=flt.t||'lowpass';f.frequency.value=flt.f||1000;f.Q.value=flt.Q||1
      s.connect(f);f.connect(g)
    }else{s.connect(g)}
    g.connect(this.ctx.destination)
    s.start(t);s.stop(t+buf.duration)
  }
  _os(freq,type,dur,gain,slide,flt){
    const t=this.ctx.currentTime
    const o=this.ctx.createOscillator();o.type=type||'sine'
    o.frequency.setValueAtTime(freq,t)
    if(slide)o.frequency.linearRampToValueAtTime(slide,t+dur)
    const g=this.ctx.createGain()
    g.gain.setValueAtTime(0,t)
    g.gain.linearRampToValueAtTime(gain||0.08,t+0.02)
    g.gain.exponentialRampToValueAtTime(0.001,t+dur)
    let dest=g
    if(flt){
      const f=this.ctx.createBiquadFilter()
      f.type=flt.t||'lowpass';f.frequency.value=flt.f||1000;f.Q.value=flt.Q||1
      o.connect(f);f.connect(g)
    }else{o.connect(g)}
    g.connect(this.ctx.destination)
    o.start(t);o.stop(t+dur)
  }

  /* ─── SFX ─── */
  click(){
    const t=this.ctx.currentTime
    const buf=this._noise(0.015)
    const s=this.ctx.createBufferSource();s.buffer=buf
    const g=this.ctx.createGain()
    g.gain.setValueAtTime(0.06*this.volumes.sfx,t)
    g.gain.exponentialRampToValueAtTime(0.001,t+0.015)
    const f=this.ctx.createBiquadFilter();f.type='highpass';f.frequency.value=4000
    s.connect(f);f.connect(g);g.connect(this.ctx.destination)
    s.start(t);s.stop(t+0.015)
  }
  pickup(){
    const t=this.ctx.currentTime
    const buf=this._buf(0.12,i=>Math.random()*2-1)
    const s=this.ctx.createBufferSource();s.buffer=buf
    const g=this.ctx.createGain()
    g.gain.setValueAtTime(0,t)
    g.gain.linearRampToValueAtTime(0.08*this.volumes.sfx,t+0.008)
    g.gain.exponentialRampToValueAtTime(0.001,t+0.1)
    g.gain.setValueAtTime(0.04*this.volumes.sfx,t+0.05)
    g.gain.exponentialRampToValueAtTime(0.001,t+0.12)
    const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=3
    s.connect(f);f.connect(g);g.connect(this.ctx.destination)
    this._os(1600,'triangle',0.08,0.05*this.volumes.sfx,2000)
    s.start(t);s.stop(t+0.12)
  }
  wrong(){
    this._os(120,'square',0.25,0.08*this.volumes.sfx,90,{t:'lowpass',f:400,Q:2})
    this._os(80,'square',0.3,0.06*this.volumes.sfx,70,{t:'lowpass',f:300,Q:3})
  }
  unlock(){
    const t=this.ctx.currentTime
    const buf=this._noise(0.06)
    const s=this.ctx.createBufferSource();s.buffer=buf
    const g=this.ctx.createGain()
    g.gain.setValueAtTime(0.05*this.volumes.sfx,t)
    g.gain.exponentialRampToValueAtTime(0.001,t+0.05)
    const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(3000,t);f.frequency.linearRampToValueAtTime(500,t+0.05)
    s.connect(f);f.connect(g);g.connect(this.ctx.destination)
    this._os(600,'triangle',0.06,0.06*this.volumes.sfx,750)
    setTimeout(()=>{
      this._os(400,'triangle',0.04,0.04*this.volumes.sfx,500)
      this._os(800,'sine',0.1,0.05*this.volumes.sfx,600,{t:'lowpass',f:2000})
    },80)
    s.start(t);s.stop(t+0.06)
  }
  door(){
    const buf=this._buf(0.4,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.15*this.volumes.sfx,t+0.05)
      g.gain.linearRampToValueAtTime(0.06*this.volumes.sfx,t+0.2)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.4)
    }.bind(this),{t:'lowpass',f:200,Q:2})
    this._os(100,'sine',0.4,0.06*this.volumes.sfx,60,{t:'lowpass',f:300,Q:1})
  }
  step(){
    const buf=this._buf(0.08,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.06*this.volumes.sfx,t+0.005)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.08)
    }.bind(this),{t:'bandpass',f:1500,Q:2})
    this._os(80,'sine',0.06,0.04*this.volumes.sfx,60,{t:'lowpass',f:120,Q:3})
  }
  key(){
    this._os(2000,'sine',0.02,0.03*this.volumes.sfx)
    setTimeout(()=>{this._os(2500,'sine',0.15,0.05*this.volumes.sfx,2200,{t:'lowpass',f:3000})},30)
    setTimeout(()=>{this._os(1800,'sine',0.1,0.03*this.volumes.sfx,2000)},100)
  }
  paper(){
    const buf=this._buf(0.3,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t)
      g.gain.linearRampToValueAtTime(0.08*this.volumes.sfx,t+0.01)
      g.gain.linearRampToValueAtTime(0.03*this.volumes.sfx,t+0.15)
      g.gain.linearRampToValueAtTime(0.06*this.volumes.sfx,t+0.2)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.3)
    }.bind(this),{t:'bandpass',f:3000,Q:4})
  }
  shiva(){
    const buf=this._buf(1.5,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.12*this.volumes.sfx,t+0.3)
      g.gain.setValueAtTime(0.12*this.volumes.sfx,t+0.8)
      g.gain.exponentialRampToValueAtTime(0.001,t+1.5)
    }.bind(this),{t:'lowpass',f:200,Q:3})
    this._os(40,'sawtooth',2,0.06*this.volumes.sfx,30,{t:'lowpass',f:100,Q:3})
    this._os(600,'sine',1.2,0.04*this.volumes.sfx,700,{t:'bandpass',f:800,Q:2})
    setTimeout(()=>this.whisper(),300)
  }
  bell(){
    [600,750,900,1200].forEach((f,i)=>{
      setTimeout(()=>{
        this._os(f,'sine',1.5-i*0.15,0.08*this.volumes.sfx,f*1.003,{t:'lowpass',f:f*2})
      },i*80)
    })
    const buf=this._buf(0.8,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0.04*this.volumes.sfx,t+0.4)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.8)
    }.bind(this),{t:'bandpass',f:5000,Q:2})
  }
  candle(){
    const buf=this._buf(0.2,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.05*this.volumes.sfx,t+0.02)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.2)
    }.bind(this),{t:'bandpass',f:800,Q:3})
  }
  water(){
    const buf=this._buf(0.4,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.08*this.volumes.sfx,t+0.005)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.15)
      g.gain.setValueAtTime(0.04*this.volumes.sfx,t+0.15)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.4)
    }.bind(this),{t:'bandpass',f:500,Q:4})
  }
  wind(){
    const buf=this._buf(1.5,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.1*this.volumes.sfx,t+0.5)
      g.gain.setValueAtTime(0.1*this.volumes.sfx,t+1)
      g.gain.exponentialRampToValueAtTime(0.001,t+1.5)
    }.bind(this),{t:'lowpass',f:400,Q:2})
  }
  glassBreak(){
    const t=this.ctx.currentTime
    const buf=this._buf(0.5,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.18*this.volumes.sfx,t+0.02)
      g.gain.setValueAtTime(0.08*this.volumes.sfx,t+0.1)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.5)
    }.bind(this),{t:'highpass',f:3000,Q:2})
    for(let i=0;i<5;i++){
      setTimeout(()=>{
        this._os(3000+Math.random()*4000,'sine',0.08,0.04*this.volumes.sfx,0,{t:'bandpass',f:5000,Q:8})
        const s=this._buf(0.06,j=>Math.random()*2-1)
        this._play(s,function(g,t2){
          g.gain.setValueAtTime(0.03*this.volumes.sfx,t2);g.gain.exponentialRampToValueAtTime(0.001,t2+0.06)
        }.bind(this),{t:'highpass',f:6000,Q:7})
      },i*30)
    }
    this._os(60,'sine',0.3,0.07*this.volumes.sfx,40,{t:'lowpass',f:150,Q:2})
  }
  final(){
    this._os(400,'triangle',2.5,0.1*this.volumes.sfx,800,{t:'lowpass',f:1000,Q:2})
    this._os(600,'sine',2,0.06*this.volumes.sfx,1000,{t:'lowpass',f:1200})
    const buf=this._buf(2.5,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0.06*this.volumes.sfx,t+0.5)
      g.gain.exponentialRampToValueAtTime(0.001,t+2.5)
    }.bind(this),{t:'lowpass',f:300,Q:3})
  }
  combine(){
    this._os(500,'triangle',0.12,0.07*this.volumes.sfx,700,{t:'bandpass',f:1000,Q:2})
    setTimeout(()=>this._os(800,'triangle',0.1,0.06*this.volumes.sfx,900),80)
    const buf=this._buf(0.08,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0.03*this.volumes.sfx,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08)
    }.bind(this),{t:'highpass',f:4000,Q:2})
  }
  dig(){
    const buf=this._buf(0.35,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.1*this.volumes.sfx,t+0.02)
      g.gain.linearRampToValueAtTime(0.04*this.volumes.sfx,t+0.15)
      g.gain.exponentialRampToValueAtTime(0.001,t+0.35)
    }.bind(this),{t:'lowpass',f:350,Q:3})
    this._os(70,'sine',0.3,0.04*this.volumes.sfx,60,{t:'lowpass',f:150})
  }
  chain(){
    const t=this.ctx.currentTime
    for(let i=0;i<3;i++){
      setTimeout(()=>{
        this._os(800+(i*300),'triangle',0.15,0.06*this.volumes.sfx,1200,{t:'bandpass',f:2000,Q:6})
        const buf=this._buf(0.08+i*0.03,i2=>Math.random()*2-1)
        this._play(buf,function(g,t2){
          g.gain.setValueAtTime(0.05*this.volumes.sfx,t2);g.gain.exponentialRampToValueAtTime(0.001,t2+0.1)
        }.bind(this),{t:'bandpass',f:1500+Math.random()*1000,Q:4})
      },i*120)
    }
  }
  heartbeat(){
    this._os(25,'sine',0.18,0.12*this.volumes.sfx,35,{t:'lowpass',f:60,Q:5})
    this._os(50,'sine',0.12,0.06*this.volumes.sfx,40,{t:'lowpass',f:80,Q:4})
    setTimeout(()=>{
      this._os(25,'sine',0.18,0.1*this.volumes.sfx,35,{t:'lowpass',f:60,Q:5})
      this._os(50,'sine',0.12,0.05*this.volumes.sfx,40,{t:'lowpass',f:80,Q:4})
    },350)
  }
  whisper(){
    const buf=this._buf(1.2,i=>Math.random()*2-1)
    this._play(buf,function(g,t){
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.04*this.volumes.sfx,t+0.3)
      g.gain.linearRampToValueAtTime(0.01*this.volumes.sfx,t+0.6)
      g.gain.linearRampToValueAtTime(0.03*this.volumes.sfx,t+0.9)
      g.gain.exponentialRampToValueAtTime(0.001,t+1.2)
    }.bind(this),{t:'bandpass',f:2500,Q:6})
  }

  /* ─── MUSIC ─── */
  startDrone(){}
  stopDrone(){}
}
