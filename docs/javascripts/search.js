/**
 * Help Center search:
 * - keep Web and Android results on the matching guide
 * - open the matching article section (hash), not the whole page
 * - label results so Web vs Android is clear
 */
(function () {
  "use strict";

  var PLACEHOLDER = "Search for help";

  function setPlaceholder() {
    var input = document.querySelector(".md-search__input");
    if (input) {
      input.setAttribute("placeholder", PLACEHOLDER);
      input.setAttribute("aria-label", PLACEHOLDER);
    }
  }

  function currentPlatform() {
    var parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (!parts.length) return "all";
    if (parts[0] === "android") return "android";
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

  function platformOf(path) {
    return isAndroidPath(path) ? "android" : "web";
  }

  function ensureBadge(heading, platform) {
    if (!heading || heading.querySelector(".search-platform")) return;
    var badge = document.createElement("span");
    badge.className = "search-platform";
    badge.textContent = platform === "android" ? "Android" : "Web";
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
      if (platform !== "all" && itemPlatform !== platform) {
        item.hidden = true;
        return;
      }

      item.hidden = false;
      visible += 1;

      var hashed = links.filter(function (link) {
        return (link.getAttribute("href") || "").indexOf("#") !== -1;
      });
      var unhashed = links.filter(function (link) {
        return (link.getAttribute("href") || "").indexOf("#") === -1;
      });

      if (hashed.length && unhashed.length) {
        unhashed.forEach(function (link) {
          link.setAttribute("href", hashed[0].getAttribute("href"));
        });
      }

      if (platform === "all") {
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
    var root = document.querySelector("[data-md-component='search-result']");
    if (!root || root.dataset.searchClose === "true") return;
    root.dataset.searchClose = "true";
    root.addEventListener("click", function (event) {
      if (!event.target.closest("a.md-search-result__link")) return;
      closeAndResetSearch();
    });
  }

  function init() {
    setPlaceholder();
    watchResults();
    decorateResults();
    bindResultClicks();
    closeAndResetSearch();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
