/**
 * Help Center search:
 * - keep Web, Android, and Admin results on the matching guide
 * - open the matching article section (hash), not the whole page
 * - label results so Web vs Android vs Admin is clear
 */
(function () {
  "use strict";

  var PLACEHOLDER = "Search for help";
  var ADMIN_PLACEHOLDER = "Search admin help";

  function setPlaceholder() {
    var input = document.querySelector(".md-search__input");
    if (input) {
      var text = currentPlatform() === "admin" ? ADMIN_PLACEHOLDER : PLACEHOLDER;
      input.setAttribute("placeholder", text);
      input.setAttribute("aria-label", text);
    }
  }

  function currentPlatform() {
    var parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (!parts.length) return "student";
    if (parts[0] === "android") return "android";
    if (parts[0] === "admin-guide" || parts[0] === "admin") return "admin";
    return "web";
  }

  function linkPath(anchor) {
    if (!anchor) return "";
    var href = anchor.getAttribute("href") || "";
    try {
      var url = new URL(href, window.location.href);
      return (url.pathname.replace(/\/$/, "") + "/" + url.hash).replace(/\/+#/, "/#");
    } catch (err) {
      return href;
    }
  }

  function isAndroidPath(path) {
    return /(^|\/)android\//.test(path);
  }

  function isAdminPath(path) {
    return /(^|\/)admin-guide(\/|$)/.test(path) || /(^|\/)admin(\/|$)/.test(path);
  }

  function platformOf(path) {
    if (isAdminPath(path)) return "admin";
    return isAndroidPath(path) ? "android" : "web";
  }

  function ensureBadge(heading, platform) {
    if (!heading || heading.querySelector(".search-platform")) return;
    var badge = document.createElement("span");
    badge.className = "search-platform";
    badge.textContent =
      platform === "android" ? "Android" : platform === "admin" ? "Admin" : "Web";
    heading.insertBefore(badge, heading.firstChild);
  }

  function decorateResults() {
    var root = document.querySelector("[data-md-component='search-result']");
    if (!root) return;

    var platform = currentPlatform();
    var items = root.querySelectorAll(".md-search-result__item");
    var visible = 0;

    items.forEach(function (item) {
      var links = Array.prototype.slice.call(item.querySelectorAll("a.md-search-result__link"));
      if (!links.length) {
        item.hidden = true;
        return;
      }

      var itemPlatform = platformOf(linkPath(links[0]));
      var allow = false;
      if (platform === "admin") {
        allow = itemPlatform === "admin";
      } else if (platform === "android") {
        allow = itemPlatform === "android";
      } else if (platform === "web") {
        allow = itemPlatform === "web";
      } else {
        allow = itemPlatform === "web" || itemPlatform === "android";
      }
      if (!allow) {
        item.hidden = true;
        return;
      }

      var hashed = links.filter(function (link) {
        return (link.getAttribute("href") || "").indexOf("#") !== -1;
      });
      var unhashed = links.filter(function (link) {
        return (link.getAttribute("href") || "").indexOf("#") === -1;
      });

      if (hashed.length && unhashed.length) {
        var query = ((document.querySelector(".md-search__input") || {}).value || "")
          .trim()
          .toLowerCase();
        var best = hashed[0];
        if (query) {
          hashed.forEach(function (link) {
            var title = (link.textContent || "").trim().toLowerCase();
            if (title && title.indexOf(query) !== -1) best = link;
          });
        }
        unhashed.forEach(function (link) {
          link.setAttribute("href", best.getAttribute("href"));
        });
      }

      // Whole-page hits for multi-section guides open every topic. Keep section links.
      if (!hashed.length && /-guide\//.test(linkPath(links[0]))) {
        item.hidden = true;
        return;
      }

      item.hidden = false;
      visible += 1;

      var more = item.querySelector(".md-search-result__more");
      if (more) more.hidden = false;

      if (platform === "student") {
        ensureBadge(item.querySelector("h1"), itemPlatform);
      }
    });

    var meta = root.querySelector(".md-search-result__meta");
    if (meta && items.length) {
      if (!visible) {
        meta.textContent = "No matching documents";
      } else if (visible === 1) {
        meta.textContent = "1 matching document";
      } else {
        meta.textContent = visible + " matching documents";
      }
    }
  }

  function watchResults() {
    var root = document.querySelector("[data-md-component='search-result']");
    if (!root || root.dataset.searchWatch === "true") return;
    root.dataset.searchWatch = "true";

    var observer = new MutationObserver(function () {
      observer.disconnect();
      decorateResults();
      observer.observe(root, { childList: true, subtree: true });
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function bindSearchInput() {
    var input = document.querySelector(".md-search__input");
    if (!input || input.dataset.searchFilter === "true") return;
    input.dataset.searchFilter = "true";
    ["input", "keyup", "search", "paste", "change"].forEach(function (eventName) {
      input.addEventListener(eventName, decorateResults);
    });
    // Material search listens for keyup. One delayed keyup after paste/autofill
    // is enough; do not dispatch on every input (that can loop with suggest).
    input.addEventListener("paste", function () {
      window.setTimeout(function () {
        input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Unidentified" }));
      }, 0);
    });
  }

  function openSearchOverlay() {
    setPlaceholder();
    watchResults();
    bindSearchInput();
    bindResultClicks();
    decorateResults();
    window.setTimeout(decorateResults, 50);
    window.setTimeout(decorateResults, 250);
  }

  function bindSearchToggle() {
    var toggle = document.getElementById("__search");
    if (!toggle || toggle.dataset.searchFilter === "true") return;
    toggle.dataset.searchFilter = "true";
    toggle.addEventListener("change", function () {
      if (!toggle.checked) return;
      openSearchOverlay();
    });
  }

  function unwrapSearchMarks() {
    var content = document.querySelector(".md-content__inner.md-typeset");
    if (!content) return;
    content.querySelectorAll("mark").forEach(function (mark) {
      var text = document.createTextNode(mark.textContent);
      mark.parentNode.replaceChild(text, mark);
    });
  }

  function closeAndResetSearch() {
    var toggle = document.getElementById("__search");
    if (toggle && toggle.checked) {
      toggle.checked = false;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));
    }

    var input = document.querySelector(".md-search__input");
    if (input && input.value) {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.blur();
    }

    unwrapSearchMarks();

    if (window.location.search.indexOf("h=") !== -1) {
      var url = new URL(window.location.href);
      url.searchParams.delete("h");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }

  function bindResultClicks() {
    if (document.documentElement.dataset.searchClose === "true") return;
    document.documentElement.dataset.searchClose = "true";
    document.addEventListener(
      "click",
      function (event) {
        var anchor = event.target.closest("a.md-search-result__link");
        if (!anchor) return;
        var href = anchor.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        closeAndResetSearch();
        window.location.assign(new URL(href, window.location.href).href);
      },
      true
    );
  }

  function init() {
    setPlaceholder();
    watchResults();
    bindSearchInput();
    bindSearchToggle();
    decorateResults();
    bindResultClicks();
    var toggle = document.getElementById("__search");
    if (!toggle || !toggle.checked) {
      closeAndResetSearch();
    }
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
