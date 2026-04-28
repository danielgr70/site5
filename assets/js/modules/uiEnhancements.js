export function setupUiEnhancements() {
    document.querySelectorAll(".ts-img-into-bg").forEach(function (container) {
        const image = container.querySelector("img");
        if (image && image.getAttribute("src")) {
            container.style.backgroundImage = `url(${image.getAttribute("src")})`;
        }
    });

    document.querySelectorAll(".ts-labels-inside-input input, .ts-labels-inside-input textarea").forEach(function (field) {
        field.addEventListener("focusin", function () {
            const label = field.parentElement ? field.parentElement.querySelector("label") : null;
            if (label) label.classList.add("focused");
        });

        field.addEventListener("focusout", function () {
            const label = field.parentElement ? field.parentElement.querySelector("label") : null;
            if (label && !field.value.length) {
                label.classList.remove("focused");
            }
        });
    });

    document.querySelectorAll("select").forEach(function (select) {
        if (select.parentElement && select.parentElement.classList.contains("select-wrapper")) return;
        const wrapper = document.createElement("div");
        wrapper.className = "select-wrapper";
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
    });
}
