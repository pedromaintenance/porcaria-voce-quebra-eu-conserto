/* P.O.R.C.A.R.I.A. — Ciclo 39: assistência manual ao reparo; regras puras de domínio. */
(function(root,factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.PORCARIA_REPAIR_ASSIST=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 // Piloto restrito a casos de pino de esteira com catálogo auditado. Nada de liberar em toda OS.
 const SCENARIOS=Object.freeze({hammer:Object.freeze(['INC023','INC040'])});
 const MAX_HELP_MULTIPLIER=1.40;
 const GRADES=Object.freeze({
  0:Object.freeze({speed:0,fatigue:0,label:'SEM BÔNUS'}),
  1:Object.freeze({speed:0.04,fatigue:0.01,label:'EXECUÇÃO PARCIAL'}),
  2:Object.freeze({speed:0.08,fatigue:0.025,label:'BOA EXECUÇÃO'}),
  3:Object.freeze({speed:0.12,fatigue:0.04,label:'EXECUÇÃO PRECISA'})
 });
 function availability(s,d,E,id,kind='hammer'){
  const j=E.job(s,id);
  if(!j)return {supported:false,available:false,reason:'OS não encontrada.'};
  if(!SCENARIOS[kind]?.includes(j.scene))return {supported:false,available:false,reason:'Atividade incompatível com o escopo da OS.'};
  const c=E.scenario(d,j.scene);
  if(!c||!E.sapEligible(d,c))return {supported:true,available:false,reason:'Classificação SAP pendente.'};
  if(j.stage<6)return {supported:true,available:false,reason:'Conclua o diagnóstico da OS.'};
  if(!j.assigned||j.bay===null)return {supported:true,available:false,reason:'Aloque um mecânico e um box.'};
  const m=E.employee(s,j.assigned);
  if(!m||m.assigned!==j.id)return {supported:true,available:false,reason:'Alocação de mecânico inválida.'};
  if(E.physicalBlock(s,m))return {supported:true,available:false,reason:'Mecânico indisponível para trabalho físico.'};
  if(j.repairRemaining<=0||j.status==='concluida')return {supported:true,available:false,reason:'Reparo já concluído.'};
  if(!s.tools[c.tool])return {supported:true,available:false,reason:'Ferramenta do serviço indisponível.'};
  if(!j.materialUsed&&!(s.stock[c.material]>0))return {supported:true,available:false,reason:'Material do serviço indisponível.'};
  if(s.repairAssistTurn?.tick===s.tick)return {supported:true,available:false,reason:'Assistência manual já utilizada neste turno.'};
  if(j.repairAssist?.tick===s.tick)return {supported:true,available:false,reason:'Esta OS já recebeu uma tentativa no turno.'};
  return {supported:true,available:true,reason:''};
 }
 function start(s,d,E,id,kind='hammer'){
  const a=availability(s,d,E,id,kind);
  if(!a.available)return {error:a.reason};
  const j=E.job(s,id);
  const session={tick:s.tick,kind,mechanicId:j.assigned,status:'started',score:0,speed:0,fatigue:0};
  j.repairAssist=session;
  s.repairAssistTurn={tick:s.tick,orderId:id,kind};
  E.recordDecision(s,'repair_assist_start',{orderId:id,kind,mechanicId:j.assigned,classification:'assistencia_reparo_iniciada'});
  return {ok:true,session};
 }
 function finish(s,E,id,hits){
  const j=E.job(s,id),a=j?.repairAssist;
  if(!a||a.tick!==s.tick||a.status!=='started'||s.repairAssistTurn?.orderId!==id)
   return {error:'Tentativa inexistente, encerrada ou de outro turno.'};
  if(!Number.isInteger(hits)||hits<0||hits>3)return {error:'Resultado inválido.'};
  const grade=GRADES[hits];
  a.status=hits?'ready':'no_bonus';
  a.score=hits;a.speed=grade.speed;a.fatigue=grade.fatigue;
  E.recordDecision(s,'repair_assist_result',{orderId:id,kind:a.kind,score:hits,
   speed:grade.speed,fatigue:grade.fatigue,classification:'resultado_assistencia_mecanica'});
  return {ok:true,grade,session:a};
 }
 function bonus(j,tick,mechanicId){
  const a=j?.repairAssist;
  if(!a||a.status!=='ready'||a.tick!==tick||a.mechanicId!==mechanicId)return null;
  if(!SCENARIOS[a.kind]?.includes(j.scene))return null;
  // A bonificação nunca se aplica sobre save editado com valores fora do contrato.
  const grade=GRADES[a.score];
  if(!grade||!a.score)return null;
  return grade;
 }
 function applied(s,E,j,workedHH){
  if(!Number.isFinite(workedHH)||workedHH<=0)return;
  const a=j.repairAssist;
  if(!a||a.status!=='ready'||a.tick!==s.tick)return;
  a.status='consumed';a.workedHH=workedHH;
  E.recordDecision(s,'repair_assist_applied',{orderId:j.id,mechanicId:a.mechanicId,kind:a.kind,
   score:a.score,workedHH,classification:'bonus_consumido_no_turno'});
 }
 return Object.freeze({SCENARIOS,GRADES,MAX_HELP_MULTIPLIER,availability,start,finish,bonus,applied});
});
