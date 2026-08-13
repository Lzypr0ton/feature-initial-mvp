export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type AutomationStatus = 'AUTOMATED' | 'PARTIAL' | 'MANUAL';
export type ResultStatus = 'PASS' | 'FAIL' | 'WARNING' | 'MANUAL' | 'NOT_APPLICABLE' | 'ERROR';
export interface Evidence { url?: string; selector?: string; element?: string; message: string }
export interface RuleResult { ruleId: string; status: ResultStatus; severity: Severity; message: string; recommendation: string; evidence: Evidence[] }
export interface AuditRule { id:string; name:string; category:string; description:string; severity:Severity; automationStatus:AutomationStatus; sourceReference?:string; remediation:string; run(context: AuditContext): Promise<RuleResult> }
export interface AuditContext { url:string; html:string; document: ExtractedDocument; headers:Record<string,string>; status:number; }
export interface ExtractedDocument { title:string; lang:string|null; headings:{level:number;text:string;selector:string}[]; images:{alt:string|null;role:string|null;ariaLabel:string|null;selector:string;html:string}[]; links:{text:string;href:string;selector:string;html:string}[]; controls:{tag:string;type:string|null;name:string;labelled:boolean;selector:string;html:string}[]; ids:string[]; iframes:{title:string|null;selector:string;html:string}[]; videos:{hasCaptions:boolean;selector:string}[]; tables:{hasTh:boolean;hasCaption:boolean;selector:string}[]; landmarkCount:number; metaDescription:boolean; viewport:boolean; canonical:boolean; favicon:boolean; pdfLinks:string[]; skipLink:boolean; }
export interface ScanSummary { passed:number; failed:number; warnings:number; manual:number; errors:number; automatedPassRate:number|null }
export interface ScanResult { id:string; status:'queued'|'running'|'complete'|'error'; url:string; createdAt:string; completedAt?:string; summary?:ScanSummary; ruleResults?:RuleResult[]; axe?: unknown; limitations:string[]; error?:string }
