const FORM="https://docs.google.com/forms/d/e/1FAIpQLSfFGzuXPdOCvgnELu4k9uds_at8dv8hEFEkWyOQ2qmUTgq6cQ/viewform";

const Q=[
["Sampling Basics","Sampling converts a continuous-time signal into samples at discrete time instants.","What is the main purpose of sampling?",["Convert continuous-time signal into discrete-time samples","Increase noise","Remove the carrier","Amplify the signal"],0],
["Sampling Frequency","Sampling frequency fs is the number of samples taken per second.","8000 samples are taken every second. What is fs?",["800 Hz","8 kHz","80 kHz","4 kHz"],1],
["Nyquist Rate","For highest frequency fm, the Nyquist rate is 2fm.","A signal has highest frequency 4 kHz. Its Nyquist rate is:",["2 kHz","4 kHz","8 kHz","16 kHz"],2],
["Nyquist Criterion","To avoid aliasing, the sampling frequency should be at least twice the highest frequency.","Which condition satisfies the basic Nyquist criterion?",["fs < fm","fs = fm/2","fs ≥ 2fm","fs = 0"],2],
["Sampling Calculation","Minimum sampling frequency is fs(min)=2fm.","For fm = 10 kHz, the minimum sampling frequency is:",["5 kHz","10 kHz","20 kHz","40 kHz"],2],
["Aliasing","Aliasing occurs when sampling is below the required rate and spectral components overlap.","Aliasing is mainly caused by:",["Oversampling","Undersampling","Reconstruction","Increasing amplitude"],1],
["Aliasing Consequence","Aliasing creates incorrect frequency representation and distortion.","A major consequence of aliasing is:",["Frequency distortion","Perfect reconstruction","Zero sampling error","Higher bandwidth"],0],
["Anti-Aliasing Filter","An anti-aliasing low-pass filter limits input bandwidth before sampling.","Where is the anti-aliasing filter placed?",["After DAC only","Before the sampler","Inside the speaker","After antenna only"],1],
["Highest Frequency","The highest frequency component determines the required Nyquist rate.","A signal contains 1, 3 and 7 kHz components. Which determines its Nyquist rate?",["1 kHz","3 kHz","7 kHz","Average frequency"],2],
["Discrete-Time Signal","A discrete-time signal is defined at discrete instants and is commonly written x[n].","Which notation represents a discrete-time sequence?",["x(t)","x[n]","X(f)","H(t)"],1],
["Sampling Period","Sampling period Ts is the time between samples: Ts=1/fs.","If fs=10 kHz, what is Ts?",["0.1 ms","1 ms","10 ms","100 ms"],0],
["Nyquist Calculation","Choosing fs above 2fm gives a practical sampling margin.","For fm=15 kHz, which definitely satisfies Nyquist?",["20 kHz","25 kHz","30 kHz","40 kHz"],3],
["Undersampling","Undersampling uses a sampling frequency below the required value.","If fm=6 kHz and fs=8 kHz, the signal is:",["Oversampled","Undersampled","Not sampled","Quantized"],1],
["Oversampling","Oversampling means sampling faster than the minimum required rate.","For fm=5 kHz, which is an oversampling choice?",["5 kHz","8 kHz","10 kHz","25 kHz"],3],
["Reconstruction","A reconstruction low-pass filter recovers the analog waveform when sampling conditions are satisfied.","Which is associated with reconstruction after sampling?",["Reconstruction low-pass filter","Anti-aliasing filter before ADC","Battery","Mixer only"],0],
["Sampling Spectrum","Sampling creates repeated spectral copies at multiples of the sampling frequency.","Spectral replicas are separated by:",["fm","fs","2fm only","DC"],1],
["Aliasing Prevention","Limiting input bandwidth and choosing adequate fs helps prevent aliasing.","Which combination helps prevent aliasing?",["Low-pass filtering + adequate fs","Lower fs + noise","Higher amplitude","Removing sampler"],0],
["Quantization Introduction","Quantization maps each sampled amplitude to one of a finite number of allowed levels.","Quantization primarily discretizes the:",["Amplitude","Time axis only","Carrier frequency","Antenna size"],0],
["Quantization Levels","For n-bit quantization, L=2^n levels.","How many levels are available in an 8-bit quantizer?",["8","16","128","256"],3],
["Quantization Error","Quantization error is the difference between a sampled amplitude and its quantized value.","Quantization error is mainly due to:",["Amplitude approximation/rounding","Changing antenna height","Carrier generation","Increasing sampling frequency alone"],0]
];

