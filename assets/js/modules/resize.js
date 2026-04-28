export function setupResizeBehavior() {
    let resizeTimeoutId;

    function applyHeroHeight() {
        const fullScreenSections = document.querySelectorAll(".ts-full-screen");
        const viewportHeight = window.innerHeight;
        fullScreenSections.forEach(function (section) {
            section.style.height = `${viewportHeight}px`;
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
