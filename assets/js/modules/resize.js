export function setupResizeBehavior() {
    let resizeTimeoutId;

    function applyHeroHeight() {
        const fullScreenSections = document.querySelectorAll(".ts-full-screen");
        const viewportHeight = window.innerHeight;
        fullScreenSections.forEach(function (section) {
            // Keep "full screen" look, but allow section to grow with content
            // on smaller viewports so CTAs don't overlap the next section.
            section.style.minHeight = `${viewportHeight}px`;
            section.style.height = "auto";
        });
    }

    function afterResize() {
        applyHeroHeight();
        if (window.$) {
            window.$(".owl-carousel").trigger("next.owl.carousel");
        }
    }

    applyHeroHeight();

    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(afterResize, 250);
    });
}
