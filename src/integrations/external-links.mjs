// Build-time pass: every link to another site opens in a new tab, safely
// (rel="noopener") and accessibly (screen readers hear "opens in a new tab").
// Base.astro carries a matching runtime script so `astro dev` behaves the same.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NOTE = ' (opens in a new tab)';

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const attrRe = (name) => new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
const attr = (tag, name) => {
  const m = tag.match(attrRe(name));
  return m ? (m[2] ?? m[3]) : null;
};
const setAttr = (tag, name, value) =>
  attrRe(name).test(tag)
    ? tag.replace(attrRe(name), ` ${name}="${value}"`)
    : tag.replace(/\s*>$/, ` ${name}="${value}">`);

export function isExternal(href, siteOrigin, base) {
  if (!/^https?:\/\//i.test(href)) return false; // relative, #anchor, mailto:, tel:
  try {
    const u = new URL(href);
    if (u.origin !== siteOrigin) return true;
    return !u.pathname.startsWith(base); // same host but outside our base path
  } catch {
    return false;
  }
}

export function rewrite(html, siteOrigin, base) {
  let n = 0;
  const out = html.replace(/(<a\b[^>]*>)([\s\S]*?)(<\/a>)/gi, (all, open, inner, close) => {
    const href = attr(open, 'href');
    if (!href || !isExternal(href, siteOrigin, base)) return all;
    n++;
    let tag = open;
    if (!attr(tag, 'target')) tag = setAttr(tag, 'target', '_blank');
    const rel = (attr(tag, 'rel') || '').split(/\s+/).filter(Boolean);
    if (!rel.includes('noopener')) rel.push('noopener');
    tag = setAttr(tag, 'rel', rel.join(' '));
    const label = attr(tag, 'aria-label');
    if (label !== null) {
      if (!/new tab/i.test(label)) tag = setAttr(tag, 'aria-label', label + NOTE);
    } else if (!/new tab/i.test(inner)) {
      inner += `<span class="visually-hidden">${NOTE}</span>`;
    }
    return tag + inner + close;
  });
  return { out, n };
}

export default function externalLinks() {
  let siteOrigin = '';
  let base = '/';
  return {
    name: 'external-links',
    hooks: {
      'astro:config:done': ({ config }) => {
        siteOrigin = config.site ? new URL(config.site).origin : '';
        base = config.base || '/';
      },
      'astro:build:done': async ({ dir, logger }) => {
        let total = 0;
        for await (const f of htmlFiles(fileURLToPath(dir))) {
          const src = await readFile(f, 'utf8');
          const { out, n } = rewrite(src, siteOrigin, base);
          total += n;
          if (out !== src) await writeFile(f, out);
        }
        logger.info(`external links processed: ${total}`);
      },
    },
  };
}
