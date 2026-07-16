/* NS Interview Prep — Fixed & Polished */
const SB_URL='https://wfhteolnlrwbquxndvqs.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHRlb2xubHJ3YnF1eG5kdnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTQwMjEsImV4cCI6MjA5OTczMDAyMX0.2FBhcHGDS2-zfqrGVHWOy5GzN0fE_RKtDQw5rRgv81I';
const sb=window.supabase.createClient(SB_URL,SB_KEY);
const RENDER_URL='https://smart-prep-x8ce.onrender.com';

const S={
  screen:'auth',user:null,profile:null,name:'',field:'',fieldLabel:'',
  mode:'male',cvData:null,company:'',scheduleMode:false,
  conversation:[],currentQ:0,totalQ:8,phase:'idle',
  isListening:false,isSpeaking:false,serverUp:false,ending:false,
  micStream:null,audioCtx:null,analyser:null,animId:null,
  silenceT:null,maxT:null,finalTxt:'',interimTxt:'',
  currentIV:null,teamIdx:0,
  mtStream:null,mtCtx:null,mtAn:null,mtAnim:null,
  sessions:[],completions:[],
  vidStream:null,mediaRecorder:null,vidChunks:[],isRecording:false,currentSessionId:null
};

const FL={electrical:'Electrical Engineering',mechanical:'Mechanical Engineering',mining:'Mining Engineering',civil:'Civil Engineering',computer:'Computer Engineering',chemical:'Chemical Engineering',petroleum:'Petroleum Engineering',aerospace:'Aerospace Engineering',agricultural:'Agricultural Engineering',biomedical:'Biomedical Engineering',geomatic:'Geomatic Engineering',materials:'Materials Engineering'};
const FK={electrical:['circuit','voltage','current','power','transformer','motor','generator','pcb','plc','relay','wiring','solar','inverter','grid','substation','earthing','switchgear'],mechanical:['cad','thermodynamics','fluid','machine','design','manufacturing','welding','lathe','milling','turbine','pump','bearing','gear','stress','strain','fatigue'],mining:['excavation','drilling','blasting','ore','mineral','tailings','ventilation','shaft','slope','geology','rock','gold','underground','surface','survey'],civil:['concrete','steel','structure','foundation','survey','highway','drainage','soil','beam','column','slab','load','reinforcement','construction','site'],computer:['programming','software','hardware','microcontroller','embedded','algorithm','database','network','python','java','c++','iot','sensor','firmware','linux','arduino'],chemical:['reaction','process','distillation','heat transfer','mass transfer','piping','reactor','catalyst','polymer','fluid flow','thermodynamics','separation','plant','safety'],petroleum:['reservoir','drilling','production','refining','crude','well','pipeline','exploration','formation','gas','oil','upstream','downstream'],aerospace:['aerodynamics','propulsion','structure','flight','aircraft','engine','turbine','lift','drag','composites','avionics','simulation'],agricultural:['irrigation','soil','crop','machinery','processing','farm','tractor','harvest','post-harvest','drainage','greenhouse','yield'],biomedical:['medical','device','implant','biomaterial','prosthetic','diagnostic','tissue','clinical','sterilization','regulatory','signal','imaging'],geomatic:['gis','survey','gps','remote sensing','mapping','cartography','geodesy','photogrammetry','lidar','spatial','coordinate'],materials:['metallurgy','composite','polymer','ceramic','corrosion','heat treatment','alloy','microstructure','testing','characterization']};

const SP={male:{name:'Mr. Osei',gender:'male',pitch:0.85,rate:0.90,role:'Senior Engineer',focus:null,color:'#e8a023'},female:{name:'Ms. Amoako',gender:'female',pitch:1.12,rate:0.94,role:'HR Manager',focus:null,color:'#e8a023'}};
const TM=[{name:'Ama Darko',role:'HR Coordinator',focus:'behavioral',color:'#3b82f6',pitch:1.10,rate:0.95,gender:'female',intro:"Good day. I'm Ama Darko, HR Coordinator. I'll be asking you about your background and teamwork."},{name:'Mr. Osei',role:'Technical Lead',focus:'technical',color:'#e8a023',pitch:0.84,rate:0.89,gender:'male',intro:"I'm Mr. Osei, Technical Lead. I'll be assessing your technical knowledge and problem-solving."},{name:'Dr. Mensah',role:'Project Manager',focus:'cv_project',color:'#8b5cf6',pitch:0.95,rate:0.92,gender:'male',intro:"I'm Dr. Mensah. I'll focus on your projects, experience, and how you apply your knowledge."},{name:'Eng. Boateng',role:'Senior Engineer',focus:'scenario',color:'#22c55e',pitch:0.88,rate:0.87,gender:'male',intro:"I'm Engineer Boateng. I'll present you with real engineering scenarios to assess your judgement."}];

const FU={project:["Walk me through the technical approach for that project.","What was the most challenging aspect of that project?","What specific role did you play in the team?","If you could redo one aspect of that project, what would it be?","What tools and methods did you use, and why did you choose them?"],internship:["What specific technical tasks were you responsible for during that attachment?","How did the practical experience connect with what you learned in the classroom?","Can you describe a specific moment where you applied theory to a real problem?","What feedback did your supervisor give you about your performance?"],teamwork:["Can you give me a specific example of how you resolved a disagreement in that team?","How do you handle a team member who is not contributing their fair share?","In your experience, what is the most critical factor for effective teamwork?"],leadership:["How would you describe your leadership style?","Tell me about a time you had to motivate a group that was struggling.","What do you think is the difference between a good manager and a good leader?"],challenge:["Looking back, what would you do differently?","How did you manage the pressure during that period?","What did that experience teach you about yourself?"],skills:["Which of your technical skills do you consider your strongest, and why?","How have you continued to develop your skills outside of formal coursework?","Are there any specific skills you are actively working to improve right now?"],motivation:["What specifically drew you to this field of engineering?","Where do you see yourself professionally in five years?","What do you hope to contribute during your national service?"],academic:["Which courses from your program do you think will be most relevant in industry, and why?","Tell me about your final year project or dissertation.","How did you approach a particularly difficult course or subject?"]};

