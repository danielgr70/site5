export function setupCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const timerEl = document.getElementById("countdown-timer");
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !timerEl) return;

    const targetDate = new Date("2026-05-10T10:00:00").getTime();

    const countdown = setInterval(function () {
        const distance = targetDate - Date.now();
        if (distance < 0) {
            clearInterval(countdown);
            timerEl.innerHTML = "<h3 class='mb-0 text-slate-800'>המחזור כבר התחיל - ניתן להירשם למחזור הבא</h3>";
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
