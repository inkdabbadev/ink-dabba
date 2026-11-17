import {getGame} from './store';
let ctx:AudioContext|undefined,interacted=false;
window.addEventListener('pointerdown',()=>{interacted=true},{once:true});
window.addEventListener('keydown',()=>{interacted=true},{once:true});
export function sound(kind='tap'){if(!interacted||!getGame().settings.sound)return;try{ctx??=new AudioContext();void ctx.resume();const tones:Record<string,number[]>={tap:[470],open:[392,523,659],collect:[659,880],gift:[392,494,587,784],draw:[370],place:[520,610],forest:[784,988],ambient:[261.63,392]};(tones[kind]||tones.tap).forEach((f,i)=>{const o=ctx!.createOscillator(),g=ctx!.createGain(),t=ctx!.currentTime+i*(kind==='ambient'?.4:.10);o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(kind==='ambient'?.008:.035,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+(kind==='ambient'?1.8:.24));o.connect(g).connect(ctx!.destination);o.start(t);o.stop(t+(kind==='ambient'?2:.25))})}catch{}}
export function ambient(scene:string){if(!['garden','forest','finale'].includes(scene))return()=>{};const id=setInterval(()=>sound('ambient'),7500);return()=>clearInterval(id)}
