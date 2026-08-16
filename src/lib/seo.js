// Extension included deliberately: Vite resolves it either way, but the build
// script in scripts/ imports this file through plain Node ESM, which does not.
import { SKILLS, skillBySlug } from "./skills.js";

/**
 * Every page's identity, in one place.
 *
 * The app reads this at runtime to retitle the document on navigation, and
 * scripts/generate-sitemap.mjs reads the same route list to build sitemap.xml —
 * so a page cannot exist in the sitemap and be missing a title, or vice versa.
 */

// The canonical origin. Every absolute URL on the site is built from this, so
// moving domains is a one-line change. No trailing slash.
export const SITE_URL = "https://thesinghrudra.com";

export const SITE_NAME = "Rudra Pratap Singh";

/**
 * The share image. 1731×909 — a 1.904:1 aspect, which is what the wide card
 * format expects (1200×630 is 1.905:1), so no platform crops it.
 *
 * Absolute URLs only, built from SITE_URL below: every scraper fetches this
 * without a page to resolve a relative path against, and a bare "/og-image.png"
 * silently yields no preview at all.
 */
export const OG_IMAGE = "/og-image.png";
export const TWITTER_CARD = "summary_large_image";

// Used for the Person schema's sameAs, which is what ties this domain to the
// profiles Google already knows about. Kept here rather than in Contact.jsx so
// the structured data and the visible links cannot drift apart.
//
// Only confirmed profiles belong here. A sameAs pointing at an account that
// isn't yours — or isn't there — is a worse signal than a shorter list, because
// it is a claim Google can check and find wrong.
//
// Note this is separate from the twitter:card tags, which stay regardless: those
// describe how X should render the link when somebody else shares it, and need
// no account of your own.
export const PROFILES = [
  "https://github.com/lucifer78907",
  "https://www.linkedin.com/in/thesinghrudra/",
];

const DEFAULT = {
  title: "Rudra Pratap Singh — Software Engineer",
  description:
    "Software engineer building fintech that moves money, AI products that do real work, and the agentic workflows running quietly underneath them.",
};

/**
 * Static routes.
 *
 * Titles lead with what the page is and end with the name, because a portfolio
 * realistically ranks for "Rudra Pratap Singh" and essentially never for
 * "creative developer" — so the name is the part that has to survive Google
 * truncating the tail.
 */
export const ROUTES = {
  "/": {
    title: "Rudra Pratap Singh — Software Engineer",
    description: DEFAULT.description,
  },
  "/about": {
    title: "About — Rudra Pratap Singh",
    description:
      "Software engineer since 2024. Fintech at Initializ, platform work on agentic AI, and a revamp that moved SEO performance 40%. The long version, with the credits.",
  },
  "/projects": {
    title: "Work — Rudra Pratap Singh",
    description:
      "Selected projects: LoanNetwork, the Initializ Console, Offingo, and other things built with React, Next.js and Node.",
  },
  "/random-photos": {
    title: "Gallery — Rudra Pratap Singh",
    description:
      "Photographs taken away from the keyboard. Travel, light, and whatever was in front of the lens.",
  },
  "/contact": {
    title: "Contact — Rudra Pratap Singh",
    description:
      "Get in touch about engineering work, collaborations, or anything else. Email, GitHub, LinkedIn and Twitter.",
  },
};

/** Every indexable path on the site, static and generated. */
export const ALL_PATHS = [
  ...Object.keys(ROUTES),
  ...SKILLS.map((s) => `/skills/${s.slug}`),
];

/**
 * Resolve a pathname to its metadata.
 *
 * Skill pages are built from the same record the card and the detail page use,
 * so the description a searcher reads is the description on the page.
 */
export const metaFor = (pathname) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (ROUTES[path]) return { ...ROUTES[path], canonical: SITE_URL + path };

  const skillMatch = path.match(/^\/skills\/([\w-]+)$/);
  if (skillMatch) {
    const skill = skillBySlug(skillMatch[1]);
    if (skill) {
      return {
        title: `${skill.label} — Rudra Pratap Singh`,
        description: `${skill.blurb} ${skill.body}`.slice(0, 300),
        canonical: `${SITE_URL}/skills/${skill.slug}`,
      };
    }
  }

  // Unknown path: still give it a title, but keep it out of the index rather
  // than letting a typo'd URL get crawled as a thin duplicate of the home page.
  return { ...DEFAULT, canonical: SITE_URL + path, noindex: true };
};
