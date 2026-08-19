/**
 * Coursera-style breadcrumbs on article pages:
 * Help Center > Category > Article (or section name when hash is set)
 */
(function () {
  "use strict";

  var ARTICLE_MAP = {
    web: {
      "logging-in": {
        category: "Account & registration",
        categoryPath: "../categories/logging-in/",
      },
      "explore-courses": {
        category: "Explore & Discover Programs",
        categoryPath: "../categories/explore-programs/",
      },
      "enroll-in-a-course": {
        category: "Apply to a Program",
        categoryPath: "../categories/apply/",
      },
      "my-dashboard": {
        category: "My Dashboard",
        categoryPath: "../categories/dashboard/",
      },
      "inside-a-course": {
        category: "Inside a Program",
        categoryPath: "../categories/inside-program/",
      },
      "achievements-and-certificates": {
        category: "Achievements & Certificates",
        categoryPath: "../categories/achievements/",
      },
      "profile-and-support": {
        category: "Profile & Support",
        categoryPath: "../categories/profile/",
      },
    },
    android: {
      "logging-in": {
        category: "Account & registration",
        categoryPath: "../categories/logging-in/",
      },
      "explore-programs": {
        category: "Explore Programs",
        categoryPath: "../categories/explore-programs/",
      },
      "enroll-in-a-program": {
        category: "Apply to a Program",
        categoryPath: "../categories/apply/",
      },
      "my-learning": {
        category: "My Learning",
        categoryPath: "../categories/my-learning/",
      },
      "inside-a-program": {
        category: "Inside a Program",
        categoryPath: "../categories/inside-program/",
      },
      achievements: {
        category: "Achievements",
        categoryPath: "../categories/achievements/",
      },
      "profile-and-support": {
        category: "Profile & Support",
        categoryPath: "../categories/profile/",
      },
      "app-install-and-updates": {
        category: "App Install & Updates",
        categoryPath: "../categories/app-install/",
      },
    },
  };

  function getContentRoot() {
    return document.querySelector(".md-content__inner.md-typeset");
  }

  function getArticleInfo() {
    var parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (!parts.length) return null;

    var isAndroid = parts[0] === "android";
    var slug = parts[parts.length - 1];
    var platform = isAndroid ? "android" : "web";

    return {
      platform: platform,
      slug: slug,
      // Fix category pages:
      // /categories/<topic>/          --> /help-center/
      // /android/categories/<topic>/  --> /android/help-center/
      helpPath: parts.indexOf("categories") !== -1 ? "../../help-center/" : "../help-center/",
    };
  }

  function getSectionTitle(content) {
    var hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return null;

    var h2 = content.querySelector("h2#" + CSS.escape(hash));
    if (h2) return h2.textContent.trim();

    var el = document.getElementById(hash);
    if (!el || !content.contains(el)) return null;

    if (el.tagName === "H2") return el.textContent.trim();

    var node = el;
    while (node && node !== content) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (prev.tagName === "H2" && prev.id) return prev.textContent.trim();
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }

    return null;
  }

  function appendSeparator(nav) {
    var sep = document.createElement("span");
    sep.className = "sep";
    sep.setAttribute("aria-hidden", "true");
    sep.textContent = ">";
    nav.appendChild(sep);
  }

  function renderBreadcrumbs() {
    var content = getContentRoot();
    if (!content) return;

    var existing = content.querySelector(".article-breadcrumbs");
    if (existing) existing.remove();

    var h1 = content.querySelector("h1");
    if (!h1) return;

    var info = getArticleInfo();
    if (!info) return;

    var nav = document.createElement("nav");
    nav.className = "article-breadcrumbs";
    nav.setAttribute("aria-label", "Breadcrumb");

    var helpLink = document.createElement("a");
    helpLink.href = info.helpPath;
    helpLink.textContent = "Help Center";
    nav.appendChild(helpLink);

    appendSeparator(nav);

    if (content.querySelector(".category-hub")) {
      var current = document.createElement("span");
      current.className = "current";
      current.textContent = h1.textContent.trim();
      nav.appendChild(current);
      content.insertBefore(nav, h1);
      return;
    }

    if (!content.querySelector(".skip-to")) return;

    var map = ARTICLE_MAP[info.platform] && ARTICLE_MAP[info.platform][info.slug];
    if (!map) return;

    var sectionTitle = getSectionTitle(content);

    // Article title is the H1 (section name). Do not repeat it in the trail.
    // Focused article: Help Center > Category (link)
    // Full topic page: Help Center > Category (current)
    if (sectionTitle) {
      var categoryLink = document.createElement("a");
      categoryLink.href = map.categoryPath;
      categoryLink.textContent = map.category;
      nav.appendChild(categoryLink);
    } else {
      var currentTopic = document.createElement("span");
      currentTopic.className = "current";
      currentTopic.textContent = map.category;
      nav.appendChild(currentTopic);
    }

    content.insertBefore(nav, h1);
  }

  function init() {
    renderBreadcrumbs();
  }

  window.renderArticleBreadcrumbs = renderBreadcrumbs;

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      init();
    });
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  window.addEventListener("hashchange", init);
})();
