import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { metaFor, SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_CARD } from '../lib/seo';

/**
 * Keeps the document head in step with the route.
 *
 * Mounted once in RootLayout rather than per page, because every route's
 * metadata already lives in lib/seo.js — a <Seo> in each page would be fifteen
 * places for that to fall out of date.
 *
 * Renders nothing. This is a side effect on document.head, deliberately: React
 * 18 has no native support for hoisting metadata out of the tree (that arrives
 * in 19), and react-helmet-async would be a dependency for something this small.
 *
 * WORTH KNOWING: this covers Google, which executes JavaScript and will index
 * the title and description it finds after render. It does NOT cover social
 * crawlers — Twitter, LinkedIn, Slack, WhatsApp, Discord all read the raw HTML
 * and never run scripts, so every shared link previews with whatever is baked
 * into index.html. Fixing that needs per-route HTML generated at build time; see
 * the note in scripts/generate-sitemap.mjs.
 */

const upsert = (selector, create) => {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    return el;
};

const setMeta = (attr, key, content) => {
    const el = upsert(`meta[${attr}="${key}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute(attr, key);
        return m;
    });
    el.setAttribute('content', content);
};

const Seo = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        const { title, description, canonical, noindex } = metaFor(pathname);
        const image = SITE_URL + OG_IMAGE;

        document.title = title;

        setMeta('name', 'description', description);
        // follow, not none: a page can be worth crawling through even when it
        // is not worth indexing.
        setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:url', canonical);
        setMeta('property', 'og:site_name', SITE_NAME);
        setMeta('property', 'og:type', pathname === '/' ? 'website' : 'article');
        setMeta('property', 'og:image', image);

        setMeta('name', 'twitter:card', TWITTER_CARD);
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', image);

        upsert('link[rel="canonical"]', () => {
            const l = document.createElement('link');
            l.setAttribute('rel', 'canonical');
            return l;
        }).setAttribute('href', canonical);
    }, [pathname]);

    return null;
};

export default Seo;
