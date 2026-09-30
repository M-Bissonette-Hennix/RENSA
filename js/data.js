export const APP_VERSION = '3.0.0';
export const SCHEMA_VERSION = 3;

export const representations = {
  FULL: 'The relevant solo motor task can be practiced meaningfully in the configured environment.',
  SHADOW: 'A non-contact motor pattern can be rehearsed; resistance, timing and opponent interaction are absent.',
  PROXY: 'A useful surrogate preserves part of the skill, but a defining component is unavailable solo.',
  REFERENCE: 'Retained as knowledge / sequencing recall only in the current environment.',
  DISABLED: 'Excluded from generated sessions under the current environment profile.'
};

const T = (id,name,domain,provenance,representation,extra={}) => ({
  id,name,domain,provenance,representation,quiet:true,band:false,laterality:'none',sessionEligible:true,
  spokenCue:name.split('//')[0].trim(),prerequisites:[],setup:[],checkpoints:[],failures:[],recovery:'Return to compact base under control.',solo:[],
  ...extra
});

export const techniques = [
  T('base','Compact fighting base','BASE','Hybrid striking / grappling','FULL',{
    summary:'Stable, recoverable posture for micro-footprint movement and immediate domain switching.',
    setup:['Stand centered on the mat lane with enough clearance to extend the arms without contacting furniture.'],
    checkpoints:['Feet remain under a recoverable base.','Head and trunk stay organized rather than pitching forward.','Hands return to a familiar protective position after every action.'],
    failures:['Crossing the feet during micro movement.','Allowing stance width to exceed the usable lane.'],
    solo:['Assume your familiar compact fighting stance.','Make small weight shifts without crossing the feet.','Reset to the same recoverable base after every cue.']
  }),
  T('micro-footwork','Micro footwork + pivot','BASE','Boxing / Muay Thai / grappling','FULL',{
    laterality:'bilateral',summary:'Short forward/rear adjustments and compact pivots without leaving the 72 × 24 inch footprint.',prerequisites:['base'],
    checkpoints:['Head level changes minimally.','Feet do not cross.','Every displacement ends in usable balance.'],
    failures:['Large room-crossing steps.','Pivoting farther than the floor space safely permits.'],
    solo:['Use short stance-preserving adjustments.','Make compact pivots rather than broad arcs.','Treat every movement as preparation for a subsequent cue.']
  }),
  T('level-change','Level change','SHOT','Wrestling','FULL',{
    summary:'Quiet level-change mechanics and recovery without collision, penetration finish, or floor impact.',prerequisites:['base'],
    checkpoints:['Lower through hips and knees while preserving posture.','Feet stay inside the lane.','Recovery returns directly to base.'],
    failures:['Folding primarily at the waist.','Dropping a knee hard to the floor.'],solo:['Lower under control.','Hold structure briefly.','Recover quietly to base.']
  }),
  T('quiet-sprawl','Quiet step-back sprawl','SPRAWL','Wrestling / MMA','PROXY',{
    summary:'Low-impact sprawl-pattern rehearsal adapted for apartment use.',prerequisites:['base','level-change'],
    checkpoints:['Legs step back rather than jump.','Hands and hips remain controlled.','Recovery is quiet and balanced.'],
    failures:['Dropping bodyweight into the floor.','Treating speed as the training objective.'],
    solo:['Step the legs back under control rather than jumping.','Keep impact minimal.','Recover quietly to base.'],
    limits:'This is not live takedown defense and omits opponent pressure, timing and head/hand fighting.'
  }),
  T('cover-shell','Compact cover / shell','DEFEND','Boxing / Muay Thai / combatives','FULL',{
    laterality:'bilateral',summary:'Compact defensive shell and immediate visual/reaction reset without impact.',prerequisites:['base'],
    checkpoints:['Elbows and hands stay compact.','Vision is not deliberately obscured longer than necessary.','Cover resolves back into an actionable base.'],
    failures:['Over-closing posture.','Holding a static shell as an endpoint.'],solo:['Form the familiar compact cover.','Recover hands and posture immediately.','Pair with a micro exit when cued.']
  }),
  T('frame','Frame / hands home','FRAME','BJJ / wrestling / combatives','FULL',{
    laterality:'bilateral',summary:'Compact framing geometry and immediate recovery without pushing against a person or fixed object.',prerequisites:['base'],
    checkpoints:['Elbows stay structurally connected.','Hands return home after the frame.','No maximal isometric pushing.'],
    failures:['Locking elbows hard.','Using furniture as a resistance partner.'],solo:['Build the familiar frame shape in the air.','Hold only long enough to confirm geometry.','Recover immediately to base.']
  }),
  T('clinch-shadow','Compact clinch acquisition shadow','CLINCH','Wrestling / Muay Thai / judo / combatives','SHADOW',{
    laterality:'bilateral',summary:'No-contact rehearsal of entering to a familiar compact upper-body connection.',prerequisites:['base','micro-footwork'],
    checkpoints:['Entry remains within the mat lane.','Head, hands and posture remain organized.','No imagined throw completion follows automatically.'],
    failures:['Overreaching into empty space.','Using large lateral steps.'],solo:['Rehearse the hand and head-position route you already know.','Stop at the connection position.','Reset or transition only on the next cue.'],
    limits:'No pummeling, hand fighting, tactile pressure or opponent posture is reproduced.'
  }),
  T('disengage','Compact disengage / reset','DISENGAGE','Hybrid combatives','FULL',{
    laterality:'bilateral',summary:'Small-footprint exit and reorganization after a completed or aborted sequence.',prerequisites:['base','micro-footwork'],
    checkpoints:['Exit preserves balance.','Hands return to a protective home position.','Movement remains inside the lane.'],
    failures:['Turning the back during a purely technical reset.','Taking a large retreat step beyond the mat.'],solo:['Make a compact exit.','Re-establish base and visual orientation.','Stop cleanly rather than adding extra movement.']
  }),
  T('1-2','Jab — Cross','STRIKE','Boxing','FULL',{
    laterality:'stance',spokenCue:'Jab cross',summary:'Straight-punch two-count with immediate guard recovery.',prerequisites:['base'],
    checkpoints:['Punches return to guard.','Elbows do not lock.','Finish balanced.'],
    failures:['Chasing speed until structure degrades.','Allowing the rear hand to stay extended.'],
    solo:['Deliver familiar jab–cross mechanics without locking the elbows.','Recover both hands to guard.','Add only a compact exit when cued.']
  }),
  T('1-1-2','Jab — Jab — Cross','STRIKE','Boxing','FULL',{
    laterality:'stance',spokenCue:'Jab jab cross',summary:'Double-jab entry into rear straight, rehearsed with compact displacement.',prerequisites:['base','1-2'],
    checkpoints:['Second jab changes rhythm without overreaching.','Rear straight returns cleanly.','Base survives the combination.'],
    failures:['Letting the second jab pull the head forward.','Drifting off the mat lane.'],solo:['Use the first jab to establish rhythm and the second to alter it.','Finish with the rear straight.','Recover immediately.']
  }),
  T('1-2-3','Jab — Cross — Lead Hook','STRIKE','Boxing','FULL',{
    laterality:'stance',spokenCue:'Jab cross lead hook',aliases:['Jab — Cross — Left Hook (orthodox)'],summary:'Three-count combination emphasizing compact rotation and clean reset.',prerequisites:['base','1-2'],
    checkpoints:['Hook remains compact.','Rotation stops under control.','Lead hand returns home.'],failures:['Over-rotating the hook.','Letting stance collapse after the turn.'],solo:['Keep the hook compact enough for apartment clearance.','Return the lead hand to guard.','Finish balanced.']
  }),
  T('1-2-3-2','Jab — Cross — Lead Hook — Cross','STRIKE','Boxing','FULL',{
    laterality:'stance',spokenCue:'Jab cross lead hook cross',aliases:['Jab — Cross — Left Hook — Cross (orthodox)'],summary:'Four-count combination for rhythm, rotation and immediate reorganization.',prerequisites:['base','1-2-3'],
    checkpoints:['Each strike recovers into the next.','Final cross does not drag the stance long.','Interruption can be obeyed without finishing the string.'],
    failures:['Running the string as one memorized blur.','Ignoring a stop/change cue.'],solo:['Keep the sequence smooth rather than maximal-speed.','Recover position after each rotational strike.','On interruption cues, stop cleanly and return to base.']
  }),
  T('hubud-solo','Hubud-Lubud // Open-hand solo flow','FLOW','Kali / Arnis / Eskrima','PROXY',{
    laterality:'bilateral',spokenCue:'Hubud',summary:'Solo bilateral motor-pattern proxy for a partner-based close-range sensitivity drill.',prerequisites:['base'],
    checkpoints:['Hands remain compact around the centerline task.','Both sides can lead the loop.','CHANGE produces a clean reversal/restart rather than a scramble.'],
    failures:['Treating the solo loop as tactile sensitivity training.','Allowing the pattern to become large and theatrical.'],
    solo:['Cycle the familiar open-hand receive / redirect / check / return pattern.','Mirror the pattern on both sides.','Change rhythm without expanding the footprint.','On CHANGE, reverse or restart cleanly.'],
    limits:'Hubud proper is a tactile partner drill. Solo flow cannot train pressure-reading, contact sensitivity or adaptive partner timing.'
  }),
  T('osoto','O-soto-gari // no-gi shadow entry','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'O Soto',family:'reap',canonicalSource:'O-soto-gari',variant:'RENSA no-gi shadow entry',summary:'No-impact rehearsal of your no-gi o-soto entry and reaping trajectory.',prerequisites:['base','clinch-shadow'],
    checkpoints:['Upper-body connection and off-balancing direction are mentally explicit.','Reaping trajectory is controlled.','No throw completion follows.'],
    failures:['Swinging the leg at maximal speed.','Using furniture as the receiving body.'],
    solo:['Establish your familiar no-gi upper-body connection in the air.','Rehearse off-balancing direction, entry and leg trajectory without completing a throw.','Recover under control.'],
    bandOverlay:'Use only light external resistance for upper-body connection and entry. Anchor safely; no recoil path toward the face.',
    limits:'No partner balance, gripping contest, collision, timing or throw completion is reproduced.'
  }),
  T('ouchi','O-uchi-gari // no-gi shadow entry','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'O Uchi',family:'reap',canonicalSource:'O-uchi-gari',variant:'RENSA no-gi shadow entry',summary:'Compact inner-reap entry rehearsal with controlled recovery.',prerequisites:['base','clinch-shadow'],
    checkpoints:['Connection, entry line and reap path remain distinct.','Support foot remains quiet.','Recovery is balanced.'],failures:['Hopping through the entry.','Turning the movement into a floor-sweeping kick.'],
    solo:['Rehearse your no-gi connection and entry line.','Trace the inner-reap path without an imagined loaded finish.','Return to base quietly.'],bandOverlay:'Optional light resistance may cue the upper-body phase only.',limits:'Partner reaction, balance and reap timing are absent.'
  }),
  T('deashi','De-ashi-harai // timing sweep shadow','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'Day Ashi Harai',family:'sweep',canonicalSource:'De-ashi-harai',variant:'RENSA timing-sweep shadow',summary:'Timing-oriented foot-sweep pattern kept deliberately small and quiet.',prerequisites:['base','micro-footwork'],
    checkpoints:['Sweep path is relaxed.','Support foot resets completely.','Imagined timing cue precedes the sweep.'],failures:['Muscling the sweep.','Dragging or striking the floor.'],
    solo:['Use a minimal imagined movement cue.','Trace the sweep with relaxed precision and no floor impact.','Reset the support foot before repeating.'],bandOverlay:'A light band may provide upper-body directional reference; it does not recreate a moving partner.',limits:'The essence of de-ashi timing depends on another body in motion; solo work preserves only the motor representation.'
  }),
  T('uchimata','Uchi-mata // no-gi shadow entry','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'Uchi Mata',family:'turning',canonicalSource:'Uchi-mata',variant:'RENSA no-gi shadow entry',summary:'Controlled turning-entry and leg-path rehearsal without elevation or throw completion.',prerequisites:['base','clinch-shadow'],
    checkpoints:['Turn remains controlled.','Attacking leg path does not compromise balance.','Recovery is deliberate.'],failures:['Kicking high into instability.','Spinning through a failed imaginary finish.'],
    solo:['Rehearse entry and torso organization at submaximal speed.','Trace the attacking-leg path without elevation.','Recover inside the lane.'],bandOverlay:'Use light resistance only with an unquestionably stable anchor and safe recoil path.',limits:'No lift, collision, partner posture or live balance disruption is reproduced.'
  }),
  T('taiotoshi','Tai-otoshi // no-gi shadow entry','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'Tai Otoshi',family:'turning',canonicalSource:'Tai-otoshi',variant:'RENSA no-gi shadow entry',summary:'Turning hand-throw entry pattern constrained to a narrow solo footprint.',prerequisites:['base','clinch-shadow'],
    checkpoints:['Turn and hand direction are coordinated.','Foot placement stays within the lane.','No rigid obstacle is used as a partner surrogate.'],failures:['Locking a leg against furniture.','Over-pulling a band.'],
    solo:['Rehearse upper-body turn and entry with careful foot placement.','Do not create a rigid trip structure against furniture.','Recover to stance.'],bandOverlay:'Light resistance may cue hand direction; no maximal pulling force.',limits:'Partner movement, load and actual throwing mechanics require live practice.'
  }),
  T('seoi','Ippon-seoi-nage // no-gi shadow entry','THROW','Judo','SHADOW',{
    laterality:'bilateral',band:true,spokenCue:'Ippon Seoi Nage',family:'shoulder',canonicalSource:'Ippon-seoi-nage',variant:'RENSA no-gi shadow entry',summary:'Compact shoulder-throw entry rehearsal without loading, dropping or throw completion.',prerequisites:['base','clinch-shadow'],
    checkpoints:['Turn and shoulder line remain organized.','Knees remain controlled.','Unwind to base.'],failures:['Dropping hard toward the floor.','Attempting to simulate partner loading against fixed objects.'],
    solo:['Rehearse the turn and shoulder-line organization you already know.','Remain upright enough to protect the knees and avoid impact.','Unwind rather than completing a throw.'],bandOverlay:'Optional light pulling reference only. Keep tension low.',limits:'No partner loading, posture, grip fighting or finish is reproduced.'
  }),
  T('double','Double-leg takedown // compact shadow entry','SHOT','Wrestling / MMA','SHADOW',{
    laterality:'stance',spokenCue:'Double Leg',family:'double-leg',canonicalSource:'Wrestling double-leg',variant:'RENSA compact no-collision entry',summary:'Compact level-change and penetration-pattern rehearsal with no collision, drive or lift finish.',prerequisites:['base','level-change'],
    checkpoints:['Level change precedes entry.','Entry remains short enough for the mat.','No drive finish follows.'],failures:['Launching forward into furniture.','Dropping knees hard to the floor.'],
    solo:['Level change under control.','Rehearse a short entry inside the mat length.','Stop before any drive or lifting simulation and recover.'],limits:'No opponent reaction, penetration depth, finish, wall interaction or live defense is present.'
  }),
  T('morote','Morote-gari // reference shadow entry','SHOT','Judo','SHADOW',{
    laterality:'stance',spokenCue:'Morote Gari',family:'double-leg',canonicalSource:'Morote-gari',variant:'Reference-only comparison entry',sessionEligible:false,related:['double'],summary:'Separate judo te-waza entry retained as a related but distinct technique rather than treating it as a synonym for the wrestling double-leg.',prerequisites:['base','level-change'],
    checkpoints:['Keep the mechanics conceptually distinct from the wrestling double-leg used in the active regimen.'],failures:['Collapsing the two techniques into a single label.'],
    solo:['Use only as a technical comparison/reference entry.','Do not add it to the weekly maintenance pulse unless deliberately activated in a future release.'],limits:'Related mechanics do not make morote-gari and the wrestling double-leg identical techniques.'
  }),
  T('ezekiel','Standing Ezekiel // hand-position recall','CONTROL','BJJ / no-gi adaptation','REFERENCE',{
    laterality:'bilateral',spokenCue:'Ezekiel position',canonicalSource:'Sode-guruma-jime family',variant:'Standing no-gi hand-position recall',giDependency:'Canonical sode-guruma-jime uses sleeve purchase; this RENSA entry is an adaptation, not canonical sleeve mechanics.',summary:'Recall-only representation of the standing hand-position sequence; no neck compression is trained solo.',prerequisites:['clinch-shadow'],
    checkpoints:['Stop at positional recall.','No pressure is applied.','Immediate release/reset follows.'],failures:['Using the neck, household objects, pets or another person as solo resistance.'],
    solo:['Rehearse only the gross hand-position sequence in the air.','Stop at the positional endpoint and immediately release/reset.'],limits:'Do not apply strangulation pressure during solo RENSA sessions.'
  }),
  T('rnc','Standing rear naked choke // hand-position recall','CONTROL','BJJ / grappling / hadaka-jime family','REFERENCE',{
    laterality:'bilateral',spokenCue:'Rear naked choke position',canonicalSource:'Hadaka-jime / rear naked choke family',variant:'Standing hand-position recall',summary:'Recall-only hand-sequencing proxy with no neck compression.',prerequisites:['clinch-shadow'],
    checkpoints:['Gross sequence is recognizable.','No closing pressure.','Immediate reset follows.'],failures:['Practicing pressure on yourself or an improvised object.'],
    solo:['Rehearse the gross hand path in the air without closing pressure.','Reset immediately after the remembered finishing position.'],limits:'RENSA does not solo-train the strangulation itself. Pressure, finishing mechanics and partner safety are outside this environment.'
  }),
  T('breath-reset','Recovery breath + posture reset','RECOVER','General training','FULL',{
    summary:'Short downshift used after demanding cue blocks without leaving the mat.',prerequisites:['base'],checkpoints:['Breathing settles without collapsing posture.','No breath-hold challenge.'],failures:['Turning recovery into a maximal respiratory drill.'],solo:['Stand or kneel comfortably as space allows.','Use relaxed breathing.','Finish oriented and stable.']
  })
];

