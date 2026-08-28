/**
 * Student site (/) vs Admin guide (/admin-guide/).
 * Hides the other guide's tabs and points the logo at the matching home.
 */
(function () {
  "use strict";

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
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(applyScope);
  } else {
    document.addEventListener("DOMContentLoaded", applyScope);
  }
})();
