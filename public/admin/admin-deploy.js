(function () {
    const bar = document.getElementById("orit-deploy-bar");
    const button = document.getElementById("orit-deploy-btn");
    const status = document.getElementById("orit-deploy-status");
    if (!bar || !button || !status || button.disabled) return;

    const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
    if (localHosts.has(window.location.hostname)) return;

    const buildHookUrl = (bar.dataset.buildHookUrl || "").trim();
    if (!buildHookUrl) return;

    button.addEventListener("click", async function () {
        button.disabled = true;
        status.textContent = "מפעיל בנייה…";
        status.classList.remove("is-error");

        try {
            const response = await fetch(buildHookUrl, {
                method: "POST",
                body: "{}",
            });
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            status.textContent = "הבנייה הופעלה — האתר יתעדכן בעוד דקות ספורות";
        } catch (error) {
            status.textContent = "שגיאה בהפעלת הבנייה";
            status.classList.add("is-error");
            console.error("Netlify build hook failed:", error);
        } finally {
            button.disabled = false;
        }
    });
})();
