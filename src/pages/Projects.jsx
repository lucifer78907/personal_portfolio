import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { DiMongodb } from 'react-icons/di';
import { FaAws, FaCss3, FaDocker, FaExternalLinkAlt, FaGithub, FaHtml5, FaMobileAlt, FaNode, FaReact, FaSass, FaBrain, FaRobot } from 'react-icons/fa';
import { IoLogoFirebase } from 'react-icons/io5';
import { RiGitRepositoryPrivateFill, RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri';
import { SiExpress, SiGreensock, SiJavascript, SiNetlify, SiReactrouter, SiSwiper, SiTypescript, SiOpenai, SiKubernetes, SiPostgresql } from 'react-icons/si';
import { HiSparkles } from 'react-icons/hi2';
import { TbPlugConnected } from 'react-icons/tb';

/*
  Projects page — v2.
  Data is preserved verbatim from v1 (id 0..7). No copy edits, no ordering
  changes, no icon changes. The overhaul is presentation only.

  Composition:
  - Featured plate: current work (Initializ.ai Console) gets a full-viewport
    editorial opener — display headline, generous whitespace, one CTA.
  - Gallery: the shipped middle tier flows through a horizontal-pan track,
    pinned on desktop, native vertical stack on mobile / reduced-motion.
    Varied tile widths give the track bento rhythm instead of 8 identical
    rectangles.
  - Archive: earliest static-site work drops to a compact index — same data,
    less weight.

  Motion budget matches the rest of the site (ScrollSmoother + heavy GSAP).
  The purple-accent AI card treatment from v1 is intentionally dropped: the
  brand palette is amber. Emphasis is created via composition (scale, position,
  isolation of the featured plate) rather than palette breaks.
*/

const projects = [
    {
        id: 0,
        title: 'Initializ.ai Console',
        description: 'Building enterprise GenAI platform dashboards with agentic workflows, knowledge bases, and RAG systems. Full-stack unified platform for AI application deployment with GPU optimization and serverless inferencing',
        liveLink: 'https://www.initializ.ai/',
        techStackIcons: [FaBrain, SiOpenai, HiSparkles, FaDocker, SiPostgresql, RiNextjsFill],
        isAI: true
    },
    {
        id: 1,
        title: 'LoanNetwork',
        description: 'AI-powered fintech loan marketplace connecting borrowers with top banks. Building responsive web app (Next.js) and mobile app (React Native) for instant loan comparison and digital processing',
        liveLink: 'https://loannetwork.app/',
        techStackIcons: [RiNextjsFill, FaMobileAlt, SiTypescript, RiTailwindCssFill, FaReact, SiOpenai, FaAws],
    },
    {
        id: 2,
        title: 'Offingo',
        description: 'Offingo is revolutionary tech product for offline retail fashion market to increase store footfall and multiply sales by 2x',
        techStackIcons: [RiNextjsFill, RiTailwindCssFill, SiTypescript, FaAws, FaDocker, SiSwiper]
    },
    {
        id: 3,
        title: 'Zentask',
        description: 'Zentask is a goal tracking app which looks aestheically pleasing on the frontend while being feasiable and fast from the backend',
        githubLink: 'https://github.com/lucifer78907/ZenTask',
        liveLink: 'https://zentask-dd7c9.web.app/login',
        techStackIcons: [FaReact, FaSass, SiExpress, DiMongodb, SiGreensock, IoLogoFirebase]
    },
    {
        id: 4,
        title: 'TrackIt',
        description: 'An application for University for tracking its buses and mointering them in real time. It is a frontend project ',
        githubLink: 'https://github.com/lucifer78907/TrackIt/tree/main/frontend',
        techStackIcons: [FaReact, FaSass, SiGreensock, SiReactrouter]
    },
    {
        id: 5,
        title: 'Lawyer firm website',
        description: 'This is a website for a law firm Karan Chauhary and associates',
        githubLink: 'https://github.com/lucifer78907/Karan_Chaudhary_and_associates_website',
        liveLink: 'https://advkaranchaudhary.netlify.app/',
        techStackIcons: [FaHtml5, FaSass, SiJavascript, SiNetlify]
    },
    {
        id: 6,
        title: 'Iron Temple Gym',
        description: 'A simple landing page for a gym , made using HTML and vanilla CSS and JS ',
        githubLink: 'https://github.com/lucifer78907/Gym_landing_page',
        liveLink: 'https://irontemplegym.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },
    {
        id: 7,
        title: 'Omnifood restaurant',
        description: 'A landing page made for a fictional restaurant using HTML,CSS and JS ',
        liveLink: 'https://omnifood-rudra-website.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },
];

// Split by tier so composition can vary. Data is unchanged.
const featured = projects.find((p) => p.isAI);
const gallery = projects.filter((p) => !p.isAI && p.id < 6);
const archive = projects.filter((p) => p.id >= 6);

function Projects() {
    const rootRef = useRef(null);
    const panWrapRef = useRef(null);
    const panTrackRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger, SplitText);

    useGSAP(() => {
        // ---- FEATURED PLATE ------------------------------------------------
        gsap.set(['.featured-eyebrow', '.featured-title', '.featured-copy', '.featured-cta', '.featured-stack', '.featured-meta'], {
            visibility: 'visible',
        });

        const featuredSplit = SplitText.create('.featured-title', { type: 'chars,words', mask: 'chars' });

        gsap.from('.featured-eyebrow', {
            yPercent: 40,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.featured-plate', start: 'top 85%', toggleActions: 'play none none reverse' },
        });

        gsap.from(featuredSplit.chars, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.featured-plate', start: 'top 80%', toggleActions: 'play none none reverse' },
        });

        gsap.from(['.featured-copy', '.featured-cta', '.featured-stack', '.featured-meta'], {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.featured-plate', start: 'top 70%', toggleActions: 'play none none reverse' },
        });

        // ---- HORIZONTAL GALLERY (pin + pan) --------------------------------
        // matchMedia scopes the hijack to desktop + prefers-reduced-motion off.
        // GSAP tears the ScrollTrigger down on breakpoint change automatically.
        const mm = gsap.matchMedia();

        mm.add(
            {
                isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
                isReduced: '(prefers-reduced-motion: reduce), (max-width: 767px)',
            },
            (ctx) => {
                const { isDesktop } = ctx.conditions;
                if (!isDesktop) return; // small screens / reduced-motion get CSS-only vertical flow

                const track = panTrackRef.current;
                const wrap = panWrapRef.current;
                if (!track || !wrap) return;

                const getDistance = () => track.scrollWidth - window.innerWidth;

                // ease: 'none' is REQUIRED so containerAnimation math stays 1:1
                // with scroll position. Any other ease breaks the per-tile
                // reveals below.
                const pan = gsap.to(track, {
                    x: () => -getDistance(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrap,
                        start: 'top top',
                        end: () => `+=${getDistance()}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });

                // Per-tile reveal driven by horizontal pan progress.
                gsap.utils.toArray('.gallery-tile').forEach((tile) => {
                    gsap.from(tile, {
                        y: 40,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: tile,
                            containerAnimation: pan,
                            start: 'left 85%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                });
            }
        );

        // ---- ARCHIVE INDEX -------------------------------------------------
        gsap.from('.archive-row', {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.archive-index', start: 'top 85%', toggleActions: 'play none none reverse' },
        });

        // Fonts + images can shift layout post-mount; re-measure once.
        const refreshT = setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => clearTimeout(refreshT);
    }, { scope: rootRef });

    return (
        <section ref={rootRef} className="relative">
            {/* =============================================================
                 FEATURED PLATE — full-viewport opener.
             ============================================================= */}
            <div className="featured-plate min-h-[100dvh] flex items-center px-6 sm:px-10 lg:px-20 2xl:px-32 py-24">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                    <div className="lg:col-span-8">
                        <p className="featured-eyebrow invisible font-lexend text-xs sm:text-sm tracking-[0.28em] uppercase text-amber-700/70 mb-6">
                            Currently building
                        </p>
                        <h1 className="featured-title invisible font-lexend text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tighter leading-[0.95] text-amber-950 overflow-hidden pb-2">
                            {featured.title}
                        </h1>
                        <p className="featured-copy invisible mt-8 font-lexend text-base sm:text-lg lg:text-xl leading-relaxed text-amber-950/75 max-w-[62ch]">
                            {featured.description}
                        </p>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="featured-stack invisible">
                            <p className="font-lexend text-xs tracking-[0.24em] uppercase text-amber-700/60 mb-4">
                                Tech stack
                            </p>
                            <div className="flex flex-wrap gap-4 text-2xl text-amber-800">
                                {featured.techStackIcons.map((Icon, i) => (
                                    <Icon key={i} />
                                ))}
                            </div>
                        </div>

                        {featured.liveLink && (
                            <a
                                href={featured.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="featured-cta invisible group inline-flex items-center gap-3 self-start font-lexend text-base sm:text-lg font-medium text-amber-950 border-b-2 border-amber-950/30 pb-1 hover:border-amber-950 transition-colors"
                            >
                                Visit live
                                <FaExternalLinkAlt className="text-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        )}

                        <p className="featured-meta invisible font-lexend text-xs tracking-[0.2em] uppercase text-amber-700/50">
                            001 / featured
                        </p>
                    </div>
                </div>
            </div>

            {/* =============================================================
                 GALLERY — horizontal pan on desktop, vertical stack on mobile.
             ============================================================= */}
            <div ref={panWrapRef} className="gallery-wrap relative md:h-[100dvh] md:overflow-hidden">
                <div
                    ref={panTrackRef}
                    className="gallery-track flex flex-col md:flex-row md:h-full md:items-center gap-8 md:gap-10 px-6 sm:px-10 md:pl-20 md:pr-32 py-16 md:py-0"
                >
                    {/* Section marker at the start of the track */}
                    <div className="gallery-marker shrink-0 md:w-[38vw] lg:w-[30vw] flex flex-col justify-between md:h-[70vh]">
                        <div>
                            <p className="font-lexend text-xs tracking-[0.28em] uppercase text-amber-700/70">
                                Shipped work
                            </p>
                            <h2 className="mt-4 font-lexend text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-amber-950 leading-[1]">
                                Selected<br />projects
                            </h2>
                        </div>
                        <p className="mt-8 font-lexend text-sm sm:text-base text-amber-700/70 max-w-[36ch] italic">
                            Talk's cheap. Show me the code.
                        </p>
                    </div>

                    {gallery.map((project, i) => (
                        <GalleryTile key={project.id} project={project} index={i} />
                    ))}

                    {/* End marker on desktop */}
                    <div className="hidden md:flex shrink-0 w-[20vw] items-center">
                        <p className="font-lexend text-xs tracking-[0.24em] uppercase text-amber-700/50">
                            End of gallery.<br />Keep scrolling for the archive.
                        </p>
                    </div>
                </div>
            </div>

            {/* =============================================================
                 ARCHIVE — compact index for legacy static-site work.
             ============================================================= */}
            <div className="archive-index px-6 sm:px-10 lg:px-20 2xl:px-32 py-24 lg:py-32">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-10 lg:mb-14">
                        <p className="font-lexend text-xs tracking-[0.28em] uppercase text-amber-700/70">
                            Archive
                        </p>
                        <h2 className="mt-3 font-lexend text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-amber-950">
                            Where it started
                        </h2>
                    </header>

                    <ul className="divide-y divide-amber-900/10">
                        {archive.map((project) => (
                            <ArchiveRow key={project.id} project={project} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Projects;

/* =================================================================
   Gallery tile — bento widths + the site's `retro` shadow token.
================================================================= */
const TILE_WIDTHS = [
    'md:w-[46vw] lg:w-[38vw]',
    'md:w-[32vw] lg:w-[26vw]',
    'md:w-[40vw] lg:w-[32vw]',
    'md:w-[32vw] lg:w-[26vw]',
    'md:w-[44vw] lg:w-[36vw]',
];

const GalleryTile = ({ project, index }) => {
    const { title, description, techStackIcons, githubLink, liveLink } = project;
    const widthClass = TILE_WIDTHS[index % TILE_WIDTHS.length];

    return (
        <article
            className={`gallery-tile shrink-0 w-full ${widthClass} md:h-[68vh] flex flex-col p-8 lg:p-10 rounded-2xl bg-amber-100/40 border border-amber-900/10 shadow-retro transition-transform duration-500 hover:-translate-y-1`}
        >
            <header className="flex items-start justify-between gap-6">
                <p className="font-lexend text-xs tracking-[0.24em] uppercase text-amber-700/60">
                    {String(index + 2).padStart(3, '0')}
                </p>
                <div className="flex items-center gap-3 text-lg text-amber-900">
                    {githubLink && (
                        <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${title} GitHub repository`}
                            className="hover:text-amber-950 transition-colors"
                        >
                            <FaGithub />
                        </a>
                    )}
                    {liveLink && (
                        <a
                            href={liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${title} live site`}
                            className="hover:text-amber-950 transition-colors"
                        >
                            <FaExternalLinkAlt className="text-base" />
                        </a>
                    )}
                    {!githubLink && !liveLink && (
                        <span className="flex items-center gap-2 text-xs text-amber-700/70 font-lexend">
                            <RiGitRepositoryPrivateFill /> Private
                        </span>
                    )}
                </div>
            </header>

            <h3 className="mt-6 font-lexend text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tighter text-amber-950 leading-[1.05]">
                {title}
            </h3>

            <p className="mt-5 font-lexend text-sm lg:text-base leading-relaxed text-amber-950/75 max-w-[42ch]">
                {description}
            </p>

            <div className="mt-auto pt-8 flex items-center gap-3 flex-wrap">
                {techStackIcons.map((Icon, i) => (
                    <Icon key={i} className="text-xl lg:text-2xl text-amber-800/85" />
                ))}
            </div>
        </article>
    );
};

/* =================================================================
   Archive row — one compact line per legacy project.
================================================================= */
const ArchiveRow = ({ project }) => {
    const { title, description, githubLink, liveLink, techStackIcons } = project;

    return (
        <li className="archive-row py-6 lg:py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1 min-w-0">
                <h3 className="font-lexend text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-amber-950">
                    {title}
                </h3>
                <p className="mt-1 font-lexend text-sm lg:text-base text-amber-950/70 max-w-[68ch]">
                    {description}
                </p>
            </div>

            <div className="flex items-center gap-4 text-amber-800/85 shrink-0">
                {techStackIcons.map((Icon, i) => (
                    <Icon key={i} className="text-lg" />
                ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 text-amber-900 text-base">
                {githubLink && (
                    <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} GitHub repository`}
                        className="hover:text-amber-950 transition-colors"
                    >
                        <FaGithub />
                    </a>
                )}
                {liveLink && (
                    <a
                        href={liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} live site`}
                        className="hover:text-amber-950 transition-colors"
                    >
                        <FaExternalLinkAlt className="text-sm" />
                    </a>
                )}
                {!githubLink && !liveLink && (
                    <span className="flex items-center gap-2 text-xs text-amber-700/70 font-lexend">
                        <RiGitRepositoryPrivateFill /> Private
                    </span>
                )}
            </div>
        </li>
    );
};

// Kept for backward compat: the v1 module exported ProjectCard. Any external
// import site keeps working — it now renders via the modern gallery tile.
export const ProjectCard = ({ title, githubLink, liveLink, description, techStackIcons }) => (
    <GalleryTile
        index={0}
        project={{ title, githubLink, liveLink, description, techStackIcons }}
    />
);
