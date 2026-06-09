# Slugger improvement backlog

The loop picks the **top unblocked** item each iteration. Keep items small and
single-purpose so one iteration can finish + verify one item. Mark `[x]` done,
`[~]` in progress, `[!]` rejected (with a one-line reason in the log).

## Gameplay
- [x] Replay flow: game-over screen + "Play Again" → brand-new random map.
- [x] Win → next level with ramping difficulty (more hazards). (gaps unchanged
      — widening gaps is deferred; needs multi-tier solvability re-check.)
- [ ] Pause (P key) with an overlay.
- [ ] High-score persistence in localStorage (reuse the audio settings pattern).
- [ ] Shareable seed via `?seed=` URL (the generator is already deterministic).
- [ ] A second enemy type with different movement (e.g. a hopper).

## Game feel / juice
- [ ] Screen shake on hit / stomp.
- [ ] Multi-layer parallax background.
- [ ] Coin/strawberry collect sparkle particles.

## Procedural assets (code-drawn — see STYLE.md)
- [ ] Procedurally varied background tiles (subtle per-column variation).
- [ ] A drawn slug idle "breathing" frame (replace static idle).
- [ ] Distinct enemy palettes/shapes per type.
- [ ] A drawn pipe/goal flourish (particles or shading).

## Tech / quality
- [ ] Promote verify-solvable + playtest into a Vitest suite.
- [ ] GitHub Pages deploy workflow.

## Tuning targets (what "good" means for the metrics harness)
- Solvability: 100% (hard gate).
- jumpsRequired.avg: ~6–12 (engaging but not punishing).
  - NOTE: currently ~16.6. Lowering it means fewer up-steps / flatter levels,
    which fights the "use the full canvas height" preference. **Deferred to a
    human decision** — do not auto-flatten.
- hazardDensityPer1000px.avg: ~2–4. ✅ met (3.05).
- maxGapPx.max: ≤ ~120 (within a comfortable jump). ✅ met (112).

## Log (most recent first)
- 2026-06-09 · win → next level · **accepted (with caveat)** · level counter +
  HUD "Level N"; hazards ramp with level (verified 9.4→15.6→24.7 hazards/lvl at
  L1/3/6); solvability still 100% across tiers [1,4,8]. Win advances level &
  keeps score; game-over restarts at L1. CAVEAT: the win/level-complete screen
  was NOT captured live — an autopilot can't reliably clear a full level
  (37 deaths). Win→nextLevel code verified by review (mirrors tested replay flow).
- 2026-06-09 · replay flow · **accepted** · game-over screen (score + "click to
  play again") and a win-screen play-again; click regenerates a fresh map.
  Verified in browser; no console errors. Replaces the old halve-score-and-continue.
- 2026-06-09 · tune hazard density · **accepted** · salt/saltball/enemy rates
  down; hazardDensity 6.21→3.05 (in band), solvability still 100%, no regressions.
<!-- iteration entries: date · item · outcome (accepted/rejected) · note -->