const s={name:"",roll:"",score:0,lives:3,done:0,x:90,y:0,vy:0,jump:false,left:false,right:false,question:false,answered:false,monsters:[],camera:0,running:false};

const $=id=>document.getElementById(id);
const start=$("start"),game=$("game"),result=$("result");

function show(el){[start,game,result].forEach(x=>x.classList.remove("active"));el.classList.add("active")}
function beep(f=500,d=.07,type="sine"){try{const A=new AudioContext(),o=A.createOscillator(),g=A.createGain();o.frequency.value=f;o.type=type;g.gain.value=.035;o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+d)}catch(e){}}
function toast(t){$("toast").textContent=t;$("toast").classList.remove("hidden");clearTimeout(toast.t);toast.t=setTimeout(()=>$("toast").classList.add("hidden"),1500)}
function hud(){$("hudName").textContent=s.name;$("hudScore").textContent=s.score;$("hudLives").textContent=s.lives;$("hudProgress").textContent=`${s.done}/20`;$("barFill").style.width=`${s.done*5}%`}
function startGame(){
 s.name=$("name").value.trim();s.roll=$("roll").value.trim();
 if(!s.name||!s.roll){alert("Please enter your name and roll number.");return}
 s.score=0;s.lives=3;s.done=0;s.x=90;s.y=0;s.vy=0;s.jump=false;s.left=false;s.right=false;s.question=false;s.answered=false;s.running=true;
 $("studentPopup").classList.add("hidden");$("playerTag").textContent=s.name;show(game);build();hud();requestAnimationFrame(loop);toast("🚀 Mission started! Find the first 📡");beep(700,.12)
}
function build(){
 $("objects").innerHTML="";s.monsters=[];
 const spacing=240;
 Q.forEach((_,i)=>{let d=document.createElement("div");d.className="checkpoint";d.id="cp"+i;d.textContent="📡";d.dataset.label=`MISSION ${i+1}`;d.style.left=(180+i*spacing)+"px";$("objects").appendChild(d)});
 [600,1080,1560,2040,2520,3000,3480,3960].forEach((x,i)=>{let d=document.createElement("div");d.className="monster";d.textContent=["👾","🤖","👹","👻"][i%4];d.style.left=x+"px";$("objects").appendChild(d);s.monsters.push({el:d,x,dead:false})});
 $("castle").classList.add("locked");$("castleText").textContent="🔒 20 missions required";s.camera=0;camera()
}
function width(){return 180+19*240+500}
function camera(){let vw=$("viewport").clientWidth;s.camera=Math.max(0,Math.min(s.x-vw*.35,width()-vw));$("world").style.transform=`translateX(${-s.camera}px)`;$("player").style.left=(s.x-s.camera)+"px"}
function player(){camera();$("player").style.transform=`translateY(${s.y}px)`}
function jump(){if(!s.running||s.question||s.jump)return;s.jump=true;s.vy=-14;beep(550,.05)}
function attack(){if(!s.running||s.question)return;let hit=false;s.monsters.forEach(m=>{if(!m.dead&&Math.abs(s.x-m.x)<85){m.dead=true;m.el.classList.add("dead");s.score+=20;hit=true;toast("⚡ Monster defeated! +20");beep(180,.1,"square")}});if(!hit)beep(240,.04,"square");hud()}
function near(a,b,n=60){return Math.abs(a-b)<n}
function check(){
 if(s.done<20){let cp=$("cp"+s.done);let cx=parseFloat(cp.style.left);if(near(s.x,cx,65))openQ(s.done)}
 s.monsters.forEach(m=>{if(!m.dead&&near(s.x,m.x,38)){m.dead=true;m.el.classList.add("dead");s.lives--;hud();toast("💥 Monster hit! -1 life");beep(120,.12,"sawtooth");if(s.lives<=0)finish(false)}})
 if(s.done===20&&near(s.x,width()-150,110))finish(true)
}
function openQ(i){if(s.question)return;s.question=true;s.answered=false;let q=Q[i];$("qnum").textContent=`MISSION ${i+1}/20`;$("qtitle").textContent="📡 "+q[0];$("concept").textContent=q[1];$("qtext").textContent=q[2];$("answers").innerHTML="";$("feedback").textContent="";$("feedback").className="";$("continue").classList.add("hidden");q[3].forEach((a,k)=>{let b=document.createElement("button");b.className="answer";b.textContent=String.fromCharCode(65+k)+". "+a;b.onclick=()=>answer(k);$("answers").appendChild(b)});$("question").classList.remove("hidden");beep(600,.06)}
function answer(k){if(s.answered)return;s.answered=true;let q=Q[s.done],bs=[...$("answers").children];bs.forEach((b,i)=>{b.classList.add("off");if(i===q[4])b.classList.add("correct");if(i===k&&i!==q[4])b.classList.add("wrong")});if(k===q[4]){s.score+=10;$("feedback").textContent="✅ Correct! Signal restored. +10";$("feedback").className="good";beep(900,.1)}else{s.lives--;$("feedback").textContent="❌ Correct answer: "+String.fromCharCode(65+q[4])+". "+q[3][q[4]];$("feedback").className="bad";beep(140,.13,"sawtooth")}hud();$("continue").classList.remove("hidden")}
function next(){if(!s.answered)return;$("cp"+s.done).classList.add("cleared");s.done++;s.question=false;$("question").classList.add("hidden");if(s.lives<=0){finish(false);return}if(s.done===20){$("castle").classList.remove("locked");$("castleText").textContent="🔓 Reach the castle!";toast("🏰 Castle unlocked!");beep(1000,.12)}else toast(`Mission ${s.done}/20 cleared!`);hud()}
function finish(win){if(!s.running)return;s.running=false;s.question=false;$("question").classList.add("hidden");if(win&&s.done===20)s.score+=50;let status=win&&s.done===20?"QUEST COMPLETE":"MISSION ENDED";$("rName").textContent=s.name;$("rRoll").textContent=s.roll;$("rScore").textContent=s.score;$("rMissions").textContent=`${s.done}/20`;$("rLives").textContent=s.lives;$("rStatus").textContent=status;$("resultTitle").textContent=status==="QUEST COMPLETE"?"QUEST COMPLETE!":"MISSION ENDED";$("resultMsg").textContent=status==="QUEST COMPLETE"?"🏆 The Signal Kingdom is safe! You restored the communication network. +50 completion bonus.":"Review the concepts and try again to improve your mission score.";show(result);beep(win?1100:160,.14,win?"sine":"sawtooth")}
function copy(){let t=`COMMUNICATION QUEST – S5 ECE RESULT\nStudent Name: ${s.name}\nRoll / Register Number: ${s.roll}\nFinal Score: ${s.score}\nCheckpoints Completed: ${s.done}/20\nLives Remaining: ${s.lives}\nMission Status: ${$("rStatus").textContent}`;navigator.clipboard?.writeText(t).then(()=>{$("copied").textContent="✅ Result copied."}).catch(()=>{$("copied").textContent="Copy failed — please use the form manually."})}
function loop(){if(!s.running)return;if(s.jump){s.vy+=.75;s.y+=s.vy;if(s.y>=0){s.y=0;s.vy=0;s.jump=false}}if(!s.question){if(s.left)s.x-=6;if(s.right)s.x+=6;s.x=Math.max(20,Math.min(s.x,width()-80));check()}player();requestAnimationFrame(loop)}

