function applyBasicBackgroundStyles(element) {
    const bgColor = element.getAttribute("data-bg-color");
    const bgImage = element.getAttribute("data-bg-image");
    const bgSize = element.getAttribute("data-bg-size");
    const bgRepeat = element.getAttribute("data-bg-repeat");
    const bgPosition = element.getAttribute("data-bg-position");
    const bgBlendMode = element.getAttribute("data-bg-blend-mode");

    if (bgColor !== null) {
        element.style.backgroundColor = bgColor;
        if (element.classList.contains("btn")) {
            element.style.borderColor = bgColor;
        }
    }

    if (bgImage !== null) {
        element.style.backgroundImage = `url(${bgImage})`;
        if (bgSize) element.style.backgroundSize = bgSize;
        if (bgRepeat) element.style.backgroundRepeat = bgRepeat;
        if (bgPosition) element.style.backgroundPosition = bgPosition;
        if (bgBlendMode) element.style.backgroundBlendMode = bgBlendMode;
    }
}

export function setupBackgroundBasics() {
    const candidates = document.querySelectorAll("[data-bg-color], [data-bg-image]");
    if (!candidates.length) return;

    candidates.forEach(function (element) {
        const isAdvanced = element.classList.contains("ts-separate-bg-element") ||
            element.hasAttribute("data-bg-particles-line-color") ||
            element.hasAttribute("data-bg-particles-dot-color") ||
            element.getAttribute("data-bg-parallax") === "scroll";

        if (isAdvanced) return;

        applyBasicBackgroundStyles(element);
        element.setAttribute("data-bg-managed", "vanilla");
    });
}
