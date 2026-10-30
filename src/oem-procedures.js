/* PORCARIA — OEM procedure preflight. Pure validation; no OEM instructions. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PorcariaOEMProcedure = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const isText = x => typeof x === 'string' && x.trim().length > 0;
  function validateProcedure(record, opts = {}) {
    const errors = [], warnings = [];
    if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: ['invalid-record'], warnings };
    if (record.schemaVersion !== '1.0.0') errors.push('unsupported-schema');
    if (!isText(record.id)) errors.push('missing-id');
    if (!['draft','review','validated'].includes(record.status)) errors.push('invalid-status');
    const equipment = record.equipment || {}, src = record.source || {}, op = record.operation || {}, review = record.review || {};
    if (!isText(equipment.make) || !isText(equipment.model)) errors.push('missing-equipment');
    if (!Array.isArray(op.steps)) errors.push('missing-steps');
    const steps = Array.isArray(op.steps) ? op.steps : [];
    const ids = new Set(), state = new Map(), byId = new Map();
    const choiceGroups = new Map();
    for (const group of (Array.isArray(op.choiceGroups) ? op.choiceGroups : [])) {
      if (!group || !isText(group.id) || choiceGroups.has(group.id)) {
        errors.push('invalid-choice-group'); continue;
      }
      const options = Array.isArray(group.options)
        ? group.options.map(option => typeof option === 'string' ? option : option && option.id)
        : [];
      if (group.mode !== 'exactly-one' || options.length < 2 || options.some(id => !isText(id)) || new Set(options).size !== options.length) {
        errors.push('invalid-choice-options:' + group.id);
      }
      choiceGroups.set(group.id, new Set(options));
    }
    for (const step of steps) {
      if (!step || !isText(step.id)) { errors.push('invalid-step-id'); continue; }
      if (ids.has(step.id)) errors.push('duplicate-step:' + step.id);
      ids.add(step.id); byId.set(step.id, step);
      if (!Array.isArray(step.predecessorIds)) errors.push('invalid-predecessors:' + step.id);
      if (step.choiceGroup && !choiceGroups.has(step.choiceGroup)) errors.push('unknown-choice-group:' + step.id);
      if (step.requiresChoiceGroup && !choiceGroups.has(step.requiresChoiceGroup)) errors.push('unknown-required-choice-group:' + step.id);
    }
    function visit(id) {
      if (state.get(id) === 1) { errors.push('dependency-cycle:' + id); return; }
      if (state.get(id) === 2) return;
      state.set(id, 1);
      const step = byId.get(id);
      if (step) for (const dep of (Array.isArray(step.predecessorIds) ? step.predecessorIds : [])) {
        if (!ids.has(dep)) errors.push('unknown-predecessor:' + id + ':' + dep);
        else visit(dep);
      }
      state.set(id, 2);
    }
    for (const id of ids) visit(id);
    if (record.status === 'validated') {
      if (!isText(equipment.serialPrefix) && !isText(equipment.serialRange)) errors.push('missing-serial-applicability');
      if (!isText(src.literatureId) || !isText(src.revision)) errors.push('missing-literature-revision');
      if (src.accessRights === 'unverified') errors.push('rights-unverified');
      if (!isText(review.engineeringValidatedBy) || !isText(review.validatedAt)) errors.push('missing-engineering-signoff');
      if (!Array.isArray(op.safetyRequirements) || !op.safetyRequirements.length) errors.push('missing-safety-requirements');
      if (!steps.length) errors.push('empty-procedure');
      if (steps.some(s => !isText(s.sourceReference))) errors.push('unreferenced-step');
    } else warnings.push('not-validated-for-oem-gameplay');
    if (record.gameplay && record.gameplay.eligible && record.status !== 'validated') errors.push('unvalidated-gameplay');
    if (record.gameplay && Array.isArray(record.gameplay.relatedIncidentIds) && record.gameplay.relatedIncidentIds.some(id => ['INC103','INC111','INC115','INC122'].includes(id))) errors.push('fps-sap-mapping-pending');
    if (opts.serial && record.status === 'validated' && equipment.serialRange && !isText(equipment.serialPrefix)) warnings.push('serial-range-requires-domain-review');
    return { ok: errors.length === 0, errors: [...new Set(errors)], warnings };
  }
  function availableSteps(record, completedIds, selections = {}) {
    const done = new Set(completedIds || []);
    const op = record && record.operation || {};
    const groups = new Map((Array.isArray(op.choiceGroups) ? op.choiceGroups : []).map(group => [
      group.id, new Set((Array.isArray(group.options) ? group.options : []).map(option => typeof option === 'string' ? option : option.id))
    ]));
    return (Array.isArray(op.steps) ? op.steps : [])
      .filter(step => !done.has(step.id)
        && Array.isArray(step.predecessorIds)
        && step.predecessorIds.every(id => done.has(id))
        && (!step.requiresChoiceGroup || (groups.has(step.requiresChoiceGroup)
            && groups.get(step.requiresChoiceGroup).has(selections && selections[step.requiresChoiceGroup]))));
  }
  return { validateProcedure, availableSteps };
});
