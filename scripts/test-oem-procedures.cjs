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
console.log('OEM preflight tests passed');
