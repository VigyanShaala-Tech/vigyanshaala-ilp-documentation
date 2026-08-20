/**
 * Header "Export in PDF" saves one combined Web + Android PDF file.
 */
(function () {
  "use strict";

  var PDF_NAME = "VigyanShaala-ILP-Student-Guide.pdf";

  function pdfHref() {
    var logo = document.querySelector(".md-header__button.md-logo");
    var root = logo ? logo.getAttribute("href") : "./";
    if (!root) root = "./";
    if (root.slice(-1) !== "/") root += "/";
    return root + PDF_NAME;
  }

  function addHeaderButton() {
    var inner = document.querySelector(".md-header__inner");
    if (!inner || inner.querySelector(".header-download-pdf")) return;

    var link = document.createElement("a");
    link.className = "header-download-pdf";
    link.href = pdfHref();
    link.textContent = "Export in PDF";
    link.setAttribute("download", PDF_NAME);
    link.setAttribute("title", "Export the full Web and Android student guide as PDF");

    var search = inner.querySelector(".md-search");
    if (search) {
      inner.insertBefore(link, search);
    } else {
      inner.appendChild(link);
    }
  }

  function init() {
    addHeaderButton();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
