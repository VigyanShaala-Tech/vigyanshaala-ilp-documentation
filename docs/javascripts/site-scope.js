/**
 * Student site (/) vs Admin guide (/admin-guide/).
 * Hides the other guide's tabs and points the logo at the matching home.
 */
(function () {
  "use strict";

  var STUDENT_SITE_NAME = "VigyanShaala ILP — Student Guide";
  var ADMIN_SITE_NAME = "VigyanShaala ILP — Admin Guide";

  function isAdminSite() {
    var path = window.location.pathname;
    return /(^|\/)admin-guide(\/|$)/.test(path) || /(^|\/)admin(\/|$)/.test(path);
  }

  window.vsIsAdminSite = isAdminSite;

  function tabKind(item) {
    var link = item.querySelector("a");
    if (!link) return "";
    var href = (link.getAttribute("href") || "").toLowerCase();
    var label = (link.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (label === "admin" || href.indexOf("admin-guide") !== -1) return "admin";
    if (label === "android" || href.indexOf("/android") !== -1 || href.indexOf("android/") !== -1) {
      return "android";
    }
    if (label === "web") return "web";
    return "web";
  }

  function applySiteName(admin) {
    var name = admin ? ADMIN_SITE_NAME : STUDENT_SITE_NAME;
    var other = admin ? STUDENT_SITE_NAME : ADMIN_SITE_NAME;

    var headerSite = document.querySelector(
      ".md-header__title .md-header__topic:not([data-md-component='header-topic']) .md-ellipsis"
    );
    if (headerSite) {
      headerSite.textContent = name;
    }

    document.querySelectorAll(".md-header__button.md-logo, .md-nav__button.md-logo").forEach(function (el) {
      el.setAttribute("title", name);
      el.setAttribute("aria-label", name);
    });

    var navTitle = document.querySelector(".md-nav__title");
    if (
      navTitle &&
      (navTitle.textContent.indexOf(STUDENT_SITE_NAME) !== -1 ||
        navTitle.textContent.indexOf(ADMIN_SITE_NAME) !== -1)
    ) {
      navTitle.textContent = name;
    }

    if (document.title.indexOf(other) !== -1) {
      document.title = document.title.replace(other, name);
    }
  }

  function applyScope() {
    var admin = isAdminSite();
    document.body.classList.toggle("admin-site", admin);
    document.body.classList.toggle("student-site", !admin);

    document.querySelectorAll(".md-tabs__item").forEach(function (item) {
      var kind = tabKind(item);
      if (admin) {
        item.hidden = kind !== "admin";
      } else {
        item.hidden = kind === "admin";
      }
    });

    var logo = document.querySelector(".md-header__button.md-logo");
    if (logo) {
      logo.setAttribute("href", admin ? "/admin-guide/" : "/");
    }

    applySiteName(admin);
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(applyScope);
  } else {
    document.addEventListener("DOMContentLoaded", applyScope);
  }
})();