$("enter").onclick=()=>$("studentPopup").classList.remove("hidden");$("closePopup").onclick=()=>$("studentPopup").classList.add("hidden");$("launch").onclick=startGame;
$("guide").onclick=()=>$("guideModal").classList.remove("hidden");$("closeGuide").onclick=()=>$("guideModal").classList.add("hidden");$("gameHelp").onclick=()=>$("guideModal").classList.remove("hidden");
$("continue").onclick=next;$("qclose").onclick=()=>{if(!s.answered)toast("Answer the mission to continue.")};$("copy").onclick=copy;$("form").onclick=()=>window.open(FORM,"_blank");$("again").onclick=()=>show(start);
window.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp","Space"].includes(e.code))e.preventDefault();if(e.code==="ArrowLeft"||e.code==="KeyA")s.left=true;if(e.code==="ArrowRight"||e.code==="KeyD")s.right=true;if(["ArrowUp","KeyW","Space"].includes(e.code))jump();if(e.code==="KeyX")attack()});
window.addEventListener("keyup",e=>{if(e.code==="ArrowLeft"||e.code==="KeyA")s.left=false;if(e.code==="ArrowRight"||e.code==="KeyD")s.right=false});
document.querySelectorAll(".mobile button").forEach(b=>{let k=b.dataset.k;let down=e=>{e.preventDefault();if(k==="left")s.left=true;if(k==="right")s.right=true;if(k==="jump")jump();if(k==="attack")attack()};let up=e=>{e.preventDefault();if(k==="left")s.left=false;if(k==="right")s.right=false};b.addEventListener("touchstart",down,{passive:false});b.addEventListener("touchend",up,{passive:false});b.addEventListener("mousedown",down);b.addEventListener("mouseup",up);b.addEventListener("mouseleave",up)});
window.addEventListener("resize",()=>{if(s.running)player()});
