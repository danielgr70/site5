function setStyleIfValue(element, property, value) {
    if (value) {
        element.style[property] = value;
    }
}

function ensureBackgroundContainer(section) {
    let background = section.querySelector(":scope > .ts-background");
    if (!background) {
        background = document.createElement("div");
        background.className = "ts-background";
        section.appendChild(background);
    }
    return background;
}

function ensureBackgroundImage(background) {
    let imageLayer = background.querySelector(":scope > .ts-background-image");
    if (!imageLayer) {
        imageLayer = document.createElement("div");
        imageLayer.className = "ts-background-image";
        background.appendChild(imageLayer);
    }
    return imageLayer;
}

export function setupSeparateBackgroundSafe() {
    const sections = document.querySelectorAll(".ts-separate-bg-element");
    if (!sections.length) return;

    sections.forEach(function (section) {
        const hasParticles = section.hasAttribute("data-bg-particles-line-color") ||
            section.hasAttribute("data-bg-particles-dot-color");
        const hasParallax = section.getAttribute("data-bg-parallax") === "scroll";
        const bgColor = section.getAttribute("data-bg-color");
        const bgImage = section.getAttribute("data-bg-image");

        // Keep complex effects in jQuery path for now.
        if (hasParticles || hasParallax) return;
        if (bgColor === null && bgImage === null) return;

        const background = ensureBackgroundContainer(section);
        if (bgColor !== null) {
            background.style.backgroundColor = bgColor;
        }

        if (bgImage !== null) {
            const imageLayer = ensureBackgroundImage(background);
            imageLayer.style.backgroundImage = `url(${bgImage})`;
            setStyleIfValue(imageLayer, "backgroundSize", section.getAttribute("data-bg-size"));
            setStyleIfValue(imageLayer, "backgroundRepeat", section.getAttribute("data-bg-repeat"));
            setStyleIfValue(imageLayer, "backgroundPosition", section.getAttribute("data-bg-position"));
            setStyleIfValue(imageLayer, "backgroundBlendMode", section.getAttribute("data-bg-blend-mode"));
            setStyleIfValue(imageLayer, "opacity", section.getAttribute("data-bg-image-opacity"));
        }

        section.setAttribute("data-bg-managed", "vanilla-separate");
    });
}
