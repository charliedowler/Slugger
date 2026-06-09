// Core gameplay tuning. These mirror the original game's feel.
export const FPS = 60;
export const STEP_MS = 1000 / FPS;

export const GRAVITY = 10; // terminal vertical velocity
export const WEIGHT = 1; // how quickly gravity ramps up each step
export const SLUG_SPEED = 4; // world scroll speed per step
export const BG_SPEED = 3; // parallax background scroll speed

export const BLOOD_SPLATTER = 20; // particles spawned when hurt
export const SLIME_SPLATTER = 10; // particles spawned when walking on a block

export const HURT_COOLDOWN_MS = 2000; // invulnerability window after a hit
export const STARTING_LIVES = 3;

// The original stepped each salt ball once per block every frame (~84x),
// which is what made them visibly bounce. These constants reproduce that
// effective speed while updating each ball exactly once per step.
export const SALT_BALL_VX = 0.84;
export const SALT_BALL_VY = 3.36;

// ---- Game feel ----
export const COYOTE_FRAMES = 6; // jump still allowed briefly after leaving a ledge
export const JUMP_BUFFER_FRAMES = 6; // a jump pressed just before landing still fires
export const JUMP_CUT = 0.45; // releasing jump early shortens the hop
export const WALK_FRAME_INTERVAL = 8; // frames between walk-cycle sprite swaps

// ---- Shooting ----
export const MAX_SLIMEBALLS = 3; // ammo cap
export const SLIMEBALL_REFILL_MS = 1500; // time to regenerate one slime ball
export const SLIMEBALL_SPEED = 6; // horizontal launch speed
export const SLIMEBALL_LAUNCH_VY = -4.5; // initial upward speed (negative = up)
export const SLIMEBALL_GRAVITY = 0.28; // downward acceleration per step (the arc)
export const SLIMEBALL_SPEED_SPREAD = 1.5; // random variance in launch speed
export const SLIMEBALL_VY_SPREAD = 2; // random variance in upward kick (arc height)

// ---- Enemies (drawn as colour blocks) ----
export const ENEMY_SIZE = 28;
export const ENEMY_SPEED = 1; // patrol speed in px/step
export const ENEMY_COLOR = '#9b30ff'; // body
export const ENEMY_COLOR_DARK = '#5b1a99'; // outline

// When killed (shot or stomped), an enemy pops up then falls off the map.
export const ENEMY_BOUNCE_VY = -9; // upward pop on death
export const ENEMY_DEATH_GRAVITY = 0.6; // fall acceleration while dying
export const ENEMY_KNOCK_VX = 2.5; // horizontal knockback on death
export const STOMP_BOUNCE_VY = -9; // upward bounce given to the slug on a stomp
export const SLUG_DEATH_BOUNCE_VY = -11; // upward pop when the slug loses its last life
