/**
 * GA4: gtag is defined inline in index.html before this module loads.
 * Use data-ga-event / data-ga-params on important CTAs, or rely on rules below.
 */

export function trackGtag(eventName, params) {
    if (typeof window.gtag !== "function" || !eventName) return;
    window.gtag("event", eventName, params && typeof params === "object" ? params : {});
}

function parseParamsFromElement(el) {
    const raw = el.getAttribute("data-ga-params");
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function mergeLinkParams(el, params) {
    const href = el.getAttribute("href");
    if (href) params.link_url = href;
    return params;
}

export function setupGtagClickTracking() {
    document.addEventListener(
        "click",
        function (e) {
            const explicit = e.target.closest("[data-ga-event]");
            if (explicit) {
                const name = explicit.getAttribute("data-ga-event");
                if (name) {
                    const params = mergeLinkParams(explicit, parseParamsFromElement(explicit));
                    trackGtag(name, params);
                }
                return;
            }

            const videoLink = e.target.closest("a.video-popup[href*='youtube.com/watch']");
            if (videoLink) {
                const href = videoLink.getAttribute("href") || "";
                trackGtag("youtube_video_click", {
                    link_url: href,
                    video_id: href.split("v=")[1] ? href.split("v=")[1].split("&")[0] : ""
                });
            }
        },
        true
    );
}
