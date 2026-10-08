import { describe, expect, it } from 'vitest';
import { runRules } from '@gigw/rules';
import type { AuditContext } from '@gigw/shared';

const context = (overrides: Partial<AuditContext['document']> = {}): AuditContext => ({
  url: 'https://example.gov.in', html: '', headers: {}, status: 200,
  document: { title: 'Example', lang: 'en', headings: [], images: [], links: [], controls: [], ids: [], iframes: [], videos: [], tables: [], landmarkCount: 1, metaDescription: true, viewport: true, canonical: false, favicon: false, pdfLinks: [], skipLink: true, ...overrides }
});
const status = async (input: AuditContext, id: string) => (await runRules(input)).find(result => result.ruleId === id)?.status;

describe('GIGW rule engine', () => {
  it('detects a missing document language', async () => expect(await status(context({ lang: null }), 'GIGW-A11Y-LANG')).toBe('FAIL'));
  it('rejects an invalid document language tag', async () => expect(await status(context({ lang: 'en_US' }), 'GIGW-A11Y-LANG')).toBe('FAIL'));
  it('accepts a valid BCP 47 document language tag', async () => expect(await status(context({ lang: 'en-IN' }), 'GIGW-A11Y-LANG')).toBe('PASS'));
  it('detects images without alternatives', async () => expect(await status(context({ images: [{ alt: null, ariaLabel: null, role: null, selector: 'img', html: '<img src="x">' }] }), 'GIGW-A11Y-IMG-ALT')).toBe('FAIL'));
  it('allows an explicit empty alt for a potentially decorative image', async () => expect(await status(context({ images: [{ alt: '', ariaLabel: null, role: null, selector: 'img', html: '<img alt="">' }] }), 'GIGW-A11Y-IMG-ALT')).toBe('PASS'));
  it('rejects a whitespace-only title', async () => expect(await status(context({ title: '   ' }), 'GIGW-QUALITY-TITLE')).toBe('FAIL'));
  it('keeps contextual requirements manual', async () => expect((await runRules(context())).filter(result => result.status === 'MANUAL')).toHaveLength(2));
});
