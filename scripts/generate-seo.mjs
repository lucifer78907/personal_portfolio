import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    ALL_PATHS,
    metaFor,
    SITE_URL,
    SITE_NAME,
    OG_IMAGE,
    TWITTER_CARD,
    PROFILES,
} from '../src/lib/seo.js';

/**
 * Post-build SEO pass.
 *
 * Runs after `vite build` and turns the single-page bundle into something
 * crawlers can actually read:
 *
 *   1. One HTML file per route, each with its own title, description, canonical
 *      and social card baked into the served markup.
 *   2. sitemap.xml covering every one of those routes.
 *   3. robots.txt pointing at it.
 *
 * Point 1 is the one that matters and the one a client-side <Seo> component
 * cannot do. Google executes JavaScript and will eventually index whatever
 * document.head ends up as — but Twitter, LinkedIn, Slack, WhatsApp and Discord
 * do not run scripts at all. They read the bytes the server sent. Without this
 * pass every link shared from this domain, whichever page it points to, previews
 * as the home page.
 *
 * src/lib/seo.js is the single source of truth for all of it: this script
 * imports the same module the running app does, so a route cannot appear in the
 * sitemap while missing a title, and the JSON-LD's profile links cannot drift
 * from the ones the app knows about.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

// Attribute-safe. Descriptions are prose written by hand and will eventually
// contain an apostrophe or an ampersand; unescaped, one of those silently
// truncates a meta tag and the page ships with half a description.
const esc = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    image: SITE_URL + OG_IMAGE,
    jobTitle: 'Software Engineer',
    email: 'mailto:thesinghrudra@gmail.com',
    description: metaFor('/').description,
    sameAs: PROFILES,
};

const headFor = (path) => {
    const { title, description, canonical, noindex } = metaFor(path);
    const image = SITE_URL + OG_IMAGE;

    return `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}" />
    <meta name="author" content="${esc(SITE_NAME)}" />

    <meta property="og:type" content="${path === '/' ? 'website' : 'article'}" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(image)}" />

    <meta name="twitter:card" content="${esc(TWITTER_CARD)}" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />

    <script type="application/ld+json">
${JSON.stringify(personSchema, null, 6)}
    </script>
    `;
};

// Firebase serves dist/about.html at /about with cleanUrls enabled, so the file
// name is the path with its leading slash dropped. Nested routes such as
// /skills/react become dist/skills/react.html, hence the mkdir.
const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

const run = async () => {
    const indexPath = join(DIST, 'index.html');
    let template;

    try {
        template = await readFile(indexPath, 'utf8');
    } catch {
        throw new Error(`dist/index.html not found — run \`vite build\` before this script.`);
    }

    const a = template.indexOf(START);
    const b = template.indexOf(END);
    if (a === -1 || b === -1) {
        throw new Error(
            `Could not find the ${START} / ${END} markers in dist/index.html. ` +
            `They live in the project's index.html and are what this script rewrites.`,
        );
    }

    const before = template.slice(0, a + START.length);
    const after = template.slice(b);

    for (const path of ALL_PATHS) {
        const file = join(DIST, fileFor(path));
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, before + headFor(path) + after, 'utf8');
    }

    // Build date, not per-page modification dates. Claiming a lastmod per URL
    // that is really just "whenever the site was deployed" is noise, but one
    // honest date across the sitemap is a useful hint.
    const today = new Date().toISOString().slice(0, 10);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ALL_PATHS.map(
        (p) => `  <url>
    <loc>${SITE_URL}${p === '/' ? '/' : p}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p === '/' ? '1.0' : p.startsWith('/skills/') ? '0.5' : '0.8'}</priority>
  </url>`,
    ).join('\n')}
</urlset>
`;

    await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');

    await writeFile(
        join(DIST, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
        'utf8',
    );

    console.log(`SEO: ${ALL_PATHS.length} pages, sitemap.xml and robots.txt written to dist/`);
};

run().catch((err) => {
    console.error(`\nSEO generation failed: ${err.message}\n`);
    process.exit(1);
});
