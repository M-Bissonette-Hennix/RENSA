export const APP_VERSION = '1.0.0';

export const representations = {
  FULL: 'The relevant solo motor task can be practiced meaningfully in the configured environment.',
  SHADOW: 'A non-contact movement pattern can be rehearsed; resistance, timing and opponent interaction are absent.',
  PROXY: 'A useful surrogate preserves part of the skill, but a defining component is unavailable solo.',
  REFERENCE: 'Retained as knowledge / recall only in the current environment.',
  DISABLED: 'Excluded from generated sessions under the current environment profile.'
};

export const techniques = [
  {id:'base',name:'Compact fighting base',domain:'BASE',provenance:'Hybrid striking / grappling',representation:'FULL',quiet:true,band:false,summary:'Stable, recoverable posture for micro-footprint movement and immediate domain switching.',solo:['Assume your familiar compact fighting stance inside the mat lane.','Make small weight shifts without crossing the feet or leaving the lane.','Return to a balanced neutral guard after every cue.'],limits:'No claim is made that stance-only work reproduces live distance, timing or contact.'},
  {id:'micro-footwork',name:'Micro footwork + pivot',domain:'BASE',provenance:'Boxing / Muay Thai / grappling',representation:'FULL',quiet:true,band:false,summary:'Short forward/rear/lateral adjustments and compact pivots without leaving the 72 × 24 inch footprint.',solo:['Use short stance-preserving adjustments rather than room-crossing movement.','Keep the head level and recover the base after each direction change.','Treat every movement as preparation for a subsequent cue.']},
  {id:'level-change',name:'Level change',domain:'SHOT',provenance:'Wrestling',representation:'FULL',quiet:true,band:false,summary:'Quiet level-change mechanics and recovery without an impact finish.',solo:['Lower through hips and knees while preserving posture.','Keep the movement narrow enough to remain inside the lane.','Recover immediately to a stable fighting base.']},
  {id:'quiet-sprawl',name:'Quiet step-back sprawl',domain:'SPRAWL',provenance:'Wrestling / MMA',representation:'PROXY',quiet:true,band:false,summary:'Low-impact sprawl-pattern rehearsal adapted for apartment use.',solo:['From stance, step the legs back under control rather than jumping.','Keep impact minimal and treat the movement as a pattern rehearsal.','Recover quietly to base before the next repetition.'],limits:'This is not live takedown defense and omits opponent pressure, timing and head/hand fighting.'},
  {id:'1-2',name:'Jab — Cross',domain:'STRIKE',provenance:'Boxing',representation:'FULL',quiet:true,band:false,summary:'Straight-punch two-count with immediate guard recovery.',solo:['Deliver the familiar jab–cross mechanics without locking the elbows.','Recover both hands to guard.','Add a small exit or reset when space allows.']},
  {id:'1-1-2',name:'Jab — Jab — Cross',domain:'STRIKE',provenance:'Boxing',representation:'FULL',quiet:true,band:false,summary:'Double-jab entry into rear straight, rehearsed with compact displacement.',solo:['Use the first jab to establish rhythm and the second to alter it.','Finish with the rear straight and recover.','Avoid drifting beyond the mat lane.']},
  {id:'1-2-3',name:'Jab — Cross — Left Hook',domain:'STRIKE',provenance:'Boxing',representation:'FULL',quiet:true,band:false,summary:'Three-count combination emphasizing clean rotational reset.',solo:['Keep the hook compact enough for apartment clearance.','Return the hook side to guard rather than over-rotating.','Finish balanced and ready for another domain.']},
  {id:'1-2-3-2',name:'Jab — Cross — Hook — Cross',domain:'STRIKE',provenance:'Boxing',representation:'FULL',quiet:true,band:false,summary:'Four-count combination for rhythm, rotation and immediate reorganization.',solo:['Keep the sequence smooth rather than maximal-speed.','Recover position after each rotational strike.','On interruption cues, stop cleanly and return to base.']},
  {id:'hubud-solo',name:'Hubud-Lubud // Open-hand solo flow',domain:'FLOW',provenance:'Kali / Arnis / Eskrima',representation:'PROXY',quiet:true,band:false,summary:'Solo bilateral motor-pattern proxy for a partner-based close-range sensitivity drill.',solo:['Cycle the familiar open-hand receive / redirect / check / return pattern in compact form.','Mirror the pattern on both sides.','Change rhythm without allowing the hands to drift away from the centerline task.','On CHANGE, reverse or restart cleanly rather than forcing a broken sequence.'],limits:'Hubud proper is a tactile partner drill. Solo flow cannot train pressure-reading, contact sensitivity or adaptive partner timing.'},
  {id:'osoto',name:'O-soto-gari // no-gi shadow entry',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'No-impact rehearsal of your no-gi o-soto entry and reaping trajectory.',solo:['Establish your familiar no-gi upper-body connection in the air.','Rehearse off-balancing direction, entry and leg trajectory without completing a throw.','Recover under control to the starting base.'],bandOverlay:'Use the band only as light external resistance for the upper-body connection and entry. Anchor safely; do not use a setup that can recoil into you or pull furniture.',limits:'No partner balance, gripping contest, collision, timing or throw completion is reproduced.'},
  {id:'ouchi',name:'O-uchi-gari // no-gi shadow entry',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'Compact inner-reap entry rehearsal with controlled recovery.',solo:['Rehearse your no-gi connection and entry line.','Trace the inner-reap path without attempting a finish against an imaginary load.','Return to base without hopping or striking the floor.'],bandOverlay:'Optional light-resistance connection can be added to the upper-body phase only.',limits:'Partner reaction, balance and reap timing are absent.'},
  {id:'deashi',name:'De-ashi-harai // timing sweep shadow',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'Timing-oriented foot-sweep pattern kept deliberately small and quiet.',solo:['Use a minimal imagined movement cue rather than a large step.','Trace the sweep with relaxed precision and no floor impact.','Reset the support foot before repeating.'],bandOverlay:'A light band can provide upper-body directional reference; it does not recreate a moving partner.',limits:'The essence of de-ashi timing depends on another body in motion; solo work preserves only the motor representation.'},
  {id:'uchimata',name:'Uchi-mata // no-gi shadow entry',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'Controlled turning-entry and leg-path rehearsal without elevation or throw completion.',solo:['Rehearse your entry and torso organization at submaximal speed.','Trace the attacking-leg path without kicking high or compromising balance.','Recover deliberately inside the lane.'],bandOverlay:'Use light resistance only if the anchor is unquestionably stable and the band cannot snap back toward the face.',limits:'No lift, collision, partner posture or live balance disruption is reproduced.'},
  {id:'taiotoshi',name:'Tai-otoshi // no-gi shadow entry',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'Turning hand-throw entry pattern constrained to a narrow solo footprint.',solo:['Rehearse upper-body turn and entry with careful foot placement.','Do not create a rigid trip structure against furniture or fixed objects.','Recover to stance after each entry.'],bandOverlay:'Light band resistance may be used to cue hand direction; do not use maximal pulling force.',limits:'Partner movement, load and actual throwing mechanics require live practice.'},
  {id:'seoi',name:'Ippon-seoi-nage // no-gi shadow entry',domain:'THROW',provenance:'Judo',representation:'SHADOW',quiet:true,band:true,summary:'Compact shoulder-throw entry rehearsal without loading or dropping.',solo:['Rehearse the turn and shoulder-line organization you already know.','Remain upright enough to protect the knees and avoid floor impact.','Unwind to base rather than completing a throwing motion.'],bandOverlay:'Optional band can provide a light pulling reference for the entry. Keep tension low.',limits:'No partner loading, posture, grip fighting or finish is reproduced.'},
  {id:'double',name:'Double-leg // morote-gari family entry',domain:'SHOT',provenance:'Wrestling / historical judo technique family',representation:'SHADOW',quiet:true,band:false,summary:'Compact level-change and penetration-pattern rehearsal with no collision or drive finish.',solo:['Level change under control.','Rehearse a short entry that remains inside the mat length.','Stop before any drive or lifting simulation and recover to base.'],limits:'No opponent reaction, penetration depth, finish, wall interaction or live defense is present.'},
  {id:'ezekiel',name:'Standing Ezekiel // hand-position recall',domain:'CONTROL',provenance:'BJJ / sode-guruma-jime derivative family',representation:'REFERENCE',quiet:true,band:false,summary:'Recall-only representation of the standing hand-position sequence; no neck compression is trained solo.',solo:['Rehearse only the gross hand-position sequence in the air.','Stop at the positional endpoint and immediately release/reset.'],limits:'Do not apply strangulation pressure to yourself, household objects, pets or another person during solo RENSA sessions.'},
  {id:'rnc',name:'Standing rear naked choke // hand-position recall',domain:'CONTROL',provenance:'BJJ / grappling / hadaka-jime family',representation:'REFERENCE',quiet:true,band:false,summary:'Recall-only hand-sequencing proxy with no neck compression.',solo:['Rehearse the gross hand path in the air without closing pressure.','Reset immediately after the remembered finishing position.'],limits:'RENSA does not solo-train the strangulation itself. Pressure, finishing mechanics and partner safety are outside this environment profile.'},
  {id:'recovery',name:'Reset / disengage / recover',domain:'RECOVER',provenance:'Hybrid combatives',representation:'FULL',quiet:true,band:false,summary:'Immediate return to stable base and visual orientation after any rehearsal chain.',solo:['Stop the preceding pattern cleanly.','Recover posture and guard.','Re-orient before accepting the next cue.']}
];

