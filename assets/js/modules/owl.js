export function setupOwlCarousel() {
    if (!window.$ || typeof window.$.fn.owlCarousel !== "function") return;

    const $owlCarousel = window.$(".owl-carousel");
    if (!$owlCarousel.length) return;

    $owlCarousel.each(function () {
        let items = parseInt(window.$(this).attr("data-owl-items"), 10);
        if (!items) items = 1;

        let nav = parseInt(window.$(this).attr("data-owl-nav"), 2);
        if (!nav) nav = 0;

        let dots = parseInt(window.$(this).attr("data-owl-dots"), 2);
        if (!dots) dots = 0;

        let center = parseInt(window.$(this).attr("data-owl-center"), 2);
        if (!center) center = 0;

        let loop = parseInt(window.$(this).attr("data-owl-loop"), 2);
        if (!loop) loop = 0;

        let margin = parseInt(window.$(this).attr("data-owl-margin"), 10);
        if (!margin) margin = 0;

        let autoWidth = parseInt(window.$(this).attr("data-owl-auto-width"), 2);
        if (!autoWidth) autoWidth = 0;

        let navContainer = window.$(this).attr("data-owl-nav-container");
        if (!navContainer) navContainer = 0;

        let autoplay = parseInt(window.$(this).attr("data-owl-autoplay"), 2);
        if (!autoplay) autoplay = 0;

        let autoplayTimeOut = parseInt(window.$(this).attr("data-owl-autoplay-timeout"), 10);
        if (!autoplayTimeOut) autoplayTimeOut = 5000;

        let autoHeight = parseInt(window.$(this).attr("data-owl-auto-height"), 2);
        if (!autoHeight) autoHeight = 0;

        let fadeOut = window.$(this).attr("data-owl-fadeout");
        if (!fadeOut) fadeOut = 0;
        else fadeOut = "fadeOut";

        let rtl;
        if (window.$("body").hasClass("rtl")) rtl = true;
        else rtl = false;

        if (items === 1) {
            window.$(this).owlCarousel({
                navContainer: navContainer,
                animateOut: fadeOut,
                autoplayTimeout: autoplayTimeOut,
                autoplay: 1,
                autoHeight: autoHeight,
                center: center,
                loop: loop,
                margin: margin,
                autoWidth: autoWidth,
                items: 1,
                nav: nav,
                dots: dots,
                rtl: rtl,
                navText: []
            });
        } else {
            window.$(this).owlCarousel({
                navContainer: navContainer,
                animateOut: fadeOut,
                autoplayTimeout: autoplayTimeOut,
                autoplay: autoplay,
                autoHeight: autoHeight,
                center: center,
                loop: loop,
                margin: margin,
                autoWidth: autoWidth,
                items: 1,
                nav: nav,
                dots: dots,
                rtl: rtl,
                navText: [],
                responsive: {
                    1199: {
                        items: items
                    },
                    992: {
                        items: 3
                    },
                    768: {
                        items: 2
                    },
                    0: {
                        items: 1
                    }
                }
            });
        }

        if (window.$(this).find(".owl-item").length === 1) {
            window.$(this).find(".owl-nav").css({ "opacity": 0, "pointer-events": "none" });
        }
    });
}
