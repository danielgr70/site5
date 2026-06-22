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

  function boot() {
    scan();
    new MutationObserver(scan).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    var attempts = 0;
    var timer = setInterval(function () {
      scan();
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