export const chains = [
  {id:'c1',name:'Straight line → shot',domain:'STRIKE → SHOT',steps:['Jab — Cross','Level change','Double-leg entry','Reset'],note:'Cross-domain retrieval. No collision or drive finish.'},
  {id:'c2',name:'Straight line → outside reap',domain:'STRIKE → CLINCH/THROW',steps:['Jab — Cross','Compact clinch acquisition shadow','O-soto entry','Reset'],note:'Transition rehearsal only; no throw completion.'},
  {id:'c3',name:'Inside reap → uchi-mata',domain:'THROW → THROW',steps:['O-uchi entry','CHANGE','Uchi-mata entry','Reset'],note:'Judo-derived chaining represented as shadow entries.'},
  {id:'c4',name:'Timing sweep → turning attack',domain:'THROW → THROW',steps:['De-ashi shadow','CHANGE','Tai-otoshi entry','Reset'],note:'Trains immediate retrieval of a second attack family.'},
  {id:'c5',name:'Hubud interruption → base',domain:'FLOW → RECOVER',steps:['Hubud open-hand flow','BREAK','Frame / hands home','Reset base'],note:'Solo motor proxy; tactile Hubud qualities are absent.'},
  {id:'c6',name:'Combination → interruption',domain:'STRIKE → RECOVER',steps:['1—2—3—2','CHANGE','Stop cleanly','Pivot/reset'],note:'Tests inhibition and reorganization rather than maximal output.'},
  {id:'c7',name:'Shot abort → standing recovery',domain:'SHOT → RECOVER',steps:['Level change','Double-leg entry','ABORT','Immediate stable recovery'],note:'No knee drop or collision required.'},
  {id:'c8',name:'Control-position recall → release',domain:'CONTROL → RECOVER',steps:['RNC or Ezekiel hand path','POSITION ONLY','Release','Reorient'],note:'No compression. This is memory retrieval, not submission training.'}
];

