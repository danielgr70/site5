export function setupCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const timerEl = document.getElementById("countdown-timer");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !timerEl) return;

    const targetRaw = timerEl.dataset.countdownTarget;
    if (!targetRaw) return;

    const targetDate = new Date(targetRaw).getTime();
    if (Number.isNaN(targetDate)) return;

    const endedMessage =
        timerEl.dataset.countdownEnded ||
        "המחזור כבר התחיל - ניתן להירשם למחזור הבא";

    const countdown = setInterval(function () {
        const distance = targetDate - Date.now();
        if (distance < 0) {
            clearInterval(countdown);
            timerEl.replaceChildren();
            const heading = document.createElement("h3");
            heading.className = "mb-0 text-slate-800";
            heading.textContent = endedMessage;
            timerEl.appendChild(heading);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days);
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
}
