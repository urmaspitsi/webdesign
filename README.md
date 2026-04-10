# Web Design Collection

Static GitHub Pages repository for a collection of standalone web pages.

Deployed site: [urmaspitsi.github.io/webdesign](https://urmaspitsi.github.io/webdesign/)

The repository is organized around topic folders. Each topic folder has its own `index.html` and displays a catalog of pages inside that folder. The root `index.html` acts as the main landing page for navigating between folders.

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript
- No framework required for runtime
- Designed to work as a GitHub Pages site from the repository root

## Structure

```text
/
|-- index.html
|-- README.md
|-- assets/
|   |-- catalog.css
|   |-- catalog.js
|   |-- folder-index.js
|   `-- site-data.js
|-- landingpages/
|   |-- index.html
|   |-- catalog.config.js
|   `-- *.html
`-- dashboards/
    |-- index.html
    `-- catalog.config.js
```

## How It Works

### Root Homepage

- [index.html](C:\Users\Urmas\Documents\codex\webdesign\index.html) is the site entry point.
- It loads shared assets and renders the homepage through `renderHomeFromRegistry(...)`.
- Project folders shown on the homepage are registered in [assets/site-data.js](C:\Users\Urmas\Documents\codex\webdesign\assets\site-data.js).

### Folder Index Pages

- Every topic folder has its own [index.html](C:\Users\Urmas\Documents\codex\webdesign\landingpages\index.html)-style entry page.
- These folder `index.html` files are intentionally thin wrappers.
- They all use the same shared bootstrap in [assets/folder-index.js](C:\Users\Urmas\Documents\codex\webdesign\assets\folder-index.js).
- Folder-specific content lives in each folder's `catalog.config.js`.

### Shared Design Template

Folder index design is centralized.

- Layout and visual styling live in [assets/catalog.css](C:\Users\Urmas\Documents\codex\webdesign\assets\catalog.css).
- Shared rendering logic lives in [assets/catalog.js](C:\Users\Urmas\Documents\codex\webdesign\assets\catalog.js).
- If you want to change colors, spacing, card structure, fonts, hero behavior, or interaction patterns across folder indexes, change the shared assets instead of editing folder pages one by one.

### Item Cards

- Cards are rendered by the shared catalog renderer.
- Landing page cards can carry per-item visual themes through `cardTheme` in [landingpages/catalog.config.js](C:\Users\Urmas\Documents\codex\webdesign\landingpages\catalog.config.js).
- The whole card is clickable.
- Folder item cards do not need a separate open button.

## Adding a New Project Folder

1. Create a new top-level folder, for example `posters/`.
2. Add `posters/index.html` using the same thin wrapper pattern as existing folder indexes.
3. Add `posters/catalog.config.js` with that folder's hero content and item list.
4. Register the folder in [assets/site-data.js](C:\Users\Urmas\Documents\codex\webdesign\assets\site-data.js).

After that, the homepage will be able to link to the new folder, and the folder will use the shared folder-index template.

## Adding a New Item to a Folder

1. Add the standalone HTML file to the folder.
2. Add an item object to that folder's `catalog.config.js`.
3. Set `href` to the local file, for example `my-page.html`.
4. Optionally add a `cardTheme` object if the card should visually reflect the target page.

## GitHub Pages Compatibility

This repository is GitHub Pages friendly because:

- it is static,
- it does not depend on server-side rendering,
- it uses relative paths,
- folder links use explicit `index.html` targets.

Publish from the repository root.

## Current Shared Files

- [assets/site-data.js](C:\Users\Urmas\Documents\codex\webdesign\assets\site-data.js): homepage project registry
- [assets/catalog.js](C:\Users\Urmas\Documents\codex\webdesign\assets\catalog.js): shared renderer
- [assets/catalog.css](C:\Users\Urmas\Documents\codex\webdesign\assets\catalog.css): shared styling
- [assets/folder-index.js](C:\Users\Urmas\Documents\codex\webdesign\assets\folder-index.js): shared folder-index bootstrap

## Notes

- Some sample pages use external resources such as Google Fonts or CDN scripts.
- Those pages are still GitHub Pages compatible, but they depend on external network access for those resources.
- A lightweight automated test suite is available via `npm test`.