export const fullSession = [
  {phase:'WAKE',label:'Shoulder rotations',seconds:45,instruction:'Smooth shoulder circles. No ballistic range.'},
  {phase:'WAKE',label:'Trunk + hip mobility',seconds:60,instruction:'Compact rotations and hip opening inside the lane.'},
  {phase:'WAKE',label:'Ankle + knee preparation',seconds:45,instruction:'Controlled range. Keep feet inside the mat.'},
  {phase:'WAKE',label:'Reverse-lunge mobility',seconds:90,instruction:'Alternating compact reverse lunges. Quiet feet.'},
  {phase:'BASE',label:'Compact fighting base',seconds:60,instruction:'Settle posture, guard and breathing.'},
  {phase:'BASE',label:'Micro forward / rear shifts',seconds:60,instruction:'Short stance-preserving adjustments.'},
  {phase:'BASE',label:'Micro pivots + level changes',seconds:60,instruction:'Small pivots, then controlled level changes.'},
  {phase:'WRESTLE',label:'Quiet step-back sprawl',seconds:60,instruction:'Step, do not jump. Recover silently.'},
  {phase:'WRESTLE',label:'Level-change entries',seconds:60,instruction:'Compact wrestling entries, no drive finish.'},
  {phase:'WRESTLE',label:'Sprawl → recover',seconds:60,instruction:'Alternate quiet sprawl pattern and stable recovery.'},
  {phase:'STRIKE',label:'Jab — Cross',seconds:75,instruction:'Clean mechanics, guard recovery, micro exit.'},
  {phase:'STRIKE',label:'Reset',seconds:15,instruction:'Breathe and reorganize.'},
  {phase:'STRIKE',label:'Jab — Jab — Cross',seconds:75,instruction:'Alter rhythm. Stay inside the lane.'},
  {phase:'STRIKE',label:'Reset',seconds:15,instruction:'Hands home. Quiet footwork.'},
  {phase:'STRIKE',label:'Jab — Cross — Hook',seconds:75,instruction:'Compact hook and clean rotational recovery.'},
  {phase:'STRIKE',label:'Reset',seconds:15,instruction:'Re-center.'},
  {phase:'STRIKE',label:'Jab — Cross — Hook — Cross',seconds:75,instruction:'Smooth sequence, no maximal-speed flailing.'},
  {phase:'STRIKE',label:'Reset',seconds:15,instruction:'Recover and breathe.'},
  {phase:'FLOW',label:'Hubud solo // right lead',seconds:90,instruction:'Open-hand solo proxy. Receive / redirect / check / return.'},
  {phase:'FLOW',label:'Hubud solo // left lead',seconds:90,instruction:'Mirror the pattern. Keep it compact.'},
  {phase:'FLOW',label:'Hubud // rhythm changes',seconds:60,instruction:'Vary cadence; recover immediately from sequence loss.'},
  {phase:'TAKEDOWN',label:'Maintenance pulse // 7 entries',seconds:240,instruction:'Cycle all seven takedown entries at low volume. No finishes.',dynamic:'maintenance'},
  {phase:'TAKEDOWN',label:'Focus A',seconds:210,instruction:'Deliberate mechanics. Alternate sides where technically familiar.',dynamic:'focusA'},
  {phase:'TAKEDOWN',label:'Focus B',seconds:210,instruction:'Deliberate mechanics. Precision before pace.',dynamic:'focusB'},
  {phase:'CONTROL',label:'Standing Ezekiel // position recall only',seconds:120,instruction:'Hand-position memory only. Never apply compression.'},
  {phase:'CONTROL',label:'Standing RNC // position recall only',seconds:120,instruction:'Hand-path memory only. Release/reset immediately.'},
  {phase:'CHAIN',label:'Cross-domain chain work',seconds:240,instruction:'Follow randomized chain prompts. Stop and reset cleanly on CHANGE.',dynamic:'chains'},
  {phase:'CHAIN',label:'Interrupt / recover work',seconds:240,instruction:'Prioritize inhibition and rapid reorganization over speed.',dynamic:'interrupt'},
  {phase:'PRESSURE',label:'Pressure recall',seconds:300,instruction:'Audio-led retrieval. Maintain safe, controlled movement.',dynamic:'pressure'},
  {phase:'DOWN',label:'Cobra + decompression',seconds:45,instruction:'Gentle cobra if comfortable, then neutral.'},
  {phase:'DOWN',label:'Recovery breathing',seconds:45,instruction:'Slow breathing. Let heart rate settle.'},
  {phase:'DOWN',label:'Session ledger',seconds:30,instruction:'Session complete. Rate recall quality and flag pain if present.',dynamic:'log'}
];

