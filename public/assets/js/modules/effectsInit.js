export function dismissLoadingScreen() {
    document.body.classList.add("loading-done");
}

export function setupEffectsInit() {
    if (!window.$ || typeof window.$.fn.imagesLoaded !== "function" || typeof window.$.fn.scrolla !== "function") {
        dismissLoadingScreen();
        return;
    }

    const fallback = window.setTimeout(dismissLoadingScreen, 8000);

    window.$("body").imagesLoaded(function () {
        window.clearTimeout(fallback);
        dismissLoadingScreen();
        window.$("[data-animate]").scrolla({
            mobile: true
        });
    });
}
