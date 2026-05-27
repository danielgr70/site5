export function setupCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("cookie-accept-btn");
    if (!banner || !acceptButton) return;

    if (!localStorage.getItem("cookieAccepted")) {
        banner.style.display = "block";
    }

    acceptButton.addEventListener("click", function () {
        localStorage.setItem("cookieAccepted", "true");
        banner.style.display = "none";
    });
}