export const focusRotation = [
  ['osoto','double'],['uchimata','ouchi'],['taiotoshi','deashi'],['seoi','osoto']
];

export const pressureCategories = ['STRIKE','FLOW','THROW','SHOT','SPRAWL','RECOVER'];
export const noiseCues = ['BLUE','SEVEN','NORTH','HOLD DATA','ALPHA','STATIC','ZERO'];

export const glossary = [
  {term:'Base',domain:'HYBRID',definition:'A recoverable fighting posture from which striking, level changing, clinch-entry shadowing, defense and disengagement can all be initiated without a large preliminary adjustment.'},
  {term:'Kuzushi',domain:'JUDO',definition:'Disruption or management of balance. RENSA uses the term descriptively inside judo-derived entries; solo shadowing cannot reproduce an actual partner’s balance response.'},
  {term:'Tsukuri',domain:'JUDO',definition:'The fitting/entry phase used in classical analytical descriptions of throwing technique. In RENSA it is a useful technical lens, not a claim that live throws always unfold in clean isolated phases.'},
  {term:'Kake',domain:'JUDO',definition:'The execution/completion phase in classical throw analysis. Kake that would require throwing a body is not performed in the default apartment profile.'},
  {term:'Ashi-waza',domain:'JUDO',definition:'Foot/leg technique family. Several retained RENSA takedowns derive from this family, including o-soto-gari, o-uchi-gari, de-ashi-harai and uchi-mata.'},
  {term:'Te-waza',domain:'JUDO',definition:'Hand-technique family. Tai-otoshi, ippon-seoi-nage and morote-gari are represented in RENSA through non-impact solo entry patterns rather than completed throws.'},
  {term:'Level change',domain:'WRESTLING',definition:'Lowering the body level while preserving functional posture to create access to a lower line of attack or defense.'},
  {term:'Penetration pattern',domain:'WRESTLING',definition:'The entry movement associated with a shot. RENSA rehearses a compact, no-collision representation and stops before drive or finish mechanics.'},
  {term:'Sprawl',domain:'WRESTLING / MMA',definition:'A takedown-defense movement family that sends the hips/legs away from a shot. RENSA uses a quiet step-back proxy because jumping impact is incompatible with the apartment profile.'},
  {term:'Hubud-Lubud',domain:'FMA',definition:'A family of close-range partner flow/sensitivity drills found in Filipino martial arts. RENSA’s open-hand solo version preserves sequencing and bilateral coordination but not tactile sensitivity or partner pressure.'},
  {term:'Frame',domain:'GRAPPLING',definition:'Use of skeletal structure and limb positioning to manage space or connection. Solo RENSA can recall frame positions but cannot validate them against pressure.'},
  {term:'Chain',domain:'RENSA',definition:'Two or more callable movement representations linked so the end, interruption or failure of one immediately cues another.'},
  {term:'Reset',domain:'RENSA',definition:'Deliberate return to stable posture, guard and orientation before accepting the next cue.'},
  {term:'Inhibition',domain:'RENSA',definition:'The ability to stop an initiated or anticipated response when the cue changes. CHANGE and RESET prompts deliberately train this cognitive-motor function.'},
  {term:'Recall latency',domain:'RENSA',definition:'The delay between recognizing a valid cue and initiating the intended known movement. RENSA pressures access without assigning a false precision score to the delay.'},
  {term:'Representation',domain:'RENSA',definition:'The portion of a real skill that can honestly be rehearsed in the current environment: FULL, SHADOW, PROXY, REFERENCE or DISABLED.'}
];

