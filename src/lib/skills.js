import { FaReact, FaAws, FaNodeJs, FaLinux, FaGitAlt, FaMobileAlt, FaDocker } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs, SiPostgresql, SiTailwindcss, SiGraphql } from 'react-icons/si';
import { HiSparkles } from 'react-icons/hi2';

/**
 * The stack, and what each entry is actually for.
 *
 * One list, consumed by both the homepage board and the /skills/:slug detail
 * page — so a card and the page it opens can never disagree about a name, an
 * icon or a claim.
 *
 * `where` is drawn from the credits on /about rather than written fresh. That
 * page is the authoritative record of where Rudra has worked and on what, and
 * a portfolio that states one thing on one route and something else on another
 * is worse than one that says less.
 *
 * Deliberately no years-of-experience figure anywhere. It would be the one
 * number here that nothing else on the site can corroborate, and inventing it
 * is how a portfolio ends up making a claim its author has to defend.
 */
export const SKILLS = [
    {
        slug: 'react',
        label: 'React',
        group: 'Frontend',
        Icon: FaReact,
        blurb: 'The default. Most things here started as a component.',
        body: 'The bulk of what I ship is React, and most of what I have learned the hard way is about keeping it boring at scale — where state actually belongs, which renders are load-bearing, and how a component tree survives a team rather than an afternoon.',
        where: [
            'Console and Assistant front-ends at Initializ',
            'LogAnalyzer for GreyOrange — complete front-end',
            'Offingo platform revamp at Anmol India',
            'Mentoring juniors on scalable React patterns',
        ],
    },
    {
        slug: 'nextjs',
        label: 'Next.js',
        group: 'Frontend',
        Icon: SiNextdotjs,
        blurb: 'When the pages have to be found, not just rendered.',
        body: 'Reached for when rendering strategy matters — when a page has to exist for a crawler before it exists for a bundler. Routing, server rendering and the caching decisions that come with them.',
        where: [
            'Offingo revamp — React and Next.js, SEO performance up 40%',
        ],
    },
    {
        slug: 'typescript',
        label: 'TypeScript',
        group: 'Languages',
        Icon: SiTypescript,
        blurb: 'The compiler arguing with me, and usually winning.',
        body: 'Types as design pressure rather than decoration. Most of the value shows up at the seams — API boundaries, shared contracts, the places where a refactor would otherwise be a guess.',
        where: [
            'Production front-ends and services at Initializ',
        ],
    },
    {
        slug: 'nodejs',
        label: 'Node.js',
        group: 'Backend',
        Icon: FaNodeJs,
        blurb: 'The other half of every project on this site.',
        body: 'Services, integrations and the unglamorous middle layer — the code that talks to a bureau, a payment rail or a queue and has to be right the first time because a retry costs someone money.',
        where: [
            'Experian/CIBIL bureau workflows at Initializ',
            'WhatsApp Business ↔ Admin Portal integration, saving 20+ hours a week',
            'Backend API efficiency improved 20% at Anmol India',
        ],
    },
    {
        slug: 'express',
        label: 'Express',
        group: 'Backend',
        Icon: SiExpress,
        blurb: 'Unfashionable, entirely fine, still everywhere.',
        body: 'The default shape for REST services here. Small, legible, and old enough that nothing about it is a surprise at three in the morning.',
        where: ['REST services backing the platforms above'],
    },
    {
        slug: 'graphql',
        label: 'GraphQL',
        group: 'Backend',
        Icon: SiGraphql,
        blurb: 'For when REST needed too many round trips.',
        body: 'Used where a client genuinely needs to shape its own payload — dashboards pulling from several sources at once, rather than as a default for every endpoint.',
        where: ['Data-heavy dashboard surfaces at Initializ'],
    },
    {
        slug: 'mongodb',
        label: 'MongoDB',
        group: 'Data',
        Icon: SiMongodb,
        blurb: 'Schemaless until, inevitably, it is not.',
        body: 'Document storage for the parts of a product still deciding what they are. The interesting work is usually the indexes and the shape of the aggregation, not the writes.',
        where: ['Application data across platform work at Initializ'],
    },
    {
        slug: 'postgresql',
        label: 'PostgreSQL',
        group: 'Data',
        Icon: SiPostgresql,
        blurb: 'Where the data has to actually be correct.',
        body: 'The choice whenever relationships and constraints matter more than flexibility — which, for anything touching money, is always.',
        where: ['Relational data behind fintech workflows'],
    },
    {
        slug: 'aws',
        label: 'AWS',
        group: 'Cloud',
        Icon: FaAws,
        blurb: 'Amplify, EC2, S3, CloudFront. And the bill.',
        body: 'Deployment, delivery and the security work that follows it — including remediating VAPT findings, which is the part of cloud work nobody puts in a portfolio.',
        where: [
            'AWS Amplify deployments and VAPT remediation at Initializ',
            'EC2, S3 and CloudFront for delivery',
        ],
    },
    {
        slug: 'docker',
        label: 'Docker',
        group: 'Cloud',
        Icon: FaDocker,
        blurb: 'It works on my machine, and now on yours.',
        body: 'Reproducible environments, mostly so that the gap between local and production stops being a source of mystery.',
        where: ['Containerised services and local parity across projects'],
    },
    {
        slug: 'react-native',
        label: 'React Native',
        group: 'Frontend',
        Icon: FaMobileAlt,
        blurb: 'Same mental model, entirely different bugs.',
        body: 'Mobile surfaces with Expo, sharing the reasoning of the web work while conceding that layout, gestures and release cycles are their own discipline.',
        where: ['Mobile surfaces built with React Native and Expo'],
    },
    {
        slug: 'tailwind',
        label: 'Tailwind',
        group: 'Frontend',
        Icon: SiTailwindcss,
        blurb: 'Long class names, short stylesheets.',
        body: 'Styling that stays next to the markup it describes. The trade is verbosity for never again hunting an override three files away — including on this site.',
        where: ['This portfolio', 'Product front-ends at Initializ'],
    },
    {
        slug: 'gen-ai',
        label: 'Gen AI',
        group: 'AI',
        Icon: HiSparkles,
        blurb: 'Agentic workflows, RAG, and a lot of prompt archaeology.',
        body: 'Building the platform layer underneath LLM products rather than the models themselves — agentic workflows, retrieval, and the tooling that makes either of them debuggable.',
        where: [
            'Agentic Workflow platform for Console and Assistant at Initializ',
            'Promethia data graph, renewals and settings',
        ],
    },
    {
        slug: 'git',
        label: 'Git',
        group: 'Tools',
        Icon: FaGitAlt,
        blurb: 'Mostly fine. Occasionally a reflog rescue.',
        body: 'History as a tool rather than a formality — bisect, reflog, and commits written so the next person can follow the reasoning.',
        where: ['Every project listed here'],
    },
    {
        slug: 'linux',
        label: 'Linux',
        group: 'Tools',
        Icon: FaLinux,
        blurb: 'Where the servers live and the logs hide.',
        body: 'Comfortable in a shell — the environment most of this runs on once it stops being local.',
        where: ['Deployment targets and CI environments'],
    },
];

export const skillBySlug = (slug) => SKILLS.find((s) => s.slug === slug);
