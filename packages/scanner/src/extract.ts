// Browser-side code must stay uncompiled: tsx/esbuild's `__name` helper only
// exists in Node, not in the page context used by Playwright.
export const extractionScript = `(() => {
  const q = s => Array.from(document.querySelectorAll(s));
  const path = e => {
    if (e.id) return '#' + CSS.escape(e.id);
    let p = e.tagName.toLowerCase(), n = 1, x = e;
    while ((x = x.previousElementSibling) && x.tagName === e.tagName) n++;
    return p + ':nth-of-type(' + n + ')';
  };
  const outer = e => e.outerHTML.slice(0, 700);
  const labelledByText = e => (e.getAttribute('aria-labelledby') || '').split(/\\s+/).map(id => document.getElementById(id)?.textContent?.trim() || '').filter(Boolean).join(' ');
  return {
    title: document.title, lang: document.documentElement.lang || null,
    headings: q('h1,h2,h3,h4,h5,h6').map(e => ({ level: +e.tagName[1], text: (e.textContent || '').trim(), selector: path(e) })),
    images: q('img').map(e => ({ alt: e.getAttribute('alt'), role: e.getAttribute('role'), ariaLabel: e.getAttribute('aria-label') || labelledByText(e) || null, selector: path(e), html: outer(e) })),
    links: q('a[href]').map(e => ({ text: (e.textContent || '').trim(), href: e.href, selector: path(e), html: outer(e) })),
    controls: q('input,select,textarea,button').map(e => { const id = e.id; return { tag: e.tagName.toLowerCase(), type: e.type || null, name: e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.textContent?.trim() || '', labelled: !!(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || (id && document.querySelector('label[for="' + CSS.escape(id) + '"]')) || e.closest('label')), selector: path(e), html: outer(e) }; }),
    ids: q('[id]').map(e => e.id), iframes: q('iframe').map(e => ({ title: e.getAttribute('title'), selector: path(e), html: outer(e) })),
    videos: q('video').map(e => ({ hasCaptions: !!e.querySelector('track[kind="captions"],track[kind="subtitles"]'), selector: path(e) })),
    tables: q('table').map(e => ({ hasTh: !!e.querySelector('th'), hasCaption: !!e.querySelector('caption'), selector: path(e) })),
    landmarkCount: q('main,nav,header,footer,aside,[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"]').length,
    metaDescription: !!document.querySelector('meta[name="description"]'), viewport: !!document.querySelector('meta[name="viewport"]'), canonical: !!document.querySelector('link[rel="canonical"]'), favicon: !!document.querySelector('link[rel~="icon"]'),
    pdfLinks: q('a[href$=".pdf" i]').map(e => e.href), skipLink: q('a[href^="#"]').some(e => /skip/i.test(e.textContent || '')),
  };
})()`;
