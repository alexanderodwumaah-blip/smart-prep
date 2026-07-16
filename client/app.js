/* NS Interview Prep — Complete Phase 5+6 */
const SB_URL='https://wfhteolnlrwbquxndvqs.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHRlb2xubHJ3YnF1eG5kdnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTQwMjEsImV4cCI6MjA5OTczMDAyMX0.2FBhcHGDS2-zfqrGVHWOy5GzN0fE_RKtDQw5rRgv81I';
const sb=window.supabase.createClient(SB_URL,SB_KEY);

const S={screen:'auth',user:null,profile:null,name:'',field:'',fieldLabel:'',mode:'male',cvData:null,company:'',scheduleMode:false,
conversation:[],currentQ:0,totalQ:8,phase:'idle',isListening:false,isSpeaking:false,serverUp:false,
micStream:null,audioCtx:null,analyser:null,animId:null,silenceT:null,maxT:null,finalTxt:'',currentIV:null,teamIdx:0,
mtStream:null,mtCtx:null,mtAn:null,mtAnim:null,sessions:[],completions:[],
// Video recording
vidStream:null,mediaRecorder:null,vidChunks:[],isRecording:false,currentSessionId:null};

const FL={electrical:'Electrical Engineering',mechanical:'Mechanical Engineering',mining:'Mining Engineering',civil:'Civil Engineering',computer:'Computer Engineering',chemical:'Chemical Engineering',petroleum:'Petroleum Engineering',aerospace:'Aerospace Engineering',agricultural:'Agricultural Engineering',biomedical:'Biomedical Engineering',geomatic:'Geomatic Engineering',materials:'Materials Engineering'};
const FK={electrical:['circuit','voltage','current','power','transformer','motor','generator','pcb','plc','relay','wiring','solar','inverter','grid','substation','earthing','switchgear'],mechanical:['cad','thermodynamics','fluid','machine','design','manufacturing','welding','lathe','milling','turbine','pump','bearing','gear','stress','strain','fatigue'],mining:['excavation','drilling','blasting','ore','mineral','tailings','ventilation','shaft','slope','geology','rock','gold','underground','surface','survey'],civil:['concrete','steel','structure','foundation','survey','highway','drainage','soil','beam','column','slab','load','reinforcement','construction','site'],computer:['programming','software','hardware','microcontroller','embedded','algorithm','database','network','python','java','c++','iot','sensor','firmware','linux','arduino'],chemical:['reaction','process','distillation','heat transfer','mass transfer','piping','reactor','catalyst','polymer','fluid flow','thermodynamics','separation','plant','safety'],petroleum:['reservoir','drilling','production','refining','crude','well','pipeline','exploration','formation','gas','oil','upstream','downstream'],aerospace:['aerodynamics','propulsion','structure','flight','aircraft','engine','turbine','lift','drag','composites','avionics','simulation'],agricultural:['irrigation','soil','crop','machinery','processing','farm','tractor','harvest','post-harvest','drainage','greenhouse','yield'],biomedical:['medical','device','implant','biomaterial','prosthetic','diagnostic','tissue','clinical','sterilization','regulatory','signal','imaging'],geomatic:['gis','survey','gps','remote sensing','mapping','cartography','geodesy','photogrammetry','lidar','spatial','coordinate'],materials:['metallurgy','composite','polymer','ceramic','corrosion','heat treatment','alloy','microstructure','testing','characterization']};

const SP={male:{name:'Mr. Osei',gender:'male',pitch:0.88,rate:0.91,role:'Interviewer',focus:null,color:'#e8a023'},female:{name:'Ms. Amoako',gender:'female',pitch:1.14,rate:0.96,role:'Interviewer',focus:null,color:'#e8a023'}};
const TM=[{name:'Ama Darko',role:'HR Coordinator',focus:'behavioral',color:'#3b82f6',pitch:1.12,rate:0.96,gender:'female',intro:"I'm Ama Darko, HR coordinator. I handle behavioral questions."},{name:'Mr. Osei',role:'Technical Lead',focus:'technical',color:'#e8a023',pitch:0.86,rate:0.90,gender:'male',intro:"I'm Mr. Osei, technical lead. I'll assess your technical knowledge."},{name:'Dr. Mensah',role:'Project Manager',focus:'cv_project',color:'#8b5cf6',pitch:0.96,rate:0.93,gender:'male',intro:"I'm Dr. Mensah. I'll focus on your projects and experience."},{name:'Eng. Boateng',role:'Senior Engineer',focus:'scenario',color:'#22c55e',pitch:0.90,rate:0.88,gender:'male',intro:"I'm Engineer Boateng. I'll give you practical scenarios."}];

const FU={project:["Walk me through the technical approach for that project.","What was the most challenging part?","What specific role did you play?","If you could redo one thing, what would it be?","What tools did you use and why?"],internship:["What specific tasks were you responsible for?","How did the practical work connect with coursework?","Describe applying theory to a real problem.","What feedback did your supervisor give you?"],teamwork:["Give an example of resolving a team disagreement.","How do you handle someone not pulling their weight?","What's most important for effective teamwork?"],leadership:["Describe your leadership style.","Tell me about motivating a struggling group.","Good manager vs good leader — what's the difference?"],challenge:["What would you do differently?","How did you manage the pressure?","What did that experience teach you?"],skills:["Which technical skill is your strongest?","How have you developed skills outside class?","Skills you're actively improving?"],motivation:["Why this field of engineering?","Where do you see yourself in five years?","What attracts you about national service?"],academic:["Which courses are most relevant to practice?","Tell me about your final year project.","How did you handle a difficult course?"]};
const PIV={project:"Tell me about a significant project.",internship:"Have you done any industrial attachment?",teamwork:"Share a teamwork experience.",leadership:"Have you been in a leadership role?",challenge:"Describe a significant challenge you've overcome.",skills:"What technical skills have you developed?",motivation:"What motivates you to pursue this career?",academic:"Which coursework will be most useful in industry?"};
const SCN={electrical:["A motor keeps tripping its breaker. Walk me through your diagnosis.","Client wants single-phase to three-phase upgrade. What factors?"],mechanical:["A pump is vibrating excessively. How would you investigate?","Selecting a bearing for high-speed application. What factors?"],mining:["Assess slope stability at a new site. Your approach?","Blast produces more flyrock than expected. Investigation?"],civil:["Concrete pour has cracking. What steps?","Road drainage issues after first rainy season. Fix?"],computer:["Embedded system behaving erratically in field. Debug approach?","Connect sensor network to dashboard. Architecture?"],chemical:["Reactor yield drops unexpectedly. Troubleshoot?","Piping system material selection considerations?"],petroleum:["Well production rate drops. Investigation steps?","Minimize environmental impact at production site."],aerospace:["Component fails at 80% expected load. Investigation?","Select composite for aircraft interior panel."],agricultural:["Irrigation system underperforming. Assess and fix?","Reduce post-harvest losses for a specific crop."],biomedical:["Medical device fails sterilization validation. Next steps?","Choose biomaterial for an implant. What properties?"],geomatic:["GPS survey inconsistent results. What to check?","Topographic map of site with dense vegetation."],materials:["Metal component fails prematurely. Investigation?","Select heat treatment for a steel part."]};
const FTQ={electrical:["Relay vs contactor — when to use each?","Design power distribution for small factory."],mechanical:["Bearing selection factors?","Soldering vs brazing vs welding."],mining:["Open-pit slope stability?","Mineral processing after extraction?"],civil:["Concrete tests before structural use?","Shallow vs deep foundations?"],computer:["Microprocessors vs microcontrollers?","Debug malfunctioning embedded system."],chemical:["Batch vs continuous process?","Heat exchanger types?"],petroleum:["Upstream vs midstream vs downstream?"],aerospace:["Four forces on an aircraft?"],agricultural:["Design irrigation for small farm?"],biomedical:["Medical device design considerations?"],geomatic:["GPS in large-scale surveying?"],materials:["Material selection for applications?"]};
const Q_ARC=['intro','followup','cv_based','technical','behavioral','cv_based','technical','closing'];

