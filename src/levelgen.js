// Procedural level generation with a guaranteed-completable path.
//
// Strategy: build a left-to-right chain of platforms. For every step we
// simulate the slug's actual jump arc (its real impulse, gravity and scroll
// speed) and only accept the next platform if the slug can land on it. If a
// candidate is unreachable we pull it closer / lower it until it is — so the
// finished level is solvable by construction, not by luck.

import { BLOCK_SIZE, STRAWBERRY_SIZE, SALT, SLUG_START } from './level.js';

const CANVAS_H = 300;

// Physics constants mirrored from the game (see game.js / constants.js).
const SLUG_W = SLUG_START.width;
const SLUG_H = SLUG_START.height;
const JUMP_V0 = -(SLUG_H / 2.5); // -12.8, the upward impulse of a jump
const GRAVITY = 10; // terminal fall speed
const WEIGHT = 1; // gravity ramp per step
const SCROLL = 4; // world scroll (= horizontal slug speed) per step

// Discrete platform heights (top-Y), one block apart, spanning the canvas from
// near the top down to the original ground level. Spreading platforms across
// these rows makes the level use the full vertical space.
const ROWS = [76, 108, 140, 172, 204, 236, 268];
const GROUND_ROW = ROWS.length - 1; // 268
const LEVEL_LENGTH = 3200;

// How far the slug can move between platforms per step (in rows):
// up to 2 rows up (a jump clears ~88px) or 3 rows down (falling is free).
const MAX_UP_ROWS = 2;
const MAX_DOWN_ROWS = 3;

// --- Tiny seedable RNG (mulberry32) so a seed reproduces a map exactly. ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const platformRight = (p) => p.x + p.len * BLOCK_SIZE;

// Simulate leaving the right edge of `from` with initial vertical speed `v0`
// and report whether the slug lands on top of `to`.
function landsOn(from, to, v0) {
  let x = platformRight(from) - SLUG_W;
  let y = from.y - SLUG_H; // standing on top of `from`
  let v = v0;
  const toLeft = to.x;
  const toRight = platformRight(to);

  for (let frame = 0; frame < 150; frame++) {
    const prevBottom = y + SLUG_H;
    x += SCROLL;
    v = Math.min(v + WEIGHT, GRAVITY);
    y += v;
    const bottom = y + SLUG_H;

    // Landing: falling and the slug's feet cross the platform top while
    // horizontally overlapping it.
    if (v > 0 && prevBottom <= to.y && bottom >= to.y && x + SLUG_W > toLeft && x < toRight) {
      return true;
    }
    if (y > CANVAS_H) return false; // fell past the bottom of the screen
  }
  return false;
}

// Reachable if the slug can either jump across or simply walk off and fall.
function canReach(from, to) {
  return landsOn(from, to, JUMP_V0) || landsOn(from, to, 0);
}

// Propose the next platform after `prev`, then nudge it until it is reachable.
function nextPlatform(prev, rng) {
  const curRow = ROWS.indexOf(prev.y);

  // Aim for a random row across the whole canvas, but only move as far as the
  // slug can manage in one step. This keeps platforms spread top-to-bottom.
  const targetRow = randInt(rng, 0, ROWS.length - 1);
  const step = Math.max(-MAX_UP_ROWS, Math.min(MAX_DOWN_ROWS, targetRow - curRow));
  const nextRow = Math.max(0, Math.min(ROWS.length - 1, curRow + step));
  const ny = ROWS[nextRow];
  const len = randInt(rng, 2, 6);

  const dy = ny - prev.y;
  let gap;
  if (dy < 0) gap = randInt(rng, 8, 32); // stepping up: keep it close
  else if (dy === 0) gap = randInt(rng, 32, 80); // flat: medium gap
  else gap = randInt(rng, 32, 112); // dropping: a wider gap is fine

  const candidate = { x: platformRight(prev) + gap, y: ny, len };

  let guard = 0;
  while (!canReach(prev, candidate) && guard++ < 120) {
    if (candidate.x - platformRight(prev) > 8) {
      candidate.x -= 8; // too far — pull it closer
    } else if (candidate.y < prev.y) {
      candidate.y += BLOCK_SIZE; // too high — drop it a row
    } else {
      break; // already adjacent and level: accept it
    }
  }
  return candidate;
}

/**
 * Generate a complete, guaranteed-solvable level.
 * @param {number} [seed] pass a fixed seed to reproduce a specific map.
 */
export function generateLevel(seed = Math.floor(Math.random() * 2 ** 32)) {
  const rng = mulberry32(seed);

  // Starting platform: long, flat, at ground level, sitting under the slug's
  // fixed spawn point so it always lands safely.
  const platforms = [{ x: 32, y: ROWS[GROUND_ROW], len: 7 }];
  while (platformRight(platforms[platforms.length - 1]) < LEVEL_LENGTH) {
    platforms.push(nextPlatform(platforms[platforms.length - 1], rng));
  }

  const blocks = [];
  const strawberries = [];
  const salt = [];
  const enemies = [];

  platforms.forEach((p, idx) => {
    for (let i = 0; i < p.len; i++) blocks.push([p.x + i * BLOCK_SIZE, p.y]);

    // Leave the spawn platform clear so the slug doesn't grab free points.
    if (idx === 0) return;

    // Patrolling enemy on some wider platforms. Stored as platform-relative
    // bounds; the game positions it on top once it knows the enemy's height.
    if (p.len >= 3 && rng() < 0.18) {
      enemies.push({
        x: p.x + (p.len * BLOCK_SIZE) / 2,
        top: p.y,
        leftBound: p.x,
        rightBound: platformRight(p),
      });
    }

    // Strawberries hover just above the platform — always reachable.
    for (let i = 0; i < randInt(rng, 0, 2); i++) {
      const sx =
        p.x + randInt(rng, 0, p.len - 1) * BLOCK_SIZE + (BLOCK_SIZE - STRAWBERRY_SIZE) / 2;
      const sy = p.y - randInt(rng, 1, 3) * 16 - STRAWBERRY_SIZE;
      strawberries.push([sx, sy]);
    }

    // Salt sits on top of an *interior* platform tile (never the first or last
    // block, so there's always a safe edge to land on). Avoidable, and never on
    // the first two platforms.
    if (idx >= 2 && p.len >= 3 && rng() < 0.22) {
      const tile = randInt(rng, 1, p.len - 2);
      salt.push([p.x + tile * BLOCK_SIZE, p.y - SALT.height]);
    }
  });

  // Guarantee a worthwhile number of strawberries to collect.
  while (strawberries.length < 12) {
    const p = pick(rng, platforms);
    const sx = p.x + randInt(rng, 0, p.len - 1) * BLOCK_SIZE + (BLOCK_SIZE - STRAWBERRY_SIZE) / 2;
    strawberries.push([sx, p.y - BLOCK_SIZE - STRAWBERRY_SIZE]);
  }

  // Bouncing salt balls scattered through open air.
  const saltBalls = [];
  for (let i = 0, n = randInt(rng, 3, 6); i < n; i++) {
    saltBalls.push([randInt(rng, 400, LEVEL_LENGTH), randInt(rng, 40, 220)]);
  }

  // Pipe (the goal) at the end, on the final platform's level so the slug
  // wins on contact while standing above it.
  const last = platforms[platforms.length - 1];
  const pipe = { x: platformRight(last) + 16, y: last.y, width: 118, height: 150 };

  return { blocks, strawberries, salt, saltBalls, enemies, pipe, seed };
}
