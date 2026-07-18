/* NS Interview Prep — Fixed & Polished */
const SB_URL='https://wfhteolnlrwbquxndvqs.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHRlb2xubHJ3YnF1eG5kdnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTQwMjEsImV4cCI6MjA5OTczMDAyMX0.2FBhcHGDS2-zfqrGVHWOy5GzN0fE_RKtDQw5rRgv81I';
const sb=window.supabase.createClient(SB_URL,SB_KEY);
const RENDER_URL='https://smart-prep-x8ce.onrender.com';

const S={
  screen:'auth',user:null,profile:null,name:'',field:'',fieldLabel:'',
  mode:'male',cvData:null,company:'',scheduleMode:false,
  internshipInfo:'',hasInternship:false,
  conversation:[],currentQ:0,totalQ:8,questionArc:[],phase:'idle',
  isListening:false,isSpeaking:false,serverUp:false,ending:false,
  studentQPhase:false,studentQCount:0,studentQMax:2,
  _coachTimer:null,
  micStream:null,audioCtx:null,analyser:null,animId:null,
  silenceT:null,maxT:null,finalTxt:'',interimTxt:'',
  currentIV:null,teamIdx:0,
  mtStream:null,mtCtx:null,mtAn:null,mtAnim:null,
  sessions:[],completions:[],
  vidStream:null,mediaRecorder:null,vidChunks:[],isRecording:false,currentSessionId:null
};

const FL={electrical:'Electrical & Electronic Engineering',mechanical:'Mechanical Engineering',mining:'Mining Engineering',civil:'Civil Engineering',computer:'Computer Engineering',chemical:'Chemical Engineering',petroleum:'Petroleum Engineering',aerospace:'Aerospace Engineering',agricultural:'Agricultural Engineering',biomedical:'Biomedical Engineering',geomatic:'Geomatic Engineering',materials:'Materials Engineering',health:'Health Sciences',business:'Business & Management',safety:'Fire Safety & Disaster Management',other:'General Studies'};
const FK={electrical:['circuit','voltage','current','power','transformer','motor','generator','pcb','plc','relay','wiring','solar','inverter','grid','substation','earthing','switchgear'],mechanical:['cad','thermodynamics','fluid','machine','design','manufacturing','welding','lathe','milling','turbine','pump','bearing','gear','stress','strain','fatigue'],mining:['excavation','drilling','blasting','ore','mineral','tailings','ventilation','shaft','slope','geology','rock','gold','underground','surface','survey'],civil:['concrete','steel','structure','foundation','survey','highway','drainage','soil','beam','column','slab','load','reinforcement','construction','site'],computer:['programming','software','hardware','microcontroller','embedded','algorithm','database','network','python','java','c++','iot','sensor','firmware','linux','arduino'],chemical:['reaction','process','distillation','heat transfer','mass transfer','piping','reactor','catalyst','polymer','fluid flow','thermodynamics','separation','plant','safety'],petroleum:['reservoir','drilling','production','refining','crude','well','pipeline','exploration','formation','gas','oil','upstream','downstream'],aerospace:['aerodynamics','propulsion','structure','flight','aircraft','engine','turbine','lift','drag','composites','avionics','simulation'],agricultural:['irrigation','soil','crop','machinery','processing','farm','tractor','harvest','post-harvest','drainage','greenhouse','yield'],biomedical:['medical','device','implant','biomaterial','prosthetic','diagnostic','tissue','clinical','sterilization','regulatory','signal','imaging'],geomatic:['gis','survey','gps','remote sensing','mapping','cartography','geodesy','photogrammetry','lidar','spatial','coordinate'],materials:['metallurgy','composite','polymer','ceramic','corrosion','heat treatment','alloy','microstructure','testing','characterization']};

const SP={male:{name:'Mr. Osei',gender:'male',pitch:0.85,rate:0.90,role:'Senior Engineer',focus:null,color:'#e8a023'},female:{name:'Ms. Amoako',gender:'female',pitch:1.12,rate:0.94,role:'HR Manager',focus:null,color:'#e8a023'}};
const TM=[{name:'Ama Darko',role:'HR Coordinator',focus:'behavioral',color:'#3b82f6',pitch:1.10,rate:0.95,gender:'female',intro:"Good day. I'm Ama Darko, HR Coordinator. I'll be asking you about your background and teamwork."},{name:'Mr. Osei',role:'Technical Lead',focus:'technical',color:'#e8a023',pitch:0.84,rate:0.89,gender:'male',intro:"I'm Mr. Osei, Technical Lead. I'll be assessing your technical knowledge and problem-solving."},{name:'Dr. Mensah',role:'Project Manager',focus:'cv_project',color:'#8b5cf6',pitch:0.95,rate:0.92,gender:'male',intro:"I'm Dr. Mensah. I'll focus on your projects, experience, and how you apply your knowledge."},{name:'Eng. Boateng',role:'Senior Engineer',focus:'scenario',color:'#22c55e',pitch:0.88,rate:0.87,gender:'male',intro:"I'm Engineer Boateng. I'll present you with real engineering scenarios to assess your judgement."}];

const FU={project:["Walk me through the technical approach for that project.","What was the most challenging aspect of that project?","What specific role did you play in the team?","If you could redo one aspect of that project, what would it be?","What tools and methods did you use, and why did you choose them?"],internship:["What specific technical tasks were you responsible for during that attachment?","How did the practical experience connect with what you learned in the classroom?","Can you describe a specific moment where you applied theory to a real problem?","What feedback did your supervisor give you about your performance?"],teamwork:["Can you give me a specific example of how you resolved a disagreement in that team?","How do you handle a team member who is not contributing their fair share?","In your experience, what is the most critical factor for effective teamwork?"],leadership:["How would you describe your leadership style?","Tell me about a time you had to motivate a group that was struggling.","What do you think is the difference between a good manager and a good leader?"],challenge:["Looking back, what would you do differently?","How did you manage the pressure during that period?","What did that experience teach you about yourself?"],skills:["Which of your technical skills do you consider your strongest, and why?","How have you continued to develop your skills outside of formal coursework?","Are there any specific skills you are actively working to improve right now?"],motivation:["What specifically drew you to this field of engineering?","Where do you see yourself professionally in five years?","What do you hope to contribute during your national service?"],academic:["Which courses from your program do you think will be most relevant in industry, and why?","Tell me about your final year project or dissertation.","How did you approach a particularly difficult course or subject?"]};

const PIV={project:"Tell me about a significant engineering project you have worked on.",internship:"Have you done any industrial attachment or internship? Tell me about it.",teamwork:"Share an experience where you worked effectively as part of a team.",leadership:"Have you ever been in a leadership or supervisory role? Tell me about it.",challenge:"Describe a significant challenge you faced and how you overcame it.",skills:"What technical skills have you developed that you are most proud of?",motivation:"What motivates you to pursue a career in engineering?",academic:"Which aspects of your coursework will be most useful when you enter industry?"};
const SCN={electrical:["A three-phase motor keeps tripping its circuit breaker shortly after startup. Walk me through your diagnostic approach step by step.","A client wants to upgrade their facility from single-phase to three-phase power supply. What key factors do you assess?"],mechanical:["A centrifugal pump in a processing plant is vibrating excessively. How would you systematically investigate this problem?","You need to select a bearing for a high-speed rotating shaft. What factors guide your selection?"],mining:["You are asked to assess slope stability at a new open-pit site. Walk me through your approach.","After a blast, there is significantly more flyrock than anticipated. How do you investigate and prevent recurrence?"],civil:["You inspect a freshly poured concrete structure and notice surface cracking. What are your immediate steps?","A newly constructed road has serious drainage problems after the first rainy season. How do you diagnose and fix this?"],computer:["An embedded system is behaving erratically in the field but works fine in the lab. How do you debug this?","You need to connect a network of sensors across a factory floor to a central monitoring dashboard. Describe your architecture."],chemical:["A reactor's yield has dropped unexpectedly over three weeks. How do you troubleshoot this systematically?","You are selecting materials for a new piping system handling corrosive chemicals. What considerations guide your decision?"],petroleum:["A production well's output rate has dropped significantly over two months. What steps do you take to investigate?","How would you approach minimizing the environmental impact of operations at a production site?"],aerospace:["A structural component fails at 80% of its expected load during testing. How do you investigate the failure?","You are selecting a composite material for an interior aircraft panel. What properties do you prioritize?"],agricultural:["An irrigation system is underperforming and crop yields are below expectation. How do you assess and fix this?","Describe how you would design an intervention to reduce post-harvest losses for a specific staple crop."],biomedical:["A medical device fails sterilization validation. What are your next steps?","You are choosing a biomaterial for a long-term implant. What biocompatibility and mechanical properties are critical?"],geomatic:["Your GPS survey is giving inconsistent results across a site. What do you check and how do you resolve it?","You need to produce a topographic map of a site with dense forest cover. What methods and tools do you use?"],materials:["A metal component in a machine is failing prematurely through fracture. How do you investigate the failure mode?","You need to specify a heat treatment process for a steel shaft to achieve high surface hardness with a tough core. What process do you recommend?"]};
const FTQ={electrical:["Explain the difference between a relay and a contactor, and when you would use each.","How would you design the power distribution layout for a small manufacturing facility?"],mechanical:["What factors do you consider when selecting a bearing for a specific application?","Compare soldering, brazing, and welding — when is each technique most appropriate?"],mining:["What are the key factors that determine open-pit slope stability?","Describe the main stages of mineral processing after ore is extracted."],civil:["What tests would you specify for concrete before it is used in a structural application?","Explain the difference between shallow and deep foundations and when each is used."],computer:["What is the fundamental difference between a microprocessor and a microcontroller?","Walk me through your approach to debugging a malfunctioning embedded system."],chemical:["Compare batch and continuous processing — what are the trade-offs?","Name three types of heat exchangers and describe the application each is suited for."],petroleum:["Explain the difference between upstream, midstream, and downstream in the oil and gas industry.","What is enhanced oil recovery, and what are the main techniques used?"],aerospace:["Name and explain the four fundamental forces acting on an aircraft in flight.","What are the key considerations when certifying a new aircraft design for airworthiness?"],agricultural:["How would you design an irrigation scheme for a 10-hectare smallholder farm?","What post-harvest technologies are most effective for reducing losses in cereal crops?"],biomedical:["What key considerations guide the design and development of a medical device?","Explain the concept of biocompatibility and why it matters for implantable devices."],geomatic:["How does differential GPS improve the accuracy of a survey?","What are the main sources of error in a large-scale surveying project and how do you mitigate them?"],materials:["Explain the factors you consider when selecting a material for a structural application.","What is the purpose of annealing and how does it change the properties of a metal?"]};
const Q_ARC=['intro','cv_based','technical','behavioral','cv_based','technical','scenario','closing'];

// ===== DYNAMIC QUESTION ARC — shuffled each session =====
const Q_POOL={
  intro:['intro'],
  behavioral:['behavioral','behavioral','behavioral'],
  technical:['technical','technical','technical'],
  cv:['cv_based','cv_based'],
  scenario:['scenario','scenario'],
  closing:['closing']
};
function buildArc(total){
  // Always: intro first, closing last
  // Middle: shuffle a balanced mix of behavioral, technical, cv, scenario
  const mid=[];
  const slots={behavioral:Math.round(total*0.25),technical:Math.round(total*0.30),cv:Math.round(total*0.25),scenario:Math.round(total*0.10)};
  let filled=0;
  for(const[k,n]of Object.entries(slots)){for(let i=0;i<n&&filled<total-2;i++){mid.push(k==='cv'?'cv_based':k);filled++}}
  // Shuffle middle
  for(let i=mid.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[mid[i],mid[j]]=[mid[j],mid[i]]}
  // Fill remainder with followup
  while(mid.length<total-2)mid.push('followup');
  return['intro',...mid.slice(0,total-2),'closing'];
}

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
  // Hide/show forms
  $(`#form-login`).classList.toggle('hidden',t!=='login');
  $(`#form-signup`).classList.toggle('hidden',t!=='signup');
  $(`#form-forgot`)?.classList.add('hidden');
  // Update tab button styles
  const li=$(`#tab-login`),su=$(`#tab-signup`);
  if(t==='login'){
    li.style.background='linear-gradient(135deg,#7c3aed,#6d28d9)';li.style.color='#fff';
    su.style.background='';su.style.color='#6b7280';
  } else {
    su.style.background='linear-gradient(135deg,#7c3aed,#06b6d4)';su.style.color='#fff';
    li.style.background='';li.style.color='#6b7280';
  }
  $(`#auth-err`).classList.add('hidden');
}

async function handleLogin(){
  const btn=$('#btn-li'),e=$('#li-email').value.trim(),p=$('#li-pass').value;
  if(!e||!p){showAE('Please fill in both email and password.');return}
  $(`#auth-err`).classList.add('hidden');
  if(btn){btn.disabled=true;btn.textContent='Signing in...'}
  const{data,error}=await sb.auth.signInWithPassword({email:e,password:p});
  if(btn){btn.disabled=false;btn.textContent='Sign In'}
  if(error){
    // Give friendlier messages for common errors
    if(error.message.includes('Invalid login')||error.message.includes('invalid_credentials'))
      showAE('Incorrect email or password. Please check and try again.');
    else if(error.message.includes('Email not confirmed'))
      showAE('Please verify your email first. Check your inbox for a confirmation link.');
    else
      showAE(error.message);
    return;
  }
  // If we have a session, onAuthStateChange fires — nothing else needed here
  if(!data?.session)showAE('Sign in failed. Please try again.');
}

