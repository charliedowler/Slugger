# Autonomous improvement loop — iteration protocol

Kick off (attended) with:

```
/loop improve one item from BACKLOG.md following LOOP.md
```

Each iteration does exactly one backlog item, on its own branch, and only keeps
it if it passes every gate. Stop and hand back to a human before merging.

## Steps

1. **Plan.** Read `BACKLOG.md`; pick the top unblocked `[ ]` item. Mark it `[~]`.
   Read `STYLE.md` if the item touches assets.
2. **Branch.** `git checkout -b loop/<short-item-name>`.
3. **Change.** Implement just that item. For assets, draw procedurally
   (canvas/SVG) per `STYLE.md`; never add an opaque box behind a sprite.
4. **Objective gates.** Run `npm run harness`. It must end `PASS`:
   - lint clean · build ok · solvability 100% · metrics within target ranges.
   If it fails and can't be fixed quickly → revert the branch, mark item `[!]`
   with a one-line reason, stop.
5. **Observe (browser).** Start `npm run dev`, open the game, drive it
   (start, move, jump, shoot, trigger the changed behaviour), and
   `take_screenshot` at the key moments. Read the console for errors.
6. **Judge (soft).** Score the screenshots 1–5 against this rubric:
   - *Correct:* the item visibly works as intended.
   - *Readable:* reads clearly at 1× game scale (assets) / no confusion.
   - *Consistent:* matches `STYLE.md` (assets) or existing feel (gameplay).
   - *No regression:* nothing else looks/behaves worse.
   Use a 3-perspective panel for asset/visual changes (correctness, style,
   silhouette-at-scale); accept only on majority ≥ 4.
7. **Decide.**
   - **Accept:** `git commit` on the branch; tick the item `[x]`; add a Log line.
   - **Reject:** revert; mark `[!]`; add a Log line with the reason so it isn't
     retried blindly.
8. **Repeat** until the loop interval ends or the budget is hit.

## Guardrails (do not violate autonomously)
- Never push, and never merge to `master`, without explicit human approval.
- One item per branch; auto-revert on any failed hard gate.
- No external/paid services (procedural assets only) without a human gate.
- Keep the Log honest: record rejections and skipped coverage, don't hide them.
- If two consecutive iterations reject, stop and summarise for the human.

## The metrics signal
`npm run playtest` prints difficulty proxies; targets live at the bottom of
`BACKLOG.md`. Tuning items should move these toward the targets without breaking
solvability (always 100%).