const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
function pk(a){return a[Math.floor(Math.random()*a.length)]}
function sl(ms){return new Promise(r=>setTimeout(r,ms))}
function gtg(){const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function isSC(){return window.isSecureContext||location.protocol==='https:'||['localhost','127.0.0.1','[::1]'].includes(location.hostname)}
// *** UPDATE THIS with your actual Render URL if it changes ***
const RENDER_URL='https://ns-interview-prep.onrender.com';

function getAPI(){
  // If a custom URL is entered, use that
  const inp=($('#inp-srv')?.value||'').trim();
  if(inp)return inp.replace(/\/+$/,'');
  // Use saved URL from localStorage if available
  const saved=localStorage.getItem('ns_api_url');
  if(saved)return saved.replace(/\/+$/,'');
  // On localhost, default to local server; on any deployed domain, use Render
  if(['localhost','127.0.0.1','[::1]'].includes(location.hostname))return 'http://localhost:3000';
  return RENDER_URL;
}
function toast(msg,t='info'){const e=document.createElement('div');e.className=`toast toast-${t}`;e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}

// ===== PARTICLES =====
function mkP(){const c=$('#ptc');for(let i=0;i<15;i++){const p=document.createElement('div');p.className='pt';const sz=2+Math.random()*2.5;Object.assign(p.style,{left:Math.random()*100+'%',width:sz+'px',height:sz+'px',animationDuration:(20+Math.random()*30)+'s',animationDelay:(Math.random()*25)+'s','--po':(0.03+Math.random()*0.07).toString()});c.appendChild(p)}}

// ===== SCREENS =====
function showScreen(n){$$('.scr').forEach(s=>s.classList.remove('on'));$(`#s-${n}`).classList.add('on');S.screen=n;const nv=$('#navbar');nv.classList.toggle('hidden',['auth','interview','results'].includes(n));if(!['auth','interview','results'].includes(n))buildNav()}
function buildNav(){const nl=$('#nav-links');nl.innerHTML='';const isA=S.profile?.role==='admin';const links=isA?[{id:'admin',l:'Dashboard'},{id:'mgmt',l:'Tests'}]:[{id:'dash',l:'Dashboard'},{id:'tests',l:'Aptitude'}];
links.forEach(l=>{const b=document.createElement('button');b.className=`nl${S.screen===l.id?' act':''}`;b.textContent=l.l;b.onclick=()=>{if(l.id==='dash')loadDashboard();else if(l.id==='tests')loadTests();else if(l.id==='admin')loadAdmin();else if(l.id==='mgmt')loadMgmt();showScreen(l.id)};nl.appendChild(b)});
 $('#nav-name').textContent=S.profile?.name||''}

// ===== AUTH =====
function switchAuthTab(t){$('#form-login').classList.toggle('hidden',t!=='login');$('#form-signup').classList.toggle('hidden',t!=='signup');$('#tab-login').className=`flex-1 py-1.5 rounded-md text-sm font-medium transition ${t==='login'?'bg-acc text-bg':'text-mut hover:text-white'}`;$('#tab-signup').className=`flex-1 py-1.5 rounded-md text-sm font-medium transition ${t==='signup'?'bg-acc text-bg':'text-mut hover:text-white'}`;$('#auth-err').classList.add('hidden')}
async function handleLogin(){const e=$('#li-email').value.trim(),p=$('#li-pass').value;if(!e||!p){showAE('Fill in all fields.');return}$('#auth-err').classList.add('hidden');const{error}=await sb.auth.signInWithPassword({email:e,password:p});if(error)showAE(error.message)}
async function handleSignup(){const n=$('#su-name').value.trim(),u=$('#su-uni').value,pr=$('#su-prog').value.trim(),e=$('#su-email').value.trim(),p=$('#su-pass').value;if(!n||!e||!p){showAE('Name, email, and password required.');return}if(p.length<6){showAE('Password must be at least 6 characters.');return}$('#auth-err').classList.add('hidden');const{data,error}=await sb.auth.signUp({email:e,password:p,options:{data:{name:n,university:u,program:pr}}});if(error)showAE(error.message);else{toast('Account created! Check email to verify, then sign in.','ok');switchAuthTab('login')}}
function showAE(m){const e=$('#auth-err');e.innerHTML=`<i class="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i><span>${esc(m)}</span>`;e.classList.remove('hidden')}
async function handleLogout(){await sb.auth.signOut();S.user=null;S.profile=null;S.sessions=[];showScreen('auth')}

// ===== TTS =====
const tts={syn:window.speechSynthesis,mV:null,fV:null,
init(){const ld=()=>{const v=this.syn.getVoices().filter(x=>x.lang.startsWith('en'));this.mV=v.find(x=>x.name.includes('Google')&&x.name.includes('Male'))||v.find(x=>x.name.includes('Daniel'))||v[0]||null;this.fV=v.find(x=>x.name.includes('Google')&&x.name.includes('Female'))||v.find(x=>x.name.includes('Samantha'))||v[1]||v[0]||null};ld();if(this.syn.onvoiceschanged!==undefined)this.syn.onvoiceschanged=ld},
async speak(t,c){S.isSpeaking=true;this.syn.cancel();const segs=t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[t];for(let i=0;i<segs.length;i++){if(!S.isSpeaking)break;const s=segs[i].trim();if(!s)continue;await this._s(s,c);if(i<segs.length-1)await sl(220+Math.random()*180)}S.isSpeaking=false},
_s(t,c){return new Promise(r=>{const u=new SpeechSynthesisUtterance(t);u.voice=this.gv(c.gender);u.pitch=c.pitch+(Math.random()*0.05-0.025);u.rate=c.rate+(Math.random()*0.03-0.015);const mx=Math.max(2000,t.length*80),t2=setTimeout(r,mx);u.onend=()=>{clearTimeout(t2);r()};u.onerror=()=>{clearTimeout(t2);r()};this.syn.speak(u)})},
stop(){S.isSpeaking=false;this.syn.cancel()},gv(g){return g==='female'?this.fV||this.mV:this.mV||this.fV}};

// ===== STT =====
const stt={rec:null,ok:false,
init(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){this.ok=false;return}this.rec=new SR();this.rec.continuous=true;this.rec.interimResults=true;this.rec.lang='en-US';this.ok=true},
start(oR,oE){if(!this.ok)return false;S.finalTxt='';this.rec.onresult=e=>{let f='',im='';for(let i=0;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)f+=t;else im+=t}if(f)S.finalTxt=f;oR(f,im);rsT()};this.rec.onend=()=>{if(S.isListening){try{this.rec.start()}catch(e){}}else oE(S.finalTxt)};this.rec.onerror=e=>{if(e.error==='no-speech'||e.error==='aborted')return};try{this.rec.start();return true}catch(e){return false}},
stop(){S.isListening=false;cT();try{this.rec.stop()}catch(e){}}};
function rsT(){cT();S.silenceT=setTimeout(()=>{if(S.isListening)stt.stop()},3200)}
function cT(){if(S.silenceT){clearTimeout(S.silenceT);S.silenceT=null}}