async function handleSignup(){
  const btn=$('#btn-su');
  const n=$('#su-name').value.trim();
  let u=$('#su-uni').value;
  if(u==='other'){u=$('#su-uni-other')?.value.trim()||'Other';}

  const progRaw=$('#su-prog')?.value||'';
  let pr='', progCategory='';
  if(progRaw.startsWith('other')){
    pr=$('#su-prog-other')?.value.trim()||'Other';progCategory='other';
  } else if(progRaw.includes('|')){
    [pr,progCategory]=progRaw.split('|');
  } else {pr=progRaw;progCategory='';}

  const e=$('#su-email').value.trim(), p=$('#su-pass').value;
  if(!n){showAE('Please enter your full name.');return}
  if(!e){showAE('Please enter your email address.');return}
  if(!p||p.length<6){showAE('Password must be at least 6 characters.');return}
  $(`#auth-err`).classList.add('hidden');
  if(btn){btn.disabled=true;btn.textContent='Creating account...'}

  const{data,error}=await sb.auth.signUp({email:e,password:p,options:{data:{
    name:n,university:u,program:pr,program_category:progCategory
  }}});

  if(btn){btn.disabled=false;btn.textContent='Create Account'}

  if(error){
    if(error.message.includes('already registered')||error.message.includes('already been registered'))
      showAE('This email is already registered. Try signing in instead.');
    else
      showAE(error.message);
    return;
  }

  // Clear form fields
  ['su-name','su-prog-other','su-email','su-pass'].forEach(id=>{
    const el=$(`#${id}`);if(el)el.value='';
  });
  $(`#su-uni`).value='';$(`#su-prog`).value='';
  $(`#su-uni-other`)?.classList.add('hidden');
  $(`#su-prog-other`)?.classList.add('hidden');

  if(data?.user&&data.session){
    // Email confirmation is OFF — user is signed in immediately
    toast('Welcome to NS Interview Prep!','ok');
    // onAuthStateChange will handle navigation
  } else if(data?.user&&!data.session){
    // Email confirmation is ON — need to verify
    showAE('');
    $(`#auth-err`).innerHTML=`<i class="fa-solid fa-envelope mt-0.5 shrink-0" style="color:#06b6d4"></i><span style="color:#67e8f9">Account created! Check your email inbox for a verification link, then sign in.</span>`;
    $(`#auth-err`).classList.remove('hidden');
    switchAuthTab('login');
  } else {
    toast('Account created! Please sign in.','ok');
    switchAuthTab('login');
  }
}

function showAE(m){const e=$(`#auth-err`);e.innerHTML=`<i class="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i><span>${esc(m)}</span>`;e.classList.remove('hidden')}
async function handleLogout(){await sb.auth.signOut();S.user=null;S.profile=null;S.sessions=[];showScreen('auth')}

// Toggle password visibility
function togglePw(fieldId,btn){
  const inp=$(`#${fieldId}`);if(!inp)return;
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.querySelector('i').className=show?'fa-solid fa-eye-slash text-xs':'fa-solid fa-eye text-xs';
}

// Show forgot password form
function showForgotPassword(){
  $(`#form-login`).classList.add('hidden');
  $(`#form-signup`).classList.add('hidden');
  $(`#form-forgot`).classList.remove('hidden');
  $(`#tab-login`).style.background='';$(`#tab-login`).style.color='#6b7280';
  $(`#tab-signup`).style.background='';$(`#tab-signup`).style.color='#6b7280';
  $(`#auth-err`).classList.add('hidden');
}

async function handleForgotPassword(){
  const email=$(`#fp-email`)?.value.trim();
  if(!email){toast('Enter your email address.','err');return}
  const btn=$('#btn-fp');if(btn){btn.disabled=true;btn.textContent='Sending...'}
  const{error}=await sb.auth.resetPasswordForEmail(email,{
    redirectTo:window.location.origin+'/#reset-password'
  });
  if(btn){btn.disabled=false;btn.textContent='Send Reset Link'}
  if(error){toast('Error: '+error.message,'err');return}
  const msg=$('#fp-msg');if(msg){msg.textContent='✅ Reset link sent! Check your email inbox (and spam folder).';msg.classList.remove('hidden')}
  toast('Reset link sent to '+email,'ok');
}

function handleUniChange(sel){
  const other=$('#su-uni-other');
  if(sel.value==='other'){other.classList.remove('hidden');other.focus()}
  else other.classList.add('hidden');
}

function handleProgChange(sel){
  const other=$('#su-prog-other');
  if(sel.value.startsWith('other')){other.classList.remove('hidden');other.focus()}
  else other.classList.add('hidden');
}

function handleInternChange(sel){
  const detail=$('#su-intern-detail');
  if(sel.value==='yes'){detail.classList.remove('hidden');detail.focus()}
  else detail.classList.add('hidden');
}

function handleSetupFieldChange(sel){
  const v=sel.value;
  S.field=v;
  S.fieldLabel=FL[v]||(sel.options[sel.selectedIndex]?.text||v);
  const startBtn=$('#btn-start');
  if(startBtn)startBtn.disabled=!v;
}

// ===== TTS — richer voice, sentence-aware pacing, interruptible =====
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
      // Check for interruption between sentences
      if(!S.isSpeaking)break;
      const s=segs[i].trim();if(!s)continue;
      await this._utterance(s,cfg);
      // Natural pause between sentences — but bail if interrupted
      if(i<segs.length-1&&S.isSpeaking)await sl(150+Math.random()*120);
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
      const timer=setTimeout(()=>{resolve()},timeout);
      u.onend=()=>{clearTimeout(timer);resolve()};
      u.onerror=()=>{clearTimeout(timer);resolve()};
      this.syn.speak(u);
    });
  },
  stop(){S.isSpeaking=false;this.syn.cancel()},
  _pickVoice(gender){return gender==='female'?(this.fV||this.mV):(this.mV||this.fV)}
};

// ===== SMART STT — VAD + Whisper + Web Speech interim display =====
//
// Architecture:
//   1. Web Speech API  → live interim text display ONLY (visual feedback)
//   2. MediaRecorder   → captures raw audio chunks the whole time
//   3. Web Audio VAD   → detects speech/silence via energy threshold
//   4. On "done":      → send audio blob to /api/transcribe (Whisper) for
//                         accurate final transcript; fall back to Web Speech final text
//
// "Done" is triggered when:
//   a) 2.5s of continuous silence AFTER at least 1 word was heard, OR
//   b) user manually hits Submit/Enter, OR
//   c) 90s safety timeout
//
// Interruption: if user speaks while TTS is playing → TTS is stopped immediately

const stt = {
  // ── Web Speech (interim display only) ──────────────────────────────────
  rec: null, wsOk: false,
  // ── Audio recording ─────────────────────────────────────────────────────
  recorder: null, chunks: [], audioStream: null,
  // ── VAD state ───────────────────────────────────────────────────────────
  vadNode: null, vadInterval: null,
  speechDetected: false, silenceMs: 0,
  SPEECH_THRESH: 18,   // energy level 0-255 above which we consider "speech"
  SILENCE_WAIT: 2500,  // ms of silence to wait before submitting
  VAD_TICK: 80,        // ms between VAD checks
  // ── Callbacks ───────────────────────────────────────────────────────────
  _onResult: null, _onEnd: null,

  init() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      this.rec = new SR();
      this.rec.continuous = true;
      this.rec.interimResults = true;
      this.rec.lang = 'en-US';
      this.wsOk = true;
    }
  },

  // ── Start listening ─────────────────────────────────────────────────────
  start(onResult, onEnd) {
    this._onResult = onResult;
    this._onEnd = onEnd;
    S.finalTxt = ''; S.interimTxt = '';
    this.chunks = [];
    this.speechDetected = false;
    this.silenceMs = 0;

    // 1. Start Web Speech for live interim display
    this._startWebSpeech();

    // 2. Start MediaRecorder on the existing audio stream (from startMedia)
    this._startRecorder();

    // 3. Start VAD loop
    this._startVAD();

    return true;
  },

  // ── Web Speech (display only, NOT used for final transcript) ────────────
  _startWebSpeech() {
    if (!this.wsOk) return;
    let wsAccum = '';
    this.rec.onresult = e => {
      if (!S.isListening) return;
      let sessionFinal = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { sessionFinal += t; }
        else { interim += t; }
      }
      if (sessionFinal) {
        wsAccum += ' ' + sessionFinal;
        S.finalTxt = wsAccum.trim();
        S.interimTxt = '';
      } else if (interim) {
        S.interimTxt = interim;
      }
      if (this._onResult) this._onResult(S.finalTxt, S.interimTxt);
      // Reset VAD silence counter when Web Speech confirms speech
      this.silenceMs = 0;
      this.speechDetected = true;
    };
    this.rec.onend = () => {
      if (S.isListening) { try { this.rec.start(); } catch (e) {} }
    };
    this.rec.onerror = e => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.warn('Web Speech error:', e.error);
      }
    };
    try { this.rec.start(); } catch (e) {}
  },

  // ── MediaRecorder: capture raw audio ────────────────────────────────────
  _startRecorder() {
    // Prefer the existing mic stream from startMedia
    const stream = S.micStream || (S.vidStream
      ? new MediaStream(S.vidStream.getAudioTracks())
      : null);
    if (!stream) { console.warn('No audio stream for recorder'); return; }

    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg'
      : '';

    try {
      this.recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      this.recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) this.chunks.push(e.data);
      };
      this.recorder.start(200); // collect in 200ms chunks for low latency
      this.audioStream = stream;
    } catch (err) {
      console.warn('stt recorder failed:', err.message);
    }
  },

  // ── VAD loop: energy-based voice activity detection ─────────────────────
  _startVAD() {
    if (!S.analyser) return;
    const data = new Uint8Array(S.analyser.frequencyBinCount);

    this.vadInterval = setInterval(() => {
      if (!S.isListening) return;
      S.analyser.getByteFrequencyData(data);

      // Average energy of speech-range frequencies (300Hz–3kHz)
      // For fftSize=256 and typical sampleRate=48000, bin width ≈ 187Hz
      // bins 2-16 cover roughly 300Hz–3000Hz
      let sum = 0, count = 0;
      const lo = 2, hi = Math.min(16, data.length - 1);
      for (let i = lo; i <= hi; i++) { sum += data[i]; count++; }
      const energy = count > 0 ? sum / count : 0;

      if (energy > this.SPEECH_THRESH) {
        // ── Active speech detected ──────────────────────────────────────
        this.speechDetected = true;
        this.silenceMs = 0;

        // INTERRUPT TTS if user starts talking while interviewer is speaking
        if (S.isSpeaking) {
          tts.stop();
          setPhase('listening');
        }
      } else {
        // ── Silence ─────────────────────────────────────────────────────
        if (this.speechDetected) {
          this.silenceMs += this.VAD_TICK;
          if (this.silenceMs >= this.SILENCE_WAIT) {
            // User has been silent long enough — submit
            this.stop();
          }
        }
      }
    }, this.VAD_TICK);
  },

  // ── Stop listening and submit ────────────────────────────────────────────
  stop() {
    if (!S.isListening) return;
    S.isListening = false;

    // Stop VAD
    if (this.vadInterval) { clearInterval(this.vadInterval); this.vadInterval = null; }
    this.silenceMs = 0;
    clearSilenceTimer();

    // Stop Web Speech
    try { if (this.rec) this.rec.stop(); } catch (e) {}

    // Stop recorder and get blob
    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.onstop = () => { this._submitAudio(); };
      try { this.recorder.stop(); } catch (e) { this._submitAudio(); }
    } else {
      this._submitAudio();
    }
  },

  // ── Send audio to Whisper, fall back to Web Speech text ─────────────────
  async _submitAudio() {
    const wsText = (S.finalTxt || S.interimTxt || '').trim();

    if (this.chunks.length === 0) {
      // No audio recorded — use whatever Web Speech gave us
      if (this._onEnd) this._onEnd(wsText);
      return;
    }

    // Try Whisper transcription if server is up
    let whisperText = '';
    if (S.serverUp) {
      try {
        const mimeType = this.recorder?.mimeType || 'audio/webm';
        const ext = mimeType.includes('ogg') ? '.ogg' : '.webm';
        const blob = new Blob(this.chunks, { type: mimeType });
        // Only send if audio is substantial (>2KB = has real content)
        if (blob.size > 2000) {
          const fd = new FormData();
          fd.append('audio', blob, 'answer' + ext);
          const resp = await fetch(getAPI() + '/api/transcribe', {
            method: 'POST',
            body: fd,
            signal: AbortSignal.timeout(15000),
          });
          if (resp.ok) {
            const data = await resp.json();
            whisperText = (data.transcript || '').trim();
          }
        }
      } catch (err) {
        console.warn('Whisper transcription failed, falling back to Web Speech:', err.message);
      }
    }

    this.chunks = [];
    // Prefer Whisper result; fall back to Web Speech accumulation
    const finalText = whisperText || wsText;
    if (this._onEnd) this._onEnd(finalText);
  },
};

function resetSilenceTimer() {
  clearSilenceTimer();
  // Backup timer — 90s absolute max (VAD handles normal silence detection)
  S.silenceT = setTimeout(() => { if (S.isListening) stt.stop(); }, 90000);
}
function clearSilenceTimer() {
  if (S.silenceT) { clearTimeout(S.silenceT); S.silenceT = null; }
}

// ===== TRANSCRIPT TOGGLE =====
let transcriptVisible=true;
function toggleTranscript(){
  transcriptVisible=!transcriptVisible;
  const wrap=$('#ta-wrap');
  const eye=$('#transcript-eye');
  const lbl=$('#transcript-label');
  const dot=$('#transcript-dot');
  if(!wrap)return;
  if(transcriptVisible){
    wrap.style.display='';
    wrap.style.maxHeight='38vh';
    if(eye)eye.className='fa-solid fa-eye text-[9px]';
    if(lbl)lbl.textContent='Hide';
    if(dot)dot.style.background='#7c3aed';
  }else{
    wrap.style.display='none';
    if(eye)eye.className='fa-solid fa-eye-slash text-[9px]';
    if(lbl)lbl.textContent='Show';
    if(dot)dot.style.background='#6b7280';
  }
}

// ===== VIDEO SIZE TOGGLE =====
let videoExpanded=false;
function toggleVideoSize(){
  videoExpanded=!videoExpanded;
  const vp=$('#vid-prev'),icon=$('#vid-expand-icon');
  if(!vp)return;
  if(videoExpanded){
    vp.classList.add('expanded');
    if(icon)icon.className='fa-solid fa-compress text-[9px]';
  }else{
    vp.classList.remove('expanded');
    if(icon)icon.className='fa-solid fa-expand text-[9px]';
  }
}

