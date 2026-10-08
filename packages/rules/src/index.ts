import type { AuditContext, AuditRule, RuleResult } from '@gigw/shared';
import { registry } from './rule-registry.js';

const result = (rule: AuditRule, status: RuleResult['status'], message: string, evidence: RuleResult['evidence'] = []): RuleResult => ({ ruleId: rule.id, status, severity: rule.severity, message, recommendation: rule.remediation, evidence });
const rule = (id: string) => registry.find(entry => entry.id === id)!;
const isValidLanguageTag = (lang: string | null): boolean => {
  if (!lang?.trim()) return false;
  try { Intl.getCanonicalLocales(lang); return true; } catch { return false; }
};
const basic = (id: string, test: (context: AuditContext) => { ok: boolean; message: string; evidence?: RuleResult['evidence'] }): AuditRule => {
  const definition = rule(id);
  return { ...definition, async run(context) {
    const outcome = test(context);
    return result(this, outcome.ok ? 'PASS' : 'FAIL', outcome.message, outcome.evidence);
  } };
};

export const rules: AuditRule[] = [
  basic('GIGW-A11Y-LANG', context => {
    const lang = context.document.lang;
    const ok = isValidLanguageTag(lang);
    return { ok, message: ok ? `Document language is ${lang}.` : lang ? `Document language "${lang}" is not a valid language tag.` : 'The html element has no lang attribute.', evidence: ok ? [] : [{ url: context.url, selector: 'html', element: '<html>', message: lang ? 'Invalid lang attribute.' : 'Missing lang attribute.' }] };
  }),
  basic('GIGW-A11Y-IMG-ALT', context => {
    // Empty alt is permitted for decorative images. Whether that classification
    // is correct is intentionally retained as a manual GIGW requirement.
    const bad = context.document.images.filter(image => image.alt === null && !image.ariaLabel?.trim());
    return { ok: !bad.length, message: bad.length ? `${bad.length} image(s) lack an alt attribute or accessible name.` : 'All detected images expose an alt attribute or accessible name.', evidence: bad.map(image => ({ url: context.url, selector: image.selector, element: image.html, message: 'Image has no alt attribute or accessible name.' })) };
  }),
  basic('GIGW-QUALITY-TITLE', context => {
    const ok = Boolean(context.document.title.trim());
    return { ok, message: ok ? 'Document title is present.' : 'Document title is missing or empty.', evidence: ok ? [] : [{ url: context.url, selector: 'title', element: '', message: 'Missing or empty title.' }] };
  }),
  { ...rule('GIGW-MANUAL-ALT-MEANING'), async run() { return result(this, 'MANUAL', this.description); } },
  { ...rule('GIGW-MANUAL-POLICIES'), async run() { return result(this, 'MANUAL', this.description); } }
];

export async function runRules(context: AuditContext) { return Promise.all(rules.map(current => current.run(context))); }
export { registry };
