(function () {
  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    return element;
  }

  function appendChildren(parent, children) {
    children.forEach(function (child) {
      if (child) {
        parent.appendChild(child);
      }
    });
    return parent;
  }

  function renderNav(mount, config) {
    var nav = createElement("header", "site-nav");
    var brand = createElement("a", "site-brand");
    brand.href = config.brand.href;
    brand.setAttribute("aria-label", config.brand.title);

    var brandMark = createElement("div", "site-brand-mark");
    var brandCopy = createElement("div", "site-brand-copy");
    brandCopy.appendChild(createElement("p", "site-brand-label", config.brand.label));
    brandCopy.appendChild(createElement("h1", "site-brand-title", config.brand.title));
    appendChildren(brand, [brandMark, brandCopy]);

    var links = createElement("nav", "site-links");
    links.setAttribute("aria-label", "Primary");

    config.navLinks.forEach(function (link) {
      var anchor = createElement(
        "a",
        "site-link" + (link.active ? " is-active" : ""),
        link.label
      );
      anchor.href = link.href;
      links.appendChild(anchor);
    });

    appendChildren(nav, [brand, links]);
    mount.appendChild(nav);
  }

  function renderHero(mount, hero) {
    var section = createElement("section", "hero");
    var inner = createElement("div", "hero-inner");
    inner.appendChild(createElement("div", "hero-kicker", hero.kicker));
    inner.appendChild(createElement("h2", "hero-title", hero.title));
    inner.appendChild(createElement("p", "hero-text", hero.text));

    if (hero.meta && hero.meta.length) {
      var metaRow = createElement("div", "hero-meta");
      hero.meta.forEach(function (item) {
        metaRow.appendChild(createElement("div", "meta-pill", item));
      });
      inner.appendChild(metaRow);
    }

    section.appendChild(inner);
    mount.appendChild(section);
  }

  function renderSectionHead(parent, section) {
    var head = createElement("div", "section-head");
    var copy = createElement("div");
    copy.appendChild(createElement("h3", "section-title", section.title));
    copy.appendChild(createElement("p", "section-copy", section.description));
    head.appendChild(copy);

    if (section.note) {
      head.appendChild(createElement("div", "section-note", section.note));
    }

    parent.appendChild(head);
  }

  function buildMeta(tags, className) {
    if (!tags || !tags.length) {
      return null;
    }

    var wrap = createElement("div", className);
    tags.forEach(function (tag) {
      wrap.appendChild(createElement("span", "card-tag", tag));
    });
    return wrap;
  }

  function renderCard(item) {
    var card = createElement("article", "catalog-card");
    var visual = createElement("div", "card-visual");
    visual.style.setProperty("--card-bg", item.accent || "linear-gradient(145deg, #d59f6f, #8f4e32)");

    var visualCopy = createElement("div", "card-visual-copy");
    visualCopy.appendChild(createElement("div", "card-label", item.eyebrow || "Showcase"));
    visualCopy.appendChild(createElement("h4", "card-visual-title", item.visualTitle || item.title));
    visual.appendChild(visualCopy);

    var body = createElement("div", "card-body");
    var header = createElement("div", "card-header");
    var titleWrap = createElement("div");
    titleWrap.appendChild(createElement("h5", "card-title", item.title));
    header.appendChild(titleWrap);

    if (item.badge) {
      header.appendChild(createElement("span", "card-badge", item.badge));
    }

    body.appendChild(header);
    body.appendChild(createElement("p", "card-text", item.description));

    var meta = buildMeta(item.tags, "card-meta");
    if (meta) {
      body.appendChild(meta);
    }

    var actions = createElement("div", "card-actions");
    var primary = createElement("a", "card-link", item.linkLabel || "Open page");
    primary.href = item.href;
    actions.appendChild(primary);

    if (item.secondaryHref && item.secondaryLabel) {
      var secondary = createElement("a", "card-link card-link-secondary", item.secondaryLabel);
      secondary.href = item.secondaryHref;
      actions.appendChild(secondary);
    }

    appendChildren(card, [visual, body, actions]);
    return card;
  }

  function renderSection(mount, section) {
    var wrapper = createElement("section");
    renderSectionHead(wrapper, section);

    if (!section.items || !section.items.length) {
      wrapper.appendChild(
        createElement(
          "div",
          "empty-state",
          section.emptyMessage || "No entries have been published yet."
        )
      );
      mount.appendChild(wrapper);
      return;
    }

    var grid = createElement("div", "card-grid");
    section.items.forEach(function (item) {
      grid.appendChild(renderCard(item));
    });
    wrapper.appendChild(grid);
    mount.appendChild(wrapper);
  }

  function renderFooter(mount, text) {
    mount.appendChild(createElement("footer", "footer-note", text));
  }

  function renderCatalogPage(config) {
    var mount = document.getElementById(config.mountId || "app");

    if (!mount) {
      throw new Error("Catalog mount element not found.");
    }

    mount.className = "site-shell";
    renderNav(mount, config);
    renderHero(mount, config.hero);

    (config.sections || []).forEach(function (section) {
      renderSection(mount, section);
    });

    if (config.footerNote) {
      renderFooter(mount, config.footerNote);
    }
  }

  function projectToNavLink(project, activeSlug, basePath) {
    return {
      label: project.shortTitle || project.title,
      href: (basePath || "") + project.navHref,
      active: project.slug === activeSlug
    };
  }

  function projectToCard(project, cardLinkLabel) {
    return {
      title: project.title,
      visualTitle: project.visualTitle || project.title,
      eyebrow: project.eyebrow || "Project Folder",
      badge: project.badge,
      description: project.summary,
      tags: project.tags || [],
      href: project.href,
      linkLabel: cardLinkLabel || "Open section",
      accent: project.accent
    };
  }

  window.renderCatalogPage = renderCatalogPage;

  window.renderHomeFromRegistry = function renderHomeFromRegistry(options) {
    var projects = window.siteProjects || [];

    renderCatalogPage({
      mountId: (options && options.mountId) || "app",
      brand: {
        href: "./",
        label: "GitHub Pages",
        title: "Web Design Collection"
      },
      navLinks: [{ label: "Home", href: "./", active: true }].concat(
        projects.map(function (project) {
          return projectToNavLink(project, null, "");
        })
      ),
      hero: {
        kicker: "Static HTML + CSS + JS",
        title: "A lightweight gallery for standalone web experiments.",
        text:
          "This repository is structured for GitHub Pages: each top-level folder is its own topic, each topic has an index page, and every design stays self-contained without frameworks or build tooling.",
        meta: [
          "Root homepage for project discovery",
          projects.length + " project folders registered",
          "Standalone files ready to host"
        ]
      },
      sections: [
        {
          title: "Projects",
          description:
            "Browse by topic. Each card links to a dedicated section page that can grow independently while staying easy to publish and maintain.",
          note: projects.length + " sections available",
          items: projects.map(function (project) {
            return projectToCard(project, "Open section");
          })
        }
      ],
      footerNote:
        "To add a new project later, create a new folder with its own index.html and catalog.config.js, then register the folder once in assets/site-data.js."
    });
  };

  window.renderProjectFromManifest = function renderProjectFromManifest(options) {
    var projects = window.siteProjects || [];
    var projectCatalog = window.projectCatalog;

    if (!projectCatalog) {
      throw new Error("Project catalog manifest not found.");
    }

    renderCatalogPage({
      mountId: (options && options.mountId) || "app",
      brand: {
        href: "../",
        label: "Project Index",
        title: projectCatalog.title
      },
      navLinks: [{ label: "Home", href: "../", active: false }].concat(
        projects.map(function (project) {
          return projectToNavLink(project, projectCatalog.slug, "../");
        })
      ),
      hero: projectCatalog.hero,
      sections: projectCatalog.sections,
      footerNote: projectCatalog.footerNote
    });
  };
})();
