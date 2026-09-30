import {APP_VERSION, techniques, chains, fullSession, focusRotation, pressureCategories, noiseCues, representations, glossary, curriculum} from './data.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STORAGE = 'rensa-state-v1';
const defaultState = {route:'today',band:false,speech:true,tones:true,pressureLevel:3,sessionMode:'full',logs:[],techStats:{},sessionCount:0,lastVersion:APP_VERSION};
let state = loadState();
let audioCtx = null, wakeLock = null, toastTimer = null;
let activeSession = null;

function loadState(){
  try{return {...defaultState,...JSON.parse(localStorage.getItem(STORAGE)||'{}')};}catch{return {...defaultState};}
}
function saveState(){localStorage.setItem(STORAGE,JSON.stringify(state));}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function fmt(sec){sec=Math.max(0,Math.ceil(sec));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200);}
function haptic(pattern=20){if(navigator.vibrate) navigator.vibrate(pattern);}
async function ensureAudio(){
  try{if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')await audioCtx.resume();return true;}catch{return false;}
}
async function tone(kind='transition'){
  if(!state.tones)return; if(!(await ensureAudio()))return;
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.type='sine'; osc.frequency.value=kind==='pressure'?620:kind==='done'?820:480;
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.08,audioCtx.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.18);
  osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.2);
}
function speak(text,force=false){
  if((!state.speech&&!force)||!('speechSynthesis' in window))return;
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.96;u.pitch=.86;u.volume=1;speechSynthesis.speak(u);
}
async function requestWake(){try{if('wakeLock'in navigator)wakeLock=await navigator.wakeLock.request('screen');}catch{}}
async function releaseWake(){try{await wakeLock?.release();}catch{}wakeLock=null;}

document.addEventListener('click',e=>{
  const route=e.target.closest('[data-route]')?.dataset.route;
  if(route){state.route=route;saveState();render();}
  const tech=e.target.closest('[data-tech]')?.dataset.tech;if(tech)showTechnique(tech);
});
$$('.nav-btn').forEach(()=>{});
$('#settings-open').addEventListener('click',openSettings);
$('#audio-toggle').addEventListener('click',async()=>{const on=state.speech||state.tones;state.speech=!on;state.tones=!on;saveState();if(!on)await ensureAudio();syncAudioButton();toast(!on?'Audio cues ON':'Audio cues OFF');});
$('#settings-form').addEventListener('close',()=>{});
$('#settings-dialog').addEventListener('close',()=>{if($('#settings-dialog').returnValue==='save')saveSettings();});
$('#export-data').addEventListener('click',exportData);
$('#import-data').addEventListener('change',importData);

document.addEventListener('visibilitychange',async()=>{if(document.visibilityState==='visible'&&activeSession){await ensureAudio();requestWake();}});