// ===== INTERVIEWER PORTRAITS =====
// Field → array of {emoji, name, role, gender, pitch, rate, color}
const IV_PROFILES={
  electrical:[
    {emoji:'👨🏿‍🔧',name:'Eng. Asante',role:'Electrical Engineer',gender:'male',pitch:.85,rate:.90,color:'#e8a023'},
    {emoji:'👩🏿‍💼',name:'Mrs. Boateng',role:'HR Manager',gender:'female',pitch:1.1,rate:.94,color:'#06b6d4'},
    {emoji:'👨🏾‍💼',name:'Dr. Mensah',role:'Technical Director',gender:'male',pitch:.92,rate:.88,color:'#8b5cf6'},
  ],
  mechanical:[
    {emoji:'👷🏿‍♂️',name:'Eng. Owusu',role:'Senior Mech. Engineer',gender:'male',pitch:.84,rate:.89,color:'#e8a023'},
    {emoji:'👩🏾‍🔬',name:'Dr. Amoah',role:'R&D Engineer',gender:'female',pitch:1.08,rate:.93,color:'#10b981'},
    {emoji:'🧑🏿‍🏭',name:'Mr. Darko',role:'Plant Manager',gender:'male',pitch:.90,rate:.91,color:'#8b5cf6'},
  ],
  mining:[
    {emoji:'⛑️',name:'Eng. Frimpong',role:'Mine Engineer',gender:'male',pitch:.82,rate:.88,color:'#f59e0b'},
    {emoji:'👩🏿‍💼',name:'Ms. Acheampong',role:'Safety Officer',gender:'female',pitch:1.1,rate:.95,color:'#10b981'},
    {emoji:'👨🏾‍💼',name:'Mr. Appiah',role:'Geology Lead',gender:'male',pitch:.88,rate:.90,color:'#06b6d4'},
  ],
  civil:[
    {emoji:'🏗️',name:'Eng. Boadu',role:'Civil Engineer',gender:'male',pitch:.86,rate:.90,color:'#e8a023'},
    {emoji:'👩🏾‍💼',name:'Mrs. Ansah',role:'Project Manager',gender:'female',pitch:1.1,rate:.94,color:'#8b5cf6'},
    {emoji:'👨🏿‍💼',name:'Dr. Osei',role:'Structural Director',gender:'male',pitch:.90,rate:.88,color:'#06b6d4'},
  ],
  computer:[
    {emoji:'👨🏿‍💻',name:'Eng. Asare',role:'Software Engineer',gender:'male',pitch:.88,rate:.92,color:'#06b6d4'},
    {emoji:'👩🏾‍💻',name:'Ms. Tetteh',role:'Tech Lead',gender:'female',pitch:1.12,rate:.95,color:'#8b5cf6'},
    {emoji:'🧑🏿‍💼',name:'Mr. Adjei',role:'CTO',gender:'male',pitch:.85,rate:.89,color:'#e8a023'},
  ],
  chemical:[
    {emoji:'🧪',name:'Dr. Kumi',role:'Process Engineer',gender:'male',pitch:.87,rate:.90,color:'#10b981'},
    {emoji:'👩🏿‍🔬',name:'Dr. Asante',role:'Chemical Engineer',gender:'female',pitch:1.08,rate:.93,color:'#06b6d4'},
    {emoji:'👨🏾‍💼',name:'Mr. Quaye',role:'Plant Supervisor',gender:'male',pitch:.92,rate:.91,color:'#e8a023'},
  ],
  petroleum:[
    {emoji:'🛢️',name:'Eng. Agyei',role:'Petroleum Engineer',gender:'male',pitch:.84,rate:.89,color:'#f59e0b'},
    {emoji:'👩🏾‍💼',name:'Mrs. Asante',role:'Reservoir Engineer',gender:'female',pitch:1.10,rate:.94,color:'#e8a023'},
    {emoji:'👨🏿‍💼',name:'Dr. Baffour',role:'Upstream Manager',gender:'male',pitch:.90,rate:.90,color:'#06b6d4'},
  ],
  agricultural:[
    {emoji:'🌾',name:'Dr. Peprah',role:'Agricultural Engineer',gender:'male',pitch:.88,rate:.91,color:'#10b981'},
    {emoji:'👩🏿‍🌾',name:'Mrs. Sarpong',role:'Agric. Consultant',gender:'female',pitch:1.1,rate:.94,color:'#84cc16'},
    {emoji:'👨🏾‍💼',name:'Mr. Acheampong',role:'Field Manager',gender:'male',pitch:.86,rate:.89,color:'#e8a023'},
  ],
  biomedical:[
    {emoji:'🩺',name:'Dr. Mensah',role:'Biomedical Engineer',gender:'male',pitch:.90,rate:.91,color:'#10b981'},
    {emoji:'👩🏿‍⚕️',name:'Dr. Asamoah',role:'Clinical Engineer',gender:'female',pitch:1.10,rate:.95,color:'#06b6d4'},
    {emoji:'🧑🏾‍💼',name:'Mr. Ofori',role:'Device Specialist',gender:'male',pitch:.88,rate:.90,color:'#8b5cf6'},
  ],
  geomatic:[
    {emoji:'🗺️',name:'Eng. Otibu',role:'Geomatics Engineer',gender:'male',pitch:.86,rate:.90,color:'#e8a023'},
    {emoji:'👩🏿‍💼',name:'Ms. Fofie',role:'Survey Consultant',gender:'female',pitch:1.08,rate:.93,color:'#06b6d4'},
    {emoji:'👨🏾‍💼',name:'Dr. Donkor',role:'GIS Specialist',gender:'male',pitch:.90,rate:.89,color:'#8b5cf6'},
  ],
  materials:[
    {emoji:'⚗️',name:'Dr. Tawiah',role:'Materials Engineer',gender:'male',pitch:.87,rate:.90,color:'#e8a023'},
    {emoji:'👩🏾‍🔬',name:'Dr. Bonsu',role:'Metallurgist',gender:'female',pitch:1.10,rate:.94,color:'#06b6d4'},
    {emoji:'👨🏿‍💼',name:'Mr. Ntim',role:'QA Manager',gender:'male',pitch:.92,rate:.91,color:'#8b5cf6'},
  ],
  health:[
    {emoji:'👨🏿‍⚕️',name:'Dr. Antwi',role:'Clinical Supervisor',gender:'male',pitch:.88,rate:.91,color:'#10b981'},
    {emoji:'👩🏿‍⚕️',name:'Dr. Forson',role:'Senior Nurse',gender:'female',pitch:1.1,rate:.94,color:'#06b6d4'},
    {emoji:'🧑🏾‍💼',name:'Mr. Asante',role:'HR Officer',gender:'male',pitch:.90,rate:.90,color:'#8b5cf6'},
  ],
  business:[
    {emoji:'👔',name:'Mr. Amponsah',role:'Business Manager',gender:'male',pitch:.88,rate:.91,color:'#e8a023'},
    {emoji:'👩🏾‍💼',name:'Mrs. Owusu',role:'HR Director',gender:'female',pitch:1.10,rate:.94,color:'#8b5cf6'},
    {emoji:'🧑🏿‍💼',name:'Dr. Kusi',role:'Finance Lead',gender:'male',pitch:.86,rate:.90,color:'#06b6d4'},
  ],
  safety:[
    {emoji:'🦺',name:'Eng. Osei',role:'Safety Officer',gender:'male',pitch:.86,rate:.90,color:'#f59e0b'},
    {emoji:'👩🏿‍💼',name:'Mrs. Adusei',role:'HSE Manager',gender:'female',pitch:1.10,rate:.94,color:'#e8a023'},
    {emoji:'👨🏾‍🚒',name:'Mr. Bediako',role:'Emergency Coordinator',gender:'male',pitch:.88,rate:.89,color:'#ef4444'},
  ],
};
// Default fallback
const IV_DEFAULT=[
  {emoji:'🧑🏿‍💼',name:'Mr. Osei',role:'Senior Interviewer',gender:'male',pitch:.85,rate:.90,color:'#e8a023'},
  {emoji:'👩🏿‍💼',name:'Ms. Amoako',role:'HR Manager',gender:'female',pitch:1.12,rate:.94,color:'#06b6d4'},
];

function getFieldInterviewers(field){
  return IV_PROFILES[field]||IV_DEFAULT;
}
// Pick a random interviewer for this session (persists for the session)
function pickSessionInterviewer(field){
  const pool=getFieldInterviewers(field);
  return pool[Math.floor(Math.random()*pool.length)];
}
function updatePortrait(iv){
  const portrait=$('#iv-portrait');
  const nameCard=$('#iv-name-card');
  const roleCard=$('#iv-role-card');
  const statusDot=$('#iv-status-dot');
  if(portrait)portrait.textContent=iv.emoji||'🧑🏿‍💼';
  if(nameCard)nameCard.textContent=iv.name||'Interviewer';
  if(roleCard)roleCard.textContent=iv.role||'Interviewer';
  if(statusDot)statusDot.style.background=iv.color||'#7c3aed';
  // Also update the d-iname label
  const iname=$('#d-iname');
  if(iname){iname.textContent=iv.name+' — '+iv.role;iname.style.color=iv.color||'#888'}
}
function toggleCamera(){
  const vid=$('#vid-prev'),icon=$('#cam-icon');
  if(!S.vidStream){toast('Camera not available.','err');return}
  if(vid.classList.contains('hidden')){
    vid.classList.remove('hidden');icon.className='fa-solid fa-video text-xs';
    toast('Camera on','ok');
  }else{
    vid.classList.add('hidden');icon.className='fa-solid fa-video-slash text-xs';
    toast('Camera hidden','info');
  }
}

// ===== CONFIRM LEAVE =====
function confirmLeave(){
  if(S.phase==='done'){showScreen('dash');return}
  // Show a simple confirm overlay
  const msg='Leave the interview? Your progress will be saved up to this point.';
  if(confirm(msg)){
    S.ending=true;
    stt.stop();
    // Clean up VAD and recorder
    if(stt.vadInterval){clearInterval(stt.vadInterval);stt.vadInterval=null}
    if(stt.recorder&&stt.recorder.state!=='inactive'){try{stt.recorder.stop()}catch(e){};stt.recorder=null}
    stopVisualizer();clearSilenceTimer();
    if(S.maxT){clearTimeout(S.maxT);S.maxT=null}
    tts.stop();
    stopVideoRecording().then(()=>{
      finaliseInterview();
    });
  }
}

