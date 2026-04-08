(function () {
  var projectCatalog = window.projectCatalog;
  var metaDescription = document.querySelector('meta[name="description"]');

  if (!projectCatalog) {
    throw new Error("Project catalog manifest not found.");
  }

  document.title = projectCatalog.title;

  if (metaDescription) {
    metaDescription.setAttribute("content", projectCatalog.description || projectCatalog.title);
  }

  window.renderProjectFromManifest({ mountId: "app" });
})();