function syncAudioButton(){const b=$('#audio-toggle');const on=state.speech||state.tones;b.classList.toggle('active',on);b.textContent=on?'AUDIO':'MUTE';}
function syncNav(){$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.route===state.route));}
function render(){syncNav();syncAudioButton();const v=$('#view');if(state.route==='today')v.innerHTML=todayView();if(state.route==='pressure')v.innerHTML=pressureView();if(state.route==='library')v.innerHTML=libraryView();if(state.route==='chains')v.innerHTML=chainsView();if(state.route==='ledger')v.innerHTML=ledgerView();bindView();v.focus({preventScroll:true});}
function bindView(){
  $('#start-session')?.addEventListener('click',startWeeklySession);
  $('#start-pressure')?.addEventListener('click',()=>startPressureStandalone(Number($('#pressure-select').value),Number($('#pressure-duration').value)));
  $('#clear-ledger')?.addEventListener('click',()=>{if(confirm('Clear all RENSA ledger entries?')){state.logs=[];state.techStats={};saveState();render();}});
  $('#library-search')?.addEventListener('input',renderLibraryCards);
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLibraryCards();}));
}
function modeMinutes(){return state.sessionMode==='compact'?20:state.sessionMode==='preview'?5:50;}
function focusPair(){const idx=state.sessionCount%focusRotation.length;return focusRotation[idx].map(id=>techniques.find(t=>t.id===id));}
function todayView(){const focus=focusPair();const total=modeMinutes();return `
  <section class="hero"><span class="eyebrow">RELEASE ${APP_VERSION} // PERSONAL SYSTEM</span><h1>RECALL<br>UNDER LOAD.</h1><p>Compact solo combatives maintenance for an existing hybrid skill set. No-impact, no-partner, apartment-footprint training with deliberate pressure retrieval.</p></section>
  <div class="meta-strip"><div><span>SPACE</span><strong>72 × 24 IN</strong></div><div><span>MODE</span><strong>SOLO / QUIET</strong></div><div><span>BAND</span><strong>${state.band?'ENABLED':'OPTIONAL / OFF'}</strong></div><div><span>SESSION</span><strong>${total} MIN</strong></div></div>
  <section class="card session-card"><div class="session-title"><div><span class="eyebrow">WEEKLY // SESSION ${state.sessionCount+1}</span><h2>Adaptive Combatives Recall</h2><p class="muted">All seven takedown families remain in the maintenance pulse. Deeper volume rotates toward two focus entries.</p></div><span class="duration-pill">${total}:00</span></div>
  <div class="focus-row"><span class="focus-chip">FOCUS A // ${esc(focus[0].name)}</span><span class="focus-chip">FOCUS B // ${esc(focus[1].name)}</span><span class="focus-chip">PRESSURE // P${state.pressureLevel}</span></div>
  <div class="phase-preview">${[['WAKE','04'],['BASE','03'],['WRESTLE','03'],['STRIKE','06'],['FLOW','04'],['TAKEDOWN','11'],['CONTROL','04'],['CHAIN','08'],['PRESSURE','05'],['DOWN','02']].map(x=>`<div class="phase-line"><span>${x[0]}</span><em>${phaseDescription(x[0])}</em><strong>${x[1]}m</strong></div>`).join('')}</div>
  <div class="callout">RENSA never interprets shadow entries, air-drilled control positions, or solo Hubud as live validation. The session trains retrieval and motor representation within the current environment.</div>
  <div class="button-row" style="margin-top:16px"><button id="start-session" class="btn primary">BEGIN SESSION</button><button class="btn secondary" data-route="library">OPEN LIBRARY</button></div></section>
  <section class="section"><div class="section-head"><div><span class="eyebrow">EVIDENCE</span><h2>Current ledger</h2></div><p>${state.logs.length} completed session${state.logs.length===1?'':'s'}</p></div><div class="grid">${statCards()}</div></section>`;}
