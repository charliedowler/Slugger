> **⚠️ This repository is no longer maintained.** No further updates, bug fixes, or support will be provided.

# Slugger

A small browser platformer: guide a slug across the level, collect the
strawberries, dodge the salt, and reach the pipe to win.

Originally written in 2011 in plain JavaScript; modernised in 2026 to ES
modules, classes, and a `requestAnimationFrame` game loop, built with [Vite](https://vite.dev).

## Controls

- **Left / Right** arrow keys — move
- **Space** — jump
- **S** — shoot slime

## Development

```bash
npm install
npm run dev      # start the dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
npm run format   # prettier
```

## Project layout

```
index.html        Entry HTML (loads src/main.js as a module)
src/
  main.js         Bootstraps the menu and game
  menu.js         Title screen
  game.js         Game state, update + render loop
  entity.js       Drawable, collidable game object
  effects.js      Particles and slime-ball projectiles
  input.js        Keyboard handling (KeyboardEvent.code)
  level.js        Level layout as coordinate data
  assets.js       Promise-based image/sound loading
  constants.js    Gameplay tuning values
  style.css       Page styling
public/           Shipped game assets (IMAGES, SOUNDS)
art-source/       Source art (.pyxel, .wav, .fw.png) — not shipped
```
