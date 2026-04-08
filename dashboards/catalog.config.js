window.projectCatalog = {
  slug: "dashboards",
  title: "Dashboards",
  description: "A dashboard section scaffolded for future UI experiments.",
  hero: {
    kicker: "Topic Folder",
    title: "A dashboard section scaffolded for future UI experiments.",
    text:
      "The folder already has its own GitHub Pages entry point and uses the same reusable card system as the rest of the site. Add standalone dashboard files here as the collection grows.",
    meta: [
      "Index page in place",
      "Reusable card system wired",
      "Ready for new entries"
    ]
  },
  sections: [
    {
      title: "Upcoming Dashboard Work",
      description:
        "This section is intentionally ready before the first dashboard ships, so the overall information architecture stays stable as new categories are added.",
      note: "0 published entries",
      items: [
        {
          title: "Dashboard Collection",
          visualTitle: "Coming Soon",
          eyebrow: "Section Placeholder",
          badge: "Next",
          description:
            "Use this folder for analytics, reporting, admin, or operational dashboard studies. Each future item should remain a standalone HTML file linked from this index.",
          tags: ["Scaffolded", "Ready for content", "Dashboard UI"],
          href: "../",
          linkLabel: "Back to home",
          secondaryHref: "../landingpages/",
          secondaryLabel: "View landing pages",
          accent: "linear-gradient(145deg, #2a6f6a, #16363f)"
        }
      ]
    }
  ],
  footerNote:
    "To extend this folder later, add new standalone dashboard HTML files here and register them in dashboards/catalog.config.js."
};