const PIV={project:"Tell me about a significant engineering project you have worked on.",internship:"Have you done any industrial attachment or internship? Tell me about it.",teamwork:"Share an experience where you worked effectively as part of a team.",leadership:"Have you ever been in a leadership or supervisory role? Tell me about it.",challenge:"Describe a significant challenge you faced and how you overcame it.",skills:"What technical skills have you developed that you are most proud of?",motivation:"What motivates you to pursue a career in engineering?",academic:"Which aspects of your coursework will be most useful when you enter industry?"};
const SCN={electrical:["A three-phase motor keeps tripping its circuit breaker shortly after startup. Walk me through your diagnostic approach step by step.","A client wants to upgrade their facility from single-phase to three-phase power supply. What key factors do you assess?"],mechanical:["A centrifugal pump in a processing plant is vibrating excessively. How would you systematically investigate this problem?","You need to select a bearing for a high-speed rotating shaft. What factors guide your selection?"],mining:["You are asked to assess slope stability at a new open-pit site. Walk me through your approach.","After a blast, there is significantly more flyrock than anticipated. How do you investigate and prevent recurrence?"],civil:["You inspect a freshly poured concrete structure and notice surface cracking. What are your immediate steps?","A newly constructed road has serious drainage problems after the first rainy season. How do you diagnose and fix this?"],computer:["An embedded system is behaving erratically in the field but works fine in the lab. How do you debug this?","You need to connect a network of sensors across a factory floor to a central monitoring dashboard. Describe your architecture."],chemical:["A reactor's yield has dropped unexpectedly over three weeks. How do you troubleshoot this systematically?","You are selecting materials for a new piping system handling corrosive chemicals. What considerations guide your decision?"],petroleum:["A production well's output rate has dropped significantly over two months. What steps do you take to investigate?","How would you approach minimizing the environmental impact of operations at a production site?"],aerospace:["A structural component fails at 80% of its expected load during testing. How do you investigate the failure?","You are selecting a composite material for an interior aircraft panel. What properties do you prioritize?"],agricultural:["An irrigation system is underperforming and crop yields are below expectation. How do you assess and fix this?","Describe how you would design an intervention to reduce post-harvest losses for a specific staple crop."],biomedical:["A medical device fails sterilization validation. What are your next steps?","You are choosing a biomaterial for a long-term implant. What biocompatibility and mechanical properties are critical?"],geomatic:["Your GPS survey is giving inconsistent results across a site. What do you check and how do you resolve it?","You need to produce a topographic map of a site with dense forest cover. What methods and tools do you use?"],materials:["A metal component in a machine is failing prematurely through fracture. How do you investigate the failure mode?","You need to specify a heat treatment process for a steel shaft to achieve high surface hardness with a tough core. What process do you recommend?"]};
const FTQ={electrical:["Explain the difference between a relay and a contactor, and when you would use each.","How would you design the power distribution layout for a small manufacturing facility?"],mechanical:["What factors do you consider when selecting a bearing for a specific application?","Compare soldering, brazing, and welding — when is each technique most appropriate?"],mining:["What are the key factors that determine open-pit slope stability?","Describe the main stages of mineral processing after ore is extracted."],civil:["What tests would you specify for concrete before it is used in a structural application?","Explain the difference between shallow and deep foundations and when each is used."],computer:["What is the fundamental difference between a microprocessor and a microcontroller?","Walk me through your approach to debugging a malfunctioning embedded system."],chemical:["Compare batch and continuous processing — what are the trade-offs?","Name three types of heat exchangers and describe the application each is suited for."],petroleum:["Explain the difference between upstream, midstream, and downstream in the oil and gas industry.","What is enhanced oil recovery, and what are the main techniques used?"],aerospace:["Name and explain the four fundamental forces acting on an aircraft in flight.","What are the key considerations when certifying a new aircraft design for airworthiness?"],agricultural:["How would you design an irrigation scheme for a 10-hectare smallholder farm?","What post-harvest technologies are most effective for reducing losses in cereal crops?"],biomedical:["What key considerations guide the design and development of a medical device?","Explain the concept of biocompatibility and why it matters for implantable devices."],geomatic:["How does differential GPS improve the accuracy of a survey?","What are the main sources of error in a large-scale surveying project and how do you mitigate them?"],materials:["Explain the factors you consider when selecting a material for a structural application.","What is the purpose of annealing and how does it change the properties of a metal?"]};
const Q_ARC=['intro','cv_based','technical','behavioral','cv_based','technical','scenario','closing'];

const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function pk(a){return a[Math.floor(Math.random()*a.length)]}
function sl(ms){return new Promise(r=>setTimeout(r,ms))}
function gtg(){const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function isSC(){return window.isSecureContext||location.protocol==='https:'||['localhost','127.0.0.1','[::1]'].includes(location.hostname)}

function getAPI(){
  const inp=($('#inp-srv')?.value||'').trim();if(inp)return inp.replace(/\/+$/,'');
  const saved=localStorage.getItem('ns_api_url');if(saved)return saved.replace(/\/+$/,'');
  if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))return 'http://localhost:3000';
  return RENDER_URL;
}
function toast(msg,t='info'){const e=document.createElement('div');e.className=`toast toast-${t}`;e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}

// ===== PARTICLES =====
function mkP(){const c=$('#ptc');for(let i=0;i<15;i++){const p=document.createElement('div');p.className='pt';const sz=2+Math.random()*2.5;Object.assign(p.style,{left:Math.random()*100+'%',width:sz+'px',height:sz+'px',animationDuration:(20+Math.random()*30)+'s',animationDelay:(Math.random()*25)+'s','--po':(0.03+Math.random()*0.07).toString()});c.appendChild(p)}}

// ===== SCREENS =====
function showScreen(n){
  // Clean up media/speech when leaving interview
  if(S.screen==='interview'&&n!=='interview'){tts.stop();stopViz()}
  $$('.scr').forEach(s=>s.classList.remove('on'));
  $(`#s-${n}`).classList.add('on');S.screen=n;
  const nv=$('#navbar');
  nv.classList.toggle('hidden',['auth','interview','results'].includes(n));
  if(!['auth','interview','results'].includes(n))buildNav();
}
function buildNav(){
  const nl=$('#nav-links');nl.innerHTML='';
  const isA=S.profile?.role==='admin';
  const links=isA?[{id:'admin',l:'Dashboard'},{id:'mgmt',l:'Tests'}]:[{id:'dash',l:'Dashboard'},{id:'tests',l:'Aptitude'}];
  links.forEach(l=>{const b=document.createElement('button');b.className=`nl${S.screen===l.id?' act':''}`;b.textContent=l.l;b.onclick=()=>{if(l.id==='dash')loadDashboard();else if(l.id==='tests')loadTests();else if(l.id==='admin')loadAdmin();else if(l.id==='mgmt')loadMgmt();showScreen(l.id)};nl.appendChild(b)});
  $('#nav-name').textContent=S.profile?.name||''
}

// ===== AUTH =====
function switchAuthTab(t){
  $(`#form-login`).classList.toggle('hidden',t!=='login');
  $(`#form-signup`).classList.toggle('hidden',t!=='signup');
  $(`#tab-login`).className=`flex-1 py-1.5 rounded-md text-sm font-medium transition ${t==='login'?'bg-acc text-bg':'text-mut hover:text-white'}`;
  $(`#tab-signup`).className=`flex-1 py-1.5 rounded-md text-sm font-medium transition ${t==='signup'?'bg-acc text-bg':'text-mut hover:text-white'}`;
  $(`#auth-err`).classList.add('hidden');
}

async function handleLogin(){
  const btn=$('#btn-li'),e=$('#li-email').value.trim(),p=$('#li-pass').value;
  if(!e||!p){showAE('Fill in all fields.');return}
  $(`#auth-err`).classList.add('hidden');
  if(btn){btn.disabled=true;btn.textContent='Signing in...'}
  const{error}=await sb.auth.signInWithPassword({email:e,password:p});
  if(btn){btn.disabled=false;btn.textContent='Sign In'}
  if(error)showAE(error.message);
}

async function handleSignup(){
  const btn=$('#btn-su');
  const n=$('#su-name').value.trim(),u=$('#su-uni').value,pr=$('#su-prog').value.trim(),e=$('#su-email').value.trim(),p=$('#su-pass').value;
  if(!n||!e||!p){showAE('Name, email, and password required.');return}
  if(p.length<6){showAE('Password must be at least 6 characters.');return}
  $(`#auth-err`).classList.add('hidden');
  if(btn){btn.disabled=true;btn.textContent='Creating account...'}
  const{data,error}=await sb.auth.signUp({email:e,password:p,options:{data:{name:n,university:u,program:pr}}});
  if(btn){btn.disabled=false;btn.textContent='Create Account'}
  if(error){showAE(error.message);return}
  // Clear form
  ['su-name','su-prog','su-email','su-pass'].forEach(id=>{const el=$(`#${id}`);if(el)el.value=''});
  $(`#su-uni`).value='';
  if(data?.user&&data.session){toast('Welcome! Account created.','ok')}
  else{toast('Account created! Check your email to verify, then sign in.','ok');switchAuthTab('login')}
}

function showAE(m){const e=$(`#auth-err`);e.innerHTML=`<i class="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i><span>${esc(m)}</span>`;e.classList.remove('hidden')}
async function handleLogout(){await sb.auth.signOut();S.user=null;S.profile=null;S.sessions=[];showScreen('auth')}

