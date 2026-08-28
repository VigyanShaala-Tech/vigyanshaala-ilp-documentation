/**
 * Header "Export in PDF" saves the matching guide:
 * student pages → student PDF, admin pages → admin PDF.
 * pdf-versions.json (written on each build) busts browser cache when guide text changes.
 */
(function () {
  "use strict";

  var STUDENT_PDF = "VigyanShaala-ILP-Student-Guide.pdf";
  var ADMIN_PDF = "VigyanShaala-ILP-Admin-Guide.pdf";
  var pdfVersions = null;

  function isAdminPage() {
    if (typeof window.vsIsAdminSite === "function") {
      return window.vsIsAdminSite();
    }
    var path = window.location.pathname;
    return /(^|\/)admin-guide(\/|$)/.test(path) || /(^|\/)admin(\/|$)/.test(path);
  }

  function pdfConfig() {
    if (isAdminPage()) {
      return {
        name: ADMIN_PDF,
        title: "Export the Admin guide as PDF",
      };
    }
    return {
      name: STUDENT_PDF,
      title: "Export the full Web and Android student guide as PDF",
    };
  }

  function pdfHref(name) {
    var url = window.location.origin + "/" + name;
    if (pdfVersions && pdfVersions[name]) {
      url += "?v=" + encodeURIComponent(pdfVersions[name].slice(0, 16));
    }
    return url;
  }

  function isPdfHiddenPage() {
    return /\/download-(admin-)?pdf\/?$/.test(window.location.pathname);
  }

  function addHeaderButton() {
    var inner = document.querySelector(".md-header__inner");
    if (!inner) return;
    var existing = inner.querySelector(".header-download-pdf");
    if (isPdfHiddenPage()) {
      if (existing) existing.remove();
      return;
    }

    var cfg = pdfConfig();
    if (existing) {
      existing.href = pdfHref(cfg.name);
      existing.setAttribute("download", cfg.name);
      existing.setAttribute("title", cfg.title);
      existing.textContent = "Export in PDF";
      return;
    }

    var link = document.createElement("a");
    link.className = "header-download-pdf";
    link.href = pdfHref(cfg.name);
    link.textContent = "Export in PDF";
    link.setAttribute("download", cfg.name);
    link.setAttribute("title", cfg.title);
    // Instant navigation hijacks same-origin clicks and the download then 404s.
    link.addEventListener("click", function (ev) {
      ev.stopImmediatePropagation();
    }, true);

    var searchBtn = inner.querySelector('label[for="__search"]');
    var search = inner.querySelector(".md-search");
    if (searchBtn) {
      inner.insertBefore(link, searchBtn);
    } else if (search) {
      inner.insertBefore(link, search);
    } else {
      inner.appendChild(link);
    }
  }

  function loadPdfVersions(done) {
    fetch("/pdf-versions.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (data && typeof data === "object") {
          pdfVersions = data;
        }
      })
      .catch(function () {
        /* manifest is optional until first post_build */
      })
      .finally(function () {
        if (typeof done === "function") done();
      });
  }

  function init() {
    loadPdfVersions(addHeaderButton);
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
