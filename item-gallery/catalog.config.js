window.projectCatalog = {
  slug: "item-gallery",
  title: "Item Gallery",
  description: "A catalog section scaffolded for future item gallery and browse UI experiments.",
  hero: {
    kicker: "Topic Folder",
    title: "A catalog section scaffolded for future item gallery and browse UI experiments.",
    text:
      "The folder already has its own GitHub Pages entry point and uses the same reusable card system as the rest of the site. Add standalone item gallery files here as the collection grows.",
    meta: [
      "Index page in place",
      "Reusable card system wired",
      "Ready for new entries"
    ]
  },
  sections: [
    {
      title: "Upcoming Item Gallery Work",
      description:
        "This section is intentionally ready before the first gallery ships, so the overall information architecture stays stable as new categories are added.",
      note: "0 published entries",
      items: [
        {
          title: "Item Gallery Collection",
          visualTitle: "Coming Soon",
          eyebrow: "Section Placeholder",
          badge: "Next",
          description:
            "Use this folder for product grids, collection browsers, or showcase layouts. Each future item should remain a standalone HTML file linked from this index.",
          tags: ["Scaffolded", "Ready for content", "Gallery UI"],
          href: "../",
          linkLabel: "Back to home",
          secondaryHref: "../landingpages/",
          secondaryLabel: "View landing pages",
          accent: "linear-gradient(145deg, #9b7747, #4f3727)"
        }
      ]
    }
  ],
  footerNote:
    "To extend this folder later, add new standalone item gallery HTML files here and register them in item-gallery/catalog.config.js."
};
