/**
 * The site's standard reading column.
 *
 * This used to live in RootLayout, wrapping every route. It moved out to the
 * pages because a layout-level constraint means any page wanting a full-bleed
 * section has to break out of it — and every technique for that (transform,
 * negative margin) interferes with ScrollTrigger pinning, which resolves
 * position:fixed against the nearest transformed ancestor.
 *
 * Pages that want the column opt in. Pages that want the viewport (About's
 * horizontal section) simply don't.
 */
const PageColumn = ({ children }) => (
    <div className="sm:w-3/4 mx-auto lg:w-3/5">{children}</div>
);

export default PageColumn;