// ===== TTS — richer voice, sentence-aware pacing =====
const tts={
  syn:window.speechSynthesis,mV:null,fV:null,_ready:false,
  init(){
    const ld=()=>{
      const v=this.syn.getVoices().filter(x=>x.lang.startsWith('en'));
      if(!v.length)return;
      // Prefer high-quality voices
      this.mV=v.find(x=>/google.*uk.*male|daniel|google.*en.*male/i.test(x.name))
             ||v.find(x=>/male/i.test(x.name))
             ||v.find(x=>x.lang==='en-GB')
             ||v[0];
      this.fV=v.find(x=>/google.*uk.*female|samantha|karen|moira|tessa/i.test(x.name))
             ||v.find(x=>/female/i.test(x.name))
             ||v.find(x=>x.lang==='en-GB')
             ||v[1]||v[0];
      this._ready=true;
    };
    ld();
    if(typeof this.syn.onvoiceschanged!=='undefined')this.syn.onvoiceschanged=ld;
    // Retry after 500ms in case voices weren't ready
    setTimeout(()=>{if(!this._ready)ld()},500);
  },
  async speak(text,cfg){
    S.isSpeaking=true;
    this.syn.cancel();
    // Split on sentence boundaries for more natural pacing
    const segs=text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)||[text];
    for(let i=0;i<segs.length;i++){
      if(!S.isSpeaking)break;
      const s=segs[i].trim();if(!s)continue;
      await this._utterance(s,cfg);
      // Natural pause between sentences
      if(i<segs.length-1)await sl(180+Math.random()*140);
    }
    S.isSpeaking=false;
  },
  _utterance(text,cfg){
    return new Promise(resolve=>{
      const u=new SpeechSynthesisUtterance(text);
      u.voice=this._pickVoice(cfg.gender);
      u.pitch=cfg.pitch+(Math.random()*0.04-0.02);
      u.rate=cfg.rate+(Math.random()*0.02-0.01);
      u.volume=1;
      // Fallback timeout based on text length
      const timeout=Math.max(3000,text.length*95);
      const timer=setTimeout(resolve,timeout);
      u.onend=()=>{clearTimeout(timer);resolve()};
      u.onerror=()=>{clearTimeout(timer);resolve()};
      this.syn.speak(u);
    });
  },
  stop(){S.isSpeaking=false;this.syn.cancel()},
  _pickVoice(gender){return gender==='female'?(this.fV||this.mV):(this.mV||this.fV)}
};

// ===== STT =====
const stt={rec:null,ok:false,
  init(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){this.ok=false;return}
    this.rec=new SR();this.rec.continuous=true;this.rec.interimResults=true;this.rec.lang='en-US';
    this.ok=true;
  },
  start(onResult,onEnd){
    if(!this.ok)return false;
    S.finalTxt='';S.interimTxt='';
    this.rec.onresult=e=>{
      let final='',interim='';
      for(let i=0;i<e.results.length;i++){
        const t=e.results[i][0].transcript;
        if(e.results[i].isFinal)final+=t; else interim+=t;
      }
      if(final){S.finalTxt=final;S.interimTxt=''}
      else if(interim){S.interimTxt=interim}
      onResult(final,interim);
      resetSilenceTimer();
    };
    this.rec.onend=()=>{
      if(S.isListening){try{this.rec.start()}catch(e){}}
      else onEnd(S.finalTxt||S.interimTxt);
    };
    this.rec.onerror=e=>{if(e.error!=='no-speech'&&e.error!=='aborted')console.warn('STT error:',e.error)};
    try{this.rec.start();return true}catch(e){return false}
  },
  stop(){S.isListening=false;clearSilenceTimer();try{this.rec.stop()}catch(e){}}
};
function resetSilenceTimer(){
  clearSilenceTimer();
  // 6 seconds of silence triggers auto-submit — gives enough time to think
  S.silenceT=setTimeout(()=>{if(S.isListening)stt.stop()},6000);
}
function clearSilenceTimer(){if(S.silenceT){clearTimeout(S.silenceT);S.silenceT=null}}

// ===== MEDIA — single getUserMedia, shared between video recorder + visualizer =====
async function startMedia(){
  // Request video+audio together — one permission prompt, one stream
  try{
    S.vidStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:true});
    // Self-view
    const sv=$('#vid-self');sv.srcObject=S.vidStream;
    $(`#vid-prev`).classList.remove('hidden');$(`#rec-dot`).classList.remove('hidden');
    // Visualizer using same audio track
    S.audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    S.analyser=S.audioCtx.createAnalyser();S.analyser.fftSize=128;
    S.audioCtx.createMediaStreamSource(S.vidStream).connect(S.analyser);
    // Video recorder
    S.vidChunks=[];
    const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';
    S.mediaRecorder=new MediaRecorder(S.vidStream,{mimeType:mime});
    S.mediaRecorder.ondataavailable=e=>{if(e.data.size>0)S.vidChunks.push(e.data)};
    S.mediaRecorder.start(1000);S.isRecording=true;
    return true;
  }catch(e){
    console.warn('Camera/mic unavailable:',e.message);
    // Fall back to audio-only for visualizer
    try{
      S.micStream=await navigator.mediaDevices.getUserMedia({audio:true});
      S.audioCtx=new(window.AudioContext||window.webkitAudioContext)();
      S.analyser=S.audioCtx.createAnalyser();S.analyser.fftSize=128;
      S.audioCtx.createMediaStreamSource(S.micStream).connect(S.analyser);
    }catch(ae){console.warn('Audio-only fallback also failed:',ae.message)}
    $(`#vid-prev`).classList.add('hidden');$(`#rec-dot`).classList.add('hidden');
    return false;
  }
}

function drawVisualizer(){
  if(!S.analyser)return;
  const c=$('#audio-canvas'),ctx=c.getContext('2d'),bins=S.analyser.frequencyBinCount,data=new Uint8Array(bins);
  function frame(){
    if(!S.isListening){ctx.clearRect(0,0,c.width,c.height);return}
    S.animId=requestAnimationFrame(frame);
    S.analyser.getByteFrequencyData(data);
    ctx.clearRect(0,0,c.width,c.height);
    const bw=c.width/bins*2.2;let px=0;
    for(let i=0;i<bins;i++){
      const h=Math.max(2,(data[i]/255)*c.height*.95),a=0.3+(data[i]/255)*0.7;
      ctx.fillStyle=`rgba(34,197,94,${a})`;ctx.beginPath();ctx.roundRect(px,c.height-h,bw-1.5,h,2);ctx.fill();px+=bw;
    }
  }
  frame();
}
function stopVisualizer(){
  if(S.animId){cancelAnimationFrame(S.animId);S.animId=null}
  const c=$('#audio-canvas');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);
}
function stopViz(){stopVisualizer()} // alias

async function stopVideoRecording(){
  return new Promise(resolve=>{
    if(!S.mediaRecorder||!S.isRecording){resolve(null);return}
    S.isRecording=false; // guard against double calls
    S.mediaRecorder.onstop=async()=>{
      const blob=new Blob(S.vidChunks,{type:'video/webm'});S.vidChunks=[];
      if(S.vidStream){S.vidStream.getTracks().forEach(t=>t.stop());S.vidStream=null}
      if(S.micStream){S.micStream.getTracks().forEach(t=>t.stop());S.micStream=null}
      if(S.audioCtx){S.audioCtx.close().catch(()=>{});S.audioCtx=null}
      $(`#vid-self`).srcObject=null;$(`#vid-prev`).classList.add('hidden');$(`#rec-dot`).classList.add('hidden');
      if(S.user&&S.currentSessionId&&blob.size>5000){
        try{
          const path=`${S.user.id}/${S.currentSessionId}.webm`;
          const{error}=await sb.storage.from('interview-videos').upload(path,blob,{contentType:'video/webm',upsert:true});
          if(!error){
            const{data:{publicUrl}}=sb.storage.from('interview-videos').getPublicUrl(path);
            await sb.from('interview_sessions').update({video_url:publicUrl}).eq('id',S.currentSessionId);
            toast('Interview recording saved!','ok');resolve(publicUrl);return;
          }
        }catch(e){console.warn('Video upload error:',e)}
      }
      resolve(null);
    };
    try{S.mediaRecorder.stop()}catch(e){resolve(null)}
  });
}

