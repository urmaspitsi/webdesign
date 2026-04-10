const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const tests = [];

class FakeStyle {
  constructor() {
    this.properties = {};
  }

  setProperty(name, value) {
    this.properties[name] = value;
  }

  getPropertyValue(name) {
    return this.properties[name] || "";
  }
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.className = "";
    this.children = [];
    this.childNodes = this.children;
    this.attributes = {};
    this.style = new FakeStyle();
    this.textContent = "";
    this.href = "";
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "href") {
      this.href = String(value);
    }
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name)
      ? this.attributes[name]
      : null;
  }
}

class FakeDocument {
  constructor() {
    this.nodesById = {};
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  getElementById(id) {
    return this.nodesById[id] || null;
  }

  registerElement(id, element) {
    this.nodesById[id] = element;
    element.id = id;
  }
}

function walk(node, visit) {
  visit(node);
  node.children.forEach(function (child) {
    walk(child, visit);
  });
}

function findAllByClass(root, className) {
  const matches = [];

  walk(root, function (node) {
    const classes = (node.className || "").split(/\s+/).filter(Boolean);
    if (classes.includes(className)) {
      matches.push(node);
    }
  });

  return matches;
}

function findFirstByClass(root, className) {
  return findAllByClass(root, className)[0] || null;
}

function flushPromises() {
  return new Promise(function (resolve) {
    setImmediate(resolve);
  });
}

function test(name, fn) {
  tests.push({ name, fn });
}

function createSandbox(fetchImpl) {
  const document = new FakeDocument();
  const app = document.createElement("main");
  document.registerElement("app", app);

  const sandbox = {
    document,
    console,
    URL,
    fetch: fetchImpl || (async function () {
      throw new Error("Unexpected fetch");
    }),
    location: {
      href: "http://localhost:8000/landingpages/index.html"
    }
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  return { sandbox, app };
}

function loadScriptIntoSandbox(filename, sandbox) {
  const source = fs.readFileSync(path.join(process.cwd(), filename), "utf8");
  vm.runInNewContext(source, sandbox, { filename });
}

function sampleProjectCatalog(items) {
  return {
    slug: "landingpages",
    title: "Landing Pages",
    hero: {
      kicker: "Topic Folder",
      title: "Sample Title",
      text: "Sample text",
      meta: ["One", "Two"]
    },
    sections: [
      {
        title: "Published Pages",
        description: "Description",
        note: "Catalog view",
        items
      }
    ]
  };
}

test("home cards share one accent, use folder titles, and do not show eyebrow labels", function () {
  const { sandbox, app } = createSandbox();

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  loadScriptIntoSandbox("assets/site-data.js", sandbox);

  sandbox.renderHomeFromRegistry({ mountId: "app" });

  const cards = findAllByClass(app, "catalog-card");
  const visuals = findAllByClass(app, "card-visual");
  const visualTitles = findAllByClass(app, "card-visual-title").map(function (node) {
    return node.textContent;
  });

  assert.equal(cards.length, sandbox.siteProjects.length);
  assert.deepEqual(visualTitles, Array.from(sandbox.siteProjects, function (project) {
    return project.title;
  }));
  assert.equal(findAllByClass(app, "card-label").length, 0);
  visuals.forEach(function (visual) {
    assert.equal(
      visual.style.getPropertyValue("--card-bg"),
      "linear-gradient(145deg, #3f7b74, #173b39)"
    );
  });
});

test("project pages remove hero kicker/meta and hide item tag pills", async function () {
  const { sandbox, app } = createSandbox(async function () {
    return {
      ok: true,
      text: async function () {
        return "<style>body{background:#000;color:#fff;font-family:Inter,sans-serif;}</style>";
      }
    };
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.siteProjects = [{ slug: "landingpages", title: "Landing Pages", navHref: "landingpages/index.html" }];
  sandbox.projectCatalog = sampleProjectCatalog([
    {
      title: "Landing 1 ChatGPT",
      visualTitle: "Dark Editorial",
      description: "Description",
      tags: ["Dark theme", "Editorial"],
      href: "landing1_chatgpt.html"
    }
  ]);

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  assert.equal(findAllByClass(app, "hero-kicker").length, 0);
  assert.equal(findAllByClass(app, "hero-meta").length, 0);
  assert.equal(findAllByClass(app, "card-tag").length, 0);
});

test("project item cards use the shared dark visual accent regardless of source config", async function () {
  const { sandbox, app } = createSandbox(async function () {
    return {
      ok: true,
      text: async function () {
        return "<style>body{background:#000;color:#fff;font-family:Inter,sans-serif;}</style>";
      }
    };
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.siteProjects = [{ slug: "landingpages", title: "Landing Pages", navHref: "landingpages/index.html" }];
  sandbox.projectCatalog = sampleProjectCatalog([
    {
      title: "One",
      visualTitle: "One",
      description: "Description",
      href: "one.html",
      accent: "linear-gradient(145deg, red, blue)",
      cardTheme: {
        visualBackground: "linear-gradient(145deg, yellow, purple)"
      }
    },
    {
      title: "Two",
      visualTitle: "Two",
      description: "Description",
      href: "two.html",
      accent: "linear-gradient(145deg, orange, green)",
      cardTheme: {
        visualBackground: "linear-gradient(145deg, pink, brown)"
      }
    }
  ]);

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  findAllByClass(app, "card-visual").forEach(function (visual) {
    assert.equal(
      visual.style.getPropertyValue("--card-bg"),
      "linear-gradient(180deg, #2d2d2d 0%, #151515 100%)"
    );
  });
});

test("linked page body theme is applied automatically to item card body styles", async function () {
  const responses = {
    "http://localhost:8000/landingpages/pocket.html": [
      "<style>",
      ":root { --bg: #0b0c0f; --text: #e7e9ee; --muted: #a7adbb; }",
      "body {",
      "  background: radial-gradient(1000px 600px at 20% 0%, rgba(255,255,255,.06), transparent 60%), var(--bg);",
      "  color: var(--text);",
      "  font-family: ui-sans-serif, system-ui, sans-serif;",
      "}",
      "</style>"
    ].join("")
  };

  const { sandbox, app } = createSandbox(async function (url) {
    return {
      ok: true,
      text: async function () {
        return responses[url];
      }
    };
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.siteProjects = [{ slug: "landingpages", title: "Landing Pages", navHref: "landingpages/index.html" }];
  sandbox.projectCatalog = sampleProjectCatalog([
    {
      title: "Pocket",
      visualTitle: "Immersive Promo",
      description: "Description",
      href: "pocket.html",
      cardTheme: {
        panelBackground: "linear-gradient(180deg, #221311, #120b0a)",
        textColor: "#f6e7df",
        mutedColor: "#c9aaa0",
        bodyTitleFont: "Georgia, serif",
        bodyFont: "Georgia, serif"
      }
    }
  ]);

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  const card = findFirstByClass(app, "catalog-card");

  assert.equal(
    card.style.getPropertyValue("--card-panel-bg"),
    "radial-gradient(1000px 600px at 20% 0%, rgba(255,255,255,.06), transparent 60%), #0b0c0f"
  );
  assert.equal(card.style.getPropertyValue("--card-ink"), "#e7e9ee");
  assert.equal(card.style.getPropertyValue("--card-muted"), "#a7adbb");
  assert.equal(
    card.style.getPropertyValue("--card-title-font"),
    "ui-sans-serif, system-ui, sans-serif"
  );
  assert.equal(
    card.style.getPropertyValue("--card-body-font"),
    "ui-sans-serif, system-ui, sans-serif"
  );
});

test("folder item card styling is centralized for every item and ignores conflicting visual config", async function () {
  const fetchedUrls = [];
  const responses = {
    "http://localhost:8000/chat-ui/first.html": [
      "<style>",
      ":root { --pageText: #dde7ee; --muted: #8fa3b3; }",
      "body { background: #101820; color: var(--pageText); font-family: Inter, sans-serif; }",
      "</style>"
    ].join(""),
    "http://localhost:8000/chat-ui/second.html": [
      "<style>",
      ":root { --text: #f7efe6; --text-muted: #c8b39f; --panel: #26160f; }",
      "html, body { background: linear-gradient(180deg, #3c2418, var(--panel)); color: var(--text); font-family: Georgia, serif; }",
      "</style>"
    ].join("")
  };

  const { sandbox, app } = createSandbox(async function (url) {
    fetchedUrls.push(url);
    return {
      ok: true,
      text: async function () {
        return responses[url];
      }
    };
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.location.href = "http://localhost:8000/chat-ui/index.html";
  sandbox.siteProjects = [{ slug: "chat-ui", title: "Chat UI", navHref: "chat-ui/index.html" }];
  sandbox.projectCatalog = {
    slug: "chat-ui",
    title: "Chat UI",
    hero: {
      title: "Chat UI",
      text: "Folder",
      kicker: "Topic Folder",
      meta: ["One"]
    },
    sections: [
      {
        items: [
          {
            title: "First",
            visualTitle: "First",
            description: "First description",
            href: "first.html",
            accent: "linear-gradient(145deg, red, blue)",
            cardTheme: {
              visualBackground: "linear-gradient(145deg, yellow, green)",
              panelBackground: "#000000",
              textColor: "#ffffff",
              mutedColor: "#999999",
              bodyTitleFont: "Arial, sans-serif",
              bodyFont: "Arial, sans-serif"
            }
          },
          {
            title: "Second",
            visualTitle: "Second",
            description: "Second description",
            href: "second.html",
            accent: "linear-gradient(145deg, orange, purple)",
            cardTheme: {
              visualBackground: "linear-gradient(145deg, teal, navy)",
              panelBackground: "#111111",
              textColor: "#eeeeee",
              mutedColor: "#777777",
              bodyTitleFont: "Tahoma, sans-serif",
              bodyFont: "Tahoma, sans-serif"
            }
          }
        ]
      }
    ]
  };

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  const cards = findAllByClass(app, "catalog-card");
  const visuals = findAllByClass(app, "card-visual");

  assert.deepEqual(fetchedUrls, [
    "http://localhost:8000/chat-ui/first.html",
    "http://localhost:8000/chat-ui/second.html"
  ]);

  visuals.forEach(function (visual) {
    assert.equal(
      visual.style.getPropertyValue("--card-bg"),
      "linear-gradient(180deg, #2d2d2d 0%, #151515 100%)"
    );
  });

  assert.equal(cards[0].style.getPropertyValue("--card-panel-bg"), "#101820");
  assert.equal(cards[0].style.getPropertyValue("--card-ink"), "#dde7ee");
  assert.equal(cards[0].style.getPropertyValue("--card-muted"), "#8fa3b3");
  assert.equal(cards[0].style.getPropertyValue("--card-title-font"), "Inter, sans-serif");

  assert.equal(
    cards[1].style.getPropertyValue("--card-panel-bg"),
    "linear-gradient(180deg, #3c2418, #26160f)"
  );
  assert.equal(cards[1].style.getPropertyValue("--card-ink"), "#f7efe6");
  assert.equal(cards[1].style.getPropertyValue("--card-muted"), "#c8b39f");
  assert.equal(cards[1].style.getPropertyValue("--card-title-font"), "Georgia, serif");
});

test("linked page theme lookup falls back to configured card styles when fetch fails", async function () {
  const { sandbox, app } = createSandbox(async function () {
    throw new Error("Network error");
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.siteProjects = [{ slug: "landingpages", title: "Landing Pages", navHref: "landingpages/index.html" }];
  sandbox.projectCatalog = sampleProjectCatalog([
    {
      title: "Fallback",
      visualTitle: "Fallback",
      description: "Description",
      href: "fallback.html",
      cardTheme: {
        panelBackground: "linear-gradient(180deg, #111111, #0c0c0c)",
        textColor: "#f5f5f5",
        mutedColor: "#b3b3b3",
        bodyTitleFont: "Inter, sans-serif",
        bodyFont: "Inter, sans-serif"
      }
    }
  ]);

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  const card = findFirstByClass(app, "catalog-card");

  assert.equal(
    card.style.getPropertyValue("--card-panel-bg"),
    "linear-gradient(180deg, #111111, #0c0c0c)"
  );
  assert.equal(card.style.getPropertyValue("--card-ink"), "#f5f5f5");
  assert.equal(card.style.getPropertyValue("--card-muted"), "#b3b3b3");
  assert.equal(card.style.getPropertyValue("--card-title-font"), "Inter, sans-serif");
  assert.equal(card.style.getPropertyValue("--card-body-font"), "Inter, sans-serif");
});

test("relative linked-page theme fetch remains GitHub Pages compatible under a repo subpath", async function () {
  const fetchedUrls = [];
  const { sandbox, app } = createSandbox(async function (url) {
    fetchedUrls.push(url);
    return {
      ok: true,
      text: async function () {
        return "<style>body{background:#0b0c0f;color:#e7e9ee;font-family:Inter,sans-serif;}</style>";
      }
    };
  });

  loadScriptIntoSandbox("assets/catalog.js", sandbox);
  sandbox.location.href = "https://urmas.github.io/webdesign/chat-ui/index.html";
  sandbox.siteProjects = [{ slug: "chat-ui", title: "Chat UI", navHref: "chat-ui/index.html" }];
  sandbox.projectCatalog = {
    slug: "chat-ui",
    title: "Chat UI",
    hero: {
      title: "Chat UI",
      text: "Folder"
    },
    sections: [
      {
        items: [
          {
            title: "Thread",
            visualTitle: "Thread",
            description: "Description",
            href: "thread.html"
          }
        ]
      }
    ]
  };

  sandbox.renderProjectFromManifest({ mountId: "app" });
  await flushPromises();

  assert.deepEqual(fetchedUrls, [
    "https://urmas.github.io/webdesign/chat-ui/thread.html"
  ]);

  const card = findFirstByClass(app, "catalog-card");
  assert.equal(card.href, "thread.html");
  assert.equal(card.style.getPropertyValue("--card-panel-bg"), "#0b0c0f");
  assert.equal(card.style.getPropertyValue("--card-ink"), "#e7e9ee");
  assert.equal(card.style.getPropertyValue("--card-title-font"), "Inter,sans-serif");
});

(async function run() {
  let failures = 0;

  for (const entry of tests) {
    try {
      await entry.fn();
      console.log("PASS", entry.name);
    } catch (error) {
      failures += 1;
      console.error("FAIL", entry.name);
      console.error(error);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("PASS", tests.length + " tests");
})();
