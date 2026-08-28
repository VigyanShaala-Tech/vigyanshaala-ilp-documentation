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
      "submit-template-assignment": {
        category: "Submit a Template based assignment",
        categoryPath: "../categories/submit-assignment/",
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
      "submit-template-assignment": {
        category: "Submit a Template based assignment",
        categoryPath: "../categories/submit-assignment/",
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
    admin: {
      "reach-control-hub": {
        category: "How to reach Control Hub",
        categoryPath: "/admin/categories/reach-control-hub/",
      },
      dashboard: {
        category: "Dashboard",
        categoryPath: "/admin/categories/dashboard/",
      },
      "user-management": {
        category: "User Management",
        categoryPath: "/admin/categories/user-management/",
      },
      "course-management": {
        category: "Course Management",
        categoryPath: "/admin/categories/course-management/",
      },
      "certificate-manage": {
        category: "Certificate Manage",
        categoryPath: "/admin/categories/certificate-manage/",
      },
      "cohort-manage-form": {
        category: "Cohort Manage Form",
        categoryPath: "/admin/categories/cohort-manage-form/",
      },
      "rule-engine": {
        category: "Rule Engine",
        categoryPath: "/admin/categories/rule-engine/",
      },
      "badges-management": {
        category: "Badges Management",
        categoryPath: "/admin/categories/badges-management/",
      },
      navigation: {
        category: "NAVIGATION",
        categoryPath: "/admin/categories/navigation/",
      },
      "tas-guide": {
        category: "TAS Admin panel",
        categoryPath: "/admin/tas-admin/",
      },
      "analytics-guide": {
        category: "Analytics",
        categoryPath: "/admin/analytics/",
        byHash: {
          open: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          dashboards: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "course-dashboard": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "at-risk-learners": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "individual-learner-dashboard": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "operator-dashboard": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "course-comparison-dashboard": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "in-context": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          datasets: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          charts: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "create-chart": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          settings: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          "import-dataset": {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
          sql: {
            category: "Analytics",
            categoryPath: "/admin/analytics/",
          },
        },
      },
      "instructor-guide": {
        category: "Instructor dashboard (LMS)",
        categoryPath: "/admin/instructor/",
        byHash: {
          open: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "course-info": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          membership: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "batch-enrollment": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "beta-testers": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "course-team": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          cohorts: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "assign-cohorts": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          extensions: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "student-admin": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "problem-location": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "enrollment-status": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "view-progress": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "adjust-learner-grade": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "adjust-all-grades": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          gradebook: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          discussions: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "data-download": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "data-download-reports": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "special-exams": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "add-extra-time": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "special-exam-attempts": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          certificates: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "enable-certificates": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "regenerate-certificates": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "certificate-exceptions": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          "invalidate-certificates": {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
          reports: {
            category: "Instructor dashboard (LMS)",
            categoryPath: "/admin/instructor/",
          },
        },
      },
      "studio-guide": {
        category: "Studio",
        categoryPath: "/admin/studio/",
        byHash: {
          open: {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "schedule-details": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "course-team": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "advanced-settings": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "course-updates": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "upload-files": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "import-export": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "export-tags": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          checklists: {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "create-course": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "course-outline": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "create-section": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "create-subsection": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "create-unit": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "add-pdf": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "add-google-document": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "add-quick-quiz-maker": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "add-staff-graded-assignment": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "add-zoom-live-class": {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          taxonomies: {
            category: "Studio overview",
            categoryPath: "/admin/categories/studio-overview/",
          },
          "create-library": {
            category: "Manage library",
            categoryPath: "/admin/categories/studio-libraries/",
          },
          "explore-library": {
            category: "Manage library",
            categoryPath: "/admin/categories/studio-libraries/",
          },
          "library-team": {
            category: "Manage library",
            categoryPath: "/admin/categories/studio-libraries/",
          },
          "library-backup": {
            category: "Manage library",
            categoryPath: "/admin/categories/studio-libraries/",
          },
        },
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
    var isAdmin = parts[0] === "admin" || parts[0] === "admin-guide";
    var slug = parts[parts.length - 1];
    var platform = isAdmin ? "admin" : isAndroid ? "android" : "web";
    var helpPath;
    var prefix = parts.indexOf("categories") !== -1 ? "../../" : "../";
    if (isAdmin) {
      helpPath = "/admin-guide/";
    } else {
      helpPath = prefix + "help-center/";
    }

    return {
      platform: platform,
      slug: slug,
      helpPath: helpPath,
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

    var hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && map.byHash && map.byHash[hash]) {
      map = map.byHash[hash];
    }

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