// ===== MIC TEST (standalone, doesn't affect main streams) =====
async function mtGo(){
  try{
    S.mtStream=await navigator.mediaDevices.getUserMedia({audio:true});
    S.mtCtx=new(window.AudioContext||window.webkitAudioContext)();
    S.mtAn=S.mtCtx.createAnalyser();S.mtAn.fftSize=256;
    S.mtCtx.createMediaStreamSource(S.mtStream).connect(S.mtAn);
    $(`#mt-go`).classList.add('hidden');$(`#mt-stop`).classList.remove('hidden');
    $(`#mt-st`).textContent='Speak now — watching levels...';$(`#mt-st`).style.color='#888';
    drawMicTest();
  }catch(e){$(`#mt-st`).textContent='Mic error: '+e.message;$(`#mt-st`).style.color='#ef4444'}
}
function drawMicTest(){
  const c=$('#mt-cv'),ctx=c.getContext('2d'),bins=S.mtAn.frequencyBinCount,data=new Uint8Array(bins);
  function frame(){
    S.mtAnim=requestAnimationFrame(frame);S.mtAn.getByteFrequencyData(data);
    let avg=0;for(let i=0;i<bins;i++)avg+=data[i];avg/=bins;
    ctx.clearRect(0,0,c.width,c.height);
    const bw=4,gap=1,cols=Math.floor(c.width/(bw+gap));
    for(let i=0;i<cols;i++){const di=Math.floor(i*bins/cols),h=Math.max(2,(data[di]/255)*c.height*.9),a=0.4+(data[di]/255)*0.6;ctx.fillStyle=`rgba(34,197,94,${a})`;ctx.beginPath();ctx.roundRect(i*(bw+gap),c.height-h,bw,h,2);ctx.fill()}
    const pct=Math.min(100,avg*1.5);$(`#mt-st`).textContent=pct>5?`Microphone working — ${Math.round(pct)}% level`:'No audio detected — check mic';$(`#mt-st`).style.color=pct>5?'#22c55e':'#f59e0b';
  }
  frame();
}
function mtStop(){
  if(S.mtAnim){cancelAnimationFrame(S.mtAnim);S.mtAnim=null}
  if(S.mtStream){S.mtStream.getTracks().forEach(t=>t.stop());S.mtStream=null}
  if(S.mtCtx){S.mtCtx.close().catch(()=>{});S.mtCtx=null}
  $(`#mt-go`).classList.remove('hidden');$(`#mt-stop`).classList.add('hidden');
  $(`#mt-st`).textContent='Click Start';$(`#mt-st`).style.color='';
}

