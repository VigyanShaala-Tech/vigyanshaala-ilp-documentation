/**
 * "Back to top" at the bottom — only on section pages
 * (e.g. Help Center > Account & registration > Create your account).
 * Hidden on home, Help Center, category hubs, and full article index views.
 */
(function () {
  "use strict";

  function addBackToTop() {
    var content = document.querySelector(".md-content__inner.md-typeset");
    var existing = content && content.querySelector(".page-back-to-top");
    if (existing) existing.remove();

    if (!document.body.classList.contains("section-focus") || !content) {
      return;
    }

    var wrap = document.createElement("p");
    wrap.className = "page-back-to-top";

    var link = document.createElement("a");
    link.className = "page-back-to-top-link";
    link.href = "#";
    link.innerHTML =
      '<span class="page-back-to-top-icon" aria-hidden="true">\u2191</span>' +
      '<span class="page-back-to-top-label">Back to top</span>';
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    wrap.appendChild(link);
    content.appendChild(wrap);
  }

  function init() {
    addBackToTop();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      init();
    });
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  window.addEventListener("hashchange", init);
})();
