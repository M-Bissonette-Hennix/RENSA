import {
  APP_VERSION, SCHEMA_VERSION, techniques, techniqueById, chains, sessionTemplates,
  focusPool, fallbackFocusRotation, pressureCategories, noiseCues, representations,
  glossary, curriculum
} from './data.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const STORAGE = 'rensa-state-v2';
const LEGACY_STORAGE = 'rensa-state-v1';
const ACTIVE_STORAGE = 'rensa-active-v2';
const MAX_LOGS = 250;
const MAX_EVIDENCE = 4000;
const ACTIVE_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const VALID_RESULTS = new Set(['clean','hesitant','miss','skipped','unrated']);
const VALID_ROUTES = new Set(['today','pressure','library','chains','ledger']);
const VALID_MODES = new Set(['full','compact','preview']);
const VALID_STANCES = new Set(['orthodox','southpaw']);

const defaultState = {
  schemaVersion: SCHEMA_VERSION,
  route: 'today', band: false, speech: true, tones: true, haptics: true,
  stance: 'orthodox', pressureLevel: 3, sessionMode: 'full',
  logs: [], evidence: [], sessionCount: 0, lastVersion: APP_VERSION,
  migratedFrom: null
};

let state = loadState();
let activeSession = null;
let audioCtx = null;
let wakeLock = null;
let wakeStatus = 'not requested';
let toastTimer = null;
let serviceRegistration = null;
let pendingWorker = null;
let pendingReload = false;

function uid(prefix='rensa') {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}
function clamp(n,min,max){return Math.min(max,Math.max(min,n));}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function fmtMs(ms){const sec=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
function fmtSec(sec){return fmtMs(sec*1000);}
function random(arr){return arr[Math.floor(Math.random()*arr.length)];}
function nowIso(){return new Date().toISOString();}
function minutes(ms){return Math.round(ms/60000*10)/10;}
function daysSince(iso){if(!iso)return Infinity;return Math.max(0,(Date.now()-new Date(iso).getTime())/86400000);}
function resultLabel(r){return ({clean:'CLEAN',hesitant:'HESITANT',miss:'MISS',skipped:'SKIPPED',unrated:'UNRATED'})[r]||'UNRATED';}
function phaseDescription(p){return ({WAKE:'mobility / preparation',BASE:'stance / micro movement',WRESTLE:'quiet level-change patterns',STRIKE:'retained combinations',FLOW:'Hubud solo proxy',TAKEDOWN:'maintenance + evidence-weighted focus',CONTROL:'position recall only',CHAIN:'sequential transition cueing',PRESSURE:'randomized retrieval',DOWN:'decompress / log'})[p]||'';}
function pressureName(n){return ({1:'Recall',2:'Side',3:'Interrupt',4:'Chain',5:'Compression',6:'Blind',7:'Category',8:'Noise gate'})[n];}
function pressureDesc(n){return ({1:'Random named movement retrieval.',2:'Bilateral techniques receive technically meaningful left/right cues.',3:'A movement is initiated, then interrupted by CHANGE/RESET and, on CHANGE, replaced.',4:'Chains are conducted node-by-node instead of spoken as one memorized string.',5:'Selection intervals shorten while physical execution remains controlled.',6:'Audio-first mode; the movement name is hidden on screen.',7:'Only a functional category is supplied; select a familiar safe movement yourself.',8:'Relevant and irrelevant words use the same channel, tone, haptic and visual treatment.'})[n];}
function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}

function sanitizeLog(l){
  if(!l||typeof l!=='object')return null;
  return {
    id: typeof l.id==='string'?l.id:uid('log'),
    date: typeof l.date==='string'?l.date:nowIso(),
    type: typeof l.type==='string'?l.type:'Session',
    mode: typeof l.mode==='string'?l.mode:null,
    status: typeof l.status==='string'?l.status:(l.legacy?'legacy':'completed'),
    creditedMinutes: Number.isFinite(l.creditedMinutes)?clamp(l.creditedMinutes,0,300):(Number.isFinite(l.minutes)?clamp(l.minutes,0,300):0),
    plannedMinutes: Number.isFinite(l.plannedMinutes)?clamp(l.plannedMinutes,0,300):null,
    creditedRatio: Number.isFinite(l.creditedRatio)?clamp(l.creditedRatio,0,1):null,
    pressure: Number.isFinite(l.pressure)?clamp(Math.round(l.pressure),1,8):null,
    focusIds: Array.isArray(l.focusIds)?l.focusIds.filter(x=>typeof x==='string').slice(0,4):[],
    focus: typeof l.focus==='string'?l.focus:null,
    focusRatings: l.focusRatings&&typeof l.focusRatings==='object'?l.focusRatings:{},
    pressureOutcome: VALID_RESULTS.has(l.pressureOutcome)?l.pressureOutcome:'unrated',
    pain: Boolean(l.pain),
    notes: typeof l.notes==='string'?l.notes.slice(0,1000):'',
    events: Number.isFinite(l.events)?Math.max(0,Math.round(l.events)):0,
    blocks:Array.isArray(l.blocks)?l.blocks.filter(b=>b&&typeof b.id==='string').slice(0,80).map(b=>({id:b.id,status:typeof b.status==='string'?b.status:'pending',creditedSeconds:Math.max(0,Number(b.creditedSeconds)||0),plannedSeconds:Math.max(0,Number(b.plannedSeconds)||0)})):[],
    protocolEvents:Array.isArray(l.protocolEvents)?l.protocolEvents.slice(0,200).map(e=>({at:typeof e.at==='string'?e.at:null,type:typeof e.type==='string'?e.type:'event',reason:typeof e.reason==='string'?e.reason:null,block:typeof e.block==='string'?e.block:null,from:typeof e.from==='string'?e.from:null,to:typeof e.to==='string'?e.to:null,creditedRatio:Number.isFinite(e.creditedRatio)?clamp(e.creditedRatio,0,1):null})):[],
    recall: Number.isFinite(l.recall)?clamp(Math.round(l.recall),1,5):null,
    legacy: Boolean(l.legacy)
  };
}
function sanitizeEvidence(e){
  if(!e||typeof e!=='object'||typeof e.techniqueId!=='string'||!techniqueById(e.techniqueId))return null;
  return {
    id: typeof e.id==='string'?e.id:uid('ev'),
    date: typeof e.date==='string'?e.date:nowIso(),
    sessionId: typeof e.sessionId==='string'?e.sessionId:'unknown',
    techniqueId:e.techniqueId,
    context:typeof e.context==='string'?e.context:'exposure',
    side:['LEFT','RIGHT','LEAD','REAR',null].includes(e.side)?e.side:null,
    result:VALID_RESULTS.has(e.result)?e.result:'unrated',
    focus:Boolean(e.focus),
    trainingCredit:Boolean(e.trainingCredit),
    source:typeof e.source==='string'?e.source:'session'
  };
}
function sanitizeState(raw){
  const r=raw&&typeof raw==='object'?raw:{};
  return {
    ...defaultState,
    schemaVersion:SCHEMA_VERSION,
    route:VALID_ROUTES.has(r.route)?r.route:'today',
    band:Boolean(r.band), speech:r.speech!==false, tones:r.tones!==false, haptics:r.haptics!==false,
    stance:VALID_STANCES.has(r.stance)?r.stance:'orthodox',
    pressureLevel:clamp(Number(r.pressureLevel)||3,1,8),
    sessionMode:VALID_MODES.has(r.sessionMode)?r.sessionMode:'full',
    logs:Array.isArray(r.logs)?r.logs.map(sanitizeLog).filter(Boolean).slice(0,MAX_LOGS):[],
    evidence:Array.isArray(r.evidence)?r.evidence.map(sanitizeEvidence).filter(Boolean).slice(0,MAX_EVIDENCE):[],
    sessionCount:Math.max(0,Math.round(Number(r.sessionCount)||0)),
    lastVersion:APP_VERSION,
    migratedFrom:typeof r.migratedFrom==='string'?r.migratedFrom:null
  };
}
function migrateLegacy(raw){
  const base=sanitizeState(raw);
  base.logs=(Array.isArray(raw?.logs)?raw.logs:[]).map(l=>sanitizeLog({...l,legacy:true,status:'legacy'})).filter(Boolean).slice(0,MAX_LOGS);
  base.evidence=[];
  base.migratedFrom='1.0.0';
  base.lastVersion=APP_VERSION;
  return base;
}
function loadState(){
  try{
    const current=localStorage.getItem(STORAGE);
    if(current)return sanitizeState(JSON.parse(current));
    const legacy=localStorage.getItem(LEGACY_STORAGE);
    if(legacy){const migrated=migrateLegacy(JSON.parse(legacy));localStorage.setItem(STORAGE,JSON.stringify(migrated));return migrated;}
  }catch{}
  return {...defaultState};
}
function saveState(){state.lastVersion=APP_VERSION;state.schemaVersion=SCHEMA_VERSION;localStorage.setItem(STORAGE,JSON.stringify(state));}
function loadSnapshot(){
  try{
    const raw=JSON.parse(localStorage.getItem(ACTIVE_STORAGE)||'null');
    if(!raw||raw.version!==APP_VERSION||!raw.savedAt)return null;
    if(Date.now()-new Date(raw.savedAt).getTime()>ACTIVE_MAX_AGE_MS){localStorage.removeItem(ACTIVE_STORAGE);return null;}
    if(!['weekly','pressure'].includes(raw.type))return null;
    return raw;
  }catch{return null;}
}
function clearSnapshot(){localStorage.removeItem(ACTIVE_STORAGE);}
function persistActive(){
  if(!activeSession)return;
  const s=activeSession;
  const snapshot={
    version:APP_VERSION,type:s.type,sessionId:s.sessionId,savedAt:nowIso(),startedAt:s.startedAt,
    paused:true,events:s.events||[],evidence:s.evidence||[]
  };
  if(s.type==='weekly')Object.assign(snapshot,{mode:s.mode,trainingCredit:s.trainingCredit,focusIds:s.focusIds,step:s.step,progress:s.progress,pressureLevel:s.pressureLevel,enteredSteps:[...s.enteredSteps]});
  if(s.type==='pressure')Object.assign(snapshot,{level:s.level,durationMs:s.durationMs,creditedMs:s.creditedMs,cues:s.cues,lastCue:s.lastCue||null});
  localStorage.setItem(ACTIVE_STORAGE,JSON.stringify(snapshot));
}

