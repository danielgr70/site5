export function setupSmoothScroll() {
    const scrollLinks = document.querySelectorAll(".ts-scroll");
    if (!scrollLinks.length) return;

    scrollLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (!link.hash) return;

            const samePath = window.location.pathname.replace(/^\//, "") === link.pathname.replace(/^\//, "");
            const sameHost = window.location.hostname === link.hostname;
            if (!samePath || !sameHost) return;

            let target = document.querySelector(link.hash);
            if (!target && link.hash.length > 1) {
                target = document.querySelector(`[name="${link.hash.slice(1)}"]`);
            }
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            setTimeout(function () {
                target.setAttribute("tabindex", "-1");
                target.focus({ preventScroll: true });
            }, 1000);
        });
    });
}
