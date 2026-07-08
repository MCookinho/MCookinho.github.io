class AudioSys{
  constructor(){
    this.ctx=null;this.initialized=false
    this.volumes={sfx:0.3,amb:0.15,bg:0.08}
    this.ambients={}
    this.muted=false
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
  _osc(freq,type,dur,gain,slide){
    if(!this.ctx||this.muted)return
    const o=this.ctx.createOscillator()
    const g=this.ctx.createGain()
    o.type=type||'sine'
    o.frequency.setValueAtTime(freq,this.ctx.currentTime)
    if(slide)o.frequency.linearRampToValueAtTime(slide,this.ctx.currentTime+dur)
    g.gain.setValueAtTime((gain||0.3)*this.volumes.sfx,this.ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur)
    o.connect(g);g.connect(this.ctx.destination)
    o.start();o.stop(this.ctx.currentTime+dur)
  }
  _noise(dur,gain){
    if(!this.ctx||this.muted)return
    const sr=this.ctx.sampleRate,len=sr*dur
    const buf=this.ctx.createBuffer(1,len,sr)
    const d=buf.getChannelData(0)
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1
    const s=this.ctx.createBufferSource()
    s.buffer=buf
    const g=this.ctx.createGain()
    g.gain.setValueAtTime((gain||0.15)*this.volumes.sfx,this.ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur)
    s.connect(g);g.connect(this.ctx.destination)
    s.start();s.stop(this.ctx.currentTime+dur)
  }
  click(){this._osc(800,'square',0.06,0.15);this._osc(400,'triangle',0.08,0.1,200)}
  pickup(){this._osc(600,'sine',0.1,0.2,900);this._osc(900,'sine',0.15,0.1,1200)}
  wrong(){this._osc(200,'square',0.3,0.15,100)}
  unlock(){this._osc(500,'triangle',0.1,0.15,700);setTimeout(()=>this._osc(700,'triangle',0.1,0.15,900),120)}
  door(){this._osc(150,'sine',0.4,0.2)}
  step(){this._noise(0.08,0.08)}
  key(){this._osc(1000,'triangle',0.12,0.2,1400);this._osc(1200,'sine',0.08,0.1)}
  paper(){this._noise(0.2,0.05)}
  shiva(){this._osc(60,'sawtooth',1.5,0.1,40);this._noise(0.5,0.08)}
  radio(freq){this._noise(0.1,0.04);this._osc(freq||400,'triangle',0.2,0.06)}
  clock(){this._osc(300,'triangle',0.5,0.1,600);setTimeout(()=>this._osc(600,'sine',0.3,0.08,800),200)}
  heart(){this._osc(200,'sine',0.15,0.12,300);setTimeout(()=>this._osc(250,'sine',0.15,0.12,350),200)}
  chime(){this._osc(880,'sine',0.3,0.15,1200);setTimeout(()=>this._osc(1100,'sine',0.3,0.1,1400),120)}
  candle(){this._osc(300,'sine',0.1,0.06);this._noise(0.15,0.03)}
  grave(){this._osc(100,'sawtooth',0.6,0.12,80)}
  water(){this._noise(0.4,0.08)}
  wind(){this._noise(1,0.04)}
  crow(){this._osc(400,'square',0.15,0.1);setTimeout(()=>this._osc(300,'square',0.2,0.08),120)}
  bell(){this._osc(600,'sine',0.5,0.15,900);setTimeout(()=>this._osc(800,'sine',0.4,0.1,1100),300)}
  final(){this._osc(400,'triangle',2,0.2,800);this._noise(1,0.06)}
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
  }
}