// ===== VISUALIZER =====
async function startViz(){try{S.micStream=await navigator.mediaDevices.getUserMedia({audio:true});S.audioCtx=new(window.AudioContext||window.webkitAudioContext)();S.analyser=S.audioCtx.createAnalyser();S.analyser.fftSize=128;S.audioCtx.createMediaStreamSource(S.micStream).connect(S.analyser);dV()}catch(e){}}
function dV(){const c=$('#audio-canvas'),x=c.getContext('2d'),l=S.analyser.frequencyBinCount,d=new Uint8Array(l);function dr(){if(!S.isListening){x.clearRect(0,0,c.width,c.height);return}S.animId=requestAnimationFrame(dr);S.analyser.getByteFrequencyData(d);x.clearRect(0,0,c.width,c.height);const bw=c.width/l*2.2;let px=0;for(let i=0;i<l;i++){const h=Math.max(2,(d[i]/255)*c.height*.95),a=0.3+(d[i]/255)*0.7;x.fillStyle=`rgba(34,197,94,${a})`;x.beginPath();x.roundRect(px,c.height-h,bw-1.5,h,2);x.fill();px+=bw}}dr()}
function stopViz(){if(S.animId){cancelAnimationFrame(S.animId);S.animId=null}if(S.micStream){S.micStream.getTracks().forEach(t=>t.stop());S.micStream=null}if(S.audioCtx){S.audioCtx.close().catch(()=>{});S.audioCtx=null}const c=$('#audio-canvas');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height)}

// ===== VIDEO RECORDING =====
async function startVideoRecording(){
    try{
        S.vidStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        const selfVid=$('#vid-self');selfVid.srcObject=S.vidStream;$('#vid-prev').classList.remove('hidden');$('#rec-dot').classList.remove('hidden');
        S.vidChunks=[];
        const mimeType=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';
        S.mediaRecorder=new MediaRecorder(S.vidStream,{mimeType});
        S.mediaRecorder.ondataavailable=e=>{if(e.data.size>0)S.vidChunks.push(e.data)};
        S.mediaRecorder.start(1000);S.isRecording=true;
    }catch(e){console.warn('Video recording not available:',e);$('#vid-prev').classList.add('hidden')}
}

function stopVideoRecording(){
    return new Promise(resolve=>{
        if(!S.mediaRecorder||S.isRecording===false){resolve(null);return}
        S.mediaRecorder.onstop=async()=>{
            const blob=new Blob(S.vidChunks,{type:'video/webm'});
            S.vidChunks=[];
            if(S.vidStream){S.vidStream.getTracks().forEach(t=>t.stop());S.vidStream=null}
            $('#vid-self').srcObject=null;$('#vid-prev').classList.add('hidden');$('#rec-dot').classList.add('hidden');
            S.isRecording=false;
            // Upload to Supabase
            if(S.user&&S.currentSessionId&&blob.size>1000){
                try{
                    const path=`${S.user.id}/${S.currentSessionId}.webm`;
                    const{error:upErr}=await sb.storage.from('interview-videos').upload(path,blob,{contentType:'video/webm',upsert:true});
                    if(!upErr){
                        const{data:{publicUrl}}=sb.storage.from('interview-videos').getPublicUrl(path);
                        await sb.from('interview_sessions').update({video_url:publicUrl}).eq('id',S.currentSessionId);
                        toast('Video saved!','ok');
                        resolve(publicUrl);
                    }else resolve(null);
                }catch(e){console.warn('Video upload failed:',e);resolve(null)}
            }else resolve(null);
        };
        S.mediaRecorder.stop();
    });
}

// ===== MIC TEST =====
async function mtGo(){try{S.mtStream=await navigator.mediaDevices.getUserMedia({audio:true});S.mtCtx=new(window.AudioContext||window.webkitAudioContext)();S.mtAn=S.mtCtx.createAnalyser();S.mtAn.fftSize=256;S.mtCtx.createMediaStreamSource(S.mtStream).connect(S.mtAn);$('#mt-go').classList.add('hidden');$('#mt-stop').classList.remove('hidden');$('#mt-st').textContent='Speak now...';$('#mt-st').style.color='#888';dMt()}catch(e){$('#mt-st').textContent='Mic error: '+e.message;$('#mt-st').style.color='#ef4444'}}
function dMt(){const c=$('#mt-cv'),x=c.getContext('2d'),l=S.mtAn.frequencyBinCount,d=new Uint8Array(l);function dr(){S.mtAnim=requestAnimationFrame(dr);S.mtAn.getByteFrequencyData(d);let avg=0;for(let i=0;i<l;i++)avg+=d[i];avg/=l;x.clearRect(0,0,c.width,c.height);const bw=4,gap=1,cols=Math.floor(c.width/(bw+gap));for(let i=0;i<cols;i++){const di=Math.floor(i*l/cols),h=Math.max(2,(d[di]/255)*c.height*.9),a=0.4+(d[di]/255)*0.6;x.fillStyle=`rgba(34,197,94,${a})`;x.beginPath();x.roundRect(i*(bw+gap),c.height-h,bw,h,2);x.fill()}const pct=Math.min(100,avg*1.5);$('#mt-st').textContent=pct>5?`Working! ${Math.round(pct)}%`:'No audio';$('#mt-st').style.color=pct>5?'#22c55e':'#f59e0b'}dr()}
function mtStop(){if(S.mtAnim){cancelAnimationFrame(S.mtAnim);S.mtAnim=null}if(S.mtStream){S.mtStream.getTracks().forEach(t=>t.stop());S.mtStream=null}if(S.mtCtx){S.mtCtx.close().catch(()=>{});S.mtCtx=null}$('#mt-go').classList.remove('hidden');$('#mt-stop').classList.add('hidden')}

