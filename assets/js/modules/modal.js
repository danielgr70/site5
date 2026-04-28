export function setupOfertaModal() {
    const modal = document.getElementById("modalOferta");
    const closeButton = document.getElementById("modal-oferta-close");
    if (!modal) return;

    function openModal() {
        modal.classList.remove("hidden");
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }

    setTimeout(openModal, 2000);

    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }
}
