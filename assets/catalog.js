(function () {
  var HOME_FOLDER_CARD_ACCENT = "linear-gradient(145deg, #3f7b74, #173b39)";
  var HOME_FOLDER_CARD_THEME = {
    panelBackground: "linear-gradient(180deg, #2e2a27, #262320)",
    panelBorder: "rgba(255, 255, 255, 0.1)",
    panelShadow: "0 18px 50px rgba(0, 0, 0, 0.24)",
    textColor: "#f3efe8",
    mutedColor: "#b8aea3"
  };
  var FOLDER_ITEM_CARD_VISUAL_ACCENT = "linear-gradient(180deg, #2d2d2d 0%, #151515 100%)";

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

  function renderHero(mount, hero, variant) {
    var heroClassName = "hero";
    var normalizedVariant = variant || "default";
    var section;

    if (normalizedVariant !== "default") {
      heroClassName += " hero-" + normalizedVariant;
    }

    section = createElement("section", heroClassName);
    var inner = createElement("div", "hero-inner");

    if (hero.kicker) {
      inner.appendChild(createElement("div", "hero-kicker", hero.kicker));
    }

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

  function applyThemeStyles(element, theme) {
    if (!theme) {
      return;
    }

    Object.keys(theme).forEach(function (key) {
      if (theme[key] !== undefined && theme[key] !== null && theme[key] !== "") {
        element.style.setProperty(key, theme[key]);
      }
    });
  }

  function parseDeclarations(block) {
    var declarations = {};

    if (!block) {
      return declarations;
    }

    block.split(";").forEach(function (declaration) {
      var separatorIndex = declaration.indexOf(":");
      var property;
      var value;

      if (separatorIndex === -1) {
        return;
      }

      property = declaration.slice(0, separatorIndex).trim();
      value = declaration.slice(separatorIndex + 1).trim();

      if (property && value) {
        declarations[property] = value;
      }
    });

    return declarations;
  }

  function selectorTargetsBody(selectorText) {
    return selectorText
      .split(",")
      .map(function (selector) {
        return selector.trim();
      })
      .some(function (selector) {
        return selector === "body";
      });
  }

  function collectCssData(cssText) {
    var rules = /([^{}]+)\{([^{}]+)\}/g;
    var match;
    var rootVars = {};
    var bodyDeclarations = {};

    while ((match = rules.exec(cssText))) {
      var selectorText = match[1].trim();
      var declarations = parseDeclarations(match[2]);

      if (selectorText === ":root") {
        Object.keys(declarations).forEach(function (property) {
          rootVars[property] = declarations[property];
        });
      }

      if (selectorTargetsBody(selectorText)) {
        Object.keys(declarations).forEach(function (property) {
          bodyDeclarations[property] = declarations[property];
        });
      }
    }

    return {
      rootVars: rootVars,
      bodyDeclarations: bodyDeclarations
    };
  }

  function resolveCssValue(value, rootVars, depth) {
    var normalizedDepth = depth || 0;

    if (!value || normalizedDepth > 5) {
      return value;
    }

    return value.replace(/var\((--[^),\s]+)\)/g, function (fullMatch, variableName) {
      if (rootVars[variableName] === undefined) {
        return fullMatch;
      }

      return resolveCssValue(rootVars[variableName], rootVars, normalizedDepth + 1);
    });
  }

  function extractThemeFromLinkedPage(html) {
    var styleBlocks = [];
    var stylePattern = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    var match;
    var rootVars = {};
    var bodyDeclarations = {};

    while ((match = stylePattern.exec(html))) {
      styleBlocks.push(match[1]);
    }

    styleBlocks.forEach(function (cssText) {
      var cssData = collectCssData(cssText);

      Object.keys(cssData.rootVars).forEach(function (property) {
        rootVars[property] = cssData.rootVars[property];
      });

      Object.keys(cssData.bodyDeclarations).forEach(function (property) {
        bodyDeclarations[property] = cssData.bodyDeclarations[property];
      });
    });

    return {
      panelBackground: resolveCssValue(
        bodyDeclarations.background || bodyDeclarations["background-color"],
        rootVars
      ),
      textColor: resolveCssValue(bodyDeclarations.color, rootVars),
      mutedColor: resolveCssValue(rootVars["--muted"] || rootVars["--text-muted"], rootVars),
      bodyFont: resolveCssValue(bodyDeclarations["font-family"], rootVars)
    };
  }

  function hydrateCardThemeFromHref(card, href) {
    fetch(new URL(href, window.location.href).href)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load linked page theme.");
        }

        return response.text();
      })
      .then(function (html) {
        var theme = extractThemeFromLinkedPage(html);

        applyThemeStyles(card, {
          "--card-panel-bg": theme.panelBackground,
          "--card-ink": theme.textColor,
          "--card-muted": theme.mutedColor,
          "--card-title-font": theme.bodyFont,
          "--card-body-font": theme.bodyFont
        });
      })
      .catch(function () {
        return null;
      });
  }

  function renderCard(item) {
    var cardTagName = item.href && !item.secondaryHref ? "a" : "article";
    var card = createElement(cardTagName, "catalog-card");
    var visual = createElement("div", "card-visual");
    var theme = item.cardTheme || {};

    if (cardTagName === "a") {
      card.href = item.href;
      card.setAttribute("aria-label", item.linkLabel || item.title);
    }

    visual.style.setProperty("--card-bg", item.accent || "linear-gradient(145deg, #d59f6f, #8f4e32)");
    applyThemeStyles(card, {
      "--card-panel-bg": theme.panelBackground,
      "--card-panel-border": theme.panelBorder,
      "--card-panel-shadow": theme.panelShadow,
      "--card-ink": theme.textColor,
      "--card-muted": theme.mutedColor,
      "--card-tag-bg": theme.tagBackground,
      "--card-tag-ink": theme.tagColor,
      "--card-link-bg": theme.linkBackground,
      "--card-link-ink": theme.linkColor,
      "--card-link-border": theme.linkBorder,
      "--card-badge-bg": theme.badgeBackground,
      "--card-badge-ink": theme.badgeColor,
      "--card-title-font": theme.bodyTitleFont,
      "--card-title-weight": theme.bodyTitleWeight,
      "--card-body-font": theme.bodyFont
    });
    applyThemeStyles(visual, {
      "--card-bg": theme.visualBackground,
      "--card-visual-ink": theme.visualColor,
      "--card-visual-title-font": theme.visualTitleFont,
      "--card-visual-title-weight": theme.visualTitleWeight,
      "--card-visual-title-size": theme.visualTitleSize,
      "--card-visual-title-spacing": theme.visualTitleSpacing,
      "--card-visual-label-ink": theme.labelColor
    });

    var visualCopy = createElement("div", "card-visual-copy");
    if (item.eyebrow) {
      visualCopy.appendChild(createElement("div", "card-label", item.eyebrow));
    }
    visualCopy.appendChild(createElement("h4", "card-visual-title", item.visualTitle || item.title));
    visual.appendChild(visualCopy);

    var body = createElement("div", "card-body");
    var header = createElement("div", "card-header");
    var titleWrap = createElement("div");
    titleWrap.appendChild(createElement("h5", "card-title", item.title));
    header.appendChild(titleWrap);

    body.appendChild(header);
    body.appendChild(createElement("p", "card-text", item.description));

    var actions = createElement("div", "card-actions");
    if (item.secondaryHref && item.secondaryLabel) {
      var secondary = createElement("a", "card-link card-link-secondary", item.secondaryLabel);
      secondary.href = item.secondaryHref;
      actions.appendChild(secondary);
    }

    if (actions.childNodes.length > 0) {
      appendChildren(card, [visual, body, actions]);
    } else {
      appendChildren(card, [visual, body]);
    }
    return card;
  }

  function renderSection(mount, section, options) {
    var wrapper = createElement("section");
    var settings = options || {};
    if (!section.hideHeader) {
      renderSectionHead(wrapper, section);
    }

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
      var card = renderCard(item);
      grid.appendChild(card);

      if (settings.resolveLinkedThemes && item.href) {
        hydrateCardThemeFromHref(card, item.href);
      }
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
    if (!config.hideNav) {
      renderNav(mount, config);
    }

    if (!config.hideHero) {
      renderHero(mount, config.hero, config.heroVariant);
    }

    (config.sections || []).forEach(function (section) {
      renderSection(mount, section, {
        resolveLinkedThemes: config.resolveLinkedThemes
      });
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

  function projectToCard(project, cardLinkLabel, options) {
    var settings = options || {};
    var theme = {};

    Object.keys(project.cardTheme || {}).forEach(function (key) {
      theme[key] = project.cardTheme[key];
    });

    Object.keys(settings.cardTheme || {}).forEach(function (key) {
      theme[key] = settings.cardTheme[key];
    });

    return {
      title: project.title,
      visualTitle: project.visualTitle || project.title,
      eyebrow: project.eyebrow || "",
      badge: project.badge,
      description: project.summary,
      tags: settings.includeTags === false ? [] : project.tags || [],
      href: project.href,
      linkLabel: cardLinkLabel || "Open section",
      accent: settings.accent || project.accent,
      cardTheme: theme
    };
  }

  window.renderCatalogPage = renderCatalogPage;

  window.renderHomeFromRegistry = function renderHomeFromRegistry(options) {
    var projects = window.siteProjects || [];

    renderCatalogPage({
      mountId: (options && options.mountId) || "app",
      hideNav: true,
      heroVariant: "minimal",
      brand: {
        href: "./index.html",
        label: "GitHub Pages",
        title: "Web Design Collection"
      },
      navLinks: [{ label: "Home", href: "./index.html", active: true }].concat(
        projects.map(function (project) {
          return projectToNavLink(project, null, "");
        })
      ),
      hero: {
        title: "My web design gallery",
        text:
          "This is my little gallery of various web design projects."
      },
      sections: [
        {
          hideHeader: true,
          title: "Projects",
          description:
            "Browse by topic. Each card links to a dedicated section page that can grow independently while staying easy to publish and maintain.",
          note: projects.length + " sections available",
          items: projects.map(function (project) {
            return projectToCard(project, "Open section", {
              includeTags: false,
              accent: HOME_FOLDER_CARD_ACCENT,
              cardTheme: HOME_FOLDER_CARD_THEME
            });
          })
        }
      ]
    });
  };

  window.renderProjectFromManifest = function renderProjectFromManifest(options) {
    var projects = window.siteProjects || [];
    var projectCatalog = window.projectCatalog;
    var sections;
    var hero;

    if (!projectCatalog) {
      throw new Error("Project catalog manifest not found.");
    }

    hero = {};
    Object.keys(projectCatalog.hero || {}).forEach(function (key) {
      hero[key] = projectCatalog.hero[key];
    });
    delete hero.kicker;
    delete hero.meta;

    sections = (projectCatalog.sections || []).map(function (section) {
      var nextSection = {};
      Object.keys(section).forEach(function (key) {
        nextSection[key] = section[key];
      });
      nextSection.items = (section.items || []).map(function (item) {
        var nextItem = {};
        var nextTheme = {};

        Object.keys(item).forEach(function (key) {
          nextItem[key] = item[key];
        });

        Object.keys(item.cardTheme || {}).forEach(function (key) {
          nextTheme[key] = item.cardTheme[key];
        });

        nextItem.accent = FOLDER_ITEM_CARD_VISUAL_ACCENT;
        nextTheme.visualBackground = FOLDER_ITEM_CARD_VISUAL_ACCENT;
        nextItem.cardTheme = nextTheme;

        return nextItem;
      });
      nextSection.hideHeader = true;
      return nextSection;
    });

    renderCatalogPage({
      mountId: (options && options.mountId) || "app",
      hideNav: true,
      heroVariant: "minimal",
      resolveLinkedThemes: true,
      brand: {
        href: "../index.html",
        label: "Project Index",
        title: projectCatalog.title
      },
      navLinks: [{ label: "Home", href: "../index.html", active: false }].concat(
        projects.map(function (project) {
          return projectToNavLink(project, projectCatalog.slug, "../");
        })
      ),
      hero: hero,
      sections: sections
    });
  };
})();
