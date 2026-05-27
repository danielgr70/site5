export function setupMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("navbarNavAltMarkup");
    const navRoot = document.querySelector("nav.navbar");
    const hero = document.getElementById("ts-hero");
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener("click", function () {
        const isHidden = navMenu.classList.contains("hidden");
        navMenu.classList.toggle("hidden", !isHidden);
        navToggle.setAttribute("aria-expanded", String(isHidden));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.add("hidden");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    if (navRoot) {
        function updateNavScrollState() {
            let shouldShowSolid = false;

            if (hero) {
                const heroBottom = hero.getBoundingClientRect().bottom;
                shouldShowSolid = heroBottom <= 0;
            } else {
                shouldShowSolid = window.scrollY >= window.innerHeight;
            }

            navRoot.classList.toggle("in", shouldShowSolid);
        }

        updateNavScrollState();
        window.addEventListener("scroll", updateNavScrollState);
        window.addEventListener("resize", updateNavScrollState);
    }
}
