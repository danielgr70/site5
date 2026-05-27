export function setupStatsCounter() {
    const counters = Array.from(document.querySelectorAll(".stats-counter"));
    if (!counters.length) return;
    const rafByElement = new WeakMap();

    const animateCounter = (el) => {
        const target = Number(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        if (!Number.isFinite(target) || target < 0) return;

        const durationMs = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = String(value) + suffix;

            if (progress < 1) {
                const rafId = requestAnimationFrame(step);
                rafByElement.set(el, rafId);
            } else {
                el.textContent = String(target) + suffix;
                rafByElement.delete(el);
            }
        };

        const existingRaf = rafByElement.get(el);
        if (existingRaf) {
            cancelAnimationFrame(existingRaf);
            rafByElement.delete(el);
        }

        // Always restart from zero when element re-enters viewport
        el.textContent = "0" + suffix;
        const rafId = requestAnimationFrame(step);
        rafByElement.set(el, rafId);
    };

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const suffix = el.dataset.suffix || "";
                const target = Number(el.dataset.target || "0");

                if (entry.isIntersecting) {
                    if (el.dataset.inView === "true") return;
                    el.dataset.inView = "true";
                    animateCounter(el);
                    return;
                }

                el.dataset.inView = "false";
                const rafId = rafByElement.get(el);
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafByElement.delete(el);
                }
                el.textContent = (Number.isFinite(target) ? "0" : "") + suffix;
            });
        },
        { threshold: 0.35 }
    );

    counters.forEach((counter) => observer.observe(counter));
}
