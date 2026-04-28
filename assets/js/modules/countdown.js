export function setupCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const timerEl = document.getElementById("countdown-timer");
    if (!daysEl || !hoursEl || !minutesEl || !timerEl) return;

    const targetDate = new Date("2026-05-10T10:00:00").getTime();

    const countdown = setInterval(function () {
        const distance = targetDate - Date.now();
        if (distance < 0) {
            clearInterval(countdown);
            timerEl.innerHTML = "<h3>El curso ya comenzo!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        daysEl.textContent = String(days);
        hoursEl.textContent = String(hours);
        minutesEl.textContent = String(minutes);
    }, 1000);
}