function phaseDescription(p){return {WAKE:'mobility / preparation',BASE:'stance / micro movement',WRESTLE:'quiet level-change patterns',STRIKE:'four retained combinations',FLOW:'Hubud solo proxy',TAKEDOWN:'maintenance + rotating focus',CONTROL:'position recall only',CHAIN:'cross-domain switching',PRESSURE:'randomized retrieval',DOWN:'decompress / log'}[p]||'';}
function statCards(){const last=state.logs[0];const stats=[['SESSIONS',state.logs.length],['TOTAL MIN',state.logs.reduce((a,l)=>a+(l.minutes||0),0)],['LAST RECALL',last?`${last.recall}/5`:'—'],['PAIN FLAGS',state.logs.filter(l=>l.pain).length]];return stats.map(s=>`<div class="card stat-card"><span class="eyebrow">${s[0]}</span><strong>${s[1]}</strong><small>${s[0]==='LAST RECALL'?'self-rated session retrieval':'local-only ledger'}</small></div>`).join('');}
function pressureView(){return `<section class="hero"><span class="eyebrow">PRESSURE ENGINE</span><h1>ACCESS,<br>NOT PANIC.</h1><p>Randomized cueing increases selection and inhibition demands while movement stays controlled. Difficulty is informational, not reckless physical speed.</p></section>
<section class="card"><label class="field"><span>LEVEL</span><select id="pressure-select">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===state.pressureLevel?'selected':''}>P${n} — ${pressureName(n)}</option>`).join('')}</select></label><label class="field"><span>DURATION</span><select id="pressure-duration"><option value="120">2 MIN</option><option value="180" selected>3 MIN</option><option value="300">5 MIN</option></select></label><div class="callout">P6 can be run screen-down/audio-only. P8 inserts irrelevant words; move only on valid combatives cues.</div><div class="button-row" style="margin-top:16px"><button id="start-pressure" class="btn primary">START PRESSURE</button></div></section>
<section class="section"><div class="section-head"><div><span class="eyebrow">LADDER</span><h2>Pressure architecture</h2></div></div><div class="ledger-list">${[1,2,3,4,5,6,7,8].map(n=>`<div class="card"><span class="eyebrow">P${n}</span><h3 style="margin:7px 0">${pressureName(n)}</h3><p class="muted" style="font-size:11px;margin:0">${pressureDesc(n)}</p></div>`).join('')}</div></section>`;}
function pressureName(n){return {1:'Recall',2:'Side',3:'Interrupt',4:'Chain',5:'Compression',6:'Blind',7:'Category',8:'Noise gate'}[n];}
function pressureDesc(n){return {1:'Random named technique retrieval.',2:'Technique plus left/right cue.',3:'Occasional CHANGE/RESET demands inhibition.',4:'Random two-step cross-domain chains.',5:'Shorter intervals between valid cues.',6:'Audio-first operation; screen information minimized.',7:'Functional category cue requires self-selection.',8:'Irrelevant words are mixed in; ignore them completely.'}[n];}
function libraryView(){const domains=['ALL',...new Set(techniques.map(t=>t.domain))];return `<section class="hero"><span class="eyebrow">TECHNICAL CORPUS</span><h1>LIBRARY.</h1><p>Functional organization first; martial-art provenance second. Representation labels state what the current solo environment can honestly train.</p></section><input id="library-search" class="search" placeholder="Search technique, provenance or function…" autocomplete="off"><div class="filter-row" style="margin-top:10px">${domains.map((d,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${d}">${d}</button>`).join('')}</div><div id="library-cards" class="library-grid">${libraryCards('ALL','')}</div><section class="section"><div class="callout"><strong>Representation key:</strong> FULL = meaningful solo task; SHADOW = non-contact motor pattern; PROXY = partial surrogate; REFERENCE = knowledge/hand-position recall only; DISABLED = excluded in this environment.</div></section><section class="section"><div class="section-head"><div><span class="eyebrow">VOCABULARY</span><h2>Terminology</h2></div><p>${glossary.length} terms</p></div>${glossary.map(g=>`<details class="accordion"><summary><span>${esc(g.term)}</span><span class="eyebrow">${esc(g.domain)}</span></summary><div class="accordion-body"><p>${esc(g.definition)}</p></div></details>`).join('')}</section><section class="section"><div class="section-head"><div><span class="eyebrow">DEPENDENCY ORDER</span><h2>Curriculum</h2></div><p>not a belt ladder</p></div><div class="card">${curriculum.map(c=>`<div class="curriculum-step"><div class="num">${c.stage}</div><div><h3>${esc(c.name)}</h3><p>${esc(c.goal)}</p></div></div>`).join('')}</div></section>`;}
function libraryCards(filter='ALL',q=''){return techniques.filter(t=>(filter==='ALL'||t.domain===filter)&&(`${t.name} ${t.domain} ${t.provenance} ${t.summary}`.toLowerCase().includes(q.toLowerCase()))).map(t=>`<button class="card tech-card" data-tech="${t.id}"><span class="eyebrow">${t.domain}</span><h3>${esc(t.name)}</h3><p>${esc(t.summary)}</p><div class="tech-meta"><span class="tag ${t.representation.toLowerCase()}">${t.representation}</span><span class="tag">${esc(t.provenance)}</span>${t.band?'<span class="tag">+ BAND</span>':''}</div></button>`).join('')||'<div class="empty">No matching entries.</div>';}
function renderLibraryCards(){const q=$('#library-search')?.value||'';const filter=$('.filter.active')?.dataset.filter||'ALL';$('#library-cards').innerHTML=libraryCards(filter,q);}
function chainsView(){return `<section class="hero"><span class="eyebrow">TRANSITION GRAPH</span><h1>CHAINS.</h1><p>RENSA treats techniques as callable nodes in a response network. Chains train switching and recovery rather than stylistic purity.</p></section><div class="ledger-list">${chains.map((c,i)=>`<div class="card chain-card"><div class="chain-index">${String(i+1).padStart(2,'0')}</div><div><span class="eyebrow">${esc(c.domain)}</span><h3 style="margin:6px 0">${esc(c.name)}</h3><p class="muted" style="font-size:11px">${esc(c.note)}</p><div class="chain-steps">${c.steps.map((s,j)=>`${j?'<span class="arrow">→</span>':''}<span class="chain-step">${esc(s)}</span>`).join('')}</div></div></div>`).join('')}</div>`;}
function ledgerView(){return `<section class="hero"><span class="eyebrow">LOCAL EVIDENCE</span><h1>LEDGER.</h1><p>Completed sessions are stored only in this browser unless you export the JSON backup.</p></section><div class="grid">${statCards()}</div><section class="section"><div class="section-head"><div><span class="eyebrow">HISTORY</span><h2>Sessions</h2></div>${state.logs.length?'<button id="clear-ledger" class="btn secondary">CLEAR</button>':''}</div><div class="ledger-list">${state.logs.length?state.logs.map(log=>ledgerEntry(log)).join(''):'<div class="empty">No completed sessions yet.</div>'}</div></section>`;}
function ledgerEntry(log){const d=new Date(log.date);return `<div class="card ledger-entry"><div class="ledger-date"><strong>${d.getDate()}</strong><span>${d.toLocaleString(undefined,{month:'short'}).toUpperCase()}</span></div><div><h3>${esc(log.type||'Weekly session')}</h3><p>${log.minutes||0} min · ${esc(log.focus||'—')}${log.pain?' · pain flagged':''}</p></div><div class="ledger-score">${log.recall||'—'}/5</div></div>`;}
function showTechnique(id){const t=techniques.find(x=>x.id===id);if(!t)return;const d=$('#technique-detail');d.innerHTML=`<div class="sheet-head"><div><span class="eyebrow">${t.domain} // ${t.representation}</span><h2 class="detail-title">${esc(t.name)}</h2></div><button class="icon-btn" id="tech-close">CLOSE</button></div><div class="detail-sub">${esc(t.provenance)}</div><div class="tech-meta"><span class="tag ${t.representation.toLowerCase()}">${t.representation}</span><span class="tag">QUIET</span>${t.band?'<span class="tag">BAND OPTIONAL</span>':''}</div><div class="detail-section"><h3>PURPOSE</h3><p>${esc(t.summary)}</p></div><div class="detail-section"><h3>SOLO REPRESENTATION</h3><ul>${(t.solo||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${state.band&&t.band?`<div class="band-box"><span class="eyebrow">+ BAND OVERLAY</span><p>${esc(t.bandOverlay)}</p></div>`:''}<div class="detail-section"><h3>REPRESENTATION LIMIT</h3><p>${esc(t.limits||representations[t.representation])}</p></div>${['CONTROL'].includes(t.domain)?'<div class="warning-box">CONTROL techniques are memory/position proxies only in solo mode. Do not apply neck compression during a RENSA solo session.</div>':''}`;$('#tech-close').onclick=()=>$('#technique-dialog').close();$('#technique-dialog').showModal();}
function openSettings(){$('#band-enabled').checked=state.band;$('#speech-enabled').checked=state.speech;$('#tones-enabled').checked=state.tones;$('#pressure-level').value=String(state.pressureLevel);$('#session-mode').value=state.sessionMode;$('#settings-dialog').showModal();}
function saveSettings(){state.band=$('#band-enabled').checked;state.speech=$('#speech-enabled').checked;state.tones=$('#tones-enabled').checked;state.pressureLevel=Number($('#pressure-level').value);state.sessionMode=$('#session-mode').value;saveState();render();toast('Environment profile saved');}
function exportData(){const blob=new Blob([JSON.stringify({app:'RENSA',version:APP_VERSION,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`rensa-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
async function importData(e){const f=e.target.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!data.state)throw new Error();state={...defaultState,...data.state,lastVersion:APP_VERSION};saveState();$('#settings-dialog').close();render();toast('RENSA data restored');}catch{toast('Import failed: invalid RENSA backup');}e.target.value='';}

function buildSession(){
  let arr=fullSession.map(x=>({...x}));
    if(state.sessionMode==='compact'){
    const keep=[['WAKE',60],['BASE',60],['WRESTLE',60],['STRIKE',240],['FLOW',90],['TAKEDOWN',240],['CONTROL',60],['CHAIN',150],['PRESSURE',180],['DOWN',60]];
    arr=keep.map(([phase,seconds])=>{const orig=fullSession.find(x=>x.phase===phase);return {...orig,seconds,label: phase==='TAKEDOWN'?'Maintenance + rotating focus':phase==='CHAIN'?'Cross-domain chain work':orig.label,dynamic:phase==='TAKEDOWN'?'compactTakedown':phase==='CHAIN'?'chains':orig.dynamic};});
  }
  if(state.sessionMode==='preview'){
    arr=[{phase:'WAKE',label:'Shoulder + hip wake',seconds:30,instruction:'Compact mobility.'},{phase:'STRIKE',label:'Jab — Cross',seconds:45,instruction:'Clean mechanics and reset.'},{phase:'FLOW',label:'Hubud solo proxy',seconds:45,instruction:'Open-hand pattern, both sides.'},{phase:'TAKEDOWN',label:'Focus A',seconds:60,instruction:'Shadow entry only.',dynamic:'focusA'},{phase:'CHAIN',label:'Cross-domain chain',seconds:45,instruction:'Follow the cue and reset.',dynamic:'chains'},{phase:'PRESSURE',label:'Pressure recall',seconds:45,instruction:'Random retrieval.',dynamic:'pressure'},{phase:'DOWN',label:'Recovery + ledger',seconds:30,instruction:'Breathe and log.',dynamic:'log'}];
  }
  return arr;
}
function dynamicLabel(item){const [a,b]=focusPair();if(item.dynamic==='focusA')return `${a.name}${state.band?' // BAND OPTIONAL':''}`;if(item.dynamic==='focusB')return b.name;if(item.dynamic==='maintenance')return '7-entry maintenance pulse';if(item.dynamic==='compactTakedown')return `${a.name} + ${b.name} + 7-entry pulse`;if(item.dynamic==='chains')return chains[(activeSession?.step||0)%chains.length]?.name||'Cross-domain chain';if(item.dynamic==='interrupt')return 'CHANGE / RESET / RECALL';if(item.dynamic==='pressure')return `Pressure P${state.pressureLevel} // ${pressureName(state.pressureLevel)}`;return item.label;}
async function startWeeklySession(){await ensureAudio();await requestWake();const plan=buildSession();activeSession={type:'weekly',plan,step:0,remaining:plan[0].seconds,paused:false,startedAt:Date.now(),timer:null,subCueTimer:null,subCueIndex:0,totalSeconds:plan.reduce((a,x)=>a+x.seconds,0),elapsed:0};$('#session-dialog').showModal();renderSessionStage(true);startSessionClock();}
function renderSessionStage(announce=false){const s=activeSession;if(!s)return;const item=s.plan[s.step];const label=dynamicLabel(item);const progress=Math.round((s.elapsed/s.totalSeconds)*100);$('#session-stage').className='session-stage';$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">${item.phase}</span><div class="session-progress">STEP ${s.step+1} / ${s.plan.length}</div></div><button id="session-exit" class="icon-btn">EXIT</button></div><div class="session-center"><div class="micro">${progress}% COMPLETE</div><h1>${esc(label)}</h1><p>${esc(item.instruction)}</p><div id="live-cue" class="live-cue">${item.dynamic?'AWAITING CUE':'HOLD FORM / BREATHE'}</div>${state.band&&item.dynamic==='focusA'?`<div class="session-band">Optional: use the final portion of this focus window for light band resistance. Stable anchor; no recoil path toward the face.</div>`:''}<div class="session-timer">${fmt(s.remaining)}</div></div><div class="session-controls"><button id="session-back" class="btn secondary">BACK</button><button id="session-pause" class="btn primary">${s.paused?'RESUME':'PAUSE'}</button><button id="session-skip" class="btn secondary">NEXT</button></div>`;
  $('#session-exit').onclick=()=>endSession(false);$('#session-back').onclick=()=>moveSession(-1);$('#session-skip').onclick=()=>moveSession(1);$('#session-pause').onclick=()=>{s.paused=!s.paused;renderSessionStage(false);if(s.paused){clearTimeout(s.subCueTimer);}else{tone();speak('Resume');scheduleSessionSubcue(true);}};
  if(announce){tone(item.phase==='PRESSURE'?'pressure':'transition');speak(`${item.phase}. ${label}`);haptic(25);scheduleSessionSubcue(true);}
}
function sessionSubcueDelay(item){
  if(item.dynamic==='pressure')return pressureInterval(state.pressureLevel);
  if(item.dynamic==='interrupt')return 6500+Math.random()*3500;
  if(item.dynamic==='chains')return 18000+Math.random()*8000;
  if(item.dynamic==='maintenance')return 30000;
  if(item.dynamic==='compactTakedown')return 26000;
  if(item.dynamic==='focusA'||item.dynamic==='focusB')return 30000+Math.random()*9000;
  return 0;
}
function nextSessionSubcue(item){
  const [a,b]=focusPair();
  if(item.dynamic==='maintenance'){
    const ids=['osoto','ouchi','deashi','uchimata','taiotoshi','seoi','double'];
    const t=techniques.find(x=>x.id===ids[(activeSession.subCueIndex++)%ids.length]);
    return {text:t.name.replace(/\/\/.*$/,'').trim(),valid:true};
  }
  if(item.dynamic==='compactTakedown'){
    const pool=[a,b,...techniques.filter(t=>['osoto','ouchi','deashi','uchimata','taiotoshi','seoi','double'].includes(t.id))];
    const t=random(pool); return {text:t.name.replace(/\/\/.*$/,'').trim(),valid:true};
  }
  if(item.dynamic==='focusA'||item.dynamic==='focusB'){
    const t=item.dynamic==='focusA'?a:b;return {text:`${Math.random()<.5?'LEFT':'RIGHT'} — ${t.name.replace(/\/\/.*$/,'').trim()}`,valid:true};
  }
  if(item.dynamic==='chains'){
    const c=random(chains);return {text:c.steps.join(' — '),valid:true};
  }
  if(item.dynamic==='interrupt'){
    if(Math.random()<.3)return {text:Math.random()<.5?'CHANGE':'RESET',valid:true};
    const t=random(validPressurePool());return {text:t.name.replace(/\/\/.*$/,'').trim(),valid:true};
  }
  if(item.dynamic==='pressure')return makePressureCue(state.pressureLevel);
  return null;
}
function scheduleSessionSubcue(immediate=false){
  const s=activeSession;if(!s||s.type!=='weekly'||s.paused)return;
  clearTimeout(s.subCueTimer);
  const item=s.plan[s.step];const delay=sessionSubcueDelay(item);if(!delay)return;
  const stepAtSchedule=s.step;
  s.subCueTimer=setTimeout(()=>{
    if(!activeSession||activeSession.type!=='weekly'||activeSession.paused||activeSession.step!==stepAtSchedule)return;
    const cue=nextSessionSubcue(item);if(!cue)return;
    const el=$('#live-cue');if(el){el.textContent=cue.valid===false?`${cue.text} // IGNORE`:cue.text;el.classList.toggle('noise',cue.valid===false);}
    tone(cue.valid===false?'transition':'pressure');speak(cue.text);haptic(cue.valid===false?10:[20,25,20]);
    scheduleSessionSubcue(false);
  },immediate?850:delay);
}

function startSessionClock(){clearInterval(activeSession.timer);activeSession.timer=setInterval(()=>{const s=activeSession;if(!s||s.paused)return;s.remaining--;s.elapsed++;if(s.remaining<=0)moveSession(1);else{const t=$('.session-timer');if(t)t.textContent=fmt(s.remaining);}},1000);}
function moveSession(delta){const s=activeSession;if(!s)return;clearTimeout(s.subCueTimer);let next=s.step+delta;if(next<0)next=0;if(next>=s.plan.length){endSession(true);return;}s.step=next;s.remaining=s.plan[next].seconds;renderSessionStage(true);}
function endSession(completed){const s=activeSession;if(!s)return;if(!completed&&!confirm('Exit this session without logging it as complete?'))return;clearInterval(s.timer);clearTimeout(s.subCueTimer);window.speechSynthesis?.cancel();releaseWake();if(completed){tone('done');speak('Session complete');showLogPrompt(Math.round(s.elapsed/60));}else{$('#session-dialog').close();activeSession=null;}}
function showLogPrompt(minutes){const [a,b]=focusPair();$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">COMPLETE</span></div></div><div class="session-center"><span class="eyebrow">EVIDENCE ENTRY</span><h1>LOG IT.</h1><p>Rate retrieval quality, not athletic intensity. A 5 means immediate, clean access to the intended movement representations.</p><label class="field" style="text-align:left;max-width:420px;margin:22px auto 0"><span>RECALL QUALITY</span><select id="log-recall"><option value="1">1 — poor / reconstructed</option><option value="2">2 — hesitant</option><option value="3" selected>3 — usable</option><option value="4">4 — immediate</option><option value="5">5 — automatic / clean</option></select></label><label class="toggle-row" style="max-width:420px;margin:auto"><span><strong>Pain or injury flag</strong><small>Marks the entry for later review.</small></span><input id="log-pain" type="checkbox"></label></div><div class="session-controls" style="grid-template-columns:1fr"><button id="save-log" class="btn primary">SAVE SESSION</button></div>`;$('#save-log').onclick=()=>{const recall=Number($('#log-recall').value),pain=$('#log-pain').checked;state.logs.unshift({date:new Date().toISOString(),type:'Weekly session',minutes:Math.max(1,minutes),recall,pain,focus:`${a.name} / ${b.name}`,pressure:state.pressureLevel});state.sessionCount++;state.logs=state.logs.slice(0,100);saveState();$('#session-dialog').close();activeSession=null;render();toast('Session committed to ledger');};}

function validPressurePool(){return techniques.filter(t=>['FULL','SHADOW','PROXY'].includes(t.representation)&&!['BASE'].includes(t.domain)&&!['CONTROL'].includes(t.domain));}
function random(arr){return arr[Math.floor(Math.random()*arr.length)];}
function makePressureCue(level){
  if(level===8&&Math.random()<.33)return {text:random(noiseCues),valid:false};
  if(level===7){const cat=random(pressureCategories);return {text:cat,valid:true,sub:'Select any familiar safe movement from this function.'};}
  if(level===4){const c=random(chains);return {text:c.steps.filter(s=>!['CHANGE','BREAK','ABORT','POSITION ONLY'].includes(s)).slice(0,2).join(' — then — '),valid:true,sub:c.name};}
  const t=random(validPressurePool());let text=t.name.replace(/\/\/.*$/,'').trim();if(level>=2)text=`${Math.random()<.5?'LEFT':'RIGHT'} — ${text}`;if(level>=3&&Math.random()<.22)text=Math.random()<.5?'CHANGE':'RESET';return {text,valid:true,sub:t.domain};
}
async function startPressureStandalone(level,duration){state.pressureLevel=level;saveState();await ensureAudio();await requestWake();activeSession={type:'pressure',level,duration,remaining:duration,paused:false,timer:null,cueTimer:null,current:null,cues:0,startedAt:Date.now()};$('#session-dialog').showModal();renderPressureStage();schedulePressureCue(true);activeSession.timer=setInterval(()=>{if(!activeSession||activeSession.paused)return;activeSession.remaining--;const t=$('.session-timer');if(t)t.textContent=fmt(activeSession.remaining);if(activeSession.remaining<=0)endPressure();},1000);}
function pressureInterval(level){if(level>=5)return 4000+Math.random()*2500;if(level>=3)return 6000+Math.random()*4000;return 8000+Math.random()*4500;}
function schedulePressureCue(immediate=false){const s=activeSession;if(!s||s.type!=='pressure')return;clearTimeout(s.cueTimer);s.cueTimer=setTimeout(()=>{if(!activeSession||activeSession.paused){schedulePressureCue();return;}const cue=makePressureCue(s.level);s.current=cue;s.cues++;renderPressureStage(true);tone(cue.valid?'pressure':'transition');speak(cue.text);haptic(cue.valid?[20,30,20]:10);schedulePressureCue();},immediate?400:pressureInterval(s.level));}
function renderPressureStage(flash=false){const s=activeSession;const cue=s.current||{text:'READY',valid:true,sub:`P${s.level} — ${pressureName(s.level)}`};$('#session-stage').className=`session-stage pressure-screen ${flash?(cue.valid?'valid-flash':'noise-flash'):''}`;$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">PRESSURE // P${s.level}</span><div class="session-progress">${pressureName(s.level).toUpperCase()}</div></div><button id="pressure-exit" class="icon-btn">EXIT</button></div><div class="session-center"><div class="pressure-status"><span class="tag">${cue.valid?'VALID CUE':'NOISE — IGNORE'}</span><span class="tag">${s.cues} CUES</span></div><h1>${esc(s.level===6&&cue.text!=='READY'?'LISTEN':cue.text)}</h1><p>${esc(cue.sub||'Maintain controlled movement and recover to base.')}</p><div class="session-timer">${fmt(s.remaining)}</div></div><div class="session-controls" style="grid-template-columns:1fr 1fr"><button id="pressure-pause" class="btn primary">${s.paused?'RESUME':'PAUSE'}</button><button id="pressure-next" class="btn secondary">NEW CUE</button></div>`;$('#pressure-exit').onclick=()=>{if(confirm('Exit pressure session?'))endPressure(false)};$('#pressure-pause').onclick=()=>{s.paused=!s.paused;renderPressureStage();if(!s.paused)schedulePressureCue(true)};$('#pressure-next').onclick=()=>schedulePressureCue(true);}
function endPressure(log=true){const s=activeSession;if(!s)return;clearInterval(s.timer);clearTimeout(s.cueTimer);window.speechSynthesis?.cancel();releaseWake();if(log){state.logs.unshift({date:new Date().toISOString(),type:`Pressure P${s.level}`,minutes:Math.max(1,Math.round(s.duration/60)),recall:3,pain:false,focus:`${s.cues} randomized cues`});state.logs=state.logs.slice(0,100);saveState();tone('done');speak('Pressure complete');}$('#session-dialog').close();activeSession=null;render();if(log)toast('Pressure session logged');}

if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
