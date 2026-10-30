const assert = require('node:assert/strict');
const { validateProcedure, availableSteps } = require('../src/oem-procedures.js');
const sample = () => ({
  schemaVersion:'1.0.0', id:'synthetic-fixture', status:'draft',
  equipment:{make:'Fictitious',model:'Testbench',serialPrefix:null},
  source:{literatureId:null,revision:null,accessRights:'unverified'},
  operation:{steps:[
    {id:'guard',title:'Open fictional cover',predecessorIds:[]},
    {id:'access',title:'Access fictional assembly',predecessorIds:['guard']},
    {id:'fasteners',title:'Interact with fictional fasteners',predecessorIds:['access']}
  ]},gameplay:{eligible:false,relatedIncidentIds:[]}, review:{}
});
let p=sample();
assert.equal(validateProcedure(p).ok,true);
assert.deepEqual(availableSteps(p,[]).map(s=>s.id),['guard']);
assert.deepEqual(availableSteps(p,['guard']).map(s=>s.id),['access']);
assert.deepEqual(availableSteps(p,['guard','access']).map(s=>s.id),['fasteners']);
p.operation.steps[0].predecessorIds=['fasteners'];
assert(validateProcedure(p).errors.some(e=>e.startsWith('dependency-cycle')));
p=sample(); p.gameplay.eligible=true; assert(validateProcedure(p).errors.includes('unvalidated-gameplay'));
p=sample(); p.gameplay.relatedIncidentIds=['INC103']; assert(validateProcedure(p).errors.includes('fps-sap-mapping-pending'));
p=sample(); p.status='validated'; assert(validateProcedure(p).errors.includes('missing-literature-revision'));
p=sample(); p.operation.steps[1].predecessorIds=['nonexistent']; assert(validateProcedure(p).errors.some(e=>e.startsWith('unknown-predecessor')));

// D9 J3D00357 — documentary preflight: draft-only, no live OEM gameplay.
const fs = require('node:fs');
const pilot = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../data/oem/d9-j3d00357-equalizer-pads-draft.json'), 'utf8'));
const check = validateProcedure(pilot);
assert.equal(check.ok, true);
assert(check.warnings.includes('not-validated-for-oem-gameplay'));
assert.equal(pilot.gameplay.eligible, false);
assert.equal(pilot.gameplay.relatedIncidentIds.length, 0);
assert.equal(pilot.source.articleIdHeader, 'i08202810');
assert.equal(pilot.source.articleIdFooter, 'i05439085');
assert.deepEqual(availableSteps(pilot, []).map(s => s.id), ['external-bottom-guard']);
assert.deepEqual(availableSteps(pilot, ['external-bottom-guard']).map(s => s.id), ['select-lifting-tool']);
assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool']).map(s => s.id), []);
for (const kit of ['A','B']) {
  const selected = { 'lifting-tool': kit };
  assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool'], selected).map(s => s.id), ['release-left-pads']);
  assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool', 'release-left-pads'], selected).map(s => s.id), ['release-right-pads']);
}
assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool'], { 'lifting-tool': 'C' }), []);
assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool', 'release-left-pads', 'release-right-pads']).map(s => s.id), []);
assert.deepEqual(availableSteps(pilot, ['external-bottom-guard', 'select-lifting-tool', 'release-left-pads', 'release-right-pads'], { 'lifting-tool': 'A' }).map(s => s.id), ['pads-clearance-gate']);
const malformed = structuredClone(pilot);
malformed.operation.choiceGroups[0].options.push({ id: 'A', label: 'duplicated' });
assert(validateProcedure(malformed).errors.includes('invalid-choice-options:lifting-tool'));
const missingChoice = structuredClone(pilot);
missingChoice.operation.steps[2].requiresChoiceGroup = 'unknown-group';
assert(validateProcedure(missingChoice).errors.some(e=>e.startsWith('unknown-required-choice-group:')));

console.log('OEM preflight tests passed');