class SpeechCoordinator{
  constructor(){this.queue=[];this.current=null;this.serial=0;}
  speak(text,{priority='normal',force=false}={}){
    if((!state.speech&&!force)||!('speechSynthesis'in window)||!text)return;
    const item={text:String(text),priority,id:++this.serial};
    if(priority==='urgent'){
      this.queue=[];
      try{speechSynthesis.cancel();}catch{}
      this.current=null;
    }else if(this.queue.length>=2){this.queue.splice(0,this.queue.length-1);}
    this.queue.push(item);this.pump();
  }
  pump(){
    if(this.current||!this.queue.length)return;
    const item=this.queue.shift();this.current=item;
    const u=new SpeechSynthesisUtterance(item.text);u.rate=.96;u.pitch=.86;u.volume=1;
    const finish=()=>{if(this.current?.id===item.id)this.current=null;this.pump();};
    u.onend=finish;u.onerror=finish;
    try{speechSynthesis.speak(u);}catch{finish();}
  }
  cancel(){this.queue=[];this.current=null;try{speechSynthesis.cancel();}catch{}}
}
const speech=new SpeechCoordinator();

async function ensureAudio(){
  try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')await audioCtx.resume();return true;}catch{return false;}
}
async function tone(kind='transition'){
  if(!state.tones)return;
  if(!(await ensureAudio()))return;
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.type='sine';osc.frequency.value=kind==='done'?820:kind==='pressure'?620:480;
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.075,audioCtx.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.17);
  osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.19);
}
function haptic(pattern=20){if(state.haptics&&navigator.vibrate)navigator.vibrate(pattern);}
async function requestWake(){
  if(!('wakeLock'in navigator)){wakeStatus='unsupported';syncWakeStatus();return false;}
  try{
    wakeLock=await navigator.wakeLock.request('screen');wakeStatus='active';syncWakeStatus();
    wakeLock.addEventListener('release',()=>{wakeStatus='released';wakeLock=null;syncWakeStatus();if(activeSession)toast('Screen wake lock released by system');});
    return true;
  }catch{wakeStatus='unavailable';syncWakeStatus();return false;}
}
async function releaseWake(){try{await wakeLock?.release();}catch{}wakeLock=null;if(wakeStatus==='active')wakeStatus='released';syncWakeStatus();}
function syncWakeStatus(){const el=$('#wake-status');if(el)el.textContent=`Wake lock: ${wakeStatus}.`;}

function syncAudioButton(){const b=$('#audio-toggle');if(!b)return;const on=state.speech||state.tones||state.haptics;b.classList.toggle('active',on);b.textContent=on?'CUES':'MUTE';}
function syncNav(){
  $$('.nav-btn').forEach(b=>{const active=b.dataset.route===state.route;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
}
function render(){
  syncNav();syncAudioButton();const v=$('#view');if(!v)return;
  if(state.route==='today')v.innerHTML=todayView();
  if(state.route==='pressure')v.innerHTML=pressureView();
  if(state.route==='library')v.innerHTML=libraryView();
  if(state.route==='chains')v.innerHTML=chainsView();
  if(state.route==='ledger')v.innerHTML=ledgerView();
  bindView();
}
function bindView(){
  $('#start-session')?.addEventListener('click',startWeeklySession);
  $('#resume-saved')?.addEventListener('click',resumeSavedSession);
  $('#discard-saved')?.addEventListener('click',()=>{if(confirm('Discard the saved in-progress session?')){clearSnapshot();render();}});
  $('#start-pressure')?.addEventListener('click',()=>startPressureStandalone(Number($('#pressure-select').value),Number($('#pressure-duration').value)));
  $('#clear-ledger')?.addEventListener('click',()=>{if(confirm('Clear RENSA v2 ledger and evidence? The preserved v1 storage key is not touched.')){state.logs=[];state.evidence=[];state.sessionCount=0;saveState();render();}});
  $('#library-search')?.addEventListener('input',renderLibraryCards);
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLibraryCards();}));
  $$('[data-delete-log]').forEach(b=>b.addEventListener('click',()=>deleteLog(b.dataset.deleteLog)));
}

document.addEventListener('click',e=>{
  const route=e.target.closest('[data-route]')?.dataset.route;
  if(route){state.route=route;saveState();render();}
  const tech=e.target.closest('[data-tech]')?.dataset.tech;if(tech)showTechnique(tech);
});
$('#settings-open').addEventListener('click',openSettings);
$('#audio-toggle').addEventListener('click',async()=>{
  const on=state.speech||state.tones||state.haptics;state.speech=!on;state.tones=!on;state.haptics=!on;saveState();if(!on)await ensureAudio();syncAudioButton();toast(!on?'Cue channels ON':'Cue channels OFF');
});
$('#settings-dialog').addEventListener('close',()=>{if($('#settings-dialog').returnValue==='save')saveSettings();});
$('#export-data').addEventListener('click',exportData);
$('#import-data').addEventListener('change',importData);
$('#test-tone').addEventListener('click',async()=>{await ensureAudio();tone('transition');toast('Tone test fired');});
$('#test-speech').addEventListener('click',async()=>{await ensureAudio();speech.speak('RENSA audio check. O Soto. Hubud. Change.',{force:true});toast('Speech test fired');});
$('#test-haptic').addEventListener('click',()=>{haptic([25,30,25]);toast(navigator.vibrate?'Haptic test fired':'Haptics unsupported here');});
$('#update-ready').addEventListener('click',applyPendingUpdate);
window.addEventListener('beforeunload',()=>{if(activeSession)persistActive();});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'&&activeSession&&!activeSession.paused){pauseActive('visibility');toast('Session paused while app is hidden');}
  if(document.visibilityState==='visible'&&activeSession)requestWake();
});
$('#session-dialog').addEventListener('cancel',e=>{e.preventDefault();if(!activeSession)return;if(activeSession.type==='weekly')showWeeklyExitPrompt();else showPressureExitPrompt();});