export const techniqueById = id => techniques.find(t=>t.id===id);
export const focusPool = ['osoto','ouchi','deashi','uchimata','taiotoshi','seoi','double'];
export const fallbackFocusRotation = [
  ['osoto','double'],['uchimata','ouchi'],['taiotoshi','deashi'],['seoi','osoto']
];

const C = (id,name,domain,nodes,note) => ({
  id,name,domain,nodes,note,
  edges:nodes.slice(0,-1).map((from,i)=>({from,to:nodes[i+1],trigger:'complete',delayMs:[1700,3000]}))
});

export const chains = [
  C('strike-shot','Straight line → shot','STRIKE / SHOT',['1-2','level-change','double','disengage'],'Sequential cues; no drive finish.'),
  C('strike-clinch-throw','Strike → clinch → reap','STRIKE / CLINCH / THROW',['1-2','clinch-shadow','osoto','disengage'],'No-contact transition architecture.'),
  C('inside-chain','Inside reap → outer reap','THROW',['ouchi','osoto','disengage'],'Motor recall of a familiar directional relationship, not partner reaction training.'),
  C('flow-break','Flow → break → frame','FLOW / FRAME',['hubud-solo','frame','disengage'],'Hubud proxy is interrupted into a compact frame and reset.'),
  C('cover-clinch','Cover → clinch','DEFEND / CLINCH',['cover-shell','clinch-shadow','disengage'],'Compact defensive organization into connection shadow.'),
  C('shot-sprawl-recover','Shot cue → sprawl → recover','SHOT / SPRAWL / RECOVER',['level-change','quiet-sprawl','base'],'Information-switching chain; not a representation of a live exchange.'),
  C('turning-switch','Turning entry switch','THROW',['taiotoshi','uchimata','disengage'],'Sequential turning-entry recall with controlled recovery.'),
  C('control-position','Clinch → control-position recall','CLINCH / CONTROL',['clinch-shadow','rnc','disengage'],'Position recall only; no compression.')
];

