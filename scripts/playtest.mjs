// Headless playability / difficulty metrics over many generated levels.
// This is the *measurable* gameplay signal the improvement loop optimises
// against. It reconstructs the platform path from generated blocks and derives
// difficulty proxies (jumps required, gaps, hazard density) without needing a
// browser — fast, deterministic, and safe to run in a tight loop.
//
// Run: node scripts/playtest.mjs [count]

import { generateLevel } from '../src/levelgen.js';

const BLOCK = 32;
const SLUG_W = 32;
const SLUG_H = 32;
const V0 = -(SLUG_H / 2.5);
const GRAVITY = 10;
const WEIGHT = 1;
const SCROLL = 4;
const CANVAS_H = 300;

const right = (p) => p.x + p.len * BLOCK;

function platforms(blocks) {
  const ps = [];
  let cur = null;
  for (const [x, y] of blocks) {
    if (cur && cur.y === y && x === cur.x + cur.len * BLOCK) cur.len += 1;
    else {
      cur = { x, y, len: 1 };
      ps.push(cur);
    }
  }
  return ps;
}

function landsOn(from, to, v0) {
  let x = right(from) - SLUG_W;
  let y = from.y - SLUG_H;
  let v = v0;
  for (let f = 0; f < 150; f++) {
    const prev = y + SLUG_H;
    x += SCROLL;
    v = Math.min(v + WEIGHT, GRAVITY);
    y += v;
    if (v > 0 && prev <= to.y && y + SLUG_H >= to.y && x + SLUG_W > to.x && x < right(to)) return true;
    if (y > CANVAS_H) return false;
  }
  return false;
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / (a.length || 1);
const round = (n) => Math.round(n * 100) / 100;

const N = Number(process.argv[2] ?? 500);
const rows = [];

for (let i = 0; i < N; i++) {
  const seed = Math.floor(Math.random() * 2 ** 32);
  const lv = generateLevel(seed);
  const ps = platforms(lv.blocks);

  let jumps = 0;
  let upSteps = 0;
  let maxGap = 0;
  for (let p = 1; p < ps.length; p++) {
    const a = ps[p - 1];
    const b = ps[p];
    const gap = b.x - right(a);
    maxGap = Math.max(maxGap, gap);
    if (b.y < a.y) upSteps += 1;
    // "requires a jump" = can't simply walk off the edge and fall onto it.
    if (!landsOn(a, b, 0) && landsOn(a, b, V0)) jumps += 1;
  }

  const length = right(ps[ps.length - 1]);
  const hazards = lv.salt.length + lv.saltBalls.length + lv.enemies.length;

  rows.push({
    platforms: ps.length,
    length,
    jumps,
    upSteps,
    maxGap,
    strawberries: lv.strawberries.length,
    enemies: lv.enemies.length,
    salt: lv.salt.length,
    saltBalls: lv.saltBalls.length,
    hazardDensity: hazards / (length / 1000), // hazards per 1000px
  });
}

const col = (k) => rows.map((r) => r[k]);
const report = {
  seeds: N,
  platforms: { avg: round(mean(col('platforms'))) },
  lengthPx: { avg: Math.round(mean(col('length'))) },
  jumpsRequired: { avg: round(mean(col('jumps'))), max: Math.max(...col('jumps')) },
  upSteps: { avg: round(mean(col('upSteps'))) },
  maxGapPx: { avg: round(mean(col('maxGap'))), max: Math.max(...col('maxGap')) },
  strawberries: { avg: round(mean(col('strawberries'))) },
  enemies: { avg: round(mean(col('enemies'))) },
  hazardDensityPer1000px: { avg: round(mean(col('hazardDensity'))) },
};

console.log(JSON.stringify(report, null, 2));
