/**
 * Old bookmarks used /tas-admin/ and /analytics/ (404).
 * Send those URLs to the admin guides.
 */
(function () {
  "use strict";
  var map = {
    "/tas-admin": "/admin/tas-admin/",
    "/tas-admin/": "/admin/tas-admin/",
    "/analytics": "/admin/analytics/",
    "/analytics/": "/admin/analytics/",
    "/admin": "/admin-guide/",
    "/admin/": "/admin-guide/",
  };
  var dest = map[window.location.pathname];
  if (dest) {
    window.location.replace(dest);
  }
})();
