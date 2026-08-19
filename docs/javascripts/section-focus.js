/**
 * When a URL has a section hash (e.g. logging-in/#log-in), show only that
 * section — hide intro, other sections, and the right-hand TOC.
 * Works on all Web and Android article pages.
 */
(function () {
  "use strict";

  var BACK_CLASS = "section-focus-back";
  var HIDDEN_CLASS = "section-hidden";
  var FOCUS_CLASS = "section-focus";

  function getContentRoot() {
    return document.querySelector(".md-content__inner.md-typeset");
  }

  function findSectionH2(content, hash) {
    if (!hash) return null;

    var direct = content.querySelector("h2#" + CSS.escape(hash));
    if (direct) return direct;

    var el = document.getElementById(hash);
    if (!el || !content.contains(el)) return null;
    if (el.tagName === "H2") return el;

    var node = el;
    while (node && node !== content) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (prev.tagName === "H2" && prev.id) return prev;
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }

    node = el;
    while (node && node !== content) {
      var next = node.nextElementSibling;
      while (next) {
        if (next.tagName === "H2" && next.id) return next;
        next = next.nextElementSibling;
      }
      node = node.parentElement;
    }

    return null;
  }

  function removeBackLink(content) {
    var existing = content && content.querySelector("." + BACK_CLASS);
    if (existing) existing.remove();
  }

  function clearSectionFocus() {
    document.body.classList.remove(FOCUS_CLASS);

    document.querySelectorAll("." + HIDDEN_CLASS).forEach(function (el) {
      el.classList.remove(HIDDEN_CLASS);
    });

    var content = getContentRoot();
    if (!content) return;

    var h1 = content.querySelector("h1");
    if (h1 && h1.dataset.fullTitle) {
      h1.textContent = h1.dataset.fullTitle;
      delete h1.dataset.fullTitle;
    }

    removeBackLink(content);

    if (typeof window.renderArticleBreadcrumbs === "function") {
      window.renderArticleBreadcrumbs();
    }
  }

  function applySectionFocus() {
    clearSectionFocus();

    var hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    var content = getContentRoot();
    if (!content) return;

    var targetH2 = findSectionH2(content, hash);
    if (!targetH2) return;

    var h2s = content.querySelectorAll("h2[id]");
    if (!h2s.length) return;

    document.body.classList.add(FOCUS_CLASS);

    var children = Array.prototype.slice.call(content.children);
    var inActiveSection = false;

    children.forEach(function (child) {
      if (child.tagName === "H1") return;

      if (child === targetH2) {
        inActiveSection = true;
        return;
      }

      if (child.tagName === "H2" && child.id && inActiveSection) {
        inActiveSection = false;
      }

      if (!inActiveSection) {
        child.classList.add(HIDDEN_CLASS);
      }
    });

    var h1 = content.querySelector("h1");
    if (h1) {
      if (!h1.dataset.fullTitle) {
        h1.dataset.fullTitle = h1.textContent.trim();
      }
      h1.textContent = targetH2.textContent.trim();
    }

    targetH2.classList.add(HIDDEN_CLASS);
    window.scrollTo(0, 0);

    if (typeof window.renderArticleBreadcrumbs === "function") {
      window.renderArticleBreadcrumbs();
    }
  }

  function init() {
    applySectionFocus();
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