export const sessionTemplates = {
  full: [
    {id:'wake-shoulders',phase:'WAKE',seconds:60,label:'Shoulder + scapular rotations',detail:'Quiet circles and controlled scapular movement.'},
    {id:'wake-spine',phase:'WAKE',seconds:60,label:'Trunk + hip mobility',detail:'Compact rotation and hip movement without leaving the mat.'},
    {id:'wake-ankles',phase:'WAKE',seconds:60,label:'Knee + ankle preparation',detail:'Controlled range only; no bouncing.'},
    {id:'wake-lunge',phase:'WAKE',seconds:60,label:'Compact reverse lunge',detail:'Short, quiet alternating repetitions inside the lane.'},
    {id:'base',phase:'BASE',seconds:60,techniqueId:'base',label:'Compact fighting base'},
    {id:'footwork',phase:'BASE',seconds:120,techniqueId:'micro-footwork',dynamic:'laterality',label:'Micro footwork + pivot'},
    {id:'level',phase:'WRESTLE',seconds:90,techniqueId:'level-change',label:'Level change'},
    {id:'sprawl',phase:'WRESTLE',seconds:90,techniqueId:'quiet-sprawl',label:'Quiet step-back sprawl'},
    {id:'strike-12',phase:'STRIKE',seconds:90,techniqueId:'1-2',label:'Jab — Cross'},
    {id:'strike-112',phase:'STRIKE',seconds:90,techniqueId:'1-1-2',label:'Jab — Jab — Cross'},
    {id:'strike-123',phase:'STRIKE',seconds:90,techniqueId:'1-2-3',label:'Jab — Cross — Lead Hook'},
    {id:'strike-1232',phase:'STRIKE',seconds:90,techniqueId:'1-2-3-2',dynamic:'selfInterrupt',interruptAction:'base',label:'Jab — Cross — Lead Hook — Cross'},
    {id:'hubud-r',phase:'FLOW',seconds:120,techniqueId:'hubud-solo',fixedSide:'RIGHT',label:'Hubud solo flow // right lead'},
    {id:'hubud-l',phase:'FLOW',seconds:120,techniqueId:'hubud-solo',fixedSide:'LEFT',dynamic:'selfInterrupt',interruptAction:'reverse',label:'Hubud solo flow // left lead'},
    {id:'maintenance',phase:'TAKEDOWN',seconds:240,dynamic:'maintenance',label:'Seven-entry maintenance pulse'},
    {id:'focus-a',phase:'TAKEDOWN',seconds:180,dynamic:'focusA',label:'Focus A'},
    {id:'focus-b',phase:'TAKEDOWN',seconds:180,dynamic:'focusB',label:'Focus B'},
    {id:'focus-integration',phase:'TAKEDOWN',seconds:60,dynamic:'focusIntegration',label:'Focus switch / optional band overlay'},
    {id:'control-e',phase:'CONTROL',seconds:120,techniqueId:'ezekiel',label:'Ezekiel position recall'},
    {id:'control-r',phase:'CONTROL',seconds:120,techniqueId:'rnc',label:'Rear naked choke position recall'},
    {id:'chains',phase:'CHAIN',seconds:300,dynamic:'chains',label:'Sequential chain conductor'},
    {id:'interrupt',phase:'CHAIN',seconds:180,dynamic:'interrupt',label:'Interrupt / substitute'},
    {id:'pressure',phase:'PRESSURE',seconds:300,dynamic:'pressure',label:'Pressure retrieval'},
    {id:'down-mobility',phase:'DOWN',seconds:60,label:'Gentle extension / mobility',detail:'Use a comfortable quiet extension or standing alternative; no forced range.'},
    {id:'down-breath',phase:'DOWN',seconds:60,techniqueId:'breath-reset',label:'Recovery breath + ledger prep'}
  ],
  compact: [
    {id:'c-wake',phase:'WAKE',seconds:120,label:'Compact mobility circuit',detail:'Shoulders, trunk, hips, knees and ankles.'},
    {id:'c-base',phase:'BASE',seconds:60,dynamic:'baseMix',label:'Base + micro movement'},
    {id:'c-wrestle',phase:'WRESTLE',seconds:90,dynamic:'wrestleMix',label:'Level change + quiet sprawl'},
    {id:'c-strike',phase:'STRIKE',seconds:240,dynamic:'strikeMix',label:'Four-combination striking rotation'},
    {id:'c-flow',phase:'FLOW',seconds:120,techniqueId:'hubud-solo',dynamic:'hubudMix',label:'Hubud bilateral flow'},
    {id:'c-takedown',phase:'TAKEDOWN',seconds:240,dynamic:'compactTakedown',label:'Maintenance + focus entries'},
    {id:'c-control',phase:'CONTROL',seconds:90,dynamic:'controlMix',label:'Control-position recall'},
    {id:'c-chain',phase:'CHAIN',seconds:120,dynamic:'chains',label:'Sequential chains'},
    {id:'c-pressure',phase:'PRESSURE',seconds:90,dynamic:'pressure',label:'Pressure retrieval'},
    {id:'c-down',phase:'DOWN',seconds:30,techniqueId:'breath-reset',label:'Recovery + log'}
  ],
  preview: [
    {id:'q-wake',phase:'WAKE',seconds:30,label:'QA mobility'},
    {id:'q-base',phase:'BASE',seconds:30,techniqueId:'base',label:'QA base'},
    {id:'q-strike',phase:'STRIKE',seconds:45,dynamic:'strikeMix',label:'QA strike cues'},
    {id:'q-flow',phase:'FLOW',seconds:30,techniqueId:'hubud-solo',dynamic:'hubudMix',label:'QA Hubud cues'},
    {id:'q-takedown',phase:'TAKEDOWN',seconds:60,dynamic:'compactTakedown',label:'QA takedown cues'},
    {id:'q-chain',phase:'CHAIN',seconds:45,dynamic:'chains',label:'QA chain cues'},
    {id:'q-pressure',phase:'PRESSURE',seconds:45,dynamic:'pressure',label:'QA pressure cues'},
    {id:'q-down',phase:'DOWN',seconds:15,techniqueId:'breath-reset',label:'QA finish'}
  ]
};

