// Independent solvability check for the procedural generator.
// Reconstructs platforms from the generated blocks and re-simulates the slug's
// jump arc between every consecutive pair, for many random seeds.
//
// Run: node scripts/verify-solvable.mjs [count]

import { generateLevel } from '../src/levelgen.js';

const BLOCK = 32;
const SLUG_W = 32;
const SLUG_H = 32;
const V0 = -(SLUG_H / 2.5);
const GRAVITY = 10;
const WEIGHT = 1;
const SCROLL = 4;
const CANVAS_H = 300;

// Group contiguous same-row blocks back into platforms.
function platformsFromBlocks(blocks) {
  const platforms = [];
  let cur = null;
  for (const [x, y] of blocks) {
    if (cur && cur.y === y && x === cur.x + cur.len * BLOCK) {
      cur.len += 1;
    } else {
      cur = { x, y, len: 1 };
      platforms.push(cur);
    }
  }
  return platforms;
}

const right = (p) => p.x + p.len * BLOCK;

// Leave the right edge of `from` with vertical speed `v0`; does the slug land on `to`?
function landsOn(from, to, v0) {
  let x = right(from) - SLUG_W;
  let y = from.y - SLUG_H;
  let v = v0;
  for (let f = 0; f < 150; f++) {
    const prevBottom = y + SLUG_H;
    x += SCROLL;
    v = Math.min(v + WEIGHT, GRAVITY);
    y += v;
    const bottom = y + SLUG_H;
    if (v > 0 && prevBottom <= to.y && bottom >= to.y && x + SLUG_W > to.x && x < right(to)) {
      return true;
    }
    if (y > CANVAS_H) return false;
  }
  return false;
}

// Reachable by jumping across or by walking off and falling.
function canReach(from, to) {
  return landsOn(from, to, V0) || landsOn(from, to, 0);
}

const count = Number(process.argv[2] ?? 500);
let failures = 0;

for (let i = 0; i < count; i++) {
  const seed = Math.floor(Math.random() * 2 ** 32);
  const level = generateLevel(seed);
  const platforms = platformsFromBlocks(level.blocks);

  for (let p = 0; p < platforms.length - 1; p++) {
    if (!canReach(platforms[p], platforms[p + 1])) {
      failures += 1;
      console.error(
        `UNREACHABLE seed=${seed} step ${p}: ` +
          `${JSON.stringify(platforms[p])} -> ${JSON.stringify(platforms[p + 1])}`,
      );
      break;
    }
  }
}

if (failures === 0) {
  console.log(`✓ ${count} generated levels are all fully traversable.`);
} else {
  console.error(`✗ ${failures}/${count} levels had an unreachable step.`);
  process.exit(1);
}
