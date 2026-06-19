# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Browser-based Reinforcement Learning exhibit for the I AM A.I. exhibition (v2). A robot
learns to navigate editable mazes via Q-learning, with the Q-values, value function, and
policy visualized live. Vanilla JS (no framework) bundled with webpack; rendering uses
PIXI.js, UI chrome uses jQuery/Bootstrap.

## Commands

- `npm install` — install dependencies
- `npm run build` — one-off webpack build into `assets/`
- `npm run watch` — rebuild on change
- `npx eslint src/js` — lint JS (Airbnb config, `.eslintrc.json`)
- `npx stylelint "src/sass/**/*.scss"` — lint styles

There is **no test runner** (`npm test` is a stub); `test/` only holds a manual HTML harness.

## Build & entry points

Webpack reads `webpack.entry-points.json`, which defines three bundles, each with its own
HTML template in `src/html/` and `main-*.js` entry in `src/js/`:

- **default** → `index.html` / `main.js` — desktop layout (Bootstrap grid)
- **exhibit** → `exhibit.html` / `main-exhibit.js` — fixed 1920×1080 kiosk mode
- **embed** → `embed.html` / `main-embed.js` — iframe-embeddable, configured entirely via
  query-string args (`map`, `training`, `tiles`, `cmds`, `xr`, `lr`, `speed`, etc. — see README)

`HtmlWebpackPlugin` writes the generated `index.html` / `exhibit.html` / `embed.html` to the
repo root (these committed files are build artifacts). Bundles land in `assets/` with
contenthash filenames. `CleanWebpackPlugin` wipes `assets/` on every build.

PIXI, jQuery, Bootstrap, popper, and i18n4js are **NOT bundled** — they load as global
`<script>` tags from `vendor/` and appear in code as globals (`PIXI`, `IMAGINARY`, `$`).
`.env` (via `dotenv-webpack`) and the git commit hash are injected at compile time.

## Architecture

Event-driven, loosely MVC. Models are framework-free and communicate outward only through
Node `EventEmitter`; views subscribe. Key layers under `src/js/`:

- **`model/`** — pure logic, no rendering:
  - `maze.js` (+ `grid.js`, `helpers/array-2d.js`) — grid of tiles, items, robot, serialized
    to/from JSON (`Maze.fromJSON`)
  - `robot.js` — position/score; emits `move`/`reset` events; knows nothing about Q-learning
  - `qlearning-ai.js` — subscribes to the robot's `move` event and updates Q/V/R tables;
    holds `learningRate`, `discountFactor`, `exploreRate`; implements ε-greedy policy. This is
    the RL core. Note `update()` defines V as `maxQ(s) + r(s)` (deviates from the textbook
    `maxQ` — see the in-file comment explaining the visualization trade-off).
- **`view-pixi/`** — PIXI rendering. `maze-view.js` is the main canvas (layered `PIXI.Container`s);
  `robot-view.js` animates the sprite; `maze-view-*-overlay.js` draw the policy arrows / Q-values.
- **`view-html/`** — jQuery DOM widgets (`ai-training-view.js`, `reward-bar.js`, `modal.js`,
  reactions, lang switcher) and the maze editor under `view-html/editor/`.
- **`components/`** — self-contained "interactive" demos (e.g. `interactive-explore-exploit.js`)
  that wire a preset maze + pre-trained Q-table + view together for embedding.
- **`cfg-loader/`** — loads and deep-merges the YAML config (see below).
- **`helpers-*/`, `input/`** — texture loading, i18n bootstrap, keyboard controls, fatal-error UI.

The wiring pattern (see `main.js`): load config → load textures into PIXI → build `Maze`
+ `Robot` + `QLearningAI` → attach `MazeView`/`MazeEditor` + overlays + `AITrainingView`.

## Configuration

`CfgLoader` fetches a list of YAML files **at runtime** and shallow-merges them in order, so
later files override earlier keys. Order (from `main.js`): the `config/*.yml` files
(`tiles`, `robot`, `items`, `ui`, `i18n`, `default-settings`) then a root `settings.yml`
(gitignored, optional). Exhibit mode additionally merges a root `settings-exhibit.yml`.

- `config/tiles.yml` — tile types: walkable, reward, color, texture, `paletteWeight` (palette order)
- `config/robot.yml` — robot spritesheet + per-state animation timelines + reaction mappings
- Mazes are JSON in `data/mazes/`; pre-trained Q-tables are JSON in `data/training/`
- Language: `?lang=xx` query param; translations live in `tr/`, driven by `IMAGINARY.i18n`

## Conventions

- ES modules transpiled by Babel (`preset-env`, browserslist targets incl. iOS/Safari 12),
  but source uses CommonJS `require`/`module.exports`.
- Airbnb ESLint with local overrides: `no-param-reassign` allows prop mutation;
  `comma-dangle` requires trailing commas except on functions.
- Optional Sentry: DSN from `?sentry-dsn=` or `sentry.dsn` in settings (see `helpers/sentry.js`).