export const pressureCategories = ['STRIKE','FLOW','CLINCH','THROW','SHOT','SPRAWL','FRAME','RECOVER','DISENGAGE'];
export const noiseCues = ['BLUE','SEVEN','NORTH','ALPHA','STATIC','ZERO','DELTA','COPPER','NINE'];

export const glossary = [
  {term:'Kuzushi',domain:'JUDO',definition:'Breaking or disturbing balance; retained as a technical concept, not as the name of this system.'},
  {term:'Tsukuri',domain:'JUDO',definition:'Fitting/positioning the body for a throw; often discussed with kuzushi and kake.'},
  {term:'Kake',domain:'JUDO',definition:'Execution phase of a throw.'},
  {term:'Ashi-waza',domain:'JUDO',definition:'Foot/leg techniques.'},
  {term:'Te-waza',domain:'JUDO',definition:'Hand techniques.'},
  {term:'Nage-waza',domain:'JUDO',definition:'Throwing techniques.'},
  {term:'Katame-waza',domain:'JUDO',definition:'Grappling/control technique category.'},
  {term:'Hadaka-jime',domain:'JUDO',definition:'Naked choke family; related conceptually to rear-naked-choke mechanics.'},
  {term:'Sode-guruma-jime',domain:'JUDO',definition:'Sleeve-wheel choke; canonical mechanics use sleeve purchase and are distinct from RENSA’s no-gi standing Ezekiel-position recall.'},
  {term:'Uchikomi',domain:'JUDO',definition:'Repeated entry practice without completing the throw; RENSA solo shadow entries are only an analogue, not partner uchikomi.'},
  {term:'Nagekomi',domain:'JUDO',definition:'Repeated completed throwing practice. Disabled by RENSA’s current apartment environment.'},
  {term:'Hubud-Lubud',domain:'FMA',definition:'Cyclical close-range partner sensitivity/flow drill. RENSA’s solo version preserves only motor sequencing and rhythm.'},
  {term:'Frame',domain:'GRAPPLING',definition:'Structural use of the limbs to maintain or create space. Solo RENSA rehearses geometry only.'},
  {term:'Level change',domain:'WRESTLING',definition:'Changing body level while preserving posture to support shot/defensive mechanics.'},
  {term:'Sprawl',domain:'WRESTLING',definition:'Takedown-defense family usually involving hips/legs moving away from a shot. RENSA uses a low-impact step-back proxy.'},
  {term:'Penetration step',domain:'WRESTLING',definition:'Entry footwork used in many shots. RENSA constrains this to the available footprint and does not train collision/finish.'},
  {term:'Lead / rear',domain:'STRIKING',definition:'Stance-relative terminology used instead of assuming left/right striking mechanics.'},
  {term:'Representation',domain:'RENSA',definition:'RENSA’s honesty label describing how much of a real skill can be meaningfully rehearsed in the configured solo environment.'}
];