export const curriculum = [
  {stage:'00',name:'Environment discipline',goal:'Know the footprint, stop conditions, no-impact rule and representation classes before training. The environment is a constraint, not something to “work around” with unsafe improvisation.'},
  {stage:'01',name:'Base + recovery',goal:'Compact stance, micro-footwork, level change, quiet step-back sprawl pattern and immediate reset become callable without reconstructing them.'},
  {stage:'02',name:'Striking vocabulary',goal:'Retrieve 1–2, 1–1–2, 1–2–3 and 1–2–3–2 with clean guard recovery, compact rotation and a stable end position.'},
  {stage:'03',name:'Bilateral flow',goal:'Maintain the open-hand Hubud solo sequence on either lead, alter rhythm, reverse/restart after interruption and recover cleanly when the sequence is lost.'},
  {stage:'04',name:'Takedown maintenance',goal:'Maintain all seven entry families every week while two rotating entries receive deliberate focus. Completion, partner timing and live balance remain outside solo claims.'},
  {stage:'05',name:'Control-position recall',goal:'Recall the gross standing Ezekiel and rear-naked-choke hand paths without applying neck compression. Position memory only.'},
  {stage:'06',name:'Cross-domain chaining',goal:'Move from striking, flow or level-change representations into another known node and then recover to base without freezing between domains.'},
  {stage:'07',name:'Pressure retrieval',goal:'Progress from named recall through laterality, interruption, chaining, compressed cue intervals, audio-only operation, category selection and noise-gating while keeping physical output controlled.'},
  {stage:'08',name:'Maintenance loop',goal:'Use the weekly ledger to identify hesitation and stale access. Future session emphasis changes retrieval exposure; no stage is treated as permanently “mastered.”'}
];