// ===== SPEAKER TEST — plays a short 440Hz beep via Web Audio =====
function testSpeaker(){
  const btn=$('#btn-spk-test'),status=$('#spk-status');
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.frequency.value=440;osc.type='sine';
    gain.gain.setValueAtTime(0.4,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.8);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.8);
    osc.onended=()=>{ctx.close()};
    if(status)status.textContent='✅ Did you hear a beep? If yes, your speaker is working!';
    if(status)status.style.color='#10b981';
    if(btn)btn.textContent='🔊 Play Again';
  }catch(e){
    if(status)status.textContent='❌ Could not play audio: '+e.message;
    if(status)status.style.color='#ef4444';
  }
}
// ===== MEDIA — separate audio/video for iOS graceful degradation =====
async function startMedia(){
  // Step 1: Request audio (critical — must succeed for interview to work)
  let audioStream=null;
  try{
    audioStream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
  }catch(ae){
    console.warn('Mic denied:',ae.message);
    $(`#vid-prev`).classList.add('hidden');$(`#rec-dot`).classList.add('hidden');$(`#rec-label`)?.classList.add('hidden');
    $(`#inp-txt`).disabled=false;$(`#btn-send`).disabled=false;
    $(`#d-st`).textContent='Mic unavailable — type your answers below';$(`#d-st`).style.color='#f59e0b';
    toast('Mic access denied — type your answers instead.','err');
    return false;
  }

  // Step 2: Set up audio analyser immediately (so visualizer AND VAD work)
  S.audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  await S.audioCtx.resume(); // always force resume
  S.analyser=S.audioCtx.createAnalyser();
  S.analyser.fftSize=256;
  S.analyser.minDecibels=-90;
  S.analyser.maxDecibels=-10;
  S.analyser.smoothingTimeConstant=0.6; // less smoothing = more responsive for VAD
  const micSource = S.audioCtx.createMediaStreamSource(audioStream);
  micSource.connect(S.analyser);
  // Save the pure mic stream so stt recorder can use it independently
  S.micStream = audioStream;

  // Step 3: Request camera separately — if denied, interview continues audio-only
  try{
    const videoStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
    // Combine audio + video tracks into one stream
    const combined=new MediaStream([...audioStream.getAudioTracks(),...videoStream.getVideoTracks()]);
    S.vidStream=combined;
    $(`#vid-self`).srcObject=combined;
    $(`#vid-prev`).classList.remove('hidden');
    $(`#rec-dot`).classList.remove('hidden');$(`#rec-label`)?.classList.remove('hidden');
    // Start recording combined stream
    S.vidChunks=[];
    const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':
                MediaRecorder.isTypeSupported('video/webm')?'video/webm':'video/mp4';
    try{
      S.mediaRecorder=new MediaRecorder(combined,{mimeType:mime});
      S.mediaRecorder.ondataavailable=e=>{if(e.data.size>0)S.vidChunks.push(e.data)};
      S.mediaRecorder.start(1000);S.isRecording=true;
    }catch(re){console.warn('Recorder failed, continuing without recording:',re.message)}
  }catch(ve){
    // Camera denied or not available — audio-only, still fully functional
    console.warn('Camera unavailable, audio-only mode:',ve.message);
    S.micStream=audioStream;
    $(`#vid-prev`).classList.add('hidden');$(`#rec-dot`).classList.add('hidden');$(`#rec-label`)?.classList.add('hidden');
  }
  return true;
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
      ctx.fillStyle=`rgba(16,185,129,${a})`;ctx.beginPath();ctx.roundRect(px,c.height-h,bw-1.5,h,2);ctx.fill();px+=bw;
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
    // Stop stt recorder first to avoid resource conflicts
    if(stt.recorder&&stt.recorder.state!=='inactive'){
      try{stt.recorder.stop()}catch(e){}
      stt.recorder=null;
    }
    if(!S.mediaRecorder||!S.isRecording){resolve(null);return}
    S.isRecording=false; // guard against double calls
    S.mediaRecorder.onstop=async()=>{
      const blob=new Blob(S.vidChunks,{type:'video/webm'});S.vidChunks=[];
      if(S.vidStream){S.vidStream.getTracks().forEach(t=>t.stop());S.vidStream=null}
      if(S.micStream){S.micStream.getTracks().forEach(t=>t.stop());S.micStream=null}
      if(S.audioCtx){S.audioCtx.close().catch(()=>{});S.audioCtx=null}
      $(`#vid-self`).srcObject=null;
      $(`#vid-prev`).classList.add('hidden');
      $(`#rec-dot`).classList.add('hidden');
      $(`#rec-label`)?.classList.add('hidden');
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
// ===== MIC TEST =====
async function mtGo(){
  // Clean up previous test without nulling mtAn yet (mtStop does that)
  if(S.mtAnim){cancelAnimationFrame(S.mtAnim);S.mtAnim=null}
  if(S.mtStream){S.mtStream.getTracks().forEach(t=>t.stop());S.mtStream=null}
  if(S.mtCtx){try{await S.mtCtx.close()}catch(e){};S.mtCtx=null}
  S.mtAn=null;

  try{
    // Request mic permission
    S.mtStream=await navigator.mediaDevices.getUserMedia({audio:{
      echoCancellation:true,noiseSuppression:true,autoGainControl:true
    },video:false});

    // Create AudioContext and RESUME it (critical — browsers suspend it by default)
    S.mtCtx=new(window.AudioContext||window.webkitAudioContext)();
    await S.mtCtx.resume(); // always force resume, not just if suspended

    // Analyser with sensitive settings to pick up quiet voices
    S.mtAn=S.mtCtx.createAnalyser();
    S.mtAn.fftSize=256;          // smaller fftSize = faster response
    S.mtAn.minDecibels=-90;      // very sensitive — picks up quiet sounds
    S.mtAn.maxDecibels=-10;      // cap at -10dB to avoid clipping display
    S.mtAn.smoothingTimeConstant=0.7; // smooth bars visually

    // Connect mic stream → analyser
    const src=S.mtCtx.createMediaStreamSource(S.mtStream);
    src.connect(S.mtAn);

    // Update UI
    $(`#mt-go`).classList.add('hidden');
    $(`#mt-stop`).classList.remove('hidden');
    $(`#mt-st`).textContent='🟢 Mic active — speak now';
    $(`#mt-st`).style.color='#10b981';

    // Start drawing AFTER analyser is ready
    drawMicTest();

  }catch(e){
    $(`#mt-st`).textContent='❌ '+e.message;
    $(`#mt-st`).style.color='#ef4444';
    console.warn('Mic test error:',e);
  }
}

function drawMicTest(){
  const c=$('#mt-cv');
  if(!c||!S.mtAn)return;
  const ctx=c.getContext('2d');
  const bins=S.mtAn.frequencyBinCount; // = fftSize/2 = 128
  const data=new Uint8Array(bins);
  let peakPct=0;

  function frame(){
    if(!S.mtAn){ctx.clearRect(0,0,c.width,c.height);return}
    S.mtAnim=requestAnimationFrame(frame);
    S.mtAn.getByteFrequencyData(data);

    // Calculate average loudness
    let sum=0;for(let i=0;i<bins;i++)sum+=data[i];
    const avg=sum/bins;
    const pct=Math.min(100,Math.round(avg*1.5)); // scale up for display
    if(pct>peakPct)peakPct=pct;

    // Draw bars
    ctx.clearRect(0,0,c.width,c.height);
    const bw=Math.floor(c.width/bins)-1;
    for(let i=0;i<bins;i++){
      const h=Math.max(1,(data[i]/255)*c.height);
      // Green when loud, cyan when medium, violet when quiet
      const loudness=data[i]/255;
      const r=Math.round(16+loudness*108);  // 16→124
      const g=Math.round(185-loudness*127); // 185→58
      const bChannel=Math.round(129+loudness*108); // 129→237
      ctx.fillStyle=`rgba(${r},${g},${bChannel},${0.5+loudness*0.5})`;
      ctx.fillRect(i*(bw+1),c.height-h,bw,h);
    }

    // Status text
    const st=$('#mt-st');
    if(st){
      if(pct>=20){
        st.textContent=`✅ Mic working! Level: ${pct}% — your microphone is detected.`;
        st.style.color='#10b981';
      }else if(pct>=5){
        st.textContent=`🟡 Low signal (${pct}%) — speak louder or move closer to mic.`;
        st.style.color='#f59e0b';
      }else{
        st.textContent='🔴 No audio detected — speak now, or check mic permissions in browser settings.';
        st.style.color='#ef4444';
      }
    }
  }
  frame();
}

function mtStop(){
  if(S.mtAnim){cancelAnimationFrame(S.mtAnim);S.mtAnim=null}
  S.mtAn=null;
  if(S.mtStream){S.mtStream.getTracks().forEach(t=>t.stop());S.mtStream=null}
  if(S.mtCtx){S.mtCtx.close().catch(()=>{});S.mtCtx=null}
  $(`#mt-go`).classList.remove('hidden');
  $(`#mt-stop`).classList.add('hidden');
  $(`#mt-st`).textContent='Click "Start Mic" to test again.';
  $(`#mt-st`).style.color='#94a3b8';
  const c=$('#mt-cv');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);
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
  try{
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
  // Readiness meter
  updateReadiness(scores,(sessions||[]).filter(s=>s.status==='completed').length,comps?.length||0);
  showDailyTip();
  loadDailyQuestion(S.profile?.program_category||S.field);
  renderCompanies(NSS_COMPANIES);
  loadAdminReplies();
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
  }catch(dashErr){
    console.error('loadDashboard error:',dashErr);
    // Show a usable dashboard even if queries fail
    const el=$('#dash-sessions');
    if(el)el.innerHTML='<div class="p-5 text-center text-xs text-slate-500">Could not load sessions — please refresh.</div>';
  }
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
  const el=$('#tests-list');
  try{
    const{data:tests}=await sb.from('aptitude_tests').select('*').eq('is_active',true).order('created_at',{ascending:false});
    const{data:comps}=await sb.from('aptitude_completions').select('test_id').eq('user_id',S.user.id);
    const done=new Set((comps||[]).map(c=>c.test_id));
    if(!tests?.length){el.innerHTML='<div class="p-5 text-center text-xs text-slate-600">No tests available yet.</div>';return}
    el.innerHTML='';
    const catColors={general:'#3b82f6',technical:'#e8a023',behavioral:'#8b5cf6',logical:'#22c55e',numerical:'#06b6d4',verbal:'#ec4899',analytical:'#f59e0b',spatial:'#10b981',iq:'#8b5cf6',interview_prep:'#7c3aed',psychometric:'#06b6d4',situational:'#f59e0b'};
    tests.forEach(t=>{
      const d=done.has(t.id);const row=document.createElement('div');row.className='tr';
      const cats=(t.categories||[t.category]).filter(Boolean);
      const primaryCat=cats[0]||'general';
      const catColor=catColors[primaryCat]||'#888';
      const dur=t.duration_minutes?`<span class="text-[9px] text-slate-500 shrink-0">⏱️ ${t.duration_minutes}m</span>`:'';
      row.innerHTML=`
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${catColor}22;color:${catColor}">
          <i class="fa-solid ${primaryCat==='technical'?'fa-code':primaryCat==='behavioral'?'fa-users':primaryCat==='logical'||primaryCat==='analytical'?'fa-brain':primaryCat==='numerical'?'fa-calculator':primaryCat==='verbal'?'fa-comments':primaryCat==='spatial'?'fa-shapes':'fa-clipboard'} text-xs"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold text-slate-200 truncate">${esc(t.title)}</div>
          <div class="flex flex-wrap items-center gap-1 mt-0.5">
            ${cats.slice(0,2).map(c=>`<span class="text-[9px] px-1 py-0.5 rounded font-medium" style="background:${catColors[c]||'#888'}22;color:${catColors[c]||'#888'}">${c}</span>`).join('')}
            ${dur}
            ${t.description?`<span class="text-[9px] text-slate-500 truncate max-w-[120px]">${esc(t.description)}</span>`:''}
          </div>
        </div>
        ${d
          ?'<span class="text-[10px] text-emerald-400 font-bold shrink-0"><i class="fa-solid fa-check mr-0.5"></i>Done</span>'
          :`<a href="${esc(t.url)}" target="_blank" rel="noopener" class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition shrink-0 btn-glow" style="background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff" data-tid="${t.id}">Take Test</a>`
        }`;
      row.querySelectorAll('a[data-tid]').forEach(a=>a.addEventListener('click',async()=>{await sb.from('aptitude_completions').upsert({user_id:S.user.id,test_id:a.dataset.tid},{onConflict:'user_id,test_id'})}));
      el.appendChild(row);
    });
  }catch(e){
    console.warn('loadTests error:',e.message);
    if(el)el.innerHTML='<div class="p-5 text-center text-xs text-slate-600">Could not load tests — please refresh.</div>';
  }
}

// ===== ADMIN =====
async function loadAdmin(){
  if(!S.user)return;
  try{
    const[{data:users},{data:sessions},{data:grades},{data:tests}]=await Promise.all([
      sb.from('profiles').select('*').order('created_at',{ascending:false}),
      sb.from('interview_sessions').select('*'),
      sb.from('grading_reports').select('*'),
      sb.from('aptitude_tests').select('id')
    ]);
    $(`#ad-users`).textContent=users?.length||0;$(`#ad-sess`).textContent=sessions?.length||0;
    const scores=(grades||[]).map(g=>g.overall_score);
    $(`#ad-avg`).textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';
    $(`#ad-tests`).textContent=tests?.length||0;
    const uStats={};
    (sessions||[]).forEach(s=>{if(!uStats[s.user_id])uStats[s.user_id]={count:0,scores:[]};uStats[s.user_id].count++;(grades||[]).filter(g=>g.session_id===s.id).forEach(g=>uStats[s.user_id].scores.push(g.overall_score))});
    const el=$('#ad-users-list');el.innerHTML='';
    if(!users?.length){el.innerHTML='<div class="p-4 text-center text-xs text-slate-500">No users yet.</div>';}
    else{
      users.slice(0,20).forEach(u=>{
        const st=uStats[u.id]||{count:0,scores:[]};const avg=st.scores.length?Math.round(st.scores.reduce((a,b)=>a+b,0)/st.scores.length):'—';
        const row=document.createElement('div');row.className='sr';
        row.innerHTML=`<div class="flex-1"><div class="text-xs font-semibold text-slate-200">${esc(u.name||'—')} ${u.role==='admin'?'<span class="text-[10px] text-violet-400 font-bold">Admin</span>':''}<br><span class="text-[10px] text-slate-500">${esc(u.university||'—')} · ${esc(u.program||'—')}</span></div></div><div class="text-[10px] text-slate-500 mr-3">${st.count} interview${st.count!==1?'s':''}</div><div class="text-xs font-bold ${typeof avg==='number'?(avg>=70?'text-emerald-400':avg>=50?'text-amber-400':'text-red-400'):'text-slate-500'}">${avg}${typeof avg==='number'?'%':''}</div>`;
        el.appendChild(row);
      });
    }
    // Unanswered student questions
    const qel=$('#ad-questions-list');
    if(qel){
      const{data:qs}=await sb.from('admin_questions').select('*,profiles(name)').is('answer',null).order('created_at',{ascending:false});
      if(!qs?.length){qel.innerHTML='<div class="p-4 text-center text-xs text-slate-500">No pending questions. ✅</div>';}
      else{
        qel.innerHTML='';
        qs.forEach(q=>{
          const row=document.createElement('div');row.className='p-3';row.style.borderBottom='1px solid #1a1a2e';
          row.innerHTML=`<div class="text-[10px] text-slate-500 mb-1">${esc(q.profiles?.name||'Student')} · ${new Date(q.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div><p class="text-xs text-slate-200 mb-2 font-medium">${esc(q.question)}</p><div class="flex gap-2"><textarea id="aq-${q.id}" rows="2" placeholder="Type your reply..." class="flex-1 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none resize-none transition" style="background:#1a1a2e;border:1px solid #2d2d4e"></textarea><button onclick="replyAdminQuestion('${q.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold text-white self-end btn-glow shrink-0" style="background:linear-gradient(135deg,#7c3aed,#06b6d4)">Reply</button></div>`;
          qel.appendChild(row);
        });
      }
    }
  }catch(e){
    console.error('loadAdmin error:',e.message);
    const el=$('#ad-users-list');
    if(el)el.innerHTML='<div class="p-4 text-center text-xs text-slate-500">Could not load data — please refresh.</div>';
  }
}

async function replyAdminQuestion(id){
  const answer=$(`#aq-${id}`)?.value.trim();
  if(!answer){toast('Write a reply first.','err');return}
  const{error}=await sb.from('admin_questions').update({answer,answered_by:S.user.id,answered_at:new Date().toISOString()}).eq('id',id);
  if(error){toast('Failed: '+error.message,'err');return}
  toast('Reply sent!','ok');loadAdmin();
}

// ===== ADMIN REPLIES (student view) =====
async function loadAdminReplies(){
  if(!S.user)return;
  try{
    const{data:replies}=await sb.from('admin_questions').select('*').eq('user_id',S.user.id).not('answer','is',null).order('answered_at',{ascending:false}).limit(5);
    const card=$('#admin-replies-card'),list=$('#admin-replies-list');
    if(!card||!list)return;
    if(!replies?.length){card.classList.add('hidden');return}
    card.classList.remove('hidden');
    list.innerHTML=replies.map(r=>`
      <div class="px-4 py-3">
        <p class="text-[11px] font-semibold text-slate-300 mb-1">${esc(r.question)}</p>
        <div class="flex items-start gap-2 mt-1.5 p-2.5 rounded-xl" style="background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15)">
          <i class="fa-solid fa-reply text-emerald-400 text-[10px] mt-0.5 shrink-0"></i>
          <p class="text-xs text-slate-300 leading-relaxed">${esc(r.answer)}</p>
        </div>
        <p class="text-[10px] text-slate-600 mt-1">${r.answered_at?new Date(r.answered_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}):''}</p>
      </div>`).join('');
  }catch(e){console.warn('loadAdminReplies error:',e.message)}
}

// ===== MANAGE TESTS =====
// Toggle button selection (purple when active)
function toggleCatBtn(btn){
  const active=btn.dataset.active==='1';
  btn.dataset.active=active?'':'1';
  btn.style.background=active?'#1a1a2e':'rgba(124,58,237,.2)';
  btn.style.borderColor=active?'#2d2d4e':'#7c3aed';
  btn.style.color=active?'#6b7280':'#a78bfa';
  // Update hint
  const hint=$('#mt-cats-hint');
  const sel=Array.from($$('#mt-cats .cat-btn[data-active="1"]')).map(b=>b.dataset.val);
  if(hint)hint.textContent=sel.length?`✓ ${sel.join(', ')}`:'None selected — tap to select';
}
function toggleFieldBtn(btn){
  const active=btn.dataset.active==='1';
  btn.dataset.active=active?'':'1';
  btn.style.background=active?'#1a1a2e':'rgba(6,182,212,.15)';
  btn.style.borderColor=active?'#2d2d4e':'#06b6d4';
  btn.style.color=active?'#6b7280':'#67e8f9';
}
function selectAllFieldBtns(){
  $$('#mt-fields .field-btn').forEach(b=>{b.dataset.active='1';b.style.background='rgba(6,182,212,.15)';b.style.borderColor='#06b6d4';b.style.color='#67e8f9'});
}
function selectAllFields(){selectAllFieldBtns()}
function clearAllFields(){
  $$('#mt-fields .field-btn').forEach(b=>{b.dataset.active='';b.style.background='#1a1a2e';b.style.borderColor='#2d2d4e';b.style.color='#6b7280'});
  const fo=$('#mt-field-other');if(fo)fo.value='';
}
// Legacy aliases
function toggleCat(btn){toggleCatBtn(btn)}
function toggleField(btn){toggleFieldBtn(btn)}

async function loadMgmt(){
  if(!S.user)return;
  const{data:tests}=await sb.from('aptitude_tests').select('*').order('created_at',{ascending:false});
  const el=$('#mgmt-list');el.innerHTML='';
  if(!tests?.length){el.innerHTML='<div class="p-4 text-center text-xs text-slate-600">No tests yet.</div>';return}
  tests.forEach(t=>{
    const cats=(t.categories||[t.category]).filter(Boolean);
    const fields=(t.fields||[t.field]).filter(Boolean);
    const dur=t.duration_minutes?`${t.duration_minutes} min`:'—';
    const diff=t.difficulty||'medium';
    const diffColor={easy:'#10b981',medium:'#f59e0b',hard:'#ef4444',mixed:'#8b5cf6'}[diff]||'#6b7280';
    const row=document.createElement('div');row.className='p-3';row.style.borderBottom='1px solid #1a1a2e';
    row.innerHTML=`
      <div class="flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-xs font-semibold text-slate-200">${esc(t.title)}</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style="background:${diffColor}22;color:${diffColor}">${diff}</span>
            ${t.duration_minutes?`<span class="text-[9px] text-slate-500">⏱️ ${dur}</span>`:''}
          </div>
          <div class="flex flex-wrap gap-1 mb-1">
            ${cats.map(c=>`<span class="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style="background:rgba(124,58,237,.15);color:#a78bfa">${c}</span>`).join('')}
          </div>
          <div class="flex flex-wrap gap-1">
            ${fields.length?fields.map(f=>`<span class="text-[9px] px-1.5 py-0.5 rounded-full" style="background:rgba(6,182,212,.12);color:#67e8f9">${FL[f]||f}</span>`).join(''):'<span class="text-[9px] text-slate-600">All fields</span>'}
          </div>
        </div>
        <div class="flex gap-1.5 shrink-0">
          <button class="text-[10px] px-2 py-1.5 rounded-lg font-semibold transition ${t.is_active?'':'opacity-50'}" style="background:${t.is_active?'rgba(16,185,129,.15)':'rgba(107,114,128,.15)'};color:${t.is_active?'#10b981':'#6b7280'};border:1px solid ${t.is_active?'rgba(16,185,129,.25)':'rgba(107,114,128,.2)'}" onclick="toggleTest('${t.id}',${!t.is_active})">${t.is_active?'Active':'Off'}</button>
          <button class="text-[10px] px-2 py-1.5 rounded-lg font-semibold transition" style="background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.2)" onclick="deleteTest('${t.id}')"><i class="fa-solid fa-trash text-[9px]"></i></button>
        </div>
      </div>`;
    el.appendChild(row);
  });
}

async function addTest(){
  if(!S.user)return;
  const t=$('#mt-title')?.value.trim();
  const u=$('#mt-url')?.value.trim();
  if(!t){toast('Test title is required.','err');return}
  if(!u){toast('Test URL is required.','err');return}

  // Read selected category toggle buttons
  const categories=Array.from($$('#mt-cats .cat-btn[data-active="1"]')).map(b=>b.dataset.val);
  if(!categories.length){toast('Please select at least one category.','err');return}

  // Read selected field toggle buttons + free-text other
  const fields=Array.from($$('#mt-fields .field-btn[data-active="1"]')).map(b=>b.dataset.val);
  const otherField=$('#mt-field-other')?.value.trim();
  if(otherField)fields.push(otherField);

  const duration=$('#mt-duration')?.value;
  const difficulty=$('#mt-difficulty')?.value||'medium';
  const desc=$('#mt-desc')?.value.trim();

  const{error}=await sb.from('aptitude_tests').insert({
    title:t,url:u,
    category:categories[0], // backward compat
    categories,
    field:fields[0]||null,   // backward compat
    fields,
    description:desc||null,
    duration_minutes:duration?parseInt(duration):null,
    difficulty,
    created_by:S.user.id
  });
  if(error){toast('Error: '+error.message,'err');return}

  // Reset form
  $(`#mt-title`).value='';$(`#mt-url`).value='';
  $(`#mt-desc`).value='';$(`#mt-duration`).value='';
  $(`#mt-difficulty`).value='medium';
  if($('#mt-field-other'))$('#mt-field-other').value='';
  // Reset toggle buttons
  $$('#mt-cats .cat-btn').forEach(b=>{b.dataset.active='';b.style.background='#1a1a2e';b.style.borderColor='#2d2d4e';b.style.color='#6b7280'});
  clearAllFields();
  const hint=$('#mt-cats-hint');if(hint)hint.textContent='None selected — tap to select';
  toast('Test added successfully!','ok');
  loadMgmt();
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
  const arc=S.questionArc||buildArc(S.totalQ);
  const topics=detectTopics(answer);
  const asked=S.conversation.filter(c=>c.role==='student').flatMap(c=>detectTopics(c.text));
  const qt=arc[qi]||'followup';
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
  const ivDot=$('#iv-status-dot'),ivStatus=$('#iv-status-text'),portrait=$('#iv-portrait');
  if(avatar){avatar.classList.remove('sp','li','th');}
  rings.forEach(r=>{const el=$(r);if(el)el.classList.remove('pu')});
  if(waves)waves.classList.remove('on');
  if(vizCanvas)vizCanvas.classList.add('hidden');
  switch(p){
    case'speaking':
      if(avatar)avatar.classList.add('sp');
      if(portrait)portrait.classList.add('sp');
      rings.forEach(r=>{const el=$(r);if(el)el.classList.add('pu')});
      if(waves)waves.classList.add('on');
      if(icon)icon.className='fa-solid fa-volume-high';
      if(statusTxt){statusTxt.textContent='Speaking...';statusTxt.style.color='#e8a023'}
      if(ivDot)ivDot.style.background='#e8a023';
      if(ivStatus)ivStatus.textContent='Speaking...';
      break;
    case'listening':
      if(avatar)avatar.classList.add('li');
      if(portrait)portrait.classList.add('li');
      if(icon)icon.className='fa-solid fa-microphone';
      if(vizCanvas)vizCanvas.classList.remove('hidden');
      drawVisualizer();
      if(statusTxt){statusTxt.textContent='Listening — speak your answer freely';statusTxt.style.color='#10b981'}
      if(ivDot)ivDot.style.background='#10b981';
      if(ivStatus)ivStatus.textContent='Listening...';
      break;
    case'processing':
      if(avatar)avatar.classList.add('th');
      if(portrait){portrait.classList.remove('sp','li')}
      if(icon)icon.className='fa-solid fa-brain';
      if(statusTxt){statusTxt.textContent='Processing...';statusTxt.style.color='#888'}
      if(ivDot)ivDot.style.background='#6b7280';
      if(ivStatus)ivStatus.textContent='Thinking...';
      break;
    case'done':
      if(portrait){portrait.classList.remove('sp','li')}
      if(icon)icon.className='fa-solid fa-check';
      if(statusTxt){statusTxt.textContent='Interview complete';statusTxt.style.color='#e8a023'}
      if(ivDot)ivDot.style.background='#10b981';
      if(ivStatus)ivStatus.textContent='Complete ✓';
      break;
    default:
      if(icon)icon.className='fa-solid fa-microphone-lines';
      if(statusTxt){statusTxt.textContent='Preparing...';statusTxt.style.color='#888'}
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
  $(`#pbar`).style.width=pct+'%';
  const label=`Q ${Math.min(S.currentQ+1,S.totalQ)} / ${S.totalQ}`;
  $(`#d-cnt`).textContent=label;
  const footer=$('#d-cnt-footer');if(footer)footer.textContent=label;
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
  if(!S.field){toast('Please select your field.','err');return}
  S.name=S.profile?.name||'Student';
  S.company=$('#inp-company')?.value.trim()||'';
  S.internshipInfo=S.profile?.internship_info||'';
  S.hasInternship=S.profile?.has_internship||false;
  await apiHealth();
  S.conversation=[];S.currentQ=0;S.teamIdx=0;S.ending=false;S.currentSessionId=null;
  S.totalQ=parseInt($$('#qcount-sel button[data-sel="1"]')[0]?.dataset.q||'12');
  S.questionArc=buildArc(S.totalQ);
  $(`#transcript`).innerHTML='';updateProgress();showScreen('interview');
  $(`#d-field`).textContent=S.fieldLabel;$(`#d-eng`).textContent=S.serverUp?'LLM':'Built-in';
  S.currentIV=getCurrentInterviewer();
  // Create session record in DB
  if(S.user){
    const{data:sess}=await sb.from('interview_sessions').insert({user_id:S.user.id,field:S.field,field_label:S.fieldLabel,target_company:S.company||null,interviewer_mode:S.mode,total_questions:S.totalQ,status:'active'}).select('id').single();
    if(sess)S.currentSessionId=sess.id;
  }
  // Show tap-to-start overlay (required for iOS Safari TTS + mic)
  // On desktop, auto-dismiss after 800ms if no touch detected
  const overlay=$('#iv-start-overlay');
  overlay.classList.remove('hidden');
  const startBtn=$('#btn-iv-start');
  const proceed=()=>{
    overlay.classList.add('hidden');
    beginInterview();
  };
  startBtn.onclick=proceed;
  // Auto-proceed on desktop (non-touch) after short delay
  const isTouch=navigator.maxTouchPoints>0||'ontouchstart' in window;
  if(!isTouch)setTimeout(proceed,600);
}

async function beginInterview(){
  // Set up portrait for single interviewer modes
  const ivPool=getFieldInterviewers(S.field);
  const portrait=ivPool[Math.floor(Math.random()*ivPool.length)];
  if(S.mode!=='team'&&portrait){
    S.currentIV={...S.currentIV,name:portrait.name,role:portrait.role,gender:portrait.gender,pitch:portrait.pitch,rate:portrait.rate,color:portrait.color};
    updatePortrait(portrait);
  }else{
    updatePortrait({emoji:S.currentIV.gender==='female'?'👩🏿‍💼':'👨🏿‍💼',name:S.currentIV.name,role:S.currentIV.role,color:S.currentIV.color||'#7c3aed'});
  }

  const vc=getVoiceCfg();
  const progLabel=S.profile?.program?` — ${S.profile.program}`:'';
  const greeting=S.mode==='team'
    ?`${gtg()}, ${S.name}. Welcome to your panel interview for ${S.fieldLabel}${progLabel}. ${S.currentIV.intro} Please start by telling us about yourself.`
    :`${gtg()}, ${S.name}. I'm ${S.currentIV.name}, your interviewer today. We're doing a mock national service interview for ${S.fieldLabel}${progLabel}. I'll ask you ${S.totalQ} questions. Speak clearly and take your time. Let's begin — please tell me about yourself.`;

  S.conversation.push({role:'ai',text:greeting,interviewer:S.currentIV.name});
  addMessage('ai',greeting,false);
  setPhase('speaking');
  const mediaOk=await startMedia();
  await tts.speak(greeting,vc);
  // Only proceed to listening if TTS completed (not interrupted — if interrupted,
  // the VAD already flipped phase to listening and will call startListening)
  if(!S.isListening)await startListening();
}

async function startListening(){
  if(S.ending)return;
  setPhase('listening');S.isListening=true;
  S.finalTxt='';S.interimTxt='';

  const ok=stt.start(
    (final,interim)=>{
      removeInterim();
      // Show full accumulated transcript + current interim as live preview
      const display=(final+(interim?' '+interim:'')).trim();
      if(display)addMessage('student',display,!!interim);
      // Update word count meter with full text so far
      updateWCMeter(final+(interim||''));
    },
    (text)=>processAnswer(text)
  );

  if(!ok){
    // No mic/recorder — fall back to text input
    $(`#inp-txt`).disabled=false;$(`#btn-send`).disabled=false;
    $(`#d-st`).textContent='Voice unavailable — type your answer below';
    $(`#d-st`).style.color='#f59e0b';
  }
  // 90s absolute safety timeout
  S.maxT=setTimeout(()=>{if(S.isListening)stt.stop();},90000);
}

async function processAnswer(text){
  if(S.ending)return;
  S.isListening=false;
  if(S.maxT){clearTimeout(S.maxT);S.maxT=null}
  stopVisualizer();
  hideWCMeter();
  // Show brief "transcribing..." indicator while Whisper processes
  const d_st=$('#d-st');
  if(d_st){d_st.textContent='Transcribing...';d_st.style.color='#7c3aed'}

  // ── Fallback to typed input if voice gave nothing ──────────────────────
  if(!text||text.trim().length<3){
    const typed=$('#inp-txt')?.value.trim();
    if(typed&&typed.length>=3){text=typed;$(`#inp-txt`).value=''}
    else{
      setPhase('speaking');
      const retry=pk([
        "I didn't quite catch that — could you speak a bit more clearly, or type your answer below?",
        "Sorry, I couldn't hear you well. Could you repeat that, or type it out?",
        "I didn't hear a clear answer. Please try speaking again, or use the text box below."
      ]);
      addMessage('ai',retry,false);
      S.conversation.push({role:'ai',text:retry,interviewer:S.currentIV.name});
      await tts.speak(retry,getVoiceCfg());
      await startListening();
      return;
    }
  }

  // ── Detect nonsensical input (random sounds, very incoherent) ──────────
  // A "nonsensical" answer is < 4 real words, OR made up of pure filler
  const wordCount = text.trim().split(/\s+/).filter(w=>w.length>1).length;
  const fillerOnly = /^(um+|uh+|ah+|er+|hmm+|okay|ok|yes|no|yeah|nope|hi|hello|hey|test|testing|check|one two|lalala|blah)[\s.,!?]*$/i.test(text.trim());

  if(wordCount < 4 || fillerOnly){
    setPhase('speaking');
    const clarify=pk([
      "It seems I only caught a few words. Could you elaborate on your answer?",
      "I want to make sure I understand you properly — could you say that again more fully?",
      "That was a bit brief. Please take a moment and give me a more complete answer."
    ]);
    addMessage('ai',clarify,false);
    S.conversation.push({role:'ai',text:clarify,interviewer:S.currentIV.name});
    await tts.speak(clarify,getVoiceCfg());
    await startListening();
    return;
  }

  removeInterim();
  // Ensure the final answer is shown (not interim)
  const lastSt=Array.from($$('.m-st')).pop();
  if(!lastSt||lastSt.querySelector('.mb')?.textContent!==text)addMessage('student',text,false);
  S.conversation.push({role:'student',text});
  $(`#inp-txt`).disabled=true;$(`#btn-send`).disabled=true;
  S.currentQ++;updateProgress();

  // ── REAL-TIME ANSWER ANALYSIS ──────────────────────────────────────────────
  // ── PARALLELISE: start generating next question AND analysing answer simultaneously ──
  let analysis=null;
  let question=null;
  const currentQType=S.questionArc[S.currentQ-1]||'followup';

  if(S.currentQ>=S.totalQ){
    // Last question — just analyse, no need to generate next question
    if(S.serverUp&&text.trim().length>8){
      try{
        analysis=await fetch(getAPI()+'/api/analyse-answer',{method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({question:S.conversation.filter(c=>c.role==='ai').slice(-1)[0]?.text||'',answer:text,field:S.field,fieldLabel:S.fieldLabel,questionType:currentQType,interviewerName:S.currentIV.name})
        }).then(r=>r.ok?r.json():null);
      }catch(e){}
    }
    if(analysis?.acknowledgement){
      setPhase('speaking');addMessage('ai',analysis.acknowledgement,false);
      S.conversation.push({role:'ai',text:analysis.acknowledgement,interviewer:S.currentIV.name});
      await tts.speak(analysis.acknowledgement,getVoiceCfg());
    }
    showCoachTip(analysis?.quality||'partial');
    await endInterview();
    return;
  }

  setPhase('processing');

  // Panel interviewer rotation
  if(S.mode==='team'&&S.currentQ%2===0){
    S.teamIdx++;S.currentIV=getCurrentInterviewer();
    updatePortrait({emoji:S.currentIV.gender==='female'?'👩🏿‍💼':'👨🏿‍💼',name:S.currentIV.name,role:S.currentIV.role,color:S.currentIV.color||'#7c3aed'});
  }

  // Fire both API calls in parallel — cuts wait time roughly in half
  const questionPromise=S.serverUp?apiQuestion({
    conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,
    name:S.name,cvData:S.cvData,interviewer:S.currentIV,
    currentQ:S.currentQ,totalQ:S.totalQ,questionArc:S.questionArc,
    program:S.profile?.program||'',internshipInfo:S.internshipInfo,hasInternship:S.hasInternship
  }).catch(()=>null):Promise.resolve(null);

  const analysisPromise=S.serverUp&&text.trim().length>8?fetch(getAPI()+'/api/analyse-answer',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({question:S.conversation.filter(c=>c.role==='ai').slice(-1)[0]?.text||'',answer:text,field:S.field,fieldLabel:S.fieldLabel,questionType:currentQType,interviewerName:S.currentIV.name})
  }).then(r=>r.ok?r.json():null).catch(()=>null):Promise.resolve(null);

  // Wait for both in parallel
  [question,analysis]=await Promise.all([questionPromise,analysisPromise]);
  if(!question)question=fallbackQuestion(text,S.field,S.currentIV,S.currentQ);

  // Speak acknowledgement first (optional correction for wrong technical answers)
  if(analysis){
    const ack=analysis.acknowledgement||'';
    const correction=analysis.correction;
    let ackResponse=ack;
    if(correction&&analysis.isWrongTechnically&&['technical','scenario'].includes(currentQType)&&Math.random()>0.35){
      ackResponse=ack?`${ack} ${correction}`:correction;
    }
    if(ackResponse&&ackResponse.trim()){
      setPhase('speaking');addMessage('ai',ackResponse,false);
      S.conversation.push({role:'ai',text:ackResponse,interviewer:S.currentIV.name});
      await tts.speak(ackResponse,getVoiceCfg());
      // If user interrupted the ack, they're already talking — don't restart listening
      if(S.isListening)return;
    }
    showCoachTip(analysis.quality||'partial');
  }

  // Then ask the next question
  S.conversation.push({role:'ai',text:question,interviewer:S.currentIV.name});
  addMessage('ai',question,false);
  setPhase('speaking');
  await tts.speak(question,getVoiceCfg());
  if(!S.isListening)await startListening();
}

async function endInterview(){
  if(S.ending)return;
  S.ending=true;S.phase='done';
  setPhase('processing');
  const closing=pk([
    `Thank you, ${S.name}. That completes your mock interview. I'll now prepare your feedback. Before we wrap up completely though, do you have any questions for me?`,
    `Well done, ${S.name} — you've completed all ${S.totalQ} questions. Your results are being prepared. But first — do you have anything you'd like to ask me?`,
    `That brings us to the end of your mock interview, ${S.name}. Great effort today. I'll have your feedback ready shortly. Any questions on your end before we finish?`
  ]);
  addMessage('ai',closing,false);
  S.conversation.push({role:'ai',text:closing,interviewer:S.currentIV.name});
  setPhase('speaking');await tts.speak(closing,getVoiceCfg());await sl(400);setPhase('done');
  // Stop video recording
  const _videoUrl=await stopVideoRecording();
  // ── Open student Q&A modal ─────────────────────────────────────────────────
  S.studentQPhase=true;S.studentQCount=0;S.studentQMax=2;
  openSQModal();
}

// ===== STUDENT Q&A MODAL =====
function openSQModal(){
  const modal=$('#sq-modal');if(!modal)return;
  modal.classList.remove('hidden');
  $(`#sq-remaining`).textContent=S.studentQMax;
  $(`#sq-ai-answer`).classList.add('hidden');
  $(`#sq-admin-wrap`).classList.add('hidden');
  $(`#sq-input-wrap`).classList.remove('hidden');
  $(`#sq-input`).value='';$(`#sq-input`).focus();
  $(`#sq-iv-name`).textContent=S.currentIV?.name||'Interviewer';
  updateSQRemaining();
}

function closeSQModal(){
  const modal=$('#sq-modal');if(!modal)return;
  modal.classList.add('hidden');
  finaliseInterview();
}

function updateSQRemaining(){
  const left=Math.max(0,S.studentQMax-S.studentQCount);
  $(`#sq-remaining`).textContent=left;
  $(`#sq-sub`).textContent=left>0?`You have ${left} question${left>1?'s':''} remaining.`:'No more questions — click Done to see your results.';
  if(left<=0){
    $(`#sq-input-wrap`).classList.add('hidden');
    $(`#sq-ask-btn`).disabled=true;
  }
}

async function submitStudentQuestion(){
  const input=$('#sq-input');
  const q=(input?.value||'').trim();
  if(!q){toast('Type a question first.','err');return}
  if(S.studentQCount>=S.studentQMax){toast('No more questions remaining.','err');return}

  const btn=$('#sq-ask-btn');if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>'}
  S.studentQCount++;

  // Show question in transcript
  addMessage('student',q,false);S.conversation.push({role:'student',text:q});
  input.value='';

  let result={canAnswer:false,answer:"That's a great question. I'd recommend leaving it for our team who can give you a more accurate answer."};
  if(S.serverUp){
    try{
      const convSummary=S.conversation.slice(-6).map(c=>`${c.role==='ai'?'Interviewer':S.name}: ${c.text}`).join('\n');
      result=await fetch(getAPI()+'/api/student-question',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({question:q,field:S.field,fieldLabel:S.fieldLabel,interviewerName:S.currentIV?.name,conversationSummary:convSummary})
      }).then(r=>r.ok?r.json():null)||result;
    }catch(e){/* use default */}
  }

  // Show AI answer
  $(`#sq-ai-answer`).classList.remove('hidden');
  $(`#sq-answer-text`).textContent=result.answer;
  addMessage('ai',result.answer,false);
  S.conversation.push({role:'ai',text:result.answer,interviewer:S.currentIV?.name||'Interviewer'});

  // Speak it
  await tts.speak(result.answer,getVoiceCfg());

  if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i>'}

  if(!result.canAnswer){
    // Show "leave for admin" panel
    $(`#sq-admin-wrap`).classList.remove('hidden');
    $(`#sq-admin-msg`).value=q;
    $(`#sq-input-wrap`).classList.add('hidden');
  } else {
    updateSQRemaining();
    if(S.studentQCount>=S.studentQMax){
      $(`#sq-input-wrap`).classList.add('hidden');
    }
  }
}

async function submitAdminQuestion(){
  const msg=$('#sq-admin-msg')?.value.trim();
  if(!msg){toast('Write your question first.','err');return}
  if(S.user){
    const{error}=await sb.from('admin_questions').insert({user_id:S.user.id,session_id:S.currentSessionId||null,question:msg});
    if(error){toast('Failed to send: '+error.message,'err');return}
  }
  toast("Question sent to our team — we'll get back to you soon.",'ok');
  $(`#sq-admin-wrap`).classList.add('hidden');
  updateSQRemaining();
  if(S.studentQCount>=S.studentQMax)$(`#sq-input-wrap`).classList.add('hidden');
}

async function finaliseInterview(){
  let grade=null;
  if(S.serverUp){
    try{grade=await apiGrade({conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,name:S.name,program:S.profile?.program||''})}
    catch(e){console.warn('LLM grading failed, using fallback')}
  }
  if(!grade)grade=fallbackGrade(S.conversation,S.field);
  // Save to DB — wrapped so showResults ALWAYS runs even if DB fails
  if(S.user&&S.currentSessionId){
    try{
      const turns=S.conversation.map((t,i)=>({session_id:S.currentSessionId,turn_number:i,role:t.role,interviewer_name:t.interviewer||null,text:t.text}));
      await sb.from('interview_turns').insert(turns);
      if(grade)await sb.from('grading_reports').insert({session_id:S.currentSessionId,overall_score:grade.overall,communication_score:grade.communication,technical_score:grade.technical,relevance_score:grade.relevance,confidence_score:grade.confidence,feedback_text:grade.feedback,improvement_notes:grade.improvements});
      await sb.from('interview_sessions').update({status:'completed',ended_at:new Date().toISOString()}).eq('id',S.currentSessionId);
    }catch(dbErr){
      console.warn('DB save failed (results will still show):',dbErr.message);
    }
  }
  showResults(grade);
}

function showResults(g){
  showScreen('results');
  const circ=2*Math.PI*59;
  setTimeout(()=>{const arc=$('#sc-ar');if(arc)arc.style.strokeDashoffset=circ*(1-g.overall/100)},100);
  animN($(`#sc-n`),0,g.overall,1200);
  // Check if student earned a certificate
  checkCertificate(g.overall);
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

// ===== READINESS METER =====
const TIPS=[
  "Use the STAR method: Situation → Task → Action → Result. It gives structure to every behavioral answer.",
  "Always link your answers back to the specific role or field. Generic answers score lower than specific ones.",
  "It's fine to take 2–3 seconds to think before answering. Silence is better than rambling.",
  "Technical questions test reasoning, not memory. Talk through your thought process even if you're unsure.",
  "Mention your final year project or industrial attachment — interviewers love concrete examples.",
  "Show enthusiasm for national service. Companies want people who are eager to contribute, not just passing through.",
  "Quantify where possible: 'reduced assembly time by 30%' is stronger than 'made it faster'.",
  "Research the company you're targeting. One specific mention shows genuine interest.",
  "Body language matters even on video — sit upright, look at the camera, and speak clearly.",
  "Close strongly: 'I'm excited about the opportunity and confident I can contribute to your team' leaves a great impression.",
  "If you don't know something technical, say 'I haven't encountered that specifically, but here's how I'd approach it' — shows problem-solving mindset.",
  "Ghana's engineering sector needs people who can bridge theory and practical field conditions. Show that awareness.",
];
function updateReadiness(scores,sessCount,testCount){
  const wrap=$('#readiness-wrap');if(!wrap)return;
  if(!sessCount){wrap.classList.add('hidden');return}
  wrap.classList.remove('hidden');
  const avgScore=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
  const consistency=scores.length>1?Math.max(0,100-(Math.max(...scores)-Math.min(...scores))):50;
  const improvement=scores.length>2&&scores[scores.length-1]>scores[0]?15:0;
  const testBonus=Math.min(20,testCount*5);
  const readiness=Math.round(Math.min(100,avgScore*0.55+consistency*0.25+improvement+testBonus*0.20));
  $('#readiness-pct').textContent=readiness+'%';
  const bar=$('#readiness-bar');bar.style.width=readiness+'%';
  bar.style.background=readiness>=75?'#22c55e':readiness>=50?'#e8a023':'#ef4444';
  const tips=[readiness<40?'Complete more practice sessions to improve your readiness.':readiness<60?'Good start. Focus on technical depth and using the STAR method.':readiness<80?'You\'re preparing well. Work on consistency across sessions.':'Excellent! You\'re showing strong interview readiness.'];
  if(scores.length&&avgScore<60)tips.push(' Aim to average above 60% before your real interview.');
  $('#readiness-tip').textContent=tips.join('');
}
function showDailyTip(){
  const el=$('#tip-text');if(!el)return;
  const d=new Date();const dayIdx=(d.getFullYear()*365+d.getMonth()*31+d.getDate())%TIPS.length;
  el.textContent=TIPS[dayIdx];
}

// ===== NSS COMPANIES =====
const NSS_COMPANIES=[
  {name:'Volta River Authority (VRA)',field:'electrical',type:'Power Utility',icon:'⚡'},
  {name:'Ghana Grid Company (GRIDCo)',field:'electrical',type:'Power Utility',icon:'⚡'},
  {name:'Electricity Company of Ghana (ECG)',field:'electrical',type:'Distribution',icon:'⚡'},
  {name:'Ghana Atomic Energy Commission',field:'electrical',type:'Research',icon:'⚛️'},
  {name:'Ghana National Petroleum Corp (GNPC)',field:'petroleum',type:'Oil & Gas',icon:'🛢️'},
  {name:'Ghana Gas Company',field:'petroleum',type:'Oil & Gas',icon:'🛢️'},
  {name:'Tullow Oil Ghana',field:'petroleum',type:'Oil & Gas',icon:'🛢️'},
  {name:'Newmont Ghana Gold',field:'mining',type:'Gold Mining',icon:'⛏️'},
  {name:'AngloGold Ashanti',field:'mining',type:'Gold Mining',icon:'⛏️'},
  {name:'Gold Fields Ghana',field:'mining',type:'Gold Mining',icon:'⛏️'},
  {name:'Geological Survey Authority',field:'mining',type:'Government',icon:'🪨'},
  {name:'Ghana Highways Authority (GHA)',field:'civil',type:'Infrastructure',icon:'🏗️'},
  {name:'Ghana Airports Company (GACL)',field:'civil',type:'Infrastructure',icon:'✈️'},
  {name:'Ghana Water Company Limited',field:'civil',type:'Water Utility',icon:'💧'},
  {name:'Ghana Standards Authority',field:'mechanical',type:'Standards Body',icon:'📏'},
  {name:'Tema Oil Refinery (TOR)',field:'chemical',type:'Refinery',icon:'🏭'},
  {name:'National Communications Authority',field:'computer',type:'Telecom Regulator',icon:'📡'},
  {name:'MTN Ghana',field:'computer',type:'Telecom',icon:'📱'},
  {name:'Vodafone Ghana',field:'computer',type:'Telecom',icon:'📱'},
  {name:'CSIR — Institute of Industrial Research',field:'computer',type:'Research',icon:'🔬'},
  {name:'Ghana Cocoa Board (COCOBOD)',field:'agricultural',type:'Agriculture',icon:'🌿'},
  {name:'Ghana Irrigation Development Authority',field:'agricultural',type:'Agriculture',icon:'💦'},
  {name:'Food and Drugs Authority (FDA)',field:'biomedical',type:'Regulatory',icon:'💊'},
  {name:'Lands Commission Ghana',field:'geomatic',type:'Government',icon:'🗺️'},
  {name:'Survey and Mapping Division',field:'geomatic',type:'Government',icon:'🗺️'},
  {name:'Ghana Health Service',field:'health',type:'Health',icon:'🏥'},
  {name:'Korle Bu Teaching Hospital',field:'health',type:'Hospital',icon:'🏥'},
  {name:'Agricultural Development Bank',field:'business',type:'Banking',icon:'🏦'},
  {name:'Ghana Education Service (GES)',field:'business',type:'Education',icon:'📚'},
  {name:'National Fire & Rescue Service',field:'safety',type:'Emergency',icon:'🚒'},
];
function renderCompanies(list){
  const el=$('#company-list');if(!el)return;
  if(!list.length){el.innerHTML='<p class="text-xs text-slate-600 text-center py-3">No companies match.</p>';return}
  el.innerHTML=list.slice(0,20).map(c=>`<div class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition" style="background:#1a1a2e" onclick="selectCompanyForInterview('${c.name.replace(/'/g,"\\'")}')"><span class="text-xl shrink-0">${c.icon}</span><div class="flex-1 min-w-0"><div class="text-xs font-semibold text-slate-200 truncate">${c.name}</div><div class="text-[10px] text-slate-500">${c.type} · ${FL[c.field]||c.field}</div></div><span class="text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0" style="background:rgba(124,58,237,.12);color:#a78bfa">Practice</span></div>`).join('');
}
function filterCompanies(q){const s=(q||'').toLowerCase();const f=s?NSS_COMPANIES.filter(c=>c.name.toLowerCase().includes(s)||FL[c.field]?.toLowerCase().includes(s)||c.type.toLowerCase().includes(s)):NSS_COMPANIES;renderCompanies(f)}
function selectCompanyForInterview(name){const inp=$('#inp-company');if(inp){inp.value=name;inp.focus()}toast(`"${name}" set as target. Configure your interview!`,'ok')}

// ===== DAILY PRACTICE QUESTION =====
const DAILY_Q={
  electrical:["How would you diagnose a motor that runs hot but doesn't trip its thermal overload?","Explain the significance of power factor and how you would improve it.","What protection devices do you specify for a 3-phase motor and why?"],
  computer:["Walk through your systematic approach to debugging erratic embedded firmware.","How would you design a sensor network to monitor temperature across a factory?","Explain what debouncing is and how you implement it in software."],
  civil:["A client wants to build on soft clay. What geotechnical investigation do you specify?","Describe quality control on a concrete site from pre-pour to post-cure.","What are the main differences between reinforced and prestressed concrete?"],
  mechanical:["A centrifugal pump in a plant is surging intermittently. What are the likely causes?","Compare welding versus bolting for structural connections.","How would you select a gearbox for a conveyor application?"],
  mining:["What factors determine open-pit vs underground mining for a deposit?","What environmental measures would you implement near a mine adjacent to a river?","How do you ensure worker safety during blasting operations?"],
  chemical:["A distillation column is not achieving required separation. What do you check first?","When would you choose a CSTR over a PFR reactor design?","Describe how you would size a heat exchanger for a process stream."],
  petroleum:["Explain the drive mechanisms that sustain production from an oil reservoir.","Describe primary, secondary, and enhanced oil recovery methods.","What well test determines reservoir permeability and how do you interpret it?"],
  agricultural:["Design a water management approach for a 5-hectare irrigated farm.","What are the key causes of post-harvest losses in cereal crops and how do you address them?","How do you select the most appropriate irrigation method for a vegetable farm?"],
  biomedical:["What regulatory pathway must a new medical device follow in Ghana?","How would you troubleshoot a patient monitor giving inconsistent readings?","Explain what biocompatibility means and why it matters for implants."],
  geomatic:["How would you set up a ground control network for a large construction project?","What are the main error sources in GPS surveying and how do you mitigate them?","Explain the difference between a geodetic datum and a coordinate reference system."],
  materials:["Why is stainless steel used in food processing instead of mild steel?","What happens at the microstructural level during tempering of hardened steel?","A steel shaft is failing by fatigue — what design changes increase its fatigue life?"],
  health:["Describe standard infection control precautions in a clinical laboratory.","How would you handle lab results inconsistent with the patient's clinical presentation?","Explain chain of custody requirements for diagnostic specimens."],
  business:["How would you analyse the financial viability of a new SME in Ghana?","Describe the key financial ratios used to assess a company's health.","What are the main risks facing small businesses in Ghana's economy?"],
  safety:["Describe the hierarchy of controls for managing workplace hazards.","Walk me through conducting a Job Hazard Analysis (JHA).","How would you manage emergency evacuation of a multi-storey building?"],
};
const DAILY_HINT={
  electrical:'Systematic diagnosis, safety first, technical specifics.',
  computer:'Show structured debugging — methodology over answers.',
  civil:'Engineering principles, reference to standards, quality assurance.',
  mechanical:'Thermodynamic/mechanical principles with practical context.',
  mining:'Balance technical accuracy with safety and environmental awareness.',
  chemical:'Mass balance, thermodynamics, process safety.',
  petroleum:'Reservoir engineering fundamentals and production experience.',
  agricultural:'Connect technical knowledge to Ghanaian farming context.',
  biomedical:'Patient safety and regulatory compliance are always the priority.',
  geomatic:'Standards, error quantification, QA procedures.',
  materials:'Microstructure → properties → performance relationship.',
  health:'Patient safety first, then regulatory and procedural compliance.',
  business:'Quantify where possible, connect to Ghanaian economic context.',
  safety:'Apply hierarchy of controls and quantified risk assessment.',
};
let dailyQData={q:'',hint:'',field:''};
function loadDailyQuestion(field){
  const f=field||S.profile?.program_category||S.field||'electrical';
  const qs=DAILY_Q[f]||DAILY_Q.electrical;
  const d=new Date();const idx=(d.getFullYear()*365+d.getMonth()*31+d.getDate())%qs.length;
  dailyQData={q:qs[idx],hint:DAILY_HINT[f]||'Structure your answer with principles and examples.',field:f};
  const qEl=$('#daily-q-text');if(qEl)qEl.textContent=dailyQData.q;
  const fEl=$('#daily-q-field');if(fEl)fEl.textContent=FL[f]||f;
  $(`#daily-q-feedback`)?.classList.add('hidden');
  const ans=$('#daily-q-answer');if(ans)ans.value='';
}
function refreshDailyQ(){
  const f=S.profile?.program_category||S.field||'electrical';
  const qs=DAILY_Q[f]||DAILY_Q.electrical;
  const idx=Math.floor(Math.random()*qs.length);
  dailyQData={q:qs[idx],hint:DAILY_HINT[f]||'Structure your answer logically.',field:f};
  $(`#daily-q-text`).textContent=dailyQData.q;
  $(`#daily-q-feedback`)?.classList.add('hidden');
  const ans=$('#daily-q-answer');if(ans)ans.value='';
  toast('New practice question!','info');
}
async function submitDailyQ(){
  const ans=$('#daily-q-answer')?.value.trim();
  if(!ans||ans.length<15){toast('Write a proper answer first.','err');return}
  const fb=$('#daily-q-feedback');if(fb){fb.textContent='⏳ Evaluating...';fb.classList.remove('hidden')}
  const words=ans.split(/\s+/).length;
  const kwCount=(FK[dailyQData.field]||[]).filter(k=>ans.toLowerCase().includes(k)).length;
  const structured=/\b(first|second|then|finally|because|therefore|for example)\b/i.test(ans);
  let c='';
  if(words<25)c='⚡ Too brief — expand with detail and an example.';
  else if(words>=80&&kwCount>=2&&structured)c='✅ Excellent — strong depth, technical vocabulary, and clear structure.';
  else if(words>=50&&kwCount>=1)c='🟢 Good answer. A specific real-world example would make it outstanding.';
  else c='🟡 Decent length. Add more technical terms and a step-by-step approach.';
  if(fb)fb.textContent=c+'\n\n💡 Hint: '+dailyQData.hint;
}
function toggleDailyAnswer(){
  const fb=$('#daily-q-feedback');
  if(!fb)return;
  if(!fb.classList.contains('hidden')&&fb.textContent.includes('Hint:')){fb.classList.add('hidden');return}
  fb.textContent='💡 Approach: '+dailyQData.hint+'\n\nStructure your answer clearly, use technical terminology, and always support with a practical example from your studies or attachment experience.';
  fb.classList.remove('hidden');
}

// ===== LIVE COACH TIP =====
function showCoachTip(quality){
  const tip=$('#coach-tip'),txt=$('#coach-tip-text');if(!tip||!txt)return;
  const pool={strong:['Excellent! Interview-winning quality.','Outstanding depth — you know your field.'],partial:['Good answer — keep that detail level.','Solid structure. The interviewer will appreciate it.'],weak:['Try to elaborate more — aim for 60+ words.','Give a specific example to back that up.']};
  txt.textContent=(pool[quality]||pool.weak)[Math.floor(Math.random()*2)];
  tip.classList.remove('hidden');clearTimeout(S._coachTimer);
  S._coachTimer=setTimeout(()=>tip.classList.add('hidden'),4500);
}

// ===== WORD COUNT METER =====
function updateWCMeter(transcript){
  const m=$('#wc-meter'),bar=$('#wc-bar'),lbl=$('#wc-label');if(!m)return;
  const w=(transcript||'').trim().split(/\s+/).filter(Boolean).length;
  m.classList.remove('hidden');const pct=Math.min(100,Math.round((w/80)*100));bar.style.width=pct+'%';
  if(w<20){bar.style.background='#ef4444';lbl.textContent=`${w}w — too brief`;lbl.style.color='#f87171'}
  else if(w<50){bar.style.background='#f59e0b';lbl.textContent=`${w}w — keep going`;lbl.style.color='#fbbf24'}
  else if(w<80){bar.style.background='#10b981';lbl.textContent=`${w}w — good ✓`;lbl.style.color='#34d399'}
  else{bar.style.background='linear-gradient(90deg,#10b981,#06b6d4)';lbl.textContent=`${w}w — excellent ✓✓`;lbl.style.color='#67e8f9'}
}
function hideWCMeter(){$('#wc-meter')?.classList.add('hidden')}

// ===== CERTIFICATE =====
function checkCertificate(score){
  if(score>=70){
    const card=$('#cert-card-result');
    const msg=$('#cert-msg');
    if(card)card.classList.remove('hidden');
    if(msg)msg.textContent=`🏆 You scored ${score}% — you're interview ready!`;
  }
}
function downloadCertificate(){
  const name=S.profile?.name||'Student',score=$('#sc-n')?.textContent||'70',field=S.fieldLabel||'Engineering';
  const date=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const html=`<!DOCTYPE html><html><head><title>NS Prep Certificate</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{font-family:'Outfit',sans-serif;background:#0d0d1a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.cert{max-width:680px;width:100%;background:#13131f;border:2px solid #7c3aed;border-radius:24px;padding:48px 56px;text-align:center;box-shadow:0 0 80px rgba(124,58,237,.3)}.logo{font-size:52px;margin-bottom:10px}.stamp{font-size:11px;letter-spacing:.25em;color:#6b7280;text-transform:uppercase;margin-bottom:20px}.h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}.sub{font-size:13px;color:#94a3b8;margin-bottom:28px}.name{font-size:30px;font-weight:900;color:#fff;border-bottom:2px solid #7c3aed;display:inline-block;padding-bottom:6px;margin-bottom:8px}.detail{font-size:14px;color:#94a3b8;margin-bottom:24px}.score{font-size:76px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}.score-sub{font-size:12px;color:#6b7280;margin-bottom:24px}.tag{display:inline-block;background:rgba(124,58,237,.15);color:#a78bfa;border:1px solid rgba(124,58,237,.3);border-radius:20px;padding:4px 16px;font-size:13px;font-weight:700;margin-bottom:28px}.footer{font-size:10px;color:#374151;margin-top:24px;padding-top:16px;border-top:1px solid #1a1a2e}@media print{body{background:#fff}.cert{box-shadow:none}}</style></head><body><div class="cert"><div class="logo">🎓</div><div class="stamp">Certificate of Achievement</div><div class="h1">NS Interview Prep</div><div class="sub">This certifies that</div><div class="name">${name}</div><div class="detail">successfully completed a mock national service interview in</div><div class="tag">${field}</div><br><div>achieving a score of</div><div class="score">${score}<span style="font-size:26px">%</span></div><div class="score-sub">out of 100</div><div class="footer">Issued by NS Interview Prep · ${date}</div></div><script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`;
  const w=window.open('','_blank');if(w){w.document.write(html);w.document.close()}else toast('Allow popups to download certificate.','err');
}

// ===== EVENTS =====
function initEvents(){
  switchAuthTab('login');
  // Mode selector
  $$('#mode-sel .md').forEach(b=>b.addEventListener('click',()=>{$$('#mode-sel .md').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');S.mode=b.dataset.m;$(`#team-prev`).classList.toggle('hidden',S.mode!=='team')}));
  // Field selection — setup screen uses value=fieldKey directly
  const fieldSel=$('#inp-field'),startBtn=$('#btn-start');
  fieldSel.addEventListener('change',()=>{
    const v=fieldSel.value;
    startBtn.disabled=!v;
    S.field=v;
    // Label: use the option text, strip program prefix for display
    const opt=fieldSel.options[fieldSel.selectedIndex];
    S.fieldLabel=FL[v]||(opt?opt.text:v);
  });
  // Pre-select from profile
  if(S.profile?.program_category&&FL[S.profile.program_category]){
    // Find first matching option
    const opts=Array.from(fieldSel.options);
    const match=opts.find(o=>o.value===S.profile.program_category);
    if(match){fieldSel.value=S.profile.program_category;S.field=S.profile.program_category;S.fieldLabel=FL[S.field];startBtn.disabled=false}
  }
  // Question count selector
  const qBtns=$$('#qcount-sel button');
  qBtns.forEach(btn=>btn.addEventListener('click',()=>{
    qBtns.forEach(b=>{b.style.borderColor='#2d2d4e';b.style.background='#1a1a2e';b.style.color='#6b7280';b.dataset.sel=''});
    btn.style.borderColor='#7c3aed';btn.style.background='rgba(124,58,237,.12)';btn.style.color='#a78bfa';btn.dataset.sel='1';
    const q=parseInt(btn.dataset.q);
    const mins={8:'~15 min',12:'~25 min',15:'~32 min',18:'~40 min'};
    const dl=$('#dur-label');if(dl)dl.textContent=`${q} questions · ${mins[q]||'~25 min'}`;
  }));
  // Mark default q-count button (12) as selected
  const defaultQBtn=Array.from($$('#qcount-sel button')).find(b=>b.dataset.q==='12');
  if(defaultQBtn){defaultQBtn.style.borderColor='#7c3aed';defaultQBtn.style.background='rgba(124,58,237,.12)';defaultQBtn.style.color='#a78bfa';defaultQBtn.dataset.sel='1'}
  startBtn.addEventListener('click',startInt);
  $(`#btn-schedule`).addEventListener('click',scheduleInterview);
  // CV upload
  const drop=$('#cv-drop'),inp=$('#cv-inp');
  drop.addEventListener('click',()=>inp.click());
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dg')});
  drop.addEventListener('dragleave',()=>drop.classList.remove('dg'));
  drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dg');if(e.dataTransfer.files.length)handleCV(e.dataTransfer.files[0])});
  inp.addEventListener('change',()=>{if(inp.files.length)handleCV(inp.files[0])});

  // Mic + speaker test — clean single listener
  $(`#btn-mic`).addEventListener('click',()=>{
    const area=$(`#mt-area`);
    const wasHidden=area.classList.contains('hidden');
    area.classList.toggle('hidden');
    if(wasHidden){
      // Panel just opened — auto-start mic test after brief delay
      setTimeout(()=>{
        if(!area.classList.contains('hidden'))mtGo();
      },300);
    }else{
      // Panel closing — stop any running test
      mtStop();
    }
  });
  $(`#mt-go`).addEventListener('click',mtGo);
  $(`#mt-stop`).addEventListener('click',mtStop);
  // Speaker test
  $(`#btn-spk-test`)?.addEventListener('click',testSpeaker);

  // Transcript toggle
  const tBtn=$('#btn-transcript-toggle');if(tBtn)tBtn.addEventListener('click',toggleTranscript);
  // Server URL field
  $(`#adv-tog`).addEventListener('click',()=>{const p=$('#adv-p'),ch=$('#adv-ch');p.classList.toggle('hidden');ch.style.transform=p.classList.contains('hidden')?'':'rotate(180deg)'});
  const savedUrl=localStorage.getItem('ns_api_url')||'';if(savedUrl&&$('#inp-srv'))$(`#inp-srv`).value=savedUrl;
  $(`#inp-srv`)?.addEventListener('blur',()=>{const v=$('#inp-srv').value.trim();if(v)localStorage.setItem('ns_api_url',v);apiHealth()});
  // Finish/End button — routes through confirmLeave
  $(`#btn-end`).addEventListener('click',()=>confirmLeave());
  // Text input fallback
  function sendTyped(){const t=$('#inp-txt')?.value.trim();if(!t)return;S.isListening=false;processAnswer(t)}
  $(`#btn-send`).addEventListener('click',sendTyped);
  $(`#inp-txt`).addEventListener('keydown',e=>{if(e.key==='Enter')sendTyped()});
  // Nav logout
  $(`#nav-logout`).addEventListener('click',handleLogout);
  // Warn before browser close during active interview
  window.addEventListener('beforeunload',e=>{if(S.screen==='interview'&&!S.ending){e.preventDefault();e.returnValue='Your interview is in progress. Are you sure?'}});
}

// ===== AUTH PROFILE LOADER =====
async function loadProfile(user){
  try{
    const{data:profile,error:fetchErr}=await sb.from('profiles').select('*').eq('id',user.id).single();
    if(fetchErr&&fetchErr.code!=='PGRST116'){
      // PGRST116 = row not found — that's ok, we'll create it below
      console.warn('loadProfile fetch error:',fetchErr.message);
    }
    if(profile){
      const meta=user.user_metadata||{};const updates={};
      if(!profile.name&&meta.name)updates.name=meta.name;
      if(!profile.university&&meta.university)updates.university=meta.university;
      if(!profile.program&&meta.program)updates.program=meta.program;
      // Only update new columns if they exist in the DB (check profile has the key)
      if('program_category' in profile&&!profile.program_category&&meta.program_category)updates.program_category=meta.program_category;
      if('internship_info' in profile&&!profile.internship_info&&meta.internship_info)updates.internship_info=meta.internship_info;
      if('has_internship' in profile&&profile.has_internship==null&&meta.has_internship!=null)updates.has_internship=meta.has_internship;
      if(Object.keys(updates).length){
        await sb.from('profiles').update(updates).eq('id',user.id);
        S.profile={...profile,...updates};
      }else{
        S.profile=profile;
      }
    }else{
      // Profile row doesn't exist — create it with minimal safe fields
      const meta=user.user_metadata||{};
      const baseProfile={
        id:user.id,
        name:meta.name||user.email?.split('@')[0]||'User',
        university:meta.university||'',
        program:meta.program||'',
        role:'student'
      };
      const{data:np,error:upsertErr}=await sb.from('profiles').upsert(baseProfile,{onConflict:'id'}).select().single();
      if(upsertErr)console.warn('Profile upsert error:',upsertErr.message);
      S.profile=np||{...baseProfile};
    }
  }catch(err){
    console.warn('loadProfile exception:',err.message);
    // Still set a minimal profile so the app can function
    S.profile={id:user.id,role:'student',name:user.email?.split('@')[0]||'User'};
  }
  // Derive field from program_category if available
  if(!S.field&&S.profile?.program_category&&S.profile.program_category!=='other'){
    const cat=S.profile.program_category;
    if(FL[cat]){S.field=cat;S.fieldLabel=FL[cat]}
  }
}

// ===== INIT =====
async function init(){
  mkP();tts.init();stt.init();initEvents();
  if(!isSC())$(`#pw-prot`).style.display='flex';
  const noMic=!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia;
  if(noMic&&$('#pw-stt'))$(`#pw-stt`).style.display='flex';
  const today=new Date().toISOString().split('T')[0];const sd=$('#inp-sdate');if(sd)sd.min=today;
  apiHealth();

  // Always show login page first on every visit.
  // User must actively sign in — no auto-login from stored sessions.
  showScreen('auth');

  // Sign out any existing session silently so the page always starts fresh
  const{data:{session:existingSession}}=await sb.auth.getSession();
  if(existingSession){
    await sb.auth.signOut();
  }

  // Auth state handler — only triggers after user explicitly logs in on this visit
  let _authHandled=false;
  sb.auth.onAuthStateChange(async(event,session)=>{
    try{
      if(event==='PASSWORD_RECOVERY'){showPasswordResetUI();return;}
      if(event==='SIGNED_IN'&&session){
        // Only navigate away from auth screen when user actively signs in
        if(_authHandled&&S.screen!=='auth')return;
        _authHandled=true;
        S.user=session.user;
        await loadProfile(session.user);
        showScreen(S.profile?.role==='admin'?'admin':'dash');
        if(S.profile?.role==='admin')loadAdmin();
        else loadDashboard();
      }else if(event==='SIGNED_OUT'||event==='USER_DELETED'){
        _authHandled=false;S.user=null;S.profile=null;showScreen('auth');
      }else if(event==='TOKEN_REFRESHED'&&session&&S.user){
        S.user=session.user;
      }
    }catch(err){
      console.error('Auth handler error:',err);
      showScreen('auth');
      showAE('Something went wrong. Please try signing in again.');
    }
  });
}

function showPasswordResetUI(){
  // Inject a simple reset password modal dynamically
  const existing=$('#pw-reset-modal');if(existing)existing.remove();
  const modal=document.createElement('div');
  modal.id='pw-reset-modal';
  modal.className='fixed inset-0 z-[200] flex items-center justify-center px-4';
  modal.style.background='rgba(13,13,26,.95)';
  modal.innerHTML=`
    <div class="w-full max-w-sm rounded-2xl p-6 space-y-4" style="background:#13131f;border:1px solid #2d2d4e">
      <div class="text-center">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 btn-glow" style="background:linear-gradient(135deg,#7c3aed,#06b6d4)"><i class="fa-solid fa-lock text-white text-lg"></i></div>
        <h2 class="text-lg font-black text-white">Set New Password</h2>
        <p class="text-xs text-slate-500 mt-1">Enter your new password below.</p>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
        <div class="relative">
          <input type="password" id="pr-pass" placeholder="Min 6 characters" class="w-full rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none transition" style="background:#1a1a2e;border:1px solid #2d2d4e">
          <button type="button" onclick="togglePw('pr-pass',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition" tabindex="-1"><i class="fa-solid fa-eye text-xs"></i></button>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Confirm Password</label>
        <input type="password" id="pr-pass2" placeholder="Repeat password" class="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition" style="background:#1a1a2e;border:1px solid #2d2d4e">
      </div>
      <p id="pr-err" class="hidden text-xs text-red-400 font-medium"></p>
      <button onclick="submitPasswordReset()" id="btn-pr" class="w-full py-3 rounded-xl text-sm font-black text-white btn-glow" style="background:linear-gradient(135deg,#7c3aed,#06b6d4);box-shadow:0 4px 20px rgba(124,58,237,.3)">Update Password</button>
    </div>`;
  document.body.appendChild(modal);
}

async function submitPasswordReset(){
  const p=$('#pr-pass')?.value,p2=$('#pr-pass2')?.value;
  const err=$('#pr-err'),btn=$('#btn-pr');
  if(!p||p.length<6){if(err){err.textContent='Password must be at least 6 characters.';err.classList.remove('hidden')}return}
  if(p!==p2){if(err){err.textContent='Passwords do not match.';err.classList.remove('hidden')}return}
  if(err)err.classList.add('hidden');
  if(btn){btn.disabled=true;btn.textContent='Updating...'}
  const{error}=await sb.auth.updateUser({password:p});
  if(btn){btn.disabled=false;btn.textContent='Update Password'}
  if(error){if(err){err.textContent=error.message;err.classList.remove('hidden')}return}
  toast('Password updated! You can now sign in.','ok');
  $(`#pw-reset-modal`)?.remove();
  await sb.auth.signOut();
  showScreen('auth');
}

// polyfill roundRect for older browsers
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()}}
document.addEventListener('DOMContentLoaded',init);
