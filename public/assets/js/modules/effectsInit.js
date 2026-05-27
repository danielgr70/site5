export function setupEffectsInit() {
    if (!window.$ || typeof window.$.fn.imagesLoaded !== "function" || typeof window.$.fn.scrolla !== "function") {
        return;
    }

    window.$("body").imagesLoaded(function () {
        window.$("body").addClass("loading-done");
        window.$("[data-animate]").scrolla({
            mobile: true
        });
    });
}
