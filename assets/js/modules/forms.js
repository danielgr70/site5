function getHebrewValidationMessage(field) {
    const validity = field.validity;
    const label = field.getAttribute("data-he-label") || field.getAttribute("aria-label") || "שדה זה";

    if (validity.valueMissing) {
        return `נא למלא את ${label}.`;
    }

    if (validity.typeMismatch && field.type === "email") {
        return "נא להזין כתובת דוא\"ל תקינה (לדוגמה: name@example.com).";
    }

    if (validity.patternMismatch) {
        return `הערך שהוזן ב-${label} אינו בפורמט הנדרש.`;
    }

    if (validity.tooShort) {
        return `נא להזין לפחות ${field.minLength} תווים.`;
    }

    if (validity.tooLong) {
        return `נא להזין עד ${field.maxLength} תווים.`;
    }

    return "נא להזין ערך תקין.";
}

function setupHebrewValidation(form) {
    const fields = form.querySelectorAll("input, textarea, select");
    fields.forEach(function (field) {
        field.addEventListener("invalid", function () {
            field.setCustomValidity(getHebrewValidationMessage(field));
        });

        field.addEventListener("input", function () {
            field.setCustomValidity("");
        });

        field.addEventListener("change", function () {
            field.setCustomValidity("");
        });
    });
}

export function setupAjaxForms() {
    const forms = document.querySelectorAll(".contact-form-js");
    if (!forms.length) return;

    forms.forEach(function (form) {
        setupHebrewValidation(form);

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            const formData = new FormData(form);
            const payload = JSON.stringify(Object.fromEntries(formData));

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: payload
            })
                .then(async function (response) {
                    await response.json();
                    if (response.status === 200) {
                        Swal.fire({
                            title: "נשלח בהצלחה!",
                            text: form.id === "form-subscribe"
                                ? "תודה שנרשמת לרשימת התפוצה שלנו."
                                : "תודה על פנייתך, נחזור אליך בהקדם.",
                            icon: "success",
                            confirmButtonColor: "#f40000",
                            confirmButtonText: "סגור",
                            timer: 3000
                        });
                        form.reset();
                    } else {
                        Swal.fire({
                            title: "שגיאה",
                            text: "חלה בעיה בשליחת הטופס",
                            icon: "error",
                            confirmButtonColor: "#f40000",
                            confirmButtonText: "נסה שוב"
                        });
                        if (submitButton) submitButton.disabled = false;
                    }
                })
                .catch(function () {
                    Swal.fire({
                        title: "אין חיבור לאינטרנט",
                        text: "לא הצלחנו להתחבר לשרת. אנא בדוק את החיבור שלך.",
                        icon: "warning",
                        confirmButtonColor: "#f40000",
                        confirmButtonText: "הבנתי"
                    });
                    if (submitButton) submitButton.disabled = false;
                });
        });
    });
}
