/**
 * When a URL has a section hash (e.g. logging-in/#log-in), show only that
 * section — hide intro, other sections, and the right-hand TOC.
 * Works on all Web and Android article pages.
 * H2 hashes show the full H2 block; H3/H4 hashes show only that subsection.
 */
(function () {
  "use strict";

  var BACK_CLASS = "section-focus-back";
  var HIDDEN_CLASS = "section-hidden";
  var FOCUS_CLASS = "section-focus";

  function getContentRoot() {
    return document.querySelector(".md-content__inner.md-typeset");
  }

  function headingLevel(el) {
    if (!el || !el.tagName || el.tagName.charAt(0) !== "H") return 99;
    var n = parseInt(el.tagName.slice(1), 10);
    return isNaN(n) ? 99 : n;
  }

  function findSectionStart(content, hash) {
    if (!hash) return null;

    var el = document.getElementById(hash);
    if (!el || !content.contains(el)) return null;
    if (headingLevel(el) < 2) return null;

    return el;
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

    var target = findSectionStart(content, hash);
    if (!target) return;

    var startLevel = headingLevel(target);
    var hasSectionHeadings = content.querySelectorAll("h2[id], h3[id], h4[id]").length > 0;
    if (!hasSectionHeadings) return;

    document.body.classList.add(FOCUS_CLASS);

    var children = Array.prototype.slice.call(content.children);
    var inActiveSection = false;

    children.forEach(function (child) {
      if (child.tagName === "H1") return;

      if (child === target) {
        inActiveSection = true;
        return;
      }

      if (inActiveSection && child.id && headingLevel(child) <= startLevel) {
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
      h1.textContent = target.textContent.trim();
    }

    target.classList.add(HIDDEN_CLASS);
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
    if (!content || !findSectionStart(content, hash)) return null;
    return hash;
  }

  // Hash links to hidden headings do nothing in the browser (display:none).
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