// ===== SERVER API =====
async function apiHealth(){try{const r=await fetch(getAPI()+'/api/health',{signal:AbortSignal.timeout(3000)});S.serverUp=r.ok}catch(e){S.serverUp=false}$('#cv-sd').style.background=S.serverUp?'#22c55e':'#ef4444';$('#cv-sl').textContent=S.serverUp?'Connected':'Offline';$('#pw-srv').style.display=S.serverUp?'none':'flex';return S.serverUp}
async function apiParseCV(file,field){const fd=new FormData();fd.append('cv',file);fd.append('field',field);const r=await fetch(getAPI()+'/api/parse-cv',{method:'POST',body:fd});if(!r.ok)throw new Error();return r.json()}
async function apiQuestion(body){const r=await fetch(getAPI()+'/api/generate-question',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error();const d=await r.json();return d.question}
async function apiGrade(body){const r=await fetch(getAPI()+'/api/grade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error();return r.json()}

// ===== DASHBOARD =====
async function loadDashboard(){
    if(!S.user)return;S.name=S.profile?.name||'Student';$('#dash-greet').textContent=`Welcome back, ${S.name}!`;
    const{data:sessions}=await sb.from('interview_sessions').select('*').eq('user_id',S.user.id).order('started_at',{ascending:false});
    S.sessions=sessions||[];
    const ids=(sessions||[]).map(s=>s.id);
    let grades={};if(ids.length){const{data:g}=await sb.from('grading_reports').select('*').in('session_id',ids);(g||[]).forEach(r=>grades[r.session_id]=r)}
    const{data:comps}=await sb.from('aptitude_completions').select('id').eq('user_id',S.user.id);
    const scored=sessions?.filter(s=>grades[s.id])||[];const scores=scored.map(s=>grades[s.id].overall_score);
    $('#ds-sess').textContent=sessions?.filter(s=>s.status==='completed').length||0;
    $('#ds-avg').textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';
    $('#ds-best').textContent=scores.length?Math.max(...scores):'—';
    $('#ds-tests').textContent=comps?.length||0;
    drawTrend(scores.slice(-8).reverse());
    // Scheduled sessions
    const sched=sessions?.filter(s=>s.status==='scheduled'&&new Date(s.scheduled_for)>new Date())||[];
    const sec=$('#sched-sec'),list=$('#sched-list');
    if(sched.length){sec.classList.remove('hidden');list.innerHTML='';sched.forEach(s=>{const d=new Date(s.scheduled_for);const row=document.createElement('div');row.className='sr';row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${FL[s.field]||s.field}</div><div class="text-[10px] text-mut">${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} at ${d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}${s.target_company?' · '+esc(s.target_company):''}</div></div><button onclick="startScheduled('${s.id}')" class="bg-acc/20 text-acc text-[10px] font-medium px-2.5 py-1 rounded hover:bg-acc/30 transition">Start</button>`;list.appendChild(row)})}else sec.classList.add('hidden');
    // Completed sessions
    const el=$('#dash-sessions');const completed=sessions?.filter(s=>s.status==='completed')||[];
    if(!completed.length){el.innerHTML='<div class="p-5 text-center text-xs text-mut">No interviews yet.</div>';return}
    el.innerHTML='';completed.slice(0,10).forEach(s=>{const g=grades[s.id];const score=g?g.overall_score:null;const date=new Date(s.started_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'});const row=document.createElement('div');row.className='sr';row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${FL[s.field]||s.field}${s.video_url?' <i class="fa-solid fa-video text-acc text-[10px]"></i>':''}</div><div class="text-[10px] text-mut">${s.interviewer_mode||'single'} · ${date}</div></div><div class="text-xs font-bold ${score>=70?'text-ok':score>=50?'text-acc':'text-err'}">${score!==null?score+'%':'—'}</div><i class="fa-solid fa-chevron-right text-[10px] text-mut ml-2"></i>`;row.onclick=()=>showDetail(s,grades[s.id]);el.appendChild(row)});
}

function drawTrend(scores){const cv=$('#trend-cv'),x=cv.getContext('2d'),w=cv.width,h=cv.height;x.clearRect(0,0,w,h);if(!scores.length){$('#trend-empty').style.display='block';return}$('#trend-empty').style.display='none';const pad=24,bw=Math.min(35,(w-pad*2-scores.length*5)/scores.length);scores.forEach((s,i)=>{const bx=pad+i*(bw+5),bh=Math.max(3,(s/100)*(h-20)),by=h-10-bh;x.fillStyle=s>=70?'#22c55e':s>=50?'#e8a023':'#ef4444';x.beginPath();x.roundRect(bx,by,bw,bh,3);x.fill();x.fillStyle='#888';x.font='9px Outfit';x.textAlign='center';x.fillText(s,bx+bw/2,by-3)})}

async function showDetail(session,grade){
    showScreen('detail');const score=grade?.overall_score||0;const circ=2*Math.PI*54;
    $('#det-title').textContent=new Date(session.started_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
    $('#det-field').textContent=FL[session.field]||session.field;
    // Video
    if(session.video_url){$('#det-vid-wrap').classList.remove('hidden');$('#det-vid').src=session.video_url}else{$('#det-vid-wrap').classList.add('hidden')}
    setTimeout(()=>{$('#det-arc').style.strokeDashoffset=circ*(1-score/100)},100);animN($('#det-score'),0,score,900);
    if(grade){const subs=[{l:'Communication',s:grade.communication_score,c:'#3b82f6'},{l:'Technical',s:grade.technical_score,c:'#e8a023'},{l:'Relevance',s:grade.relevance_score,c:'#8b5cf6'},{l:'Confidence',s:grade.confidence_score,c:'#22c55e'}];const el=$('#det-subs');el.innerHTML='';subs.forEach((s,i)=>{const d=document.createElement('div');d.innerHTML=`<div class="flex justify-between items-center mb-0.5"><span class="text-[10px] text-gray-400">${s.l}</span><span class="text-[10px] font-semibold" style="color:${s.c}">${s.s}</span></div><div class="bt"><div class="bf" style="width:0%;background:${s.c}" id="db-${i}"></div></div>`;el.appendChild(d);setTimeout(()=>$(`#db-${i}`).style.width=s.s+'%',120+i*80)});
    $('#det-fb').textContent=grade?.feedback_text||'—';const il=$('#det-imp');il.innerHTML='';(grade?.improvement_notes||[]).forEach(im=>{const li=document.createElement('li');li.className='flex items-start gap-1.5 text-[11px]';li.innerHTML=`<i class="fa-solid fa-arrow-right text-acc text-[9px] mt-0.5 shrink-0"></i><span>${esc(im)}</span>`;il.appendChild(li)});
    const{data:turns}=await sb.from('interview_turns').select('*').eq('session_id',session.id).order('turn_number');const td=$('#det-trans');td.innerHTML='';(turns||[]).forEach(t=>{const d=document.createElement('div');d.className=`m m-${t.role==='ai'?'ai':'st'}`;let ex='';if(t.role==='ai'&&t.interviewer_name)ex=`<div class="mn" style="color:#888">${esc(t.interviewer_name)}</div>`;d.innerHTML=`${ex}<div class="ml">${t.role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(t.text)}</div>`;td.appendChild(d)});
}
function animN(el,f,t,dur){const st=performance.now();function u(n){const p=Math.min((n-st)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(f+(t-f)*e);if(p<1)requestAnimationFrame(u)}requestAnimationFrame(u)}

// ===== APTITUDE TESTS =====
async function loadTests(){
    const{data:tests}=await sb.from('aptitude_tests').select('*').eq('is_active',true).order('created_at',{ascending:false});
    const{data:comps}=await sb.from('aptitude_completions').select('test_id').eq('user_id',S.user.id);
    const done=new Set((comps||[]).map(c=>c.test_id));const el=$('#tests-list');
    if(!tests?.length){el.innerHTML='<div class="p-5 text-center text-xs text-mut">No tests available.</div>';return}
    el.innerHTML='';const cc={general:'#3b82f6',technical:'#e8a023',behavioral:'#8b5cf6',logical:'#22c55e'};
    tests.forEach(t=>{const d=done.has(t.id);const row=document.createElement('div');row.className='tr';
    row.innerHTML=`<div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${cc[t.category]||'#888'}22;color:${cc[t.category]||'#888'}"><i class="fa-solid ${t.category==='technical'?'fa-code':t.category==='behavioral'?'fa-users':t.category==='logical'?'fa-brain':'fa-clipboard'} text-xs"></i></div><div class="flex-1 min-w-0"><div class="text-xs font-medium">${esc(t.title)}</div><div class="text-[10px] text-mut truncate">${esc(t.description||t.category+' test')}${t.field?' · '+FL[t.field]:''}</div></div>${d?'<span class="text-[10px] text-ok font-medium"><i class="fa-solid fa-check mr-0.5"></i>Done</span>':`<a href="${esc(t.url)}" target="_blank" rel="noopener" class="bg-acc/20 text-acc font-medium px-2.5 py-1 rounded-lg text-[10px] hover:bg-acc/30 transition shrink-0">Take Test <i class="fa-solid fa-arrow-right ml-0.5"></i></a>`}`;
    el.appendChild(row);
    el.querySelectorAll('a[target="_blank"]').forEach(a=>a.addEventListener('click',async()=>{const tid=tests.find(t=>t.url===a.href)?.id;if(tid)await sb.from('aptitude_completions').upsert({user_id:S.user.id,test_id:tid},{onConflict:'user_id,test_id'})}))});
}

// ===== ADMIN =====
async function loadAdmin(){
    const{data:users}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
    const{data:sessions}=await sb.from('interview_sessions').select('*');
    const{data:grades}=await sb.from('grading_reports').select('*');
    const{data:tests}=await sb.from('aptitude_tests').select('id');
    $('#ad-users').textContent=users?.length||0;$('#ad-sess').textContent=sessions?.length||0;
    const scores=grades?.map(g=>g.overall_score)||[];$('#ad-avg').textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';$('#ad-tests').textContent=tests?.length||0;
    const uStats={};(sessions||[]).forEach(s=>{if(!uStats[s.user_id])uStats[s.user_id]={count:0,scores:[]};uStats[s.user_id].count++;if(grades)grades.filter(g=>g.session_id===s.id).forEach(g=>uStats[s.user_id].scores.push(g.overall_score))});
    const el=$('#ad-users-list');el.innerHTML='';if(!users?.length){el.innerHTML='<div class="p-4 text-center text-xs text-mut">No users.</div>';return}
    users.slice(0,20).forEach(u=>{const st=uStats[u.id]||{count:0,scores:[]};const avg=st.scores.length?Math.round(st.scores.reduce((a,b)=>a+b,0)/st.scores.length):'—';
    const row=document.createElement('div');row.className='sr';row.innerHTML=`<div class="flex-1"><div class="text-xs font-medium">${esc(u.name)} ${u.role==='admin'?'<span class="text-[10px] text-acc">Admin</span>':''}<br><span class="text-[10px] text-mut">${u.university||'—'} · ${u.program||'—'}</span></div></div><div class="text-[10px] text-mut mr-3">${st.count} interviews</div><div class="text-xs font-semibold ${typeof avg==='number'?(avg>=70?'text-ok':avg>=50?'text-acc':'text-err'):'text-mut'}">${avg}${typeof avg==='number'?'%':''}</div>`;el.appendChild(row)});
}

// ===== MANAGE TESTS =====
async function loadMgmt(){const{data:tests}=await sb.from('aptitude_tests').select('*').order('created_at',{ascending:false});const el=$('#mgmt-list');el.innerHTML='';if(!tests?.length){el.innerHTML='<div class="p-4 text-center text-xs text-mut">No tests.</div>';return}
    tests.forEach(t=>{const row=document.createElement('div');row.className='tr';row.innerHTML=`<div class="flex-1 min-w-0"><div class="text-xs font-medium">${esc(t.title)}</div><div class="text-[10px] text-mut">${t.category}${t.field?' · '+FL[t.field]:''}</div></div><div class="flex gap-1.5 shrink-0"><button class="text-[10px] px-2 py-1 rounded ${t.is_active?'bg-ok/20 text-ok':'bg-mut/20 text-mut'}" onclick="toggleTest('${t.id}',${!t.is_active})">${t.is_active?'Active':'Off'}</button><button class="text-[10px] px-2 py-1 rounded bg-err/20 text-err hover:bg-err/30" onclick="deleteTest('${t.id}')"><i class="fa-solid fa-trash"></i></button></div>`;el.appendChild(row)})}
async function addTest(){const t=$('#mt-title').value.trim(),u=$('#mt-url').value.trim(),c=$('#mt-cat').value,f=$('#mt-field').value||null,d=$('#mt-desc').value.trim();if(!t||!u){toast('Title and URL required.','err');return}await sb.from('aptitude_tests').insert({title:t,url:u,category:c,field:f,description:d,created_by:S.user.id});$('#mt-title').value='';$('#mt-url').value='';$('#mt-desc').value='';toast('Test added!','ok');loadMgmt()}
async function toggleTest(id,a){await sb.from('aptitude_tests').update({is_active:a}).eq('id',id);toast(a?'Activated':'Deactivated','ok');loadMgmt()}
async function deleteTest(id){if(!confirm('Delete?'))return;await sb.from('aptitude_tests').delete().eq('id',id);toast('Deleted.','ok');loadMgmt()}

// ===== SCHEDULE =====
function toggleSchedule(){S.scheduleMode=!S.scheduleMode;$('#sched-fields').classList.toggle('hidden',!S.scheduleMode);$('#btn-start').classList.toggle('hidden',S.scheduleMode);$('#btn-schedule').classList.toggle('hidden',!S.scheduleMode);const dot=$('#sched-dot'),toggle=$('#sched-toggle');if(S.scheduleMode){dot.style.left='calc(100% - 18px)';dot.style.background='#e8a023';toggle.style.background='rgba(232,160,35,0.2)'}else{dot.style.left='2px';dot.style.background='#777';toggle.style.background=''}}

async function scheduleInterview(){
    const date=$('#inp-sdate').value,time=$('#inp-stime').value;
    if(!date||!time){toast('Pick date and time.','err');return}
    const scheduledFor=new Date(`${date}T${time}:00`).toISOString();
    if(new Date(scheduledFor)<=new Date()){toast('Pick a future date/time.','err');return}
    const{data,error}=await sb.from('interview_sessions').insert({user_id:S.user.id,field:S.field,field_label:S.fieldLabel,target_company:S.company||null,interviewer_mode:S.mode,total_questions:8,status:'scheduled',scheduled_for:scheduledFor}).select('id').single();
    if(error){toast('Failed: '+error.message,'err');return}
    toast('Interview scheduled!','ok');showScreen('dash');loadDashboard();
}

async function startScheduled(id){
    const{data:session}=await sb.from('interview_sessions').select('*').eq('id',id).single();
    if(!session)return;
    S.field=session.field;S.fieldLabel=session.field_label||FL[session.field];S.mode=session.interviewer_mode||'male';S.company=session.target_company||'';
    S.currentSessionId=id;
    await sb.from('interview_sessions').update({status:'active',started_at:new Date().toISOString()}).eq('id',id);
    S.conversation=[];S.currentQ=0;S.teamIdx=0;S.totalQ=8;
    $('#transcript').innerHTML='';updP();showScreen('interview');
    $('#d-field').textContent=S.fieldLabel;$('#d-eng').textContent=S.serverUp?'LLM':'Built-in';
    S.currentIV=getIV();await sl(400);
    const vc=getVC();let g=S.mode==='team'?`${gtg()}, ${S.name}. Panel interview for ${S.fieldLabel}. ${S.currentIV.intro} Tell me about yourself.`:`${gtg()}, ${S.name}. I'm ${S.currentIV.name}. ${S.fieldLabel} mock interview — 8 questions. Tell me about yourself.`;
    S.conversation.push({role:'ai',text:g,interviewer:S.currentIV.name});addM('ai',g,false);
    $('#d-iname').textContent=S.currentIV.name+' — '+S.currentIV.role;$('#d-iname').style.color=S.currentIV.color||'#888';
    setPh('speaking');await startVideoRecording();await tts.speak(g,vc);await sl(400);await startLis();
}

// ===== FALLBACK Q ENGINE =====
function detTop(t){const l=t.toLowerCase(),f=[];const ck={project:['project','built','developed','created','designed','implemented','prototype','final year','thesis'],internship:['internship','intern','worked at','company','industry','attachment','placement','site','supervisor'],teamwork:['team','group','together','collaborated','partner','colleague','member','committee'],leadership:['led','leader','managed','supervised','coordinated','directed','headed','president'],challenge:['challenge','difficult','problem','issue','obstacle','struggled','overcome','failed','mistake'],skills:['skill','proficient','experienced','familiar','knowledge','expertise','software','tool'],motivation:['passion','love','interested','enjoy','driven','goal','career','why','want'],academic:['course','class','lecture','professor','grade','gpa','research','university','learned']};for(const[k,ws]of Object.entries(ck))if(ws.some(w=>l.includes(w)))f.push(k);return f.length?f:['skills']}
function cFK(t,f){return(FK[f]||[]).filter(k=>t.toLowerCase().includes(k)).length}
function fbQ(answer,field,iv,qi){
    const topics=detTop(answer);const asked=S.conversation.filter(c=>c.role==='student').flatMap(c=>detTop(c.text));const qt=Q_ARC[qi]||'followup';
    if(qt==='cv_based'&&S.cvData){if(S.cvData.projects?.length)return`I see you worked on ${pk(S.cvData.projects).substring(0,70)}. Tell me more.`;if(S.cvData.skills?.length)return`Your CV mentions ${pk(S.cvData.skills)}. Describe your experience.`}
    if(qt==='technical'){if(iv?.focus==='scenario'&&SCN[field])return pk(SCN[field]);return pk(FTQ[field]||FTQ.electrical)}
    if(qt==='behavioral'){const bt=['teamwork','leadership','challenge','motivation'];const u=bt.filter(t=>!asked.includes(t));if(u.length)return PIV[pk(u)]}
    if(qt==='closing')return pk(["What do you hope to gain from national service?","Where do you see yourself in five years?","Why should a company choose you?","What questions do you have?"]);
    if(answer.length>15&&topics.length){const fr=topics.filter(t=>!asked.includes(t)||Math.random()>0.6);if(FU[fr[0]||topics[0]])return pk(FU[fr[0]||topics[0]])}
    const all=Object.keys(PIV);const u=all.filter(t=>!asked.includes(t));if(u.length)return PIV[pk(u)];return pk(FTQ[field]||FTQ.electrical);
}
function fbGrade(convo,field){
    const ans=convo.filter(c=>c.role==='student').map(c=>c.text);if(!ans.length)return null;
    let ct=0,tt=0,rt=0,cft=0;
    ans.forEach(a=>{const w=a.trim().split(/\s+/).length;const st=/\b(first|second|then|finally|however|therefore|for example)\b/i.test(a);ct+=Math.min(100,Math.max(20,w*0.8+(st?15:0)));tt+=Math.min(100,Math.max(15,cFK(a,field)*18+20));rt+=55+Math.random()*25;const h=(a.match(/\b(um|uh|maybe|i think|i guess|not sure)\b/gi)||[]).length;cft+=Math.min(100,Math.max(20,w*0.6-h*8+30))});
    const n=ans.length;const co=Math.round(ct/n),te=Math.round(tt/n),re=Math.round(rt/n),cf=Math.round(cft/n);const ov=Math.round(co*.25+te*.35+re*.2+cf*.2);
    const fb=[];if(ov>=70)fb.push(`Solid ${FL[field]||field} preparation.`);else if(ov>=50)fb.push('Reasonable foundation, room to improve.');else fb.push('More preparation recommended.');
    if(ans.reduce((s,a)=>s+a.split(/\s+/).length,0)/n<30)fb.push("Answers were brief — aim for more detail.");else fb.push("Good answer depth.");
    if(cFK(ans.join(' '),field)<2)fb.push("Use more field-specific terminology.");else fb.push("Good technical vocabulary.");
    const imp=[];if(co<65)imp.push("Use STAR method for structured answers.");if(te<60)imp.push(`Review core ${FL[field]||field} concepts.`);if(re<60)imp.push("Address questions more directly.");if(cf<60)imp.push("Reduce filler words.");if(!imp.length)imp.push("Keep practicing to maintain your performance.");
    return{overall:ov,communication:co,technical:te,relevance:re,confidence:cf,feedback:fb.join(' '),improvements:imp};
}

// ===== INTERVIEW UI =====
function setPh(p){S.phase=p;const c=$('#avc'),rs=['.r1','.r2','.r3'],w=$('#swv'),cv=$('#audio-canvas'),st=$('#d-st'),ic=$('#avc-i');c.classList.remove('sp','li','th');rs.forEach(r=>$(r).classList.remove('pu'));w.classList.remove('on');cv.classList.add('hidden');
    switch(p){case'speaking':c.classList.add('sp');rs.forEach(r=>$(r).classList.add('pu'));w.classList.add('on');ic.className='fa-solid fa-volume-high';st.textContent='Speaking...';st.style.color='#e8a023';break;case'listening':c.classList.add('li');ic.className='fa-solid fa-microphone';cv.classList.remove('hidden');st.textContent='Listening — speak now';st.style.color='#22c55e';break;case'processing':c.classList.add('th');ic.className='fa-solid fa-brain';st.textContent='Processing...';st.style.color='#888';break;case'done':ic.className='fa-solid fa-check';st.textContent='Complete';st.style.color='#e8a023';break;default:ic.className='fa-solid fa-microphone-lines';st.textContent='Preparing...';st.style.color='#888'}}
function addM(role,text,interim){const d=document.createElement('div');d.className=`m m-${interim?'im':role==='ai'?'ai':'st'}`;let ex='';if(!interim&&S.currentIV&&role==='ai')ex=`<div class="mn" style="color:${S.currentIV.color||'#888'}">${S.currentIV.name}</div>`;d.innerHTML=`${ex}<div class="ml">${role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(text)}</div>`;if(interim)d.id='im-msg';const a=$('#transcript');a.appendChild(d);a.parentElement.scrollTop=a.parentElement.scrollHeight;return d}
function rmIM(){const e=$('#im-msg');if(e)e.remove()}
function updP(){const p=(S.currentQ/S.totalQ)*100;$('#pbar').style.width=p+'%';$('#d-cnt').textContent=`Q ${Math.min(S.currentQ+1,S.totalQ)}/${S.totalQ}`}
function getVC(){if(S.mode==='team'&&S.currentIV)return{gender:S.currentIV.gender,pitch:S.currentIV.pitch,rate:S.currentIV.rate};if(S.mode==='random')return{gender:Math.random()>0.5?'female':'male',pitch:0.88+Math.random()*0.26,rate:0.91+Math.random()*0.05};const p=SP[S.mode]||SP.male;return{gender:p.gender,pitch:p.pitch,rate:p.rate}}
function getIV(){if(S.mode!=='team')return{...SP[S.mode||'male'],role:'Interviewer',focus:null,color:'#e8a023'};return TM[S.teamIdx%TM.length]}

// ===== INTERVIEW FLOW =====
async function startInt(){
    S.conversation=[];S.currentQ=0;S.teamIdx=0;S.totalQ=8;$('#transcript').innerHTML='';updP();showScreen('interview');
    $('#d-field').textContent=S.fieldLabel;$('#d-eng').textContent=S.serverUp?'LLM':'Built-in';S.currentIV=getIV();
    // Create session in DB
    if(S.user){const{data:s}=await sb.from('interview_sessions').insert({user_id:S.user.id,field:S.field,field_label:S.fieldLabel,target_company:S.company||null,interviewer_mode:S.mode,total_questions:8,status:'active'}).select('id').single();if(s)S.currentSessionId=s.id}
    await sl(400);const vc=getVC();let g=S.mode==='team'?`${gtg()}, ${S.name}. Panel interview for ${S.fieldLabel}. ${S.currentIV.intro} Tell me about yourself.`:`${gtg()}, ${S.name}. I'm ${S.currentIV.name}. ${S.fieldLabel} mock interview — 8 questions. Tell me about yourself.`;
    S.conversation.push({role:'ai',text:g,interviewer:S.currentIV.name});addM('ai',g,false);
    $('#d-iname').textContent=S.currentIV.name+' — '+S.currentIV.role;$('#d-iname').style.color=S.currentIV.color||'#888';
    setPh('speaking');await startVideoRecording();await tts.speak(g,vc);await sl(400);await startLis();
}

async function startLis(){
    setPh('listening');S.isListening=true;await startViz();
    const ok=stt.start((f,im)=>{rmIM();if(im)addM('student',f+im,true);else if(f){rmIM();addM('student',f,false)}},(t)=>handleAns(t));
    if(!ok){$('#inp-txt').disabled=false;$('#btn-send').disabled=false;$('#d-st').textContent='Type below — mic unavailable';$('#d-st').style.color='#f59e0b'}
    S.maxT=setTimeout(()=>{if(S.isListening){stt.stop();stopViz();handleAns(S.finalTxt)}},90000);
}

async function handleAns(text){
    S.isListening=false;if(S.maxT){clearTimeout(S.maxT);S.maxT=null}stopViz();
    if(!text||text.trim().length<3){const ti=$('#inp-txt').value.trim();if(ti.length>=3){text=ti;$('#inp-txt').value=''}else{setPh('speaking');const rq="I didn't catch that. Please repeat or type below.";addM('ai',rq,false);S.conversation.push({role:'ai',text:rq,interviewer:S.currentIV.name});await tts.speak(rq,getVC());await sl(400);await startLis();return}}
    rmIM();const ms=$$('.m-st');if(!ms.length||ms[ms.length-1]?.querySelector('.mb')?.textContent!==text)addM('student',text,false);
    S.conversation.push({role:'student',text});$('#inp-txt').disabled=true;$('#btn-send').disabled=true;
    S.currentQ++;updP();if(S.currentQ>=S.totalQ){await endInt();return}
    setPh('processing');await sl(400);
    if(S.mode==='team'&&S.currentQ%2===0){S.teamIdx++;S.currentIV=getIV();$('#d-iname').textContent=S.currentIV.name+' — '+S.currentIV.role;$('#d-iname').style.color=S.currentIV.color||'#888'}
    let q=null;if(S.serverUp){try{q=await apiQuestion({conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,name:S.name,cvData:S.cvData,interviewer:S.currentIV,currentQ:S.currentQ,totalQ:S.totalQ})}catch(e){}}
    if(!q)q=fbQ(text,S.field,S.currentIV,S.currentQ);
    S.conversation.push({role:'ai',text:q,interviewer:S.currentIV.name});addM('ai',q,false);
    setPh('speaking');await tts.speak(q,getVC());await sl(400);await startLis();
}

async function endInt(){
    setPh('processing');const cl=`Thank you, ${S.name}. That concludes your session.`;
    addM('ai',cl,false);setPh('speaking');await tts.speak(cl,getVC());await sl(500);setPh('done');
    // Stop video and wait for upload
    const videoUrl=await stopVideoRecording();
    let g=null;if(S.serverUp){try{g=await apiGrade({conversation:S.conversation,field:S.field,fieldLabel:S.fieldLabel,name:S.name})}catch(e){}}
    if(!g)g=fbGrade(S.conversation,S.field);
    // Save to DB
    if(S.user&&S.currentSessionId){
        const turns=S.conversation.map((t,i)=>({session_id:S.currentSessionId,turn_number:i,role:t.role,interviewer_name:t.interviewer||null,text:t.text}));
        await sb.from('interview_turns').insert(turns);
        if(g)await sb.from('grading_reports').insert({session_id:S.currentSessionId,overall_score:g.overall,communication_score:g.communication,technical_score:g.technical,relevance_score:g.relevance,confidence_score:g.confidence,feedback_text:g.feedback,improvement_notes:g.improvements});
        await sb.from('interview_sessions').update({status:'completed',ended_at:new Date().toISOString()}).eq('id',S.currentSessionId);
    }
    await sl(400);showRes(g);
}

function showRes(g){
    showScreen('results');const circ=2*Math.PI*59;setTimeout(()=>{$('#sc-ar').style.strokeDashoffset=circ*(1-g.overall/100)},100);animN($('#sc-n'),0,g.overall,1200);
    const subs=[{l:'Communication',s:g.communication,c:'#3b82f6',w:'25%'},{l:'Technical',s:g.technical,c:'#e8a023',w:'35%'},{l:'Relevance',s:g.relevance,c:'#8b5cf6',w:'20%'},{l:'Confidence',s:g.confidence,c:'#22c55e',w:'20%'}];
    const el=$('#r-subs');el.innerHTML='';subs.forEach((s,i)=>{const d=document.createElement('div');d.innerHTML=`<div class="flex justify-between items-center mb-0.5"><span class="text-[10px] text-gray-400">${s.l} <span class="text-[9px] text-mut">${s.w}</span></span><span class="text-[10px] font-semibold" style="color:${s.c}">${s.s}</span></div><div class="bt"><div class="bf" style="width:0%;background:${s.c}" id="rb-${i}"></div></div>`;el.appendChild(d);setTimeout(()=>$(`#rb-${i}`).style.width=s.s+'%',200+i*150)});
    $('#r-fb').textContent=g.feedback||'—';const il=$('#r-imp');il.innerHTML='';(g.improvements||[]).forEach(im=>{const li=document.createElement('li');li.className='flex items-start gap-1.5 text-[11px]';li.innerHTML=`<i class="fa-solid fa-arrow-right text-acc text-[9px] mt-0.5 shrink-0"></i><span>${esc(im)}</span>`;il.appendChild(li)});
    const td=$('#r-trans');td.innerHTML='';S.conversation.forEach(c=>{const d=document.createElement('div');d.className=`m m-${c.role==='ai'?'ai':'st'}`;let ex='';if(c.role==='ai'&&c.interviewer){const iv=S.mode==='team'?TM.find(t=>t.name===c.interviewer):null;ex=`<div class="mn" style="color:${iv?iv.color:'#888'}">${esc(c.interviewer)}</div>`}d.innerHTML=`${ex}<div class="ml">${c.role==='ai'?'Interviewer':esc(S.name)}</div><div class="mb">${esc(c.text)}</div>`;td.appendChild(d)});
    $('#r-sub').textContent=S.mode==='team'?'Panel — 8 questions':'8-question session';
}

// ===== CV UPLOAD =====
async function handleCV(file){if(!file||file.size>10*1024*1024)return;$('#cv-dc').classList.add('hidden');$('#cv-dd').classList.remove('hidden');$('#cv-fn').textContent=file.name;$('#cv-wc').textContent='Parsing...';$('#cv-drop').classList.add('hf');
    if(S.serverUp){try{const fd=new FormData();fd.append('cv',file);fd.append('field',S.field);const r=await fetch(getAPI()+'/api/parse-cv',{method:'POST',body:fd});if(!r.ok)throw new Error();const data=await r.json();S.cvData=data;$('#cv-wc').textContent=`${data.wordCount} words`;const sk=$('#cv-sk');sk.innerHTML='';(data.skills||[]).forEach(s=>{const sp=document.createElement('span');sp.className='stg';sp.textContent=s;sk.appendChild(sp)});if(data.skills?.length)$('#cv-prev').classList.remove('hidden')}catch(e){$('#cv-wc').textContent='Parse failed';S.cvData=null}}else{$('#cv-wc').textContent='Server offline';S.cvData=null}}

// ===== EVENTS =====
function initEvents(){
    switchAuthTab('login');
    $$('#mode-sel .md').forEach(b=>b.addEventListener('click',()=>{$$('#mode-sel .md').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');S.mode=b.dataset.m;$('#team-prev').classList.toggle('hidden',S.mode!=='team')}));
    const fi=$('#inp-field'),sb2=$('#btn-start');
    fi.addEventListener('change',()=>{sb2.disabled=!fi.value;S.field=fi.value;S.fieldLabel=FL[S.field]||S.field});
    sb2.addEventListener('click',()=>{S.name=S.profile?.name||'Student';S.company=$('#inp-company').value.trim();startInt()});
    $('#btn-schedule').addEventListener('click',scheduleInterview);
    const drop=$('#cv-drop'),inp=$('#cv-inp');drop.addEventListener('click',()=>inp.click());drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dg')});drop.addEventListener('dragleave',()=>drop.classList.remove('dg'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('dg');if(e.dataTransfer.files.length)handleCV(e.dataTransfer.files[0])});inp.addEventListener('change',()=>{if(inp.files.length)handleCV(inp.files[0])});
    $('#btn-mic').addEventListener('click',()=>$('#mt-area').classList.toggle('hidden'));$('#mt-go').addEventListener('click',mtGo);$('#mt-stop').addEventListener('click',mtStop);
    $('#adv-tog').addEventListener('click',()=>{const p=$('#adv-p'),ch=$('#adv-ch');p.classList.toggle('hidden');ch.style.transform=p.classList.contains('hidden')?'':'rotate(180deg)'});
    // Pre-fill saved URL and save on change
    const _savedUrl=localStorage.getItem('ns_api_url')||'';if(_savedUrl&&$('#inp-srv'))$('#inp-srv').value=_savedUrl;
    $('#inp-srv')?.addEventListener('change',()=>{const v=$('#inp-srv').value.trim();if(v)localStorage.setItem('ns_api_url',v);apiHealth()});
    $('#btn-end').addEventListener('click',async()=>{if(S.phase==='done')return;stt.stop();stopViz();if(S.maxT){clearTimeout(S.maxT);S.maxT=null}await endInt()});
    function sendT(){const t=$('#inp-txt').value.trim();if(!t)return;if(!stt.ok){S.isListening=false;handleAns(t)}}$('#btn-send').addEventListener('click',sendT);$('#inp-txt').addEventListener('keydown',e=>{if(e.key==='Enter')sendT()});
    $('#nav-logout').addEventListener('click',handleLogout);
    window.addEventListener('beforeunload',e=>{if(S.screen==='interview'&&S.phase!=='done'){e.preventDefault();e.returnValue=''}});
}

// ===== INIT =====
async function init(){
    mkP();tts.init();stt.init();initEvents();
    if(!isSC())$('#pw-prot').style.display='flex';if(!stt.ok)$('#pw-stt').style.display='flex';
    // Set min date for scheduler
    const today=new Date().toISOString().split('T')[0];const sd=$('#inp-sdate');if(sd)sd.min=today;
    await apiHealth();
    const{data:{session}}=await sb.auth.getSession();
    if(session){S.user=session.user;const{data:profile}=await sb.from('profiles').select('*').eq('id',S.user.id).single();S.profile=profile;
        if(profile?.role==='admin'){loadAdmin();showScreen('admin')}else{loadDashboard();showScreen('dash')}}else showScreen('auth');
    sb.auth.onAuthStateChange(async(event,session)=>{if(event==='SIGNED_IN'&&session){S.user=session.user;const{data:profile}=await sb.from('profiles').select('*').eq('id',S.user.id).single();S.profile=profile;
        // Update profile with signup metadata if missing
        if(profile&&session.user?.user_metadata?.name&&!profile.name){await sb.from('profiles').update({name:session.user.user_metadata.name,university:session.user.user_metadata.university,program:session.user.user_metadata.program}).eq('id',S.user.id);S.profile={...profile,...session.user.user_metadata}}
        if(profile?.role==='admin'){loadAdmin();showScreen('admin')}else{loadDashboard();showScreen('dash')}}else if(event==='SIGNED_OUT'){S.user=null;S.profile=null;showScreen('auth')}});
}
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()}}
document.addEventListener('DOMContentLoaded',init);