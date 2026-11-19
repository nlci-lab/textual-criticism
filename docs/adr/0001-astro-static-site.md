# Astro for a static, JS-optional site

We build with Astro (content collections validated by a Zod schema) and output plain static HTML. Eleventy was lighter, but schema validation of witness data would have had to be bolted on; with Astro a malformed witness file fails the build. Profiles must read with JavaScript off; JS is used only for search, the siglum keyboard and the image modal.

The base path is a build setting (`SITE_BASE`), never hard-coded, because the site starts at `nlci-lab.github.io/textual-criticism/` and is expected to move to its own domain later.
