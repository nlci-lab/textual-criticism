// Base path is a build setting (ADR 0001). GitHub Pages: SITE_BASE=/textual-criticism/
import { defineConfig } from 'astro/config';
import externalLinks from './src/integrations/external-links.mjs';

const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL ?? 'https://nlci-lab.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [externalLinks()],
  i18n: { locales: ['en'], defaultLocale: 'en' },
});
