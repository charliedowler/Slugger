# Slugger improvement backlog

The loop picks the **top unblocked** item each iteration. Keep items small and
single-purpose so one iteration can finish + verify one item. Mark `[x]` done,
`[~]` in progress, `[!]` rejected (with a one-line reason in the log).

## Gameplay
- [ ] Replay flow: game-over screen + "Play Again" → brand-new random map.
- [ ] Win → next level with ramping difficulty (more hazards, wider gaps).
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
- hazardDensityPer1000px.avg: ~2–4.
- maxGapPx.max: ≤ ~120 (within a comfortable jump).

## Log (most recent first)
<!-- iteration entries: date · item · outcome (accepted/rejected) · note -->
