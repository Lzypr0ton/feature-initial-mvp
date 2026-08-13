import type { AuditContext, AuditRule, RuleResult } from '@gigw/shared';
import { registry } from './rule-registry.js';
const result=(r:AuditRule,status:RuleResult['status'],message:string,evidence:RuleResult['evidence']=[]):RuleResult=>({ruleId:r.id,status,severity:r.severity,message,recommendation:r.remediation,evidence});
const basic=(id:string,test:(c:AuditContext)=>{ok:boolean;evidence?:RuleResult['evidence'];message:string}):AuditRule=>{const r=registry.find(x=>x.id===id)!;return {...r,async run(c){if(r.automationStatus==='MANUAL')return result(r,'MANUAL',r.description);const x=test(c);return result(r,x.ok?'PASS':'FAIL',x.message,x.evidence)}}};
export const rules:AuditRule[]=[
 basic('GIGW-A11Y-LANG',c=>({ok:!!c.document.lang,message:c.document.lang?'Document language is '+c.document.lang:'The html element has no lang attribute.',evidence:c.document.lang?[]:[{url:c.url,selector:'html',element:'<html>',message:'Missing lang attribute.'}]})),
 basic('GIGW-A11Y-IMG-ALT',c=>{const bad=c.document.images.filter(i=>i.alt===null&&!i.ariaLabel);return {ok:!bad.length,message:bad.length?`${bad.length} image(s) lack an alt attribute or accessible name.`:'All detected images expose an alt attribute or accessible name.',evidence:bad.map(i=>({url:c.url,selector:i.selector,element:i.html,message:'Image has no alt attribute or accessible name.'}))}}),
 basic('GIGW-QUALITY-TITLE',c=>({ok:!!c.document.title.trim(),message:c.document.title?'Document title is present.':'Document title is missing.',evidence:c.document.title?[]:[{url:c.url,selector:'title',element:'',message:'Missing or empty title.'}]})),
 {...registry.find(x=>x.id==='GIGW-MANUAL-ALT-MEANING')!,async run(){return result(this,'MANUAL',this.description)}},
 {...registry.find(x=>x.id==='GIGW-MANUAL-POLICIES')!,async run(){return result(this,'MANUAL',this.description)}}
];
export async function runRules(context:AuditContext){return Promise.all(rules.map(r=>r.run(context)));}
export { registry };
