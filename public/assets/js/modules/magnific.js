export function setupMagnificPopup(getScrollBarWidth) {
    if (!window.$ || typeof window.$.fn.magnificPopup !== "function") return;

    const $popupImage = window.$(".popup-image");
    if ($popupImage.length > 0) {
        $popupImage.magnificPopup({
            type: "image",
            fixedContentPos: false,
            gallery: { enabled: true },
            removalDelay: 300,
            mainClass: "mfp-fade",
            callbacks: {
                open: function () {
                    window.$(".page-wrapper, .navbar-nav").css("margin-right", getScrollBarWidth());
                },
                close: function () {
                    window.$(".page-wrapper, .navbar-nav").css("margin-right", 0);
                }
            }
        });
    }

    const $videoPopup = window.$(".video-popup");
    if ($videoPopup.length > 0) {
        $videoPopup.magnificPopup({
            type: "iframe",
            removalDelay: 300,
            mainClass: "mfp-fade",
            overflowY: "hidden",
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' +
                    '<div class="mfp-close"></div>' +
                    '<iframe class="mfp-iframe" frameborder="0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>' +
                    "</div>",
                patterns: {
                    youtube: {
                        index: "youtube.com/",
                        id: "v=",
                        src: "https://www.youtube.com/embed/%id%?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1&muted=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                },
                srcAction: "iframe_src"
            }
        });
    }
}
