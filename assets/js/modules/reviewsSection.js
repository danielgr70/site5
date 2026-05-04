import { googleReviewsUrl, reviewsData } from "./reviewsData.js";

const READ_MORE_THRESHOLD = 220;

function getInitials(name) {
    if (!name) return "א";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "א";
    if (parts.length === 1) return parts[0].charAt(0);
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
}

function createStars(rating) {
    const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
    return "★".repeat(safeRating);
}

function createReviewCard(review) {
    const article = document.createElement("article");
    article.className = "review-card-v1";

    const header = document.createElement("div");
    header.className = "review-card-v1-head";

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "review-card-v1-avatar";

    if (review.photoUrl) {
        const img = document.createElement("img");
        img.src = review.photoUrl;
        img.alt = `תמונה של ${review.name}`;
        img.loading = "lazy";
        avatarWrap.appendChild(img);
    } else {
        const initials = document.createElement("span");
        initials.textContent = getInitials(review.name);
        avatarWrap.appendChild(initials);
    }

    const meta = document.createElement("div");
    meta.className = "review-card-v1-meta";

    const name = document.createElement("p");
    name.className = "review-card-v1-name";
    name.textContent = review.name || "לקוח/ה";

    const stars = document.createElement("p");
    stars.className = "review-card-v1-stars";
    stars.textContent = createStars(review.rating);
    stars.setAttribute("aria-label", `${review.rating || 5} out of 5`);

    meta.appendChild(name);
    meta.appendChild(stars);

    header.appendChild(avatarWrap);
    header.appendChild(meta);

    const quote = document.createElement("blockquote");
    quote.className = "review-card-v1-text";
    quote.textContent = review.text || "";

    let readMoreBtn = null;
    if ((review.text || "").trim().length > READ_MORE_THRESHOLD) {
        readMoreBtn = document.createElement("button");
        readMoreBtn.type = "button";
        readMoreBtn.className = "review-card-v1-toggle";
        readMoreBtn.textContent = "קרא עוד";
        readMoreBtn.setAttribute("aria-expanded", "false");
        readMoreBtn.addEventListener("click", function () {
            const expanded = readMoreBtn.getAttribute("aria-expanded") === "true";
            readMoreBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
            readMoreBtn.textContent = expanded ? "קרא עוד" : "קרא פחות";
            article.classList.toggle("is-expanded", !expanded);
        });
    }

    const foot = document.createElement("p");
    foot.className = "review-card-v1-date";
    foot.textContent = review.date || "";

    article.appendChild(header);
    article.appendChild(quote);
    if (readMoreBtn) {
        article.appendChild(readMoreBtn);
    }
    if (review.date) {
        article.appendChild(foot);
    }

    return article;
}

export function setupReviewsSection() {
    const list = document.querySelector("#successful-stories-list");
    const reviewsLink = document.querySelector("#successful-stories-google-link");
    if (!list) return;

    list.innerHTML = "";
    const source = Array.isArray(reviewsData) ? reviewsData : [];

    source.forEach((review) => {
        list.appendChild(createReviewCard(review));
    });

    if (reviewsLink) {
        reviewsLink.setAttribute("href", googleReviewsUrl);
    }
}