// ===== API =====
async function apiHealth(){
  try{const r=await fetch(getAPI()+'/api/health',{signal:AbortSignal.timeout(4000)});S.serverUp=r.ok}catch(e){S.serverUp=false}
  const sd=$('#cv-sd'),sl=$('#cv-sl'),pw=$('#pw-srv');
  if(sd)sd.style.background=S.serverUp?'#22c55e':'#ef4444';
  if(sl)sl.textContent=S.serverUp?'Connected':'Offline';
  if(pw)pw.style.display=S.serverUp?'none':'flex';
  return S.serverUp;
}
async function apiQuestion(body){const r=await fetch(getAPI()+'/api/generate-question',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('API error '+r.status);const d=await r.json();return d.question}
async function apiGrade(body){const r=await fetch(getAPI()+'/api/grade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('API error '+r.status);return r.json()}

// ===== DASHBOARD =====
async function loadDashboard(){
  if(!S.user)return;
  S.name=S.profile?.name||'Student';
  $(`#dash-greet`).textContent=`${gtg()}, ${S.name}!`;
  const{data:sessions}=await sb.from('interview_sessions').select('*').eq('user_id',S.user.id).order('started_at',{ascending:false});
  S.sessions=sessions||[];
  const ids=(sessions||[]).map(s=>s.id);
  let grades={};
  if(ids.length){const{data:g}=await sb.from('grading_reports').select('*').in('session_id',ids);(g||[]).forEach(r=>grades[r.session_id]=r)}
  const{data:comps}=await sb.from('aptitude_completions').select('id').eq('user_id',S.user.id);
  const scored=(sessions||[]).filter(s=>grades[s.id]);
  const scores=scored.map(s=>grades[s.id].overall_score);
  $(`#ds-sess`).textContent=(sessions||[]).filter(s=>s.status==='completed').length||0;
  $(`#ds-avg`).textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';
  $(`#ds-best`).textContent=scores.length?Math.max(...scores):'—';
  $(`#ds-tests`).textContent=comps?.length||0;
  // FIX: show 8 most recent in chronological order
  drawTrend(scores.slice(0,8).reverse());
  // Scheduled sessions
  const sched=(sessions||[]).filter(s=>s.status==='scheduled'&&new Date(s.scheduled_for)>new Date());
  const sec=$('#sched-sec'),list=$('#sched-list');
  if(sched.length){
    sec.classList.remove('hidden');list.innerHTML='';
    sched.forEach(s=>{const d=new Date(s.scheduled_for);const row=document.createElement('div');row.className='sr';row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${FL[s.field]||s.field}</div><div class="text-[10px] text-mut">${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} at ${d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}${s.target_company?' · '+esc(s.target_company):''}</div></div><button onclick="startScheduled('${s.id}')" class="bg-acc/20 text-acc text-[10px] font-medium px-2.5 py-1 rounded hover:bg-acc/30 transition">Start</button>`;list.appendChild(row)});
  }else sec.classList.add('hidden');
  // Completed sessions
  const el=$('#dash-sessions');const completed=(sessions||[]).filter(s=>s.status==='completed');
  if(!completed.length){el.innerHTML='<div class="p-5 text-center text-xs text-mut">No interviews yet. Start one!</div>';return}
  el.innerHTML='';
  completed.slice(0,10).forEach(s=>{
    const g=grades[s.id];const score=g?g.overall_score:null;
    const date=new Date(s.started_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
    const row=document.createElement('div');row.className='sr';
    row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${FL[s.field]||s.field}${s.video_url?' <i class="fa-solid fa-video text-acc text-[10px]"></i>':''}</div><div class="text-[10px] text-mut">${s.interviewer_mode||'single'} · ${date}</div></div><div class="text-xs font-bold ${score>=70?'text-ok':score>=50?'text-acc':'text-err'}">${score!==null?score+'%':'—'}</div><i class="fa-solid fa-chevron-right text-[10px] text-mut ml-2"></i>`;
    row.onclick=()=>showDetail(s,grades[s.id]);el.appendChild(row);
  });
}

function drawTrend(scores){
  const cv=$('#trend-cv');if(!cv)return;const x=cv.getContext('2d'),w=cv.width,h=cv.height;
  x.clearRect(0,0,w,h);
  if(!scores.length){$('#trend-empty').style.display='block';return}
  $(`#trend-empty`).style.display='none';
  const pad=24,bw=Math.min(35,(w-pad*2-scores.length*5)/scores.length);
  scores.forEach((s,i)=>{const bx=pad+i*(bw+5),bh=Math.max(3,(s/100)*(h-20)),by=h-10-bh;x.fillStyle=s>=70?'#22c55e':s>=50?'#e8a023':'#ef4444';x.beginPath();x.roundRect(bx,by,bw,bh,3);x.fill();x.fillStyle='#888';x.font='9px Outfit';x.textAlign='center';x.fillText(s,bx+bw/2,by-3)});
}

async function showDetail(session,grade){
  showScreen('detail');const score=grade?.overall_score||0;const circ=2*Math.PI*54;
  $(`#det-title`).textContent=new Date(session.started_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  $(`#det-field`).textContent=FL[session.field]||session.field;
  if(session.video_url){$(`#det-vid-wrap`).classList.remove('hidden');$(`#det-vid`).src=session.video_url}
  else $(`#det-vid-wrap`).classList.add('hidden');
  setTimeout(()=>{$(`#det-arc`).style.strokeDashoffset=circ*(1-score/100)},100);
  animN($(`#det-score`),0,score,900);
  if(grade){
    const subs=[{l:'Communication',s:grade.communication_score,c:'#3b82f6'},{l:'Technical',s:grade.technical_score,c:'#e8a023'},{l:'Relevance',s:grade.relevance_score,c:'#8b5cf6'},{l:'Confidence',s:grade.confidence_score,c:'#22c55e'}];
    const el=$('#det-subs');el.innerHTML='';
    subs.forEach((s,i)=>{const d=document.createElement('div');d.innerHTML=`<div class="flex justify-between items-center mb-0.5"><span class="text-[10px] text-gray-400">${s.l}</span><span class="text-[10px] font-semibold" style="color:${s.c}">${s.s}</span></div><div class="bt"><div class="bf" style="width:0%;background:${s.c}" id="db-${i}"></div></div>`;el.appendChild(d);setTimeout(()=>{const bf=$(`#db-${i}`);if(bf)bf.style.width=s.s+'%'},120+i*80)});
    $(`#det-fb`).textContent=grade.feedback_text||'—';
    const il=$('#det-imp');il.innerHTML='';
    (grade.improvement_notes||[]).forEach(im=>{const li=document.createElement('li');li.className='flex items-start gap-1.5 text-[11px]';li.innerHTML=`<i class="fa-solid fa-arrow-right text-acc text-[9px] mt-0.5 shrink-0"></i><span>${esc(im)}</span>`;il.appendChild(li)});
  }
  const{data:turns}=await sb.from('interview_turns').select('*').eq('session_id',session.id).order('turn_number');
  const td=$('#det-trans');td.innerHTML='';
  (turns||[]).forEach(t=>{const d=document.createElement('div');d.className=`m m-${t.role==='ai'?'ai':'st'}`;let ex='';if(t.role==='ai'&&t.interviewer_name)ex=`<div class="mn" style="color:#888">${esc(t.interviewer_name)}</div>`;d.innerHTML=`${ex}<div class="ml">${t.role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(t.text)}</div>`;td.appendChild(d)});
}
function animN(el,f,t,dur){const st=performance.now();function u(n){const p=Math.min((n-st)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(f+(t-f)*e);if(p<1)requestAnimationFrame(u)}requestAnimationFrame(u)}

// ===== APTITUDE TESTS =====
async function loadTests(){
  if(!S.user)return;
  const{data:tests}=await sb.from('aptitude_tests').select('*').eq('is_active',true).order('created_at',{ascending:false});
  const{data:comps}=await sb.from('aptitude_completions').select('test_id').eq('user_id',S.user.id);
  const done=new Set((comps||[]).map(c=>c.test_id));
  const el=$('#tests-list');
  if(!tests?.length){el.innerHTML='<div class="p-5 text-center text-xs text-mut">No tests available yet.</div>';return}
  el.innerHTML='';const cc={general:'#3b82f6',technical:'#e8a023',behavioral:'#8b5cf6',logical:'#22c55e'};
  tests.forEach(t=>{
    const d=done.has(t.id);const row=document.createElement('div');row.className='tr';
    row.innerHTML=`<div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${cc[t.category]||'#888'}22;color:${cc[t.category]||'#888'}"><i class="fa-solid ${t.category==='technical'?'fa-code':t.category==='behavioral'?'fa-users':t.category==='logical'?'fa-brain':'fa-clipboard'} text-xs"></i></div><div class="flex-1 min-w-0"><div class="text-xs font-medium">${esc(t.title)}</div><div class="text-[10px] text-mut truncate">${esc(t.description||t.category+' test')}${t.field?' · '+FL[t.field]:''}</div></div>${d?'<span class="text-[10px] text-ok font-medium"><i class="fa-solid fa-check mr-0.5"></i>Done</span>':`<a href="${esc(t.url)}" target="_blank" rel="noopener" class="bg-acc/20 text-acc font-medium px-2.5 py-1 rounded-lg text-[10px] hover:bg-acc/30 transition shrink-0" data-tid="${t.id}">Take Test <i class="fa-solid fa-arrow-right ml-0.5"></i></a>`}`;
    row.querySelectorAll('a[data-tid]').forEach(a=>a.addEventListener('click',async()=>{await sb.from('aptitude_completions').upsert({user_id:S.user.id,test_id:a.dataset.tid},{onConflict:'user_id,test_id'})}));
    el.appendChild(row);
  });
}

// ===== ADMIN =====
async function loadAdmin(){
  if(!S.user)return;
  const[{data:users},{data:sessions},{data:grades},{data:tests}]=await Promise.all([sb.from('profiles').select('*').order('created_at',{ascending:false}),sb.from('interview_sessions').select('*'),sb.from('grading_reports').select('*'),sb.from('aptitude_tests').select('id')]);
  $(`#ad-users`).textContent=users?.length||0;$(`#ad-sess`).textContent=sessions?.length||0;
  const scores=(grades||[]).map(g=>g.overall_score);$(`#ad-avg`).textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';$(`#ad-tests`).textContent=tests?.length||0;
  const uStats={};(sessions||[]).forEach(s=>{if(!uStats[s.user_id])uStats[s.user_id]={count:0,scores:[]};uStats[s.user_id].count++;(grades||[]).filter(g=>g.session_id===s.id).forEach(g=>uStats[s.user_id].scores.push(g.overall_score))});
  const el=$('#ad-users-list');el.innerHTML='';
  if(!users?.length){el.innerHTML='<div class="p-4 text-center text-xs text-mut">No users yet.</div>';return}
  users.slice(0,20).forEach(u=>{
    const st=uStats[u.id]||{count:0,scores:[]};const avg=st.scores.length?Math.round(st.scores.reduce((a,b)=>a+b,0)/st.scores.length):'—';
    const row=document.createElement('div');row.className='sr';
    row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${esc(u.name||'—')} ${u.role==='admin'?'<span class="text-[10px] text-acc">Admin</span>':''}<br><span class="text-[10px] text-mut">${esc(u.university||'—')} · ${esc(u.program||'—')}</span></div></div><div class="text-[10px] text-mut mr-3">${st.count} interviews</div><div class="text-xs font-semibold ${typeof avg==='number'?(avg>=70?'text-ok':avg>=50?'text-acc':'text-err'):'text-mut'}">${avg}${typeof avg==='number'?'%':''}</div>`;
    el.appendChild(row);
  });
}

// ===== MANAGE TESTS =====
async function loadMgmt(){
  if(!S.user)return;
  const{data:tests}=await sb.from('aptitude_tests').select('*').order('created_at',{ascending:false});
  const el=$('#mgmt-list');el.innerHTML='';
  if(!tests?.length){el.innerHTML='<div class="p-4 text-center text-xs text-mut">No tests.</div>';return}
  tests.forEach(t=>{const row=document.createElement('div');row.className='tr';row.innerHTML=`<div class="flex-1 min-w-0"><div class="text-xs font-medium">${esc(t.title)}</div><div class="text-[10px] text-mut">${t.category}${t.field?' · '+FL[t.field]:''}</div></div><div class="flex gap-1.5 shrink-0"><button class="text-[10px] px-2 py-1 rounded ${t.is_active?'bg-ok/20 text-ok':'bg-mut/20 text-mut'}" onclick="toggleTest('${t.id}',${!t.is_active})">${t.is_active?'Active':'Off'}</button><button class="text-[10px] px-2 py-1 rounded bg-err/20 text-err hover:bg-err/30" onclick="deleteTest('${t.id}')"><i class="fa-solid fa-trash"></i></button></div>`;el.appendChild(row)});
}
async function addTest(){
  if(!S.user)return;
  const t=$('#mt-title')?.value.trim(),u=$('#mt-url')?.value.trim(),c=$('#mt-cat')?.value,f=$('#mt-field')?.value||null,d=$('#mt-desc')?.value.trim();
  if(!t||!u){toast('Title and URL required.','err');return}
  const{error}=await sb.from('aptitude_tests').insert({title:t,url:u,category:c,field:f,description:d,created_by:S.user.id});
  if(error){toast('Error: '+error.message,'err');return}
  $(`#mt-title`).value='';$(`#mt-url`).value='';$(`#mt-desc`).value='';
  toast('Test added!','ok');loadMgmt();
}
async function toggleTest(id,active){await sb.from('aptitude_tests').update({is_active:active}).eq('id',id);toast(active?'Activated':'Deactivated','ok');loadMgmt()}
async function deleteTest(id){if(!confirm('Delete this test?'))return;await sb.from('aptitude_tests').delete().eq('id',id);toast('Deleted.','ok');loadMgmt()}

// ===== SCHEDULE =====
function toggleSchedule(){
  S.scheduleMode=!S.scheduleMode;
  $(`#sched-fields`).classList.toggle('hidden',!S.scheduleMode);
  $(`#btn-start`).classList.toggle('hidden',S.scheduleMode);
  $(`#btn-schedule`).classList.toggle('hidden',!S.scheduleMode);
  const dot=$('#sched-dot'),toggle=$('#sched-toggle');
  if(S.scheduleMode){dot.style.left='calc(100% - 18px)';dot.style.background='#e8a023';toggle.style.background='rgba(232,160,35,0.2)'}
  else{dot.style.left='2px';dot.style.background='#777';toggle.style.background=''}
}
async function scheduleInterview(){
  if(!S.field){toast('Select an engineering field first.','err');return}
  const date=$('#inp-sdate')?.value,time=$('#inp-stime')?.value;
  if(!date||!time){toast('Pick a date and time.','err');return}
  const scheduledFor=new Date(`${date}T${time}:00`).toISOString();
  if(new Date(scheduledFor)<=new Date()){toast('Please pick a future date and time.','err');return}
  const{error}=await sb.from('interview_sessions').insert({user_id:S.user.id,field:S.field,field_label:S.fieldLabel,target_company:S.company||null,interviewer_mode:S.mode,total_questions:8,status:'scheduled',scheduled_for:scheduledFor});
  if(error){toast('Failed: '+error.message,'err');return}
  toast('Interview scheduled!','ok');showScreen('dash');loadDashboard();
}
async function startScheduled(id){
  const{data:session}=await sb.from('interview_sessions').select('*').eq('id',id).single();
  if(!session)return;
  S.field=session.field;S.fieldLabel=session.field_label||FL[session.field]||session.field;S.mode=session.interviewer_mode||'male';S.company=session.target_company||'';S.currentSessionId=id;
  await sb.from('interview_sessions').update({status:'active',started_at:new Date().toISOString()}).eq('id',id);
  await beginInterview();
}

// ===== FALLBACK QUESTION ENGINE =====
function detectTopics(txt){
  const l=txt.toLowerCase(),found=[];
  const checks={project:['project','built','developed','created','designed','implemented','prototype','final year','thesis'],internship:['internship','intern','worked at','company','industry','attachment','placement','site','supervisor'],teamwork:['team','group','together','collaborated','partner','colleague','member','committee'],leadership:['led','leader','managed','supervised','coordinated','directed','headed','president','captain'],challenge:['challenge','difficult','problem','issue','obstacle','struggled','overcome','failed','mistake'],skills:['skill','proficient','experienced','familiar','knowledge','expertise','software','tool','programming'],motivation:['passion','love','interested','enjoy','driven','goal','career','why','want','aspire'],academic:['course','class','lecture','professor','grade','gpa','research','university','learned','study']};
  for(const[k,words]of Object.entries(checks))if(words.some(w=>l.includes(w)))found.push(k);
  return found.length?found:['skills'];
}
function countFieldKeywords(txt,field){return(FK[field]||[]).filter(k=>txt.toLowerCase().includes(k)).length}
function fallbackQuestion(answer,field,iv,qi){
  const topics=detectTopics(answer);
  const asked=S.conversation.filter(c=>c.role==='student').flatMap(c=>detectTopics(c.text));
  const qt=Q_ARC[qi]||'followup';
  if(qt==='cv_based'&&S.cvData){
    if(S.cvData.projects?.length)return`Looking at your CV, I see you worked on: "${S.cvData.projects[0].substring(0,80)}". Can you walk me through that in more detail?`;
    if(S.cvData.skills?.length)return`Your CV mentions ${S.cvData.skills.slice(0,3).join(', ')}. Which of those skills are you most confident applying in a professional setting?`;
  }
  if(qt==='technical'||qt==='scenario'){
    if(iv?.focus==='scenario'&&SCN[field])return pk(SCN[field]);
    return pk(FTQ[field]||FTQ.electrical);
  }
  if(qt==='behavioral'){const bt=['teamwork','leadership','challenge','motivation'];const unused=bt.filter(t=>!asked.includes(t));if(unused.length)return PIV[pk(unused)]}
  if(qt==='closing')return pk(["What do you hope to gain from your national service placement?","Where do you see yourself professionally in five years?","Why should a company select you over other candidates?","Do you have any questions for us?"]);
  // Smart follow-up based on answer content
  const usableTopics=topics.filter(t=>!asked.includes(t)||Math.random()>0.7);
  if(answer.length>20&&usableTopics.length&&FU[usableTopics[0]])return pk(FU[usableTopics[0]]);
  const allTopics=Object.keys(PIV);const unused=allTopics.filter(t=>!asked.includes(t));
  if(unused.length)return PIV[pk(unused)];
  return pk(FTQ[field]||FTQ.electrical);
}
function fallbackGrade(convo,field){
  const answers=convo.filter(c=>c.role==='student').map(c=>c.text);
  if(!answers.length)return{overall:0,communication:0,technical:0,relevance:0,confidence:0,feedback:'No answers recorded.',improvements:['Complete a full interview session to receive a grade.']};
  let ct=0,tt=0,rt=0,cf=0;
  answers.forEach(a=>{
    const words=a.trim().split(/\s+/).length;
    const structured=/\b(first|firstly|second|then|finally|however|therefore|for example|specifically|in addition)\b/i.test(a);
    ct+=Math.min(100,Math.max(20,words*0.9+(structured?15:0)));
    tt+=Math.min(100,Math.max(15,countFieldKeywords(a,field)*20+20));
    rt+=50+Math.min(45,words*0.5);
    const fillers=(a.match(/\b(um|uh|like|you know|i mean|sort of|kind of|i guess|i think|maybe|not sure)\b/gi)||[]).length;
    cf+=Math.min(100,Math.max(20,words*0.7-fillers*10+25));
  });
  const n=answers.length;const co=Math.round(ct/n),te=Math.round(tt/n),re=Math.min(100,Math.round(rt/n)),conf=Math.round(cf/n);
  const ov=Math.round(co*.25+te*.35+re*.2+conf*.2);
  const avgWords=answers.reduce((s,a)=>s+a.split(/\s+/).length,0)/n;
  let fbText=ov>=75?`Strong performance in ${FL[field]||field}.`:ov>=55?`Reasonable foundation with clear areas to develop.`:`Further preparation is recommended before your actual interview.`;
  if(avgWords<25)fbText+=' Your answers were quite brief — try to elaborate more with examples.';
  else if(avgWords>60)fbText+=' Good level of detail in your answers.';
  if(countFieldKeywords(answers.join(' '),field)>=3)fbText+=' Good use of field-specific terminology.';
  else fbText+=' Try to use more technical vocabulary relevant to '+FL[field]+'.';
  const imp=[];if(co<65)imp.push('Structure answers using the STAR method (Situation, Task, Action, Result).');if(te<60)imp.push(`Review core ${FL[field]||field} concepts and practice explaining them clearly.`);if(re<60)imp.push('Ensure your answers directly address what was asked before elaborating.');if(conf<60)imp.push('Reduce filler words (um, uh, like) and speak with more conviction.');if(!imp.length)imp.push('Continue practising to maintain your strong performance.');
  return{overall:ov,communication:co,technical:te,relevance:re,confidence:conf,feedback:fbText,improvements:imp};
}

// ===== INTERVIEW UI =====
function setPhase(p){
  S.phase=p;
  const avatar=$('#avc'),rings=['.r1','.r2','.r3'],waves=$('#swv'),vizCanvas=$('#audio-canvas'),statusTxt=$('#d-st'),icon=$('#avc-i');
  avatar.classList.remove('sp','li','th');rings.forEach(r=>$(r).classList.remove('pu'));waves.classList.remove('on');vizCanvas.classList.add('hidden');
  switch(p){
    case'speaking':avatar.classList.add('sp');rings.forEach(r=>$(r).classList.add('pu'));waves.classList.add('on');icon.className='fa-solid fa-volume-high';statusTxt.textContent='Speaking...';statusTxt.style.color='#e8a023';break;
    case'listening':avatar.classList.add('li');icon.className='fa-solid fa-microphone';vizCanvas.classList.remove('hidden');drawVisualizer();statusTxt.textContent='Listening — speak your answer';statusTxt.style.color='#22c55e';break;
    case'processing':avatar.classList.add('th');icon.className='fa-solid fa-brain';statusTxt.textContent='Processing...';statusTxt.style.color='#888';break;
    case'done':icon.className='fa-solid fa-check';statusTxt.textContent='Interview complete';statusTxt.style.color='#e8a023';break;
    default:icon.className='fa-solid fa-microphone-lines';statusTxt.textContent='Preparing...';statusTxt.style.color='#888';
  }
}
function addMessage(role,text,interim){
  const d=document.createElement('div');d.className=`m m-${interim?'im':role==='ai'?'ai':'st'}`;
  let prefix='';
  if(!interim&&S.currentIV&&role==='ai')prefix=`<div class="mn" style="color:${S.currentIV.color||'#888'}">${esc(S.currentIV.name)}</div>`;
  d.innerHTML=`${prefix}<div class="ml">${role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(text)}</div>`;
  if(interim)d.id='im-msg';
  const area=$('#transcript');area.appendChild(d);
  area.parentElement.scrollTop=area.parentElement.scrollHeight;
  return d;
}
function removeInterim(){const e=$('#im-msg');if(e)e.remove()}
function updateProgress(){
  const pct=(S.currentQ/S.totalQ)*100;
  $(`#pbar`).style.width=pct+'%';$(`#d-cnt`).textContent=`Q ${Math.min(S.currentQ+1,S.totalQ)}/${S.totalQ}`;
}
function getVoiceCfg(){
  if(S.mode==='team'&&S.currentIV)return{gender:S.currentIV.gender,pitch:S.currentIV.pitch,rate:S.currentIV.rate};
  if(S.mode==='random')return{gender:Math.random()>0.5?'female':'male',pitch:0.85+Math.random()*0.28,rate:0.88+Math.random()*0.07};
  return{...(SP[S.mode]||SP.male)};
}
function getCurrentInterviewer(){
  if(S.mode!=='team')return{...(SP[S.mode||'male']),role:'Interviewer',focus:null,color:'#e8a023'};
  return TM[S.teamIdx%TM.length];
}

// ===== INTERVIEW FLOW =====
async function startInt(){
  if(!S.field){toast('Please select an engineering field.','err');return}
  S.name=S.profile?.name||'Student';S.company=$('#inp-company')?.value.trim()||'';
  // Refresh server status before starting
  await apiHealth();
  S.conversation=[];S.currentQ=0;S.teamIdx=0;S.totalQ=8;S.ending=false;S.currentSessionId=null;
  $(`#transcript`).innerHTML='';updateProgress();showScreen('interview');
  $(`#d-field`).textContent=S.fieldLabel;$(`#d-eng`).textContent=S.serverUp?'LLM':'Built-in';
  S.currentIV=getCurrentInterviewer();
  // Create session record
  if(S.user){
    const{data:sess}=await sb.from('interview_sessions').insert({user_id:S.user.id,field:S.field,field_label:S.fieldLabel,target_company:S.company||null,interviewer_mode:S.mode,total_questions:8,status:'active'}).select('id').single();
    if(sess)S.currentSessionId=sess.id;
  }
  await beginInterview();
}
async function beginInterview(){
  $(`#d-iname`).textContent=S.currentIV.name+' — '+S.currentIV.role;$(`#d-iname`).style.color=S.currentIV.color||'#888';
  await sl(300);
  const vc=getVoiceCfg();
  const greeting=S.mode==='team'
    ?`${gtg()}, ${S.name}. Welcome to your panel interview for ${S.fieldLabel}. ${S.currentIV.intro} To begin, please tell us about yourself.`
    :`${gtg()}, ${S.name}. I'm ${S.currentIV.name}, your interviewer today. We're conducting a mock national service interview for ${S.fieldLabel}. I'll ask you ${S.totalQ} questions. Please speak clearly and take your time. Let's begin — tell me about yourself.`;
  S.conversation.push({role:'ai',text:greeting,interviewer:S.currentIV.name});
  addMessage('ai',greeting,false);
  setPhase('speaking');
  await startMedia(); // start camera + mic (single getUserMedia)
  await tts.speak(greeting,vc);
  await sl(300);
  await startListening();
}

async function startListening(){
  if(S.ending)return;
  setPhase('listening');S.isListening=true;
  const ok=stt.start(
    (final,interim)=>{removeInterim();if(interim)addMessage('student',final+interim,true);else if(final){removeInterim();addMessage('student',final,false)}},
    (text)=>processAnswer(text)
  );
  if(!ok){
    $(`#inp-txt`).disabled=false;$(`#btn-send`).disabled=false;
    $(`#d-st`).textContent='Mic unavailable — type your answer below';$(`#d-st`).style.color='#f59e0b';
  }
  // Safety timeout: 90s max per answer
  S.maxT=setTimeout(()=>{if(S.isListening)stt.stop()},90000);
}

async function processAnswer(text){
  if(S.ending)return;
  S.isListening=false;
  if(S.maxT){clearTimeout(S.maxT);S.maxT=null}
  stopVisualizer();
  // Check text input fallback
  if(!text||text.trim().length<3){
    const typed=$('#inp-txt')?.value.trim();
    if(typed&&typed.length>=3){text=typed;$(`#inp-txt`).value=''}
    else{
      setPhase('speaking');
      const retry="I didn't quite catch that. Please speak clearly or type your answer in the box below.";
      addMessage('ai',retry,false);S.conversation.push({role:'ai',text:retry,interviewer:S.currentIV.name});
      await tts.speak(retry,getVoiceCfg());await sl(300);await startListening();return;
    }
  }
  removeInterim();
  // Avoid duplicate message
  const lastSt=Array.from($$('.m-st')).pop();
  if(!lastSt||lastSt.querySelector('.mb')?.textContent!==text)addMessage('student',text,false);
  S.conversation.push({role:'student',text});
  $(`#inp-txt`).disabled=true;$(`#btn-send`).disabled=true;
  S.currentQ++;updateProgress();
  if(S.currentQ>=S.totalQ){await endInterview();return}
  setPhase('processing');await sl(600);
  // Rotate panel interviewer every 2 questions
  if(S.mode==='team'&&S.currentQ%2===0){S.teamIdx++;S.currentIV=getCurrentInterviewer();$(`#d-iname`).textContent=S.currentIV.name+' — '+S.currentIV.role;$(`#d-iname`).style.color=S.currentIV.color||'#888'}
  let question=null;
  if(S.serverUp){
    try{question=await apiQuestion({conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,name:S.name,cvData:S.cvData,interviewer:S.currentIV,currentQ:S.currentQ,totalQ:S.totalQ})}
    catch(e){console.warn('LLM question failed, using fallback')}
  }
  if(!question)question=fallbackQuestion(text,S.field,S.currentIV,S.currentQ);
  S.conversation.push({role:'ai',text:question,interviewer:S.currentIV.name});
  addMessage('ai',question,false);
  setPhase('speaking');await tts.speak(question,getVoiceCfg());await sl(300);await startListening();
}

async function endInterview(){
  if(S.ending)return; // FIX: prevent double execution
  S.ending=true;S.phase='done';
  setPhase('processing');
  const closing=`Thank you, ${S.name}. That completes your mock interview. Please wait a moment while I prepare your feedback.`;
  addMessage('ai',closing,false);setPhase('speaking');await tts.speak(closing,getVoiceCfg());await sl(500);setPhase('done');
  const videoUrl=await stopVideoRecording();
  let grade=null;
  if(S.serverUp){try{grade=await apiGrade({conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,name:S.name})}catch(e){console.warn('LLM grading failed, using fallback')}}
  if(!grade)grade=fallbackGrade(S.conversation,S.field);
  // Persist to DB
  if(S.user&&S.currentSessionId){
    const turns=S.conversation.map((t,i)=>({session_id:S.currentSessionId,turn_number:i,role:t.role,interviewer_name:t.interviewer||null,text:t.text}));
    await sb.from('interview_turns').insert(turns);
    if(grade)await sb.from('grading_reports').insert({session_id:S.currentSessionId,overall_score:grade.overall,communication_score:grade.communication,technical_score:grade.technical,relevance_score:grade.relevance,confidence_score:grade.confidence,feedback_text:grade.feedback,improvement_notes:grade.improvements});
    await sb.from('interview_sessions').update({status:'completed',ended_at:new Date().toISOString()}).eq('id',S.currentSessionId);
  }
  await sl(400);showResults(grade);
}

function showResults(g){
  showScreen('results');
  const circ=2*Math.PI*59;
  setTimeout(()=>{const arc=$('#sc-ar');if(arc)arc.style.strokeDashoffset=circ*(1-g.overall/100)},100);
  animN($(`#sc-n`),0,g.overall,1200);
  const subs=[{l:'Communication',s:g.communication,c:'#3b82f6',w:'25%'},{l:'Technical',s:g.technical,c:'#e8a023',w:'35%'},{l:'Relevance',s:g.relevance,c:'#8b5cf6',w:'20%'},{l:'Confidence',s:g.confidence,c:'#22c55e',w:'20%'}];
  const el=$('#r-subs');el.innerHTML='';
  subs.forEach((s,i)=>{const d=document.createElement('div');d.innerHTML=`<div class="flex justify-between items-center mb-0.5"><span class="text-[10px] text-gray-400">${s.l} <span class="text-[9px] text-mut">${s.w}</span></span><span class="text-[10px] font-semibold" style="color:${s.c}">${s.s}</span></div><div class="bt"><div class="bf" style="width:0%;background:${s.c}" id="rb-${i}"></div></div>`;el.appendChild(d);setTimeout(()=>{const bf=$(`#rb-${i}`);if(bf)bf.style.width=s.s+'%'},200+i*150)});
  $(`#r-fb`).textContent=g.feedback||'—';
  const il=$('#r-imp');il.innerHTML='';
  (g.improvements||[]).forEach(im=>{const li=document.createElement('li');li.className='flex items-start gap-1.5 text-[11px]';li.innerHTML=`<i class="fa-solid fa-arrow-right text-acc text-[9px] mt-0.5 shrink-0"></i><span>${esc(im)}</span>`;il.appendChild(li)});
  const td=$('#r-trans');td.innerHTML='';
  S.conversation.forEach(c=>{const d=document.createElement('div');d.className=`m m-${c.role==='ai'?'ai':'st'}`;let prefix='';if(c.role==='ai'&&c.interviewer){const panel=S.mode==='team'?TM.find(t=>t.name===c.interviewer):null;prefix=`<div class="mn" style="color:${panel?panel.color:'#888'}">${esc(c.interviewer)}</div>`}d.innerHTML=`${prefix}<div class="ml">${c.role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(c.text)}</div>`;td.appendChild(d)});
  $(`#r-sub`).textContent=S.mode==='team'?'Panel interview — 4 interviewers':'Mock interview — '+S.totalQ+' questions';
}

// ===== CV UPLOAD =====
async function handleCV(file){
  if(!file||file.size>10*1024*1024){toast('File too large (max 10MB).','err');return}
  $(`#cv-dc`).classList.add('hidden');$(`#cv-dd`).classList.remove('hidden');$(`#cv-fn`).textContent=file.name;$(`#cv-wc`).textContent='Parsing...';$(`#cv-drop`).classList.add('hf');
  if(!S.field){$(`#cv-wc`).textContent='Select a field first';return}
  if(S.serverUp){
    try{
      const fd=new FormData();fd.append('cv',file);fd.append('field',S.field);
      const r=await fetch(getAPI()+'/api/parse-cv',{method:'POST',body:fd});
      if(!r.ok)throw new Error('Server error '+r.status);
      const data=await r.json();S.cvData=data;
      $(`#cv-wc`).textContent=`${data.wordCount||0} words parsed`;
      const sk=$('#cv-sk');sk.innerHTML='';
      (data.skills||[]).slice(0,20).forEach(s=>{const sp=document.createElement('span');sp.className='stg';sp.textContent=s;sk.appendChild(sp)});
      if(data.skills?.length)$(`#cv-prev`).classList.remove('hidden');
      toast('CV parsed — skills extracted!','ok');
    }catch(e){$(`#cv-wc`).textContent='Parse failed';S.cvData=null;toast('CV parse failed: '+e.message,'err')}
  }else{$(`#cv-wc`).textContent='Server offline — CV not parsed';S.cvData=null}
}

// ===== EVENTS =====
function initEvents(){
  switchAuthTab('login');
  // Mode selector
  $$('#mode-sel .md').forEach(b=>b.addEventListener('click',()=>{$$('#mode-sel .md').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');S.mode=b.dataset.m;$(`#team-prev`).classList.toggle('hidden',S.mode!=='team')}));
  // Field selection enables start button
  const fieldSel=$('#inp-field'),startBtn=$('#btn-start');
  fieldSel.addEventListener('change',()=>{startBtn.disabled=!fieldSel.value;S.field=fieldSel.value;S.fieldLabel=FL[S.field]||S.field});
  startBtn.addEventListener('click',startInt);
  $(`#btn-schedule`).addEventListener('click',scheduleInterview);
  // CV upload
  const drop=$('#cv-drop'),inp=$('#cv-inp');
  drop.addEventListener('click',()=>inp.click());
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dg')});
  drop.addEventListener('dragleave',()=>drop.classList.remove('dg'));
  drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dg');if(e.dataTransfer.files.length)handleCV(e.dataTransfer.files[0])});
  inp.addEventListener('change',()=>{if(inp.files.length)handleCV(inp.files[0])});
  // Mic test
  $(`#btn-mic`).addEventListener('click',()=>$(`#mt-area`).classList.toggle('hidden'));
  $(`#mt-go`).addEventListener('click',mtGo);$(`#mt-stop`).addEventListener('click',mtStop);
  // Server URL field
  $(`#adv-tog`).addEventListener('click',()=>{const p=$('#adv-p'),ch=$('#adv-ch');p.classList.toggle('hidden');ch.style.transform=p.classList.contains('hidden')?'':'rotate(180deg)'});
  const savedUrl=localStorage.getItem('ns_api_url')||'';if(savedUrl&&$('#inp-srv'))$(`#inp-srv`).value=savedUrl;
  $(`#inp-srv`)?.addEventListener('blur',()=>{const v=$('#inp-srv').value.trim();if(v)localStorage.setItem('ns_api_url',v);apiHealth()});
  // End interview button — guard against double-firing
  $(`#btn-end`).addEventListener('click',async()=>{
    if(S.ending||S.phase==='done')return;
    stt.stop();stopVisualizer();clearSilenceTimer();
    if(S.maxT){clearTimeout(S.maxT);S.maxT=null}
    await endInterview();
  });
  // Text input fallback
  function sendTyped(){const t=$('#inp-txt')?.value.trim();if(!t)return;S.isListening=false;processAnswer(t)}
  $(`#btn-send`).addEventListener('click',sendTyped);
  $(`#inp-txt`).addEventListener('keydown',e=>{if(e.key==='Enter')sendTyped()});
  // Nav logout
  $(`#nav-logout`).addEventListener('click',handleLogout);
  // Warn before leaving during active interview
  window.addEventListener('beforeunload',e=>{if(S.screen==='interview'&&!S.ending){e.preventDefault();e.returnValue='Your interview is in progress. Are you sure?'}});
}

// ===== AUTH PROFILE LOADER =====
async function loadProfile(user){
  const{data:profile,error}=await sb.from('profiles').select('*').eq('id',user.id).single();
  if(profile){
    const meta=user.user_metadata||{};const updates={};
    if(!profile.name&&meta.name)updates.name=meta.name;
    if(!profile.university&&meta.university)updates.university=meta.university;
    if(!profile.program&&meta.program)updates.program=meta.program;
    if(Object.keys(updates).length){await sb.from('profiles').update(updates).eq('id',user.id);S.profile={...profile,...updates}}
    else S.profile=profile;
  }else{
    // Trigger didn't fire — create profile manually
    const meta=user.user_metadata||{};
    const{data:np}=await sb.from('profiles').upsert({id:user.id,name:meta.name||user.email?.split('@')[0]||'User',university:meta.university||'',program:meta.program||'',role:'student'},{onConflict:'id'}).select().single();
    S.profile=np||{id:user.id,role:'student',name:meta.name||'User'};
  }
}

// ===== INIT =====
async function init(){
  mkP();tts.init();stt.init();initEvents();
  if(!isSC())$(`#pw-prot`).style.display='flex';
  if(!stt.ok)$(`#pw-stt`).style.display='flex';
  const today=new Date().toISOString().split('T')[0];const sd=$('#inp-sdate');if(sd)sd.min=today;
  apiHealth(); // non-blocking — don't await, let it run in background
  // FIX: use onAuthStateChange as single source of truth, not getSession+manual check
  sb.auth.onAuthStateChange(async(event,session)=>{
    if(event==='SIGNED_IN'&&session){
      S.user=session.user;
      await loadProfile(session.user);
      if(S.profile?.role==='admin'){loadAdmin();showScreen('admin')}
      else{loadDashboard();showScreen('dash')}
    }else if(event==='SIGNED_OUT'||event==='USER_DELETED'){
      S.user=null;S.profile=null;showScreen('auth');
    }
  });
  // Check for existing session on load
  const{data:{session}}=await sb.auth.getSession();
  if(!session)showScreen('auth');
  // If session exists, onAuthStateChange will have already fired SIGNED_IN
}

// polyfill roundRect for older browsers
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()}}
document.addEventListener('DOMContentLoaded',init);