export const curriculum = [
  {stage:1,name:'Base + orientation',goal:'Stable base, compact movement, recovery.',requires:[],techniques:['base','micro-footwork','breath-reset']},
  {stage:2,name:'Defensive organization',goal:'Cover, frame and controlled disengagement.',requires:[1],techniques:['cover-shell','frame','disengage']},
  {stage:3,name:'Straight striking',goal:'Retain the four selected combinations with immediate recovery.',requires:[1],techniques:['1-2','1-1-2','1-2-3','1-2-3-2']},
  {stage:4,name:'Wrestling movement',goal:'Level change, compact shot entry and quiet sprawl proxy.',requires:[1],techniques:['level-change','double','quiet-sprawl']},
  {stage:5,name:'Contact-flow representation',goal:'Retain bilateral Hubud sequencing without pretending to reproduce tactile sensitivity.',requires:[1],techniques:['hubud-solo']},
  {stage:6,name:'Clinch + off-balancing entries',goal:'Maintain selected no-gi judo entry representations.',requires:[1,2],techniques:['clinch-shadow','osoto','ouchi','deashi','uchimata','taiotoshi','seoi']},
  {stage:7,name:'Control-position recall',goal:'Preserve gross hand-position memory without compression.',requires:[2,6],techniques:['ezekiel','rnc']},
  {stage:8,name:'Transitions',goal:'Move between domains under sequential external cueing.',requires:[3,4,5,6],techniques:[],evidenceContext:'chain'},
  {stage:9,name:'Pressure retrieval',goal:'Recall, inhibit, switch and self-select under informational load while physical execution remains controlled.',requires:[8],techniques:[],evidenceContext:'pressure'}
];
