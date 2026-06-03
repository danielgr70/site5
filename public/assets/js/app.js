import { setupGtagClickTracking } from "./modules/analytics.js";
import { setupSubscribeConsent } from "./modules/consent.js";
import { setupMobileNav } from "./modules/nav.js";
import { setupOfertaModal } from "./modules/modal.js";
import { setupAjaxForms } from "./modules/forms.js";
import { setupCookieBanner } from "./modules/cookie.js";
import { setupCountdown } from "./modules/countdown.js";
import { setupSmoothScroll } from "./modules/smoothScroll.js";
import { setupResizeBehavior } from "./modules/resize.js";
import { setupBackgroundBasics } from "./modules/backgroundBasics.js";
import { setupSeparateBackgroundSafe } from "./modules/backgroundSeparateSafe.js";
import { getScrollBarWidth } from "./modules/scrollbar.js";
import { setupEffectsInit } from "./modules/effectsInit.js";
import { setupMagnificPopup } from "./modules/magnific.js";
import { setupOwlCarousel } from "./modules/owl.js";
import { setupBackgroundLegacy } from "./modules/backgroundLegacy.js";
import { setupStatsCounter } from "./modules/statsCounter.js";
import { setupScrollSpy } from "./modules/scrollSpy.js";

document.addEventListener("DOMContentLoaded", function () {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const runWhenIdle = (callback) => {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, { timeout: 1200 });
            return;
        }
        window.setTimeout(callback, 300);
    };

    setupGtagClickTracking();
    setupSubscribeConsent();
    setupMobileNav();
    setupOfertaModal();
    setupAjaxForms();
    setupCookieBanner();
    setupCountdown();
    setupSmoothScroll();
    setupResizeBehavior();
    setupBackgroundBasics();
    setupSeparateBackgroundSafe();
    if (!isMobile) {
        setupEffectsInit();
        setupBackgroundLegacy();
    }
    runWhenIdle(() => setupMagnificPopup(getScrollBarWidth));
    runWhenIdle(() => setupOwlCarousel());
    setupStatsCounter();
    setupScrollSpy();
});
