export function setupStatsCounter() {
    const counters = Array.from(document.querySelectorAll(".stats-counter"));
    if (!counters.length) return;

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
                requestAnimationFrame(step);
            } else {
                el.textContent = String(target) + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.animated === "true") return;

                el.dataset.animated = "true";
                animateCounter(el);
                observer.unobserve(el);
            });
        },
        { threshold: 0.35 }
    );

    counters.forEach((counter) => observer.observe(counter));
}
