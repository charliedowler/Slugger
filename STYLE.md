# Slugger art bible

The reference for all procedurally generated / code-drawn assets, so the look
stays consistent across iterations. Update this when a generation choice is
accepted as canonical.

## Canvas & scale
- Game canvas: 600×300, pixel-art, no smoothing (crisp scaling).
- Sprite sizes: blocks 32×32, slug 32×32, pickups (strawberry) 16×16,
  salt pile 32×8, salt ball 8×8, heart ~32×32, enemy block 28×28.
- Assets are drawn small and read at 1× — always judge them *in-game* at scale,
  never only as a zoomed-in raw image.

## Palette (canonical hexes in use)
- Slug: dark green body. Slime/projectiles: `#5dd35d`, outline `#2e7d32`.
- Enemy block: `#9b30ff` body, `#5b1a99` top shade, white eyes w/ black pupils.
- Blood particle: `red`. Slime particle: `green`. Heart: red.
- Score pop-up: `#ffe44d`. HUD text: `#fff`.
- Background: dark earthy browns (tiled) with darker mid-ground blotches.

## Rules
- 1px darker outline / top shading to read against the dark background.
- Light source is top — lighter top edge, darker bottom.
- Limited palette per sprite (≤ 4–5 colours).
- Transparent background for all sprites (no opaque box around the art).
- Animations: keep silhouette stable frame-to-frame; only small offsets move.

## Procedural approach (current)
- Enemies are drawn with canvas primitives (`fillRect`) — see `src/enemies.js`.
- New code-drawn assets should follow the same pattern: a `draw(ctx, x, y)`
  that composes rectangles/arcs, parameterised so variants are cheap.
