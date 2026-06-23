(function () {
  var WRAP_CLASS = "keystatic-photo-url-preview-wrap";
  var IMG_CLASS = "keystatic-photo-url-preview";

  function isHttpUrl(url) {
    return /^https?:\/\//i.test(url);
  }

  /** Profile photo URL field — matched by inputmode, not by label text. */
  function findPhotoUrlField(form) {
    var inputs = form.querySelectorAll('input[inputmode="url"]');
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var labelledBy = input.getAttribute("aria-labelledby");
      if (!labelledBy) continue;
      var label = document.getElementById(labelledBy.split(" ")[0]);
      if (!label || !label.parentElement) continue;
      return { input: input, anchor: label.parentElement };
    }
    return null;
  }

  function bindUrlPreview(field) {
    var input = field.input;
    var anchor = field.anchor;
    if (!input || !anchor) return;

    var wrap = anchor.querySelector("." + WRAP_CLASS);
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = WRAP_CLASS;

      var caption = document.createElement("span");
      caption.className = "keystatic-photo-url-preview-label";
      // "תצוגה מקדימה" (Preview) — Unicode escapes avoid mojibake when charset is wrong
      caption.textContent = "\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DE\u05E7\u05D3\u05D9\u05DE\u05D4";

      var img = document.createElement("img");
      img.className = IMG_CLASS;
      img.alt = "";
      img.width = 90;
      img.height = 90;
      img.referrerPolicy = "no-referrer";
      img.decoding = "async";

      wrap.appendChild(caption);
      wrap.appendChild(img);
      anchor.appendChild(wrap);
    }

    var img = wrap.querySelector("." + IMG_CLASS);

    function update() {
      var url = input.value.trim();
      if (!isHttpUrl(url)) {
        img.removeAttribute("src");
        wrap.hidden = true;
        return;
      }
      wrap.hidden = false;
      if (img.getAttribute("data-src") !== url) {
        img.setAttribute("data-src", url);
        img.src = url;
      }
    }

    if (!img._errorBound) {
      img._errorBound = true;
      img.addEventListener("error", function () {
        wrap.hidden = true;
      });
      img.addEventListener("load", function () {
        if (isHttpUrl(input.value.trim())) wrap.hidden = false;
      });
    }

    if (input._photoPreviewUpdate) {
      input.removeEventListener("input", input._photoPreviewUpdate);
      input.removeEventListener("change", input._photoPreviewUpdate);
    }
    input._photoPreviewUpdate = update;
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    update();
  }

  function scan() {
    var forms = document.querySelectorAll("#item-edit-form, #item-create-form");
    for (var f = 0; f < forms.length; f++) {
      var field = findPhotoUrlField(forms[f]);
      if (field) bindUrlPreview(field);
    }
  }

  function getPublishToken() {
    var meta = document.querySelector('meta[name="keystatic-publish-token"]');
    return meta ? meta.getAttribute("content") : null;
  }

  function mountPublishButton() {
    var btn = document.getElementById("keystatic-publish-btn");
    var status = document.getElementById("keystatic-publish-status");
    if (!btn || !status || btn._publishBound) return;

    var token = getPublishToken();
    btn._publishBound = true;
    btn.textContent = "\u05E4\u05E8\u05E1\u05D5\u05DD \u05DC\u05D0\u05EA\u05E8";
    if (!token) {
      btn.disabled = true;
      status.hidden = false;
      status.className = "keystatic-publish-status is-error";
      // "פרסום לא מוגדר בשרת"
      status.textContent =
        "\u05E4\u05E8\u05E1\u05D5\u05DD \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 \u05D1\u05E9\u05E8\u05EA";
      return;
    }

    btn.addEventListener("click", function () {
      // "לפרסם את האתר? השינויים שנשמרו יופיעו בקרוב."
      if (
        !window.confirm(
          "\u05DC\u05E4\u05E8\u05E1\u05DD \u05D0\u05EA \u05D4\u05D0\u05EA\u05E8? \u05D4\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05E9\u05E0\u05E9\u05DE\u05E8\u05D5 \u05D9\u05D5\u05E4\u05D9\u05E2\u05D5 \u05D1\u05E7\u05E8\u05D5\u05D1.",
        )
      ) {
        return;
      }

      btn.disabled = true;
      status.hidden = false;
      status.className = "keystatic-publish-status";
      // "מפרסם..."
      status.textContent = "\u05DE\u05E4\u05E8\u05E1\u05DD...";

      fetch("/api/publish", {
        method: "POST",
        headers: { "X-Publish-Token": token },
      })
        .then(function (response) {
          return response.json().then(function (body) {
            return { ok: response.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            status.className = "keystatic-publish-status is-success";
            // "האתר מתפרסם. זה לוקח כמה דקות."
            status.textContent =
              "\u05D4\u05D0\u05EA\u05E8 \u05DE\u05EA\u05E4\u05E8\u05E1\u05DD. \u05D6\u05D4 \u05DC\u05D5\u05E7\u05D7 \u05DB\u05DE\u05D4 \u05D3\u05E7\u05D5\u05EA.";
            return;
          }
          status.className = "keystatic-publish-status is-error";
          status.textContent =
            (result.body && result.body.error) ||
            "\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05E4\u05E8\u05E1\u05D5\u05DD";
        })
        .catch(function () {
          status.className = "keystatic-publish-status is-error";
          status.textContent = "\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05E4\u05E8\u05E1\u05D5\u05DD";
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  function ensurePublishUi() {
    mountPublishButton();
    if (!document.getElementById("keystatic-publish-bar")) {
      var bar = document.createElement("div");
      bar.id = "keystatic-publish-bar";
      bar.className = "keystatic-publish-bar";
      bar.innerHTML =
        '<button type="button" id="keystatic-publish-btn" class="keystatic-publish-btn">\u05E4\u05E8\u05E1\u05D5\u05DD \u05DC\u05D0\u05EA\u05E8</button>' +
        '<p id="keystatic-publish-status" class="keystatic-publish-status" hidden role="status"></p>';
      document.body.appendChild(bar);
      mountPublishButton();
    }
  }

  function boot() {
    scan();
    ensurePublishUi();
    new MutationObserver(function () {
      scan();
      ensurePublishUi();
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    var attempts = 0;
    var timer = setInterval(function () {
      scan();
      ensurePublishUi();
      if (++attempts >= 120) clearInterval(timer);
    }, 250);
    window.addEventListener("astro:hydrate", scan);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
