(function () {
  var storageKey = "news-feed-theme";
  var icons = {
    light: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2.5M12 19v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2.5 12H5M19 12h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"></path></svg>',
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 9 9 0 1 0 20 14.5z"></path></svg>'
  };

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.innerHTML = theme === "light" ? icons.dark : icons.light;
      button.setAttribute("title", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    });
  }

  function init() {
    var defaultTheme = document.body.getAttribute("data-default-theme") || "dark";
    var saved = localStorage.getItem(storageKey) || defaultTheme;
    applyTheme(saved);

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var next = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
