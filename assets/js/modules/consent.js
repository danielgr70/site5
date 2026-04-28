export function setupSubscribeConsent() {
    const checkbox = document.getElementById("consentCheckbox");
    const submitButton = document.getElementById("btn-submit");
    if (!checkbox || !submitButton) return;

    submitButton.disabled = !checkbox.checked;
    checkbox.addEventListener("click", function () {
        submitButton.disabled = !this.checked;
    });
}
