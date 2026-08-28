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

    if (/\/download-(admin-)?pdf\/?$/.test(window.location.pathname)) return;

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

  function samePath(url) {
    return url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "");
  }

  function sectionHashFromLink(anchor) {
    var href = anchor.getAttribute("href");
    if (!href || href === "#") return null;

    var hash = "";
    if (href.charAt(0) === "#") {
      hash = href.slice(1);
    } else {
      try {
        var url = new URL(anchor.href, window.location.href);
        if (!samePath(url) || !url.hash) return null;
        hash = url.hash.slice(1);
      } catch (err) {
        return null;
      }
    }

    hash = decodeURIComponent(hash);
    if (!hash) return null;

    var content = getContentRoot();
    if (!content || !findSectionH2(content, hash)) return null;
    return hash;
  }

  // Hash links to hidden H2s do nothing in the browser (display:none).
  // Set the hash ourselves so section-focus can show that topic.
  function onSectionLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var anchor = event.target.closest("a");
    if (!anchor) return;
    var href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    var url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (err) {
      return;
    }
    if (!url.hash) return;

    // Instant navigation drops the hash, so the whole article opens.
    // Load the section URL in full when leaving this page.
    if (!samePath(url)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(url.href);
      return;
    }

    var hash = sectionHashFromLink(anchor);
    if (!hash) return;

    event.preventDefault();
    if (decodeURIComponent(window.location.hash.slice(1)) === hash) {
      applySectionFocus();
      return;
    }
    window.location.hash = hash;
  }

  function init() {
    applySectionFocus();
    requestAnimationFrame(applySectionFocus);
  }

  document.addEventListener("click", onSectionLinkClick, true);

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      init();
    });
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  window.addEventListener("hashchange", init);
})();
