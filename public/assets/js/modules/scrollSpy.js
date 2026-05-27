export function setupScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll("nav.navbar a.ts-scroll[href^='#']"));
    if (!navLinks.length) return;

    const sectionMap = navLinks
        .map((link) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return null;
            const section = document.querySelector(targetId);
            if (!section) return null;
            return { link, section };
        })
        .filter(Boolean);

    if (!sectionMap.length) return;

    const setActiveLink = (activeLink) => {
        sectionMap.forEach(({ link }) => {
            const isActive = link === activeLink;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    // Keep instant feedback after click, before smooth scroll completes.
    sectionMap.forEach(({ link }) => {
        link.addEventListener("click", () => setActiveLink(link));
    });

    const updateActiveByScroll = () => {
        const nav = document.querySelector("nav.navbar");
        const navHeight = nav ? nav.getBoundingClientRect().height : 0;
        const probeY = navHeight + window.innerHeight * 0.32;

        let current = sectionMap[0];
        let fallback = sectionMap[0];
        let bestDistance = Infinity;

        for (const item of sectionMap) {
            const rect = item.section.getBoundingClientRect();

            // Best case: the probe line is currently inside this section.
            if (rect.top <= probeY && rect.bottom > probeY) {
                current = item;
                break;
            }

            // Fallback: closest section top to probe line.
            const distance = Math.abs(rect.top - probeY);
            if (distance < bestDistance) {
                bestDistance = distance;
                fallback = item;
            }
        }

        setActiveLink((current || fallback).link);
    };

    updateActiveByScroll();
    window.addEventListener("scroll", updateActiveByScroll, { passive: true });
    window.addEventListener("resize", updateActiveByScroll);
}