function openSettings(){
  $('#band-enabled').checked=state.band;$('#speech-enabled').checked=state.speech;$('#tones-enabled').checked=state.tones;$('#haptics-enabled').checked=state.haptics;
  $('#stance-select').value=state.stance;$('#pressure-level').value=String(state.pressureLevel);$('#session-mode').value=state.sessionMode;syncWakeStatus();$('#settings-dialog').showModal();
}
function saveSettings(){
  state.band=$('#band-enabled').checked;state.speech=$('#speech-enabled').checked;state.tones=$('#tones-enabled').checked;state.haptics=$('#haptics-enabled').checked;
  state.stance=VALID_STANCES.has($('#stance-select').value)?$('#stance-select').value:'orthodox';state.pressureLevel=clamp(Number($('#pressure-level').value)||3,1,8);state.sessionMode=VALID_MODES.has($('#session-mode').value)?$('#session-mode').value:'full';saveState();render();toast('Settings saved');
}
function exportData(){
  const payload={app:'RENSA',appVersion:APP_VERSION,schemaVersion:SCHEMA_VERSION,exportedAt:nowIso(),state};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`RENSA-v${APP_VERSION}-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importData(e){
  const file=e.target.files?.[0];if(!file)return;
  try{
    const parsed=JSON.parse(await file.text());let candidate;
    if(parsed?.schemaVersion===SCHEMA_VERSION&&parsed?.state)candidate=sanitizeState(parsed.state);
    else if(parsed?.state)candidate=migrateLegacy(parsed.state);
    else if(parsed?.schemaVersion===SCHEMA_VERSION)candidate=sanitizeState(parsed);
    else candidate=migrateLegacy(parsed);
    if(!confirm(`Replace current RENSA v2 data with this validated import?\n\nLogs: ${candidate.logs.length}\nEvidence events: ${candidate.evidence.length}`))return;
    state=candidate;saveState();clearSnapshot();render();toast('Validated data import complete');
  }catch{toast('Import rejected: invalid or unsupported JSON');}
  finally{e.target.value='';}
}

function activeResumeCard(){
  const snap=loadSnapshot();if(!snap)return '';
  const title=snap.type==='weekly'?`${String(snap.mode||'full').toUpperCase()} SESSION`:`PRESSURE P${snap.level}`;
  return `<div class="resume-card"><span class="eyebrow">RECOVERY STATE</span><h3>${esc(title)} paused safely</h3><p>RENSA preserved the in-progress session without crediting time while the app was closed or hidden.</p><div class="button-row"><button id="resume-saved" class="btn primary">RESUME</button><button id="discard-saved" class="btn secondary">DISCARD</button></div></div>`;
}
function planForMode(mode=state.sessionMode){return sessionTemplates[mode].map(x=>({...x}));}
function planDuration(plan){return plan.reduce((a,b)=>a+b.seconds,0);}
function phaseSummary(plan){
  const order=[];const sums={};for(const b of plan){if(!(b.phase in sums)){order.push(b.phase);sums[b.phase]=0;}sums[b.phase]+=b.seconds;}
  return order.map(p=>({phase:p,seconds:sums[p]}));
}
function focusHistory(){return state.evidence.filter(e=>e.focus&&e.trainingCredit&&focusPool.includes(e.techniqueId));}
function focusDecision(){
  const history=focusHistory();
  if(history.length<2){const ids=fallbackFocusRotation[state.sessionCount%fallbackFocusRotation.length];return {ids,details:ids.map(()=>({score:0,reasons:['coverage rotation while v2 evidence accumulates']})),adaptive:false};}
  const creditedLogs=state.logs.filter(l=>l.status==='completed').slice(0,8).map(l=>l.id);
  const rows=focusPool.map((id,index)=>{
    const ev=history.filter(e=>e.techniqueId===id).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const last=ev[0];const stale=Math.min(6,daysSince(last?.date)/7);
    const recentFocusSessions=new Set(ev.filter(e=>creditedLogs.includes(e.sessionId)).map(e=>e.sessionId)).size;
    const under=Math.max(0,2-recentFocusSessions)*1.4;
    const rated=ev.filter(e=>e.result!=='unrated').slice(0,4);
    let outcome=0;for(const e of rated){outcome+=e.result==='miss'?3.5:e.result==='hesitant'?1.8:e.result==='skipped'?2.5:e.result==='clean'?-0.7:0;}
    const latestLog=state.logs.find(l=>l.status==='completed'&&String(l.type).startsWith('Weekly'));const cooldown=latestLog?.focusIds?.includes(id)?-2.5:0;
    const sides=state.evidence.filter(e=>e.techniqueId===id&&e.trainingCredit&&['LEFT','RIGHT'].includes(e.side)).slice(-30);let imbalance=0;
    if(sides.length>=4){const left=sides.filter(e=>e.side==='LEFT').length,right=sides.length-left;imbalance=Math.abs(left-right)/sides.length>.4?.6:0;}
    const score=stale+under+outcome+cooldown+imbalance+(index*.0001);
    const reasons=[];if(stale>=1)reasons.push(`${Math.round(daysSince(last?.date))}d since focus`);if(under>0)reasons.push('under-focused recently');if(rated[0]?.result==='miss')reasons.push('recent miss');else if(rated[0]?.result==='hesitant')reasons.push('recent hesitation');if(imbalance)reasons.push('side exposure imbalance');if(cooldown)reasons.push('cooldown applied');if(!reasons.length)reasons.push('coverage balance');
    return {id,score,reasons};
  }).sort((a,b)=>b.score-a.score);
  return {ids:[rows[0].id,rows[1].id],details:[rows[0],rows[1]],adaptive:true};
}
function todayView(){
  const decision=focusDecision(),focus=decision.ids.map(techniqueById),plan=planForMode(),summary=phaseSummary(plan),total=planDuration(plan);
  return `${activeResumeCard()}<section class="hero"><span class="eyebrow">RELEASE ${APP_VERSION} // EVIDENCE ENGINE 2</span><h1>RECALL<br>UNDER LOAD.</h1><p>Compact solo combatives maintenance for an existing hybrid skill set. v2 separates exposure from performance, adapts focus from honest evidence, and never credits time that was skipped or lost while the app was suspended.</p></section>
  <div class="meta-strip"><div><span>SPACE</span><strong>72 × 24 IN</strong></div><div><span>STANCE</span><strong>${state.stance.toUpperCase()}</strong></div><div><span>BAND</span><strong>${state.band?'ENABLED':'OPTIONAL / OFF'}</strong></div><div><span>SESSION</span><strong>${fmtSec(total)}</strong></div></div>
  <section class="card session-card"><div class="session-title"><div><span class="eyebrow">${state.sessionMode==='preview'?'QA // NO TRAINING CREDIT':`WEEKLY // CREDITED ${state.sessionCount}`}</span><h2>Adaptive Combatives Recall</h2><p class="muted">${decision.adaptive?'Focus is evidence-weighted from recency, under-focus, recent hesitation/miss history, side exposure, and cooldown.':'Fallback coverage rotation remains active until v2 accumulates enough rated focus evidence.'}</p></div><span class="duration-pill">${fmtSec(total)}</span></div>
  <div class="focus-row"><span class="focus-chip">FOCUS A // ${esc(focus[0].name)}</span><span class="focus-chip">FOCUS B // ${esc(focus[1].name)}</span><span class="focus-chip">PRESSURE // P${state.pressureLevel}</span></div>
  <div class="adaptive-reasons"><small>A // ${esc(decision.details[0].reasons.join(' · '))}</small><small>B // ${esc(decision.details[1].reasons.join(' · '))}</small></div>
  <div class="phase-preview">${summary.map(x=>`<div class="phase-line"><span>${x.phase}</span><em>${phaseDescription(x.phase)}</em><strong>${fmtSec(x.seconds)}</strong></div>`).join('')}</div>
  <div class="callout">Representation integrity remains strict: shadow throws are not throws against resistance; solo Hubud is not tactile sensitivity work; control positions never include strangulation pressure.</div>
  <div class="button-row" style="margin-top:16px"><button id="start-session" class="btn primary">BEGIN SESSION</button><button class="btn secondary" data-route="library">OPEN LIBRARY</button></div></section>
  <section class="section"><div class="section-head"><div><span class="eyebrow">EVIDENCE</span><h2>Current ledger</h2></div><p>${state.logs.length} retained record${state.logs.length===1?'':'s'}</p></div><div class="grid">${statCards()}</div></section>`;
}
function statCards(){
  const completed=state.logs.filter(l=>l.status==='completed').length,total=state.logs.reduce((a,l)=>a+(l.creditedMinutes||0),0),last=state.logs[0];
  const flags=state.evidence.filter(e=>e.trainingCredit&&['hesitant','miss'].includes(e.result)).slice(-40).length;
  const stats=[['CREDITED',completed],['TOTAL MIN',Math.round(total)],['LAST STATUS',last?String(last.status).toUpperCase():'—'],['FOCUS FLAGS',flags]];
  return stats.map(s=>`<div class="card stat-card"><span class="eyebrow">${s[0]}</span><strong>${esc(s[1])}</strong><small>${s[0]==='FOCUS FLAGS'?'recent rated hesitation / miss events':'v2 evidence ledger'}</small></div>`).join('');
}
function pressureView(){return `${activeResumeCard()}<section class="hero"><span class="eyebrow">PRESSURE ENGINE 2</span><h1>ACCESS,<br>NOT PANIC.</h1><p>Pressure difficulty is informational. v2 uses stateful interruption, sequential chain cueing, technically valid side cues, and a P8 noise gate whose irrelevant stimuli no longer identify themselves.</p></section>
<section class="card"><label class="field"><span>LEVEL</span><select id="pressure-select">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===state.pressureLevel?'selected':''}>P${n} — ${pressureName(n)}</option>`).join('')}</select></label><label class="field"><span>DURATION</span><select id="pressure-duration"><option value="120">2 MIN</option><option value="180" selected>3 MIN</option><option value="300">5 MIN</option></select></label><div class="callout">P8 deliberately uses the same tone, haptic, visual treatment and timing channel for valid and irrelevant words. The distinction exists only in the vocabulary.</div><div class="button-row" style="margin-top:16px"><button id="start-pressure" class="btn primary">START PRESSURE</button></div></section>
<section class="section"><div class="section-head"><div><span class="eyebrow">LADDER</span><h2>Pressure architecture</h2></div></div><div class="ledger-list">${[1,2,3,4,5,6,7,8].map(n=>`<div class="card"><span class="eyebrow">P${n}</span><h3 style="margin:7px 0">${pressureName(n)}</h3><p class="muted" style="font-size:12px;margin:0">${pressureDesc(n)}</p></div>`).join('')}</div></section>`;}
function libraryView(){
  const domains=['ALL',...new Set(techniques.map(t=>t.domain))];
  return `<section class="hero"><span class="eyebrow">TECHNICAL CORPUS</span><h1>KNOW WHAT<br>YOU'RE RECALLING.</h1><p>Functional organization first, provenance second. Technique dossiers now separate canonical source, RENSA variant, prerequisites, checkpoints, failure modes, limitations and spoken cue.</p></section>
  <input id="library-search" class="search" type="search" placeholder="Search technique, provenance, alias, domain…" aria-label="Search technique library" />
  <div class="filter-row" style="margin-top:10px">${domains.map((d,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${esc(d)}">${esc(d)}</button>`).join('')}</div><div id="library-cards" class="library-grid">${libraryCards('ALL','')}</div>
  <section class="section"><details class="accordion"><summary>TERMINOLOGY // ${glossary.length} ENTRIES</summary><div class="accordion-body">${glossary.map(g=>`<p><strong>${esc(g.term)}</strong> <span class="tag">${esc(g.domain)}</span><br>${esc(g.definition)}</p>`).join('')}</div></details>
  <details class="accordion"><summary>CURRICULUM // DEPENDENCY DAG</summary><div class="accordion-body">${curriculum.map(c=>`<div class="curriculum-step"><div class="num">${c.stage}</div><div><h3>${esc(c.name)}</h3><p>${esc(c.goal)}</p><small>REQUIRES: ${c.requires.length?c.requires.join(', '):'—'} · NODES: ${c.techniques.length?c.techniques.map(id=>techniqueById(id)?.name||id).join(' · '):'transition/evidence stage'}</small></div></div>`).join('')}</div></details></section>`;
}
function libraryCards(filter='ALL',query=''){
  const q=query.trim().toLowerCase();return techniques.filter(t=>filter==='ALL'||t.domain===filter).filter(t=>!q||[t.name,t.domain,t.provenance,t.summary,t.spokenCue,...(t.aliases||[])].join(' ').toLowerCase().includes(q)).map(t=>`<button class="card tech-card" data-tech="${t.id}"><span class="eyebrow">${esc(t.domain)}</span><h3>${esc(t.name)}</h3><p>${esc(t.summary||t.solo?.[0]||'')}</p><div class="tech-meta"><span class="tag ${t.representation.toLowerCase()}">${t.representation}</span><span class="tag">${esc(t.provenance)}</span>${t.sessionEligible===false?'<span class="tag">REFERENCE ONLY</span>':''}</div></button>`).join('')||'<div class="empty">No matching technique.</div>';
}
function renderLibraryCards(){const active=$('.filter.active')?.dataset.filter||'ALL',q=$('#library-search')?.value||'';const target=$('#library-cards');if(target)target.innerHTML=libraryCards(active,q);}
function showTechnique(id){
  const t=techniqueById(id);if(!t)return;const prereq=t.prerequisites?.map(x=>techniqueById(x)?.name||x)||[];
  $('#technique-detail').innerHTML=`<div class="sheet-head"><div><span class="eyebrow">${esc(t.domain)} // ${esc(t.representation)}</span><h2 class="detail-title">${esc(t.name)}</h2></div><button id="tech-close" class="icon-btn">CLOSE</button></div><p class="detail-sub">${esc(t.provenance)}</p><p class="muted">${esc(t.summary||'')}</p>
  <div class="tech-meta"><span class="tag ${t.representation.toLowerCase()}">${t.representation}</span><span class="tag">LATERALITY: ${esc(t.laterality)}</span><span class="tag">SPOKEN: ${esc(t.spokenCue)}</span></div>
  ${t.canonicalSource?`<div class="detail-section"><h3>CANONICAL / VARIANT</h3><p><strong>Source:</strong> ${esc(t.canonicalSource)}<br><strong>RENSA representation:</strong> ${esc(t.variant||'—')}${t.giDependency?`<br>${esc(t.giDependency)}`:''}</p></div>`:''}
  ${prereq.length?`<div class="detail-section"><h3>PREREQUISITES</h3><p>${prereq.map(esc).join(' · ')}</p></div>`:''}
  ${listSection('SETUP',t.setup)}${listSection('SOLO PROTOCOL',t.solo)}${listSection('CHECKPOINTS',t.checkpoints)}${listSection('FAILURE MODES',t.failures)}
  <div class="detail-section"><h3>RECOVERY</h3><p>${esc(t.recovery||'Return to compact base under control.')}</p></div>
  ${state.band&&t.band&&t.bandOverlay?`<div class="band-box"><strong>+ BAND OVERLAY</strong><p>${esc(t.bandOverlay)}</p></div>`:''}
  <div class="detail-section"><h3>REPRESENTATION LIMIT</h3><p>${esc(t.limits||representations[t.representation])}</p></div>`;
  $('#tech-close').onclick=()=>$('#technique-dialog').close();$('#technique-dialog').showModal();
}
function listSection(title,items){return items?.length?`<div class="detail-section"><h3>${title}</h3><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:'';}
function chainsView(){return `<section class="hero"><span class="eyebrow">TRANSITION GRAPH</span><h1>LINK,<br>DON'T RECITE.</h1><p>Every node resolves to a real library technique. The conductor presents nodes sequentially with temporal separation rather than reading the whole chain as one phrase.</p></section><div class="ledger-list">${chains.map((c,i)=>`<div class="card chain-card"><div class="chain-index">${String(i+1).padStart(2,'0')}</div><div><span class="eyebrow">${esc(c.domain)}</span><h3>${esc(c.name)}</h3><p class="muted">${esc(c.note)}</p><div class="chain-steps">${c.nodes.map((id,j)=>`${j?'<span class="arrow">→</span>':''}<button class="chain-step link-step" data-tech="${id}">${esc(techniqueById(id)?.name||id)}</button>`).join('')}</div></div></div>`).join('')}</div>`;}
function ledgerView(){
  const logs=state.logs;
  return `<section class="hero"><span class="eyebrow">EVIDENCE VAULT</span><h1>EXPOSURE ≠<br>PERFORMANCE.</h1><p>v2 retains session history and technique exposure separately. Unrated is a first-class state; RENSA never invents success from mere completion.</p></section>
  <section class="section"><div class="section-head"><div><span class="eyebrow">FOCUS POOL</span><h2>Adaptive evidence</h2></div><p>${state.evidence.length} events</p></div><div class="library-grid">${focusPool.map(id=>focusEvidenceCard(id)).join('')}</div></section>
  <section class="section"><div class="section-head"><div><span class="eyebrow">HISTORY</span><h2>Session ledger</h2></div>${logs.length?'<button id="clear-ledger" class="btn danger">CLEAR V2 LEDGER</button>':''}</div><div class="ledger-list">${logs.length?logs.map(logEntry).join(''):'<div class="empty">No v2 session records yet. Migrated v1 entries will appear here if present.</div>'}</div></section>`;
}
function focusEvidenceCard(id){
  const t=techniqueById(id),ev=state.evidence.filter(e=>e.techniqueId===id&&e.focus&&e.trainingCredit).sort((a,b)=>new Date(b.date)-new Date(a.date)),last=ev[0],rated=ev.find(e=>e.result!=='unrated');
  return `<div class="card"><span class="eyebrow">${esc(t.domain)}</span><h3 style="margin:8px 0">${esc(t.name)}</h3><p class="muted">Last focus: ${last?`${Math.round(daysSince(last.date))}d ago`:'no v2 evidence'} · Last rated: ${rated?resultLabel(rated.result):'UNRATED'}</p></div>`;
}
function logEntry(l){
  const d=new Date(l.date),focus=l.focusIds?.map(id=>techniqueById(id)?.spokenCue||id).join(' / ')||l.focus||'—';
  const skipped=(l.blocks||[]).filter(b=>b.status==='skipped').length,partial=(l.blocks||[]).filter(b=>b.status==='partial').length,exceptions=skipped||partial?` · ${skipped} skipped / ${partial} partial blocks`:'';
  return `<div class="card ledger-entry"><div class="ledger-date"><strong>${String(d.getDate()).padStart(2,'0')}</strong><span>${d.toLocaleString(undefined,{month:'short'}).toUpperCase()}</span></div><div><h3>${esc(l.type)}</h3><p>${esc(String(l.status).toUpperCase())} · ${esc(l.creditedMinutes)} min${l.plannedMinutes?` / ${esc(l.plannedMinutes)} planned`:''}${exceptions} · ${esc(focus)}</p>${l.notes?`<p>${esc(l.notes)}</p>`:''}</div><div class="ledger-actions"><div class="ledger-score">${l.pain?'PAIN':'OK'}</div><button class="mini-btn" data-delete-log="${l.id}">DELETE</button></div></div>`;
}
function deleteLog(id){if(!confirm('Delete this ledger entry? Technique evidence attached to the session will also be removed.'))return;const target=state.logs.find(l=>l.id===id);state.logs=state.logs.filter(l=>l.id!==id);state.evidence=state.evidence.filter(e=>e.sessionId!==id);if(target?.status==='completed'&&String(target.type).startsWith('Weekly'))state.sessionCount=Math.max(0,state.sessionCount-1);saveState();render();toast('Ledger entry deleted');}

function blockLabel(item,s){
  if(item.dynamic==='focusA')return techniqueById(s.focusIds[0])?.name||'Focus A';
  if(item.dynamic==='focusB')return techniqueById(s.focusIds[1])?.name||'Focus B';
  return item.label;
}
function blockDetail(item,s){
  if(item.dynamic==='selfInterrupt')return item.interruptAction==='reverse'?'Begin the Hubud proxy on the specified side; CHANGE means reverse/restart cleanly, RESET means stop and recover.':'Begin the combination; CHANGE/RESET means abort the memorized string immediately and recover to base.';
  if(item.techniqueId)return techniqueById(item.techniqueId)?.solo?.[0]||item.detail||'';
  if(item.dynamic==='maintenance')return 'All seven active takedown entries are cued across the block; no throw is completed.';
  if(item.dynamic==='focusA'||item.dynamic==='focusB')return 'Deliberate entry rehearsal. Alternate meaningful sides; use the band overlay only if enabled and safely anchored.';
  if(item.dynamic==='focusIntegration')return 'Switch between the two selected focus entries only on the cue.';
  if(item.dynamic==='chains')return 'Each transition node arrives separately. Do not anticipate the entire chain.';
  if(item.dynamic==='interrupt')return 'Begin the first response; obey CHANGE or RESET immediately and under control.';
  if(item.dynamic==='pressure')return `P${s.pressureLevel} ${pressureName(s.pressureLevel)}. Selection pressure only; physical movement remains controlled.`;
  return item.detail||'Maintain compact, quiet movement and recover to base.';
}
function sessionProgressRatio(s){const credited=s.progress.reduce((a,p)=>a+Math.min(p.creditedMs,p.plannedMs),0),planned=s.progress.reduce((a,p)=>a+p.plannedMs,0);return planned?credited/planned:0;}
function currentRemainingMs(s){
  if(s.reviewRemainingMs!=null)return Math.max(0,s.reviewRemainingMs);
  const p=s.progress[s.step];return Math.max(0,p.plannedMs-p.creditedMs);
}
function sessionEvidenceButtons(){return `<div class="evidence-strip"><span>LAST CUE</span><button data-mark="clean">CLEAN</button><button data-mark="hesitant">HESITANT</button><button data-mark="miss">MISS</button></div>`;}

async function startWeeklySession(){
  if(activeSession)return;
  const saved=loadSnapshot();if(saved&&!confirm('A paused RENSA session already exists. Discard it and start a new one?'))return;if(saved)clearSnapshot();
  await ensureAudio();await requestWake();
  const mode=state.sessionMode,plan=planForMode(mode),decision=focusDecision();
  activeSession={type:'weekly',sessionId:uid('session'),mode,trainingCredit:mode!=='preview',plan,focusIds:decision.ids,pressureLevel:state.pressureLevel,step:0,progress:plan.map(b=>({id:b.id,plannedMs:b.seconds*1000,creditedMs:0,status:'pending'})),events:[],evidence:[],enteredSteps:new Set(),paused:false,running:true,lastTick:performance.now(),tickTimer:null,cueTimers:[],lastCue:null,reviewRemainingMs:null,startedAt:nowIso()};
  $('#session-dialog').showModal();enterWeeklyStep(true);startWeeklyClock();persistActive();
}
function resumeSavedSession(){
  if(activeSession)return;const snap=loadSnapshot();if(!snap)return toast('No resumable session found');
  if(snap.type==='weekly'){
    const plan=planForMode(snap.mode);if(!Array.isArray(snap.progress)||snap.progress.length!==plan.length){clearSnapshot();render();return toast('Saved session was incompatible and discarded');}
    activeSession={type:'weekly',sessionId:snap.sessionId||uid('session'),mode:snap.mode,trainingCredit:snap.mode!=='preview',plan,focusIds:Array.isArray(snap.focusIds)&&snap.focusIds.length===2?snap.focusIds:focusDecision().ids,pressureLevel:clamp(Number(snap.pressureLevel)||state.pressureLevel,1,8),step:clamp(Number(snap.step)||0,0,plan.length-1),progress:snap.progress.map((p,i)=>({id:plan[i].id,plannedMs:plan[i].seconds*1000,creditedMs:clamp(Number(p.creditedMs)||0,0,plan[i].seconds*1000),status:typeof p.status==='string'?p.status:'pending'})),events:Array.isArray(snap.events)?snap.events:[],evidence:Array.isArray(snap.evidence)?snap.evidence:[],enteredSteps:new Set(Array.isArray(snap.enteredSteps)?snap.enteredSteps:[]),paused:true,running:false,lastTick:performance.now(),tickTimer:null,cueTimers:[],lastCue:null,reviewRemainingMs:null,startedAt:snap.startedAt||nowIso()};
    $('#session-dialog').showModal();renderWeeklyStage(false);startWeeklyClock();requestWake();toast('Paused session restored');
  }else{
    activeSession={type:'pressure',sessionId:snap.sessionId||uid('pressure'),level:clamp(Number(snap.level)||3,1,8),durationMs:Number(snap.durationMs)||180000,creditedMs:clamp(Number(snap.creditedMs)||0,0,Number(snap.durationMs)||180000),events:Array.isArray(snap.events)?snap.events:[],evidence:Array.isArray(snap.evidence)?snap.evidence:[],paused:true,running:false,lastTick:performance.now(),tickTimer:null,cueTimers:[],cues:Number(snap.cues)||0,lastCue:snap.lastCue||null,startedAt:snap.startedAt||nowIso()};
    $('#session-dialog').showModal();renderPressureStage(false);startPressureClock();requestWake();toast('Paused pressure session restored');
  }
}
function startWeeklyClock(){
  clearInterval(activeSession?.tickTimer);if(!activeSession||activeSession.type!=='weekly')return;
  activeSession.lastTick=performance.now();activeSession.tickTimer=setInterval(()=>{
    const s=activeSession;if(!s||s.type!=='weekly'||s.paused||!s.running)return;
    const now=performance.now(),delta=now-s.lastTick;s.lastTick=now;
    if(delta>2500){pauseActive('timer-gap');toast('Timing gap detected; session paused without crediting the gap');return;}
    if(s.reviewRemainingMs!=null){s.reviewRemainingMs=Math.max(0,s.reviewRemainingMs-delta);if(s.reviewRemainingMs<=0){s.reviewRemainingMs=null;advanceWeekly(1,'review-complete');return;}}
    else{
      const p=s.progress[s.step];p.creditedMs=Math.min(p.plannedMs,p.creditedMs+delta);
      if(p.creditedMs>=p.plannedMs-5){p.creditedMs=p.plannedMs;p.status='completed';advanceWeekly(1,'timer');return;}
    }
    updateWeeklyClockUI();if(!s.lastPersistMono||now-s.lastPersistMono>=5000){s.lastPersistMono=now;persistActive();}
  },250);
}
function enterWeeklyStep(announce=true){
  const s=activeSession;if(!s||s.type!=='weekly')return;clearCueTimers();s.lastTick=performance.now();s.lastCue=null;s.lastExposureId=null;
  const item=s.plan[s.step],key=item.id;
  if(!s.enteredSteps.has(key)){s.enteredSteps.add(key);if(item.techniqueId)recordSessionExposure(item.techniqueId,{context:`block:${item.id}`,side:item.fixedSide||null});}
  renderWeeklyStage(announce);scheduleBlockProgram(item,true);persistActive();
}
function renderWeeklyStage(announce=false){
  const s=activeSession;if(!s)return;const item=s.plan[s.step],label=blockLabel(item,s),p=s.progress[s.step],ratio=sessionProgressRatio(s),review=s.reviewRemainingMs!=null;
  const bandTarget=item.techniqueId?techniqueById(item.techniqueId):(item.dynamic==='focusA'?techniqueById(s.focusIds[0]):item.dynamic==='focusB'?techniqueById(s.focusIds[1]):null);
  $('#session-stage').className='session-stage';
  $('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">${esc(item.phase)} // ${String(s.step+1).padStart(2,'0')}/${String(s.plan.length).padStart(2,'0')}</span><div class="session-progress">${Math.round(ratio*100)}% credited · ${review?'30s review replay':'evidence-aware clock'} · wake ${esc(wakeStatus)}</div></div><button id="session-exit" class="icon-btn">EXIT</button></div>
  <div class="session-center"><span class="micro">${review?'REVIEW // NO ADDITIONAL PLAN CREDIT':s.paused?'PAUSED':'CURRENT BLOCK'}</span><h1>${esc(label)}</h1><p>${esc(blockDetail(item,s))}</p>${state.band&&bandTarget?.band&&bandTarget?.bandOverlay?`<div class="session-band">+ BAND // ${esc(bandTarget.bandOverlay)}</div>`:''}<div id="live-cue" class="live-cue" aria-live="polite">${s.lastCue?esc(s.lastCue.text):'WAIT FOR CUE'}</div><div id="session-band-live" class="session-band"></div>${sessionEvidenceButtons()}<div class="session-timer">${fmtMs(currentRemainingMs(s))}</div></div>
  <div class="session-controls"><button id="session-back" class="btn secondary">BACK</button><button id="session-pause" class="btn primary">${s.paused?'RESUME':'PAUSE'}</button><button id="session-next" class="btn secondary">NEXT</button></div>`;
  $('#session-exit').onclick=showWeeklyExitPrompt;$('#session-back').onclick=()=>advanceWeekly(-1,'back');$('#session-next').onclick=()=>advanceWeekly(1,'manual');$('#session-pause').onclick=()=>togglePause();$$('[data-mark]').forEach(b=>b.onclick=()=>markLastExposure(b.dataset.mark));
  if(announce){tone(item.phase==='PRESSURE'?'pressure':'transition');speech.speak(`${item.phase}. ${label}`);haptic(25);}
}
function updateWeeklyClockUI(){const s=activeSession;if(!s)return;const t=$('.session-timer');if(t)t.textContent=fmtMs(currentRemainingMs(s));const p=$('.session-progress');if(p)p.textContent=`${Math.round(sessionProgressRatio(s)*100)}% credited · ${s.reviewRemainingMs!=null?'review replay':'evidence-aware clock'} · wake ${wakeStatus}`;}
function togglePause(){const s=activeSession;if(!s)return;if(s.paused)resumeActive();else pauseActive('manual');}
function pauseActive(reason='manual'){
  const s=activeSession;if(!s||s.paused)return;s.paused=true;s.running=false;clearCueTimers();speech.cancel();s.events.push({at:nowIso(),type:'pause',reason});persistActive();
  if(s.type==='weekly')renderWeeklyStage(false);else renderPressureStage(false);
}
function resumeActive(){
  const s=activeSession;if(!s||!s.paused)return;s.paused=false;s.running=true;s.lastTick=performance.now();s.events.push({at:nowIso(),type:'resume'});requestWake();
  if(s.type==='weekly'){renderWeeklyStage(false);scheduleBlockProgram(s.plan[s.step],true);}else{renderPressureStage(false);schedulePressureCycle(true);}persistActive();
}
function advanceWeekly(delta,reason){
  const s=activeSession;if(!s)return;clearCueTimers();
  if(reason==='manual'){
    const p=s.progress[s.step],r=p.plannedMs?p.creditedMs/p.plannedMs:0;
    if(p.creditedMs>=p.plannedMs-5){p.creditedMs=p.plannedMs;p.status='completed';}
    else p.status=r<.5?'skipped':'partial';
    s.events.push({at:nowIso(),type:'manual-next',block:s.plan[s.step].id,creditedRatio:p.plannedMs?p.creditedMs/p.plannedMs:0});
    if(s.plan[s.step].techniqueId&&r<.5)recordSessionExposure(s.plan[s.step].techniqueId,{context:'manual-skip',result:'skipped'});
  }
  if(reason==='back'){
    if(s.step===0)return;const target=s.step-1;s.events.push({at:nowIso(),type:'back',from:s.plan[s.step].id,to:s.plan[target].id});s.step=target;
    const p=s.progress[target];s.reviewRemainingMs=p.creditedMs>=p.plannedMs*.98?Math.min(30000,p.plannedMs):null;enterWeeklyStep(true);return;
  }
  const next=s.step+1;
  if(next>=s.plan.length){showWeeklyLogPrompt(true);return;}
  s.step=next;s.reviewRemainingMs=null;enterWeeklyStep(true);
}
function showWeeklyExitPrompt(){
  const s=activeSession;if(!s)return;pauseActive('exit-prompt');const ratio=sessionProgressRatio(s);
  $('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">END SESSION</span><div class="session-progress">${Math.round(ratio*100)}% of planned work credited</div></div></div><div class="session-center"><span class="eyebrow">STATE INTEGRITY</span><h1>SAVE OR DISCARD.</h1><p>Time not actually performed will not be credited. Saving preserves a partial ledger record; discarding removes this session's temporary evidence.</p></div><div class="exit-actions"><button id="exit-resume" class="btn primary">RESUME</button><button id="exit-save" class="btn secondary">SAVE PARTIAL</button><button id="exit-discard" class="btn danger">DISCARD</button></div>`;
  $('#exit-resume').onclick=()=>resumeActive();$('#exit-save').onclick=()=>showWeeklyLogPrompt(false);$('#exit-discard').onclick=discardActiveSession;
}
function showWeeklyLogPrompt(reachedEnd){
  const s=activeSession;if(!s)return;pauseActive('log-prompt');const ratio=sessionProgressRatio(s),allBlocksComplete=s.progress.every(p=>p.status==='completed'&&p.creditedMs>=p.plannedMs-5),status=reachedEnd&&allBlocksComplete&&ratio>=.9999?'completed':'partial';
  if(s.mode==='preview'){
    $('#session-stage').innerHTML=`<div class="session-center"><span class="eyebrow">QA PREVIEW COMPLETE</span><h1>NO CREDIT.</h1><p>The preview exercised the conductor without writing training evidence, advancing the adaptive scheduler, or incrementing session count.</p></div><div class="session-controls" style="grid-template-columns:1fr"><button id="preview-close" class="btn primary">CLOSE</button></div>`;$('#preview-close').onclick=discardActiveSession;return;
  }
  const a=techniqueById(s.focusIds[0]),b=techniqueById(s.focusIds[1]),assessA=focusAssessable(s,0),assessB=focusAssessable(s,1);
  $('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">${status.toUpperCase()}</span><div class="session-progress">${Math.round(ratio*100)}% credited · ${minutes(s.progress.reduce((x,p)=>x+Math.min(p.creditedMs,p.plannedMs),0))} min</div></div></div><div class="session-center log-center"><span class="eyebrow">EVIDENCE ENTRY</span><h1>RATE ONLY<br>WHAT YOU KNOW.</h1><p>Unrated is valid. These focus-specific ratings—not mere repetition counts—are the primary performance signal for the next adaptive selection.</p>
  ${ratingField('focus-a-rating',`FOCUS A // ${a.spokenCue}`,!assessA)}${ratingField('focus-b-rating',`FOCUS B // ${b.spokenCue}`,!assessB)}
  <label class="toggle-row compact-toggle"><span><strong>Pain / injury flag</strong><small>Stored on this ledger entry; stop training painful movement.</small></span><input id="log-pain" type="checkbox"></label>
  <label class="field compact-field"><span>OPTIONAL NOTE</span><input id="log-note" class="search" maxlength="1000" placeholder="Anything worth remembering from this session" /></label></div><div class="session-controls" style="grid-template-columns:1fr"><button id="save-weekly-log" class="btn primary">SAVE ${status.toUpperCase()}</button></div>`;
  $('#save-weekly-log').onclick=()=>commitWeekly(status);
}
function focusAssessable(s,index){
  if(s.mode==='full'){const id=index===0?'focus-a':'focus-b',i=s.plan.findIndex(x=>x.id===id);return i>=0&&s.progress[i].creditedMs>=30000;}
  if(s.mode==='compact'){const i=s.plan.findIndex(x=>x.id==='c-takedown'),techId=s.focusIds[index];return i>=0&&s.progress[i].creditedMs>=60000&&s.evidence.some(e=>e.techniqueId===techId&&e.context==='dynamic:c-takedown');}
  return false;
}
function ratingField(id,label,disabled=false){return `<label class="field compact-field"><span>${esc(label)}${disabled?' // NOT ENOUGH FOCUS EXPOSURE':''}</span><select id="${id}" ${disabled?'disabled':''}><option value="unrated" selected>UNRATED — no claim</option>${disabled?'':'<option value="clean">CLEAN — immediate / organized</option><option value="hesitant">HESITANT — reconstructive delay</option><option value="miss">MISS — failed retrieval</option>'}</select></label>`;}
function commitWeekly(status){
  const s=activeSession;if(!s)return;const id=s.sessionId,ratio=sessionProgressRatio(s),creditedMs=s.progress.reduce((x,p)=>x+Math.min(p.creditedMs,p.plannedMs),0),plannedMs=s.progress.reduce((x,p)=>x+p.plannedMs,0),credit=status==='completed';
  const ratings={[s.focusIds[0]]:$('#focus-a-rating').value,[s.focusIds[1]]:$('#focus-b-rating').value};
  for(const ev of s.evidence){const clean=sanitizeEvidence({...ev,sessionId:id,trainingCredit:credit});if(clean)state.evidence.push(clean);}
  for(const techId of s.focusIds){state.evidence.push(sanitizeEvidence({id:uid('ev'),date:nowIso(),sessionId:id,techniqueId:techId,context:'focus-assessment',side:null,result:ratings[techId],focus:true,trainingCredit:credit,source:'assessment'}));}
  const blocks=s.progress.map((p,i)=>({id:s.plan[i].id,status:p.status,creditedSeconds:Math.round(p.creditedMs/1000),plannedSeconds:Math.round(p.plannedMs/1000)}));
  const log=sanitizeLog({id,date:nowIso(),type:`Weekly ${s.mode}`,mode:s.mode,status,creditedMinutes:minutes(creditedMs),plannedMinutes:minutes(plannedMs),creditedRatio:ratio,pressure:s.pressureLevel,focusIds:s.focusIds,focusRatings:ratings,pain:$('#log-pain').checked,notes:$('#log-note').value,events:s.events.length,blocks,protocolEvents:s.events});
  state.logs.unshift(log);state.logs=state.logs.slice(0,MAX_LOGS);state.evidence=state.evidence.filter(Boolean).slice(-MAX_EVIDENCE);if(credit)state.sessionCount++;saveState();finishActive();toast(status==='completed'?'Session credited':'Partial session saved without adaptive credit');
}
function discardActiveSession(){finishActive();toast('In-progress session discarded');}
function finishActive(){
  if(activeSession){clearInterval(activeSession.tickTimer);clearCueTimers();}speech.cancel();releaseWake();clearSnapshot();activeSession=null;try{$('#session-dialog').close();}catch{}render();if(pendingReload)location.reload();
}

function recordSessionExposure(techniqueId,{context='cue',side=null,result='unrated',focus=false,source='session'}={}){
  const s=activeSession;if(!s||!techniqueById(techniqueId))return;
  const ev={id:uid('ev'),date:nowIso(),sessionId:s.sessionId,techniqueId,context,side,result:VALID_RESULTS.has(result)?result:'unrated',focus,trainingCredit:false,source};
  s.evidence.push(ev);s.lastExposureId=ev.id;return ev;
}
function markLastExposure(result){
  const s=activeSession;if(!s||!VALID_RESULTS.has(result)||result==='skipped')return;const id=s.lastExposureId,ev=s.evidence.findLast? s.evidence.findLast(x=>x.id===id):[...s.evidence].reverse().find(x=>x.id===id);
  if(!ev)return toast('No technique cue available to mark');ev.result=result;toast(`Last cue marked ${resultLabel(result)}`);persistActive();
}
function sideForTechnique(t){if(t?.laterality==='bilateral')return Math.random()<.5?'LEFT':'RIGHT';return null;}
function cueTextForTechnique(t,{withSide=false}={}){const side=withSide?sideForTechnique(t):null;return {text:`${side?`${side} — `:''}${t.spokenCue}`,techniqueId:t.id,side,valid:true,sub:t.domain};}
function emitWeeklyCue(cue,{priority='normal'}={}){
  const s=activeSession;if(!s||s.type!=='weekly'||s.paused)return;s.lastCue=cue;const el=$('#live-cue');if(el)el.textContent=cue.text;const sr=$('#screen-reader-cue');if(sr)sr.textContent=cue.text;
  tone('pressure');speech.speak(cue.text,{priority});haptic([20,24,20]);if(cue.techniqueId){const t=techniqueById(cue.techniqueId);const ev=recordSessionExposure(cue.techniqueId,{context:`dynamic:${s.plan[s.step].id}`,side:cue.side||null});s.lastExposureId=ev?.id;const band=$('#session-band-live');if(band)band.textContent=state.band&&t?.band&&t?.bandOverlay?`+ BAND // ${t.bandOverlay}`:'';}else{s.lastExposureId=null;const band=$('#session-band-live');if(band)band.textContent='';}
}
function clearCueTimers(){if(!activeSession)return;for(const h of activeSession.cueTimers||[])clearTimeout(h);activeSession.cueTimers=[];}
function later(fn,ms){const s=activeSession;if(!s)return null;const h=setTimeout(fn,ms);s.cueTimers.push(h);return h;}
function contextToken(){const s=activeSession;return s?`${s.sessionId}:${s.type==='weekly'?s.step:'pressure'}`:'';}
function contextStill(token){const s=activeSession;return !!s&&!s.paused&&contextToken()===token;}
function scheduleBlockProgram(item,immediate=false){
  const s=activeSession;if(!s||s.type!=='weekly'||s.paused)return;clearCueTimers();const token=contextToken();
  const start=()=>{if(!contextStill(token))return;runBlockCycle(item,token);};later(start,immediate?1500:2500);
}
function runBlockCycle(item,token){
  if(!contextStill(token))return;
  const s=activeSession;
  if(item.dynamic==='chains'){runChainSequence(random(chains),0,token,()=>later(()=>runBlockCycle(item,token),4000));return;}
  if(item.dynamic==='selfInterrupt'){runSelfInterruptSequence(item,token,()=>later(()=>runBlockCycle(item,token),4200));return;}
  if(item.dynamic==='interrupt'){runInterruptSequence(token,()=>later(()=>runBlockCycle(item,token),4500));return;}
  if(item.dynamic==='pressure'){runPressureBurst(s.pressureLevel,token,emitWeeklyCue,()=>later(()=>runBlockCycle(item,token),pressureInterval(s.pressureLevel)));return;}
  const cue=simpleBlockCue(item);if(cue)emitWeeklyCue(cue);const delay=blockCueDelay(item);if(delay)later(()=>runBlockCycle(item,token),delay);
}
function simpleBlockCue(item){
  const s=activeSession,a=techniqueById(s.focusIds[0]),b=techniqueById(s.focusIds[1]);
  if(item.dynamic==='maintenance'){const ids=focusPool;const idx=s.evidence.filter(e=>e.context===`dynamic:${item.id}`).length%ids.length;return cueTextForTechnique(techniqueById(ids[idx]),{withSide:true});}
  const countFor=()=>s.evidence.filter(e=>e.context===`dynamic:${item.id}`).length;
  if(item.dynamic==='compactTakedown'){const pool=[a,b,...focusPool.map(techniqueById)];return cueTextForTechnique(pool[countFor()%pool.length],{withSide:true});}
  if(item.dynamic==='focusA')return cueTextForTechnique(a,{withSide:true});
  if(item.dynamic==='focusB')return cueTextForTechnique(b,{withSide:true});
  if(item.dynamic==='focusIntegration')return cueTextForTechnique(countFor()%2?a:b,{withSide:true});
  if(item.dynamic==='strikeMix'){const pool=['1-2','1-1-2','1-2-3','1-2-3-2'].map(techniqueById);return cueTextForTechnique(pool[countFor()%pool.length]);}
  if(item.dynamic==='wrestleMix'){const pool=['level-change','quiet-sprawl'].map(techniqueById);return cueTextForTechnique(pool[countFor()%pool.length]);}
  if(item.dynamic==='hubudMix'){const t=techniqueById('hubud-solo'),side=countFor()%2?'LEFT':'RIGHT';return {text:`${side} — ${t.spokenCue}`,techniqueId:t.id,side,valid:true,sub:t.domain};}
  if(item.dynamic==='controlMix'){const pool=['ezekiel','rnc'].map(techniqueById);return cueTextForTechnique(pool[countFor()%pool.length],{withSide:true});}
  if(item.dynamic==='baseMix'){const pool=['base','micro-footwork'].map(techniqueById),t=pool[countFor()%pool.length];return cueTextForTechnique(t,{withSide:t.laterality==='bilateral'});}
  if(item.dynamic==='laterality'&&item.techniqueId)return cueTextForTechnique(techniqueById(item.techniqueId),{withSide:true});
  return null;
}
function blockCueDelay(item){
  if(item.dynamic==='maintenance')return 30000;if(item.dynamic==='baseMix')return 30000;if(item.dynamic==='compactTakedown')return 22000;if(item.dynamic==='focusA'||item.dynamic==='focusB')return 26000;if(item.dynamic==='focusIntegration')return 15000;if(item.dynamic==='strikeMix')return 45000;if(item.dynamic==='wrestleMix')return 30000;if(item.dynamic==='hubudMix')return 30000;if(item.dynamic==='controlMix')return 30000;if(item.dynamic==='laterality')return 30000;return 0;
}
function runChainSequence(chain,index,token,done){
  if(!contextStill(token)){return;}if(index>=chain.nodes.length){done?.();return;}const t=techniqueById(chain.nodes[index]);if(t)emitWeeklyCue(cueTextForTechnique(t,{withSide:t.laterality==='bilateral'}));const edge=chain.edges?.[index],range=edge?.delayMs||[1800,3000],delay=range[0]+Math.random()*Math.max(0,range[1]-range[0]);later(()=>runChainSequence(chain,index+1,token,done),delay);
}
function runSelfInterruptSequence(item,token,done){
  if(!contextStill(token))return;const t=techniqueById(item.techniqueId);if(!t){done?.();return;}
  let side=item.fixedSide||sideForTechnique(t);emitWeeklyCue({text:`${side?`${side} — `:''}${t.spokenCue}`,techniqueId:t.id,side,valid:true,sub:t.domain});
  later(()=>{if(!contextStill(token))return;const change=Math.random()<.65;emitWeeklyCue({text:change?'CHANGE':'RESET',valid:true,sub:'INHIBIT'},{priority:'urgent'});
    if(change&&item.interruptAction==='reverse'&&t.laterality==='bilateral')later(()=>{if(!contextStill(token))return;side=side==='LEFT'?'RIGHT':'LEFT';emitWeeklyCue({text:`${side} — ${t.spokenCue}`,techniqueId:t.id,side,valid:true,sub:t.domain},{priority:'urgent'});done?.();},700);
    else if(change&&item.interruptAction==='base')later(()=>{if(!contextStill(token))return;const base=techniqueById('base');emitWeeklyCue(cueTextForTechnique(base),{priority:'urgent'});done?.();},700);
    else done?.();
  },2000+Math.random()*1200);
}
function runInterruptSequence(token,done){
  if(!contextStill(token))return;const first=random(validPressurePool());emitWeeklyCue(cueTextForTechnique(first,{withSide:first.laterality==='bilateral'}));
  later(()=>{if(!contextStill(token))return;const change=Math.random()<.7;const word=change?'CHANGE':'RESET';emitWeeklyCue({text:word,valid:true,sub:'INHIBIT'},{priority:'urgent'});if(change)later(()=>{if(!contextStill(token))return;const next=random(validPressurePool().filter(t=>t.id!==first.id));emitWeeklyCue(cueTextForTechnique(next,{withSide:next.laterality==='bilateral'}),{priority:'urgent'});done?.();},750);else done?.();},2000+Math.random()*1400);
}

function validPressurePool(){return techniques.filter(t=>t.sessionEligible!==false&&['FULL','SHADOW','PROXY'].includes(t.representation)&&!['BASE','CONTROL','RECOVER'].includes(t.domain));}
function pressureInterval(level){if(level>=5)return 4000+Math.random()*2200;if(level>=3)return 6000+Math.random()*3000;return 8000+Math.random()*3500;}
function pressureCue(level){
  if(level===8&&Math.random()<.34)return {text:random(noiseCues),valid:false,techniqueId:null,side:null,sub:'P8'};
  if(level===7)return {text:random(pressureCategories),valid:true,techniqueId:null,side:null,sub:'Select a familiar safe movement in this function.'};
  const pool=level===2?validPressurePool().filter(t=>t.laterality==='bilateral'):validPressurePool();const t=random(pool.length?pool:validPressurePool());return cueTextForTechnique(t,{withSide:level>=2&&t.laterality==='bilateral'});
}
function runPressureBurst(level,token,emit,done){
  if(!contextStill(token))return;
  if(level===3){
    const first=pressureCue(3);emit(first);later(()=>{if(!contextStill(token))return;const change=Math.random()<.7;emit({text:change?'CHANGE':'RESET',valid:true,sub:'INHIBIT'},{priority:'urgent'});if(change)later(()=>{if(!contextStill(token))return;const alternatives=validPressurePool().filter(t=>t.id!==first.techniqueId);const t=random(alternatives.length?alternatives:validPressurePool());emit(cueTextForTechnique(t,{withSide:t.laterality==='bilateral'}),{priority:'urgent'});done?.();},750);else done?.();},1800+Math.random()*1200);return;
  }
  if(level===4){const remaining=pressureWindowRemainingMs(),eligible=chains.filter(c=>chainMaxWindowMs(c)<=remaining-250);if(!eligible.length){done?.();return;}const c=random(eligible);runPressureChain(c,0,token,emit,done);return;}
  emit(pressureCue(level));done?.();
}
function pressureWindowRemainingMs(){const s=activeSession;if(!s)return 0;if(s.type==='pressure')return Math.max(0,s.durationMs-s.creditedMs);if(s.type==='weekly')return Math.max(0,currentRemainingMs(s));return 0;}
function chainMaxWindowMs(chain){return (chain.edges||[]).reduce((sum,e)=>sum+Math.max(...(e.delayMs||[1700,2600])),0)+350;}
function shortestChainWindowMs(){return Math.min(...chains.map(chainMaxWindowMs));}
function runPressureChain(chain,index,token,emit,done){
  if(!contextStill(token))return;const nodes=chain.nodes;if(index>=nodes.length){done?.();return;}const t=techniqueById(nodes[index]);if(t)emit(cueTextForTechnique(t,{withSide:t.laterality==='bilateral'}));const edge=chain.edges?.[index],range=edge?.delayMs||[1700,2600],delay=range[0]+Math.random()*Math.max(0,range[1]-range[0]);later(()=>runPressureChain(chain,index+1,token,emit,done),delay);
}

async function startPressureStandalone(level,durationSec){
  if(activeSession)return;const saved=loadSnapshot();if(saved&&!confirm('A paused RENSA session already exists. Discard it and start pressure?'))return;if(saved)clearSnapshot();
  state.pressureLevel=clamp(level,1,8);saveState();await ensureAudio();await requestWake();
  activeSession={type:'pressure',sessionId:uid('pressure'),level:state.pressureLevel,durationMs:durationSec*1000,creditedMs:0,events:[],evidence:[],paused:false,running:true,lastTick:performance.now(),tickTimer:null,cueTimers:[],cues:0,lastCue:null,lastExposureId:null,startedAt:nowIso()};
  $('#session-dialog').showModal();renderPressureStage(false);startPressureClock();schedulePressureCycle(true);persistActive();
}
function startPressureClock(){
  clearInterval(activeSession?.tickTimer);if(!activeSession||activeSession.type!=='pressure')return;activeSession.lastTick=performance.now();activeSession.tickTimer=setInterval(()=>{
    const s=activeSession;if(!s||s.type!=='pressure'||s.paused||!s.running)return;const now=performance.now(),delta=now-s.lastTick;s.lastTick=now;if(delta>2500){pauseActive('timer-gap');toast('Timing gap detected; pressure paused without crediting the gap');return;}s.creditedMs=Math.min(s.durationMs,s.creditedMs+delta);const t=$('.session-timer');if(t)t.textContent=fmtMs(s.durationMs-s.creditedMs);if(s.creditedMs>=s.durationMs-5){s.creditedMs=s.durationMs;showPressureLogPrompt(true);}else if(!s.lastPersistMono||now-s.lastPersistMono>=5000){s.lastPersistMono=now;persistActive();}
  },250);
}
function renderPressureStage(){
  const s=activeSession;if(!s)return;const blind=s.level===6&&s.lastCue&&s.lastCue.text!=='READY',display=blind?'LISTEN':(s.lastCue?.text||'READY');
  $('#session-stage').className='session-stage pressure-screen';$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">PRESSURE // P${s.level}</span><div class="session-progress">${pressureName(s.level).toUpperCase()} · ${s.cues} cues · wake ${esc(wakeStatus)}</div></div><button id="pressure-exit" class="icon-btn">EXIT</button></div><div class="session-center"><div class="pressure-status"><span class="tag">P${s.level}</span><span class="tag">CUE ${s.cues}</span></div><h1>${esc(display)}</h1><p>${esc(s.level===8?'All words arrive through an identical channel. Respond only to known RENSA vocabulary.':s.lastCue?.sub||'Maintain controlled movement and recover to base.')}</p>${sessionEvidenceButtons()}<div class="session-timer">${fmtMs(s.durationMs-s.creditedMs)}</div></div><div class="session-controls" style="grid-template-columns:1fr 1fr"><button id="pressure-pause" class="btn primary">${s.paused?'RESUME':'PAUSE'}</button><button id="pressure-next" class="btn secondary">NEW CUE</button></div>`;
  $('#pressure-exit').onclick=showPressureExitPrompt;$('#pressure-pause').onclick=togglePause;$('#pressure-next').onclick=()=>{s.events.push({at:nowIso(),type:'manual-cue'});clearCueTimers();schedulePressureCycle(true);};$$('[data-mark]').forEach(b=>b.onclick=()=>markLastExposure(b.dataset.mark));
}
function emitPressureCue(cue,{priority='normal'}={}){
  const s=activeSession;if(!s||s.type!=='pressure'||s.paused)return;s.lastCue=cue;s.cues++;const sr=$('#screen-reader-cue');if(sr)sr.textContent=cue.text;
  // P8 deliberately does not expose validity via tone, haptic, flash, label, or typography.
  tone('pressure');speech.speak(cue.text,{priority});haptic([20,24,20]);if(cue.techniqueId){const ev=recordSessionExposure(cue.techniqueId,{context:`pressure:P${s.level}`,side:cue.side||null,source:'pressure'});s.lastExposureId=ev?.id;}else{s.lastExposureId=null;}renderPressureStage(false);
}
function schedulePressureCycle(immediate=false){
  const s=activeSession;if(!s||s.type!=='pressure'||s.paused)return;clearCueTimers();const token=contextToken();
  let delay=immediate?450:pressureInterval(s.level);
  if(s.level===4){const remaining=Math.max(0,s.durationMs-s.creditedMs),reserve=shortestChainWindowMs()+250;if(remaining<=reserve)return;delay=Math.min(delay,Math.max(450,remaining-reserve));}
  later(()=>{if(!contextStill(token))return;runPressureBurst(s.level,token,emitPressureCue,()=>{if(contextStill(token))schedulePressureCycle(false);});},delay);
}
function showPressureExitPrompt(){
  const s=activeSession;if(!s)return;pauseActive('exit-prompt');const ratio=s.durationMs?s.creditedMs/s.durationMs:0;$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">END PRESSURE</span><div class="session-progress">${Math.round(ratio*100)}% credited</div></div></div><div class="session-center"><span class="eyebrow">STATE INTEGRITY</span><h1>SAVE OR DISCARD.</h1><p>Saving keeps a partial record and any manually marked cue evidence. Discarding removes temporary evidence.</p></div><div class="exit-actions"><button id="p-exit-resume" class="btn primary">RESUME</button><button id="p-exit-save" class="btn secondary">SAVE PARTIAL</button><button id="p-exit-discard" class="btn danger">DISCARD</button></div>`;$('#p-exit-resume').onclick=resumeActive;$('#p-exit-save').onclick=()=>showPressureLogPrompt(false);$('#p-exit-discard').onclick=discardActiveSession;
}
function showPressureLogPrompt(completed){
  const s=activeSession;if(!s)return;pauseActive('log-prompt');const status=completed?'completed':'partial';$('#session-stage').innerHTML=`<div class="session-top"><div><span class="session-phase">PRESSURE ${status.toUpperCase()}</span><div class="session-progress">${s.cues} cues · ${minutes(s.creditedMs)} min credited</div></div></div><div class="session-center"><span class="eyebrow">EVIDENCE ENTRY</span><h1>NO AUTO-SCORE.</h1><p>v1 fabricated a 3/5 pressure score. v2 records unrated unless you explicitly choose an outcome.</p>${ratingField('pressure-rating','PRESSURE RETRIEVAL')}<label class="toggle-row compact-toggle"><span><strong>Pain / injury flag</strong><small>Marks this session for review.</small></span><input id="pressure-pain" type="checkbox"></label></div><div class="session-controls" style="grid-template-columns:1fr"><button id="save-pressure-log" class="btn primary">SAVE ${status.toUpperCase()}</button></div>`;$('#save-pressure-log').onclick=()=>commitPressure(status);
}
function commitPressure(status){
  const s=activeSession;if(!s)return;const id=s.sessionId,credit=status==='completed';for(const ev of s.evidence){const clean=sanitizeEvidence({...ev,sessionId:id,trainingCredit:credit});if(clean)state.evidence.push(clean);}
  const log=sanitizeLog({id,date:nowIso(),type:`Pressure P${s.level}`,mode:'pressure',status,creditedMinutes:minutes(s.creditedMs),plannedMinutes:minutes(s.durationMs),creditedRatio:s.durationMs?s.creditedMs/s.durationMs:0,pressure:s.level,pressureOutcome:$('#pressure-rating').value,pain:$('#pressure-pain').checked,events:s.events.length,protocolEvents:s.events});state.logs.unshift(log);state.logs=state.logs.slice(0,MAX_LOGS);state.evidence=state.evidence.filter(Boolean).slice(-MAX_EVIDENCE);saveState();finishActive();toast('Pressure session saved without fabricated score');
}

async function initServiceWorker(){
  if(!('serviceWorker'in navigator))return;
  try{
    const reg=await navigator.serviceWorker.register('./sw.js');serviceRegistration=reg;
    if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg.waiting);
    reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)showUpdate(w);});});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(activeSession){pendingReload=true;toast('Update installed; reload deferred until session ends');}else location.reload();});
  }catch{}
}
function showUpdate(worker){pendingWorker=worker;const b=$('#update-ready');if(b)b.hidden=false;}
function applyPendingUpdate(){if(activeSession)return toast('Finish or discard the active session before updating');if(!pendingWorker)return toast('No pending update');pendingWorker.postMessage({type:'SKIP_WAITING'});}

render();
if(state.migratedFrom){setTimeout(()=>toast('v1 ledger migrated into v2; original v1 storage preserved'),500);state.migratedFrom=null;saveState();}
initServiceWorker();
