import { Entity } from './entity.js';
import { BloodParticle, SlimeParticle, SlimeBall, FloatingText } from './effects.js';
import { Enemy } from './enemies.js';
import { Keyboard, Keys } from './input.js';
import { playSound } from './audio.js';
import { generateLevel } from './levelgen.js';
import * as C from './constants.js';
import * as L from './level.js';

export const GAME_IMAGES = [
  'block',
  'block_slime',
  'block_slime2',
  'block_slime3',
  'heart',
  'salt',
  'salt_ball',
  'slime',
  'strawberry',
  'mario_pipe',
  'slug_1',
  'slug_2',
  'slug_3',
  'slug_4',
  'slug_5',
  'slug_6',
];

export const GAME_SOUNDS = ['jump', 'hurt', 'point', 'slime', 'slime_move', 'slime_move_2'];

const SLIME_BLOCK_VARIANTS = ['block_slime', 'block_slime2', 'block_slime3'];

export class Game {
  constructor(canvas, ctx, images, sounds) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.images = images;
    this.sounds = sounds;

    this.points = 0;
    this.level = 1;
    this.winGame = false;
    this.gameOver = false; // out of lives — showing the game-over screen
    this.dying = false; // playing the death drop-off animation
    // Health is tracked in half-hearts (2 per heart) so damage can be fractional.
    this.maxHealth = C.STARTING_LIVES * 2;
    this.health = this.maxHealth;
    this.velocityY = 0.5;
    this.isRight = true;
    this.isLeft = false;
    this.shooting = false;
    this.ammo = C.MAX_SLIMEBALLS;
    this.refillTimer = 0;
    this.slimeParticlesStop = false;
    this.coolDown = false;
    this.soundPlaying = false;
    this.bgPos = 0;

    // Jump / game-feel state.
    this.grounded = false;
    this.jumping = false;
    this.jumpHeld = false;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;

    // Walk-cycle animation state.
    this.animTimer = 0;
    this.walkToggle = false;

    this.slimeballs = [];
    this.blood = [];
    this.slimeTrail = [];
    this.popups = [];
  }

  start() {
    this.#build();
    this.keyboard = new Keyboard(() => {
      // Releasing any key re-arms the one-shot actions (matches the original).
      this.shooting = false;
      this.slimeParticlesStop = false;
    });

    // On the win / game-over screen, a click starts a fresh random map.
    this.canvas.addEventListener('click', this.#onClick);

    this.lastTime = performance.now();
    this.accumulator = 0;
    requestAnimationFrame(this.#loop);
  }

  #onClick = () => {
    if (this.winGame) this.#nextLevel();
    else if (this.gameOver) this.#restart();
  };

  #build() {
    const { images } = this;
    const levelData = generateLevel(undefined, this.level);
    this.seed = levelData.seed;

    this.slug = new Entity(
      images.slug_1,
      L.SLUG_START.x,
      L.SLUG_START.y,
      L.SLUG_START.width,
      L.SLUG_START.height,
    );
    this.pipe = new Entity(
      images.mario_pipe,
      levelData.pipe.x,
      levelData.pipe.y,
      levelData.pipe.width,
      levelData.pipe.height,
    );

    this.blocks = levelData.blocks.map(
      ([x, y]) => new Entity(images.block, x, y, L.BLOCK_SIZE, L.BLOCK_SIZE),
    );
    this.strawberries = levelData.strawberries.map(
      ([x, y]) => new Entity(images.strawberry, x, y, L.STRAWBERRY_SIZE, L.STRAWBERRY_SIZE),
    );
    this.salt = levelData.salt.map(
      ([x, y]) => new Entity(images.salt, x, y, L.SALT.width, L.SALT.height),
    );
    this.saltBalls = levelData.saltBalls.map(([x, y]) => {
      const ball = new Entity(images.salt_ball, x, y, L.SALT_BALL_SIZE, L.SALT_BALL_SIZE);
      ball.vx = C.SALT_BALL_VX;
      ball.vy = C.SALT_BALL_VY;
      return ball;
    });
    this.enemies = levelData.enemies.map(
      (e) => new Enemy(e.x, e.top - C.ENEMY_SIZE, e.leftBound, e.rightBound),
    );

    this.amountOfStrawberries = this.strawberries.length;
    this.health = this.maxHealth;
  }

  // ---- Main loop: fixed-timestep updates, render once per frame ----
  #loop = (now) => {
    let frame = now - this.lastTime;
    this.lastTime = now;
    if (frame > 250) frame = 250; // clamp after a tab switch to avoid a spiral
    this.accumulator += frame;

    while (this.accumulator >= C.STEP_MS) {
      if (!this.winGame && !this.gameOver) this.#update();
      this.accumulator -= C.STEP_MS;
    }

    this.#render();
    requestAnimationFrame(this.#loop);
  };

  // ---- Simulation ----
  #update() {
    // Death animation: the slug pops up and falls off the map, then resets.
    if (this.dying) {
      this.#updateDeath();
      return;
    }
    if (this.health <= 0) {
      this.#startDeath();
      return;
    }

    this.grounded = false; // recomputed by block collisions below
    this.#handleInput();

    if (this.velocityY < C.GRAVITY) this.velocityY += C.WEIGHT;
    this.slug.y += this.velocityY;
    if (this.slug.y > this.canvas.height) this.#fallOff();

    this.#updateSlimeballs();
    this.#updateBlocks();
    this.#updateEnemies();
    this.#updateSaltBalls();
    this.#updateSalt();
    this.#checkPipe();
    this.#collectStrawberries();
    this.#resolveJump();
    this.#updateSprite();
    this.#updateAmmo();
    this.#updateParticles();
  }

  #handleInput() {
    const k = this.keyboard;

    if (k.isDown(Keys.RIGHT)) {
      this.isLeft = false;
      this.isRight = true;
      this.#scrollWorld(-C.SLUG_SPEED);
    }
    if (k.isDown(Keys.LEFT)) {
      this.isRight = false;
      this.isLeft = true;
      this.#scrollWorld(C.SLUG_SPEED);
    }

    // Jump input: buffer on press, and cut the hop short on early release.
    const jumpDown = k.isDown(Keys.JUMP);
    if (jumpDown && !this.jumpHeld) this.jumpBuffer = C.JUMP_BUFFER_FRAMES;
    if (!jumpDown && this.jumpHeld && this.jumping && this.velocityY < 0) {
      this.velocityY *= C.JUMP_CUT; // variable jump height
    }
    this.jumpHeld = jumpDown;

    if (k.isDown(Keys.SHOOT) && !this.shooting && this.ammo > 0) {
      this.shooting = true;
      this.ammo -= 1;
      this.#playSound('slime');
      const dir = this.isRight ? 'right' : 'left';
      // Slightly randomise each shot so no two arcs are identical.
      const speed = C.SLIMEBALL_SPEED + (Math.random() - 0.5) * C.SLIMEBALL_SPEED_SPREAD;
      const launchVy = C.SLIMEBALL_LAUNCH_VY + (Math.random() - 0.5) * C.SLIMEBALL_VY_SPREAD;
      this.slimeballs.push(
        new SlimeBall(this.slug, this.images.slime, dir, speed, launchVy, C.SLIMEBALL_GRAVITY),
      );
    }
  }

  // Regenerate one slime ball every SLIMEBALL_REFILL_MS, up to the cap.
  #updateAmmo() {
    if (this.ammo >= C.MAX_SLIMEBALLS) {
      this.refillTimer = 0;
      return;
    }
    this.refillTimer += C.STEP_MS;
    if (this.refillTimer >= C.SLIMEBALL_REFILL_MS) {
      this.refillTimer -= C.SLIMEBALL_REFILL_MS;
      this.ammo += 1;
    }
  }

  // Coyote time + jump buffering: decide whether to launch a jump this frame,
  // using the grounded state computed by the collision passes above.
  #resolveJump() {
    if (this.grounded) {
      this.coyoteTimer = C.COYOTE_FRAMES;
      this.jumping = false;
    } else if (this.coyoteTimer > 0) {
      this.coyoteTimer -= 1;
    }

    if (this.jumpBuffer > 0 && this.coyoteTimer > 0 && !this.jumping) {
      this.velocityY = -this.slug.jumpHeight;
      this.jumping = true;
      this.grounded = false;
      this.coyoteTimer = 0;
      this.jumpBuffer = 0;
      this.soundPlaying = false;
      this.#playSound('jump');
    }

    if (this.jumpBuffer > 0) this.jumpBuffer -= 1;
  }

  // Pick the slug sprite: jump pose in the air, walk cycle while moving, else idle.
  #updateSprite() {
    const moving = this.keyboard.isDown(Keys.LEFT) || this.keyboard.isDown(Keys.RIGHT);

    if (this.jumping || !this.grounded) {
      this.slug.sprite = this.isRight ? this.images.slug_3 : this.images.slug_6;
      return;
    }

    if (moving) {
      if (++this.animTimer >= C.WALK_FRAME_INTERVAL) {
        this.animTimer = 0;
        this.walkToggle = !this.walkToggle;
      }
      if (this.isRight) this.slug.sprite = this.walkToggle ? this.images.slug_2 : this.images.slug_1;
      else this.slug.sprite = this.walkToggle ? this.images.slug_5 : this.images.slug_4;
      return;
    }

    this.animTimer = 0;
    this.walkToggle = false;
    this.slug.sprite = this.isRight ? this.images.slug_1 : this.images.slug_4;
  }

  // Scroll the whole world (the slug stays put; everything else moves).
  #scrollWorld(dx) {
    this.bgPos += Math.sign(dx) * C.BG_SPEED;
    for (const e of this.blocks) e.x += dx;
    for (const e of this.strawberries) e.x += dx;
    for (const e of this.salt) e.x += dx;
    for (const e of this.saltBalls) e.x += dx;
    for (const e of this.enemies) e.scroll(dx);
    for (const p of this.blood) p.x += dx;
    for (const p of this.slimeTrail) p.x += dx;
    this.pipe.x += dx;
  }

  #updateSlimeballs() {
    for (let i = this.slimeballs.length - 1; i >= 0; i--) {
      const ball = this.slimeballs[i];
      ball.update();
      if (ball.isExpired(this.canvas.width, this.canvas.height)) this.slimeballs.splice(i, 1);
    }
  }

  #updateBlocks() {
    for (const block of this.blocks) {
      // Landing on top of a block.
      if (this.slug.isCollide(block) && this.slug.y + this.slug.height / 2 < block.y) {
        this.slug.y = block.y - block.height;
        this.velocityY = 0;
        this.grounded = true;

        if (!this.soundPlaying) {
          this.#playWalkSound();
          this.soundPlaying = true;
        }
        if (this.keyboard.isDown(Keys.LEFT) || this.keyboard.isDown(Keys.RIGHT)) {
          this.#playWalkSound();
        }
        if (!block.changed) {
          block.sprite = this.#randomSlimeSprite();
          block.changed = true;
        }
        if (!this.slimeParticlesStop) {
          for (let i = 0; i < C.SLIME_SPLATTER; i++) {
            this.slimeTrail.push(new SlimeParticle(this.slug));
          }
          this.slimeParticlesStop = true;
        }
      }

      // Bonking the underside of a block.
      if (this.slug.isCollide(block) && this.slug.y > block.y) {
        this.slug.y = block.y + block.height;
      }
    }
  }

  #updateEnemies() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update();

      // Dying enemies just tumble away; remove once off the map.
      if (enemy.dying) {
        if (enemy.isOffMap(this.canvas.height)) this.enemies.splice(i, 1);
        continue;
      }

      // Slime balls kill enemies (knocked in the ball's travel direction).
      let hit = false;
      for (let j = this.slimeballs.length - 1; j >= 0; j--) {
        const ball = this.slimeballs[j];
        if (ball.isCollide(enemy)) {
          this.slimeballs.splice(j, 1);
          enemy.kill(ball.vx < 0 ? -1 : 1);
          this.#spawnEnemyDeath(enemy);
          hit = true;
          break;
        }
      }
      if (hit) continue;

      if (this.slug.isCollide(enemy)) {
        // Stomp: falling onto the enemy's top kills it and bounces the slug.
        if (this.velocityY > 0 && this.slug.y + this.slug.height / 2 < enemy.y) {
          enemy.kill(this.isRight ? 1 : -1);
          this.#spawnEnemyDeath(enemy);
          this.velocityY = C.STOMP_BOUNCE_VY;
          this.jumping = true;
        } else if (!this.coolDown) {
          // Any other contact hurts the slug.
          this.#hurt();
        }
      }
    }
  }

  #spawnEnemyDeath(enemy) {
    this.#playSound('slime');
    for (let k = 0; k < C.SLIME_SPLATTER; k++) this.slimeTrail.push(new SlimeParticle(enemy));
  }

  #updateSaltBalls() {
    for (let i = this.saltBalls.length - 1; i >= 0; i--) {
      const ball = this.saltBalls[i];
      if (this.slug.isCollide(ball) && !this.coolDown) {
        this.saltBalls.splice(i, 1);
        this.#hurt(1); // salt balls take half a heart
        continue;
      }
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.y < 0 || ball.y > this.canvas.height) ball.vy = -ball.vy;
    }
  }

  #updateSalt() {
    for (const s of this.salt) {
      if (this.slug.isCollide(s) && !this.coolDown) this.#hurt();
    }
  }

  #checkPipe() {
    if (this.slug.isCollide(this.pipe) && this.slug.y < this.pipe.y) this.winGame = true;
  }

  #collectStrawberries() {
    for (let i = this.strawberries.length - 1; i >= 0; i--) {
      const berry = this.strawberries[i];
      if (this.slug.isCollide(berry)) {
        this.strawberries.splice(i, 1);
        this.points += 1;
        this.#playSound('point');
        this.popups.push(new FloatingText(berry.x + berry.width / 2, berry.y, '+1'));
      }
    }
  }

  #updateParticles() {
    const { width, height } = this.canvas;
    for (const p of this.blood) p.update();
    this.blood = this.blood.filter((p) => !p.isDead(width, height));
    for (const p of this.slimeTrail) p.update();
    this.slimeTrail = this.slimeTrail.filter((p) => !p.isDead(width, height));
    for (const p of this.popups) p.update();
    this.popups = this.popups.filter((p) => !p.dead);
  }

  // Damage in half-hearts (default 2 = a full heart).
  #hurt(amount = 2) {
    this.#playSound('hurt');
    this.coolDown = true;
    this.health -= amount;
    if (this.health > 0) {
      for (let i = 0; i < C.BLOOD_SPLATTER; i++) this.blood.push(new BloodParticle(this.slug));
    }
    setTimeout(() => {
      this.coolDown = false;
    }, C.HURT_COOLDOWN_MS);
  }

  // Fell off the bottom of the canvas: lose a life. If that was the last one,
  // the fall itself is the death drop-off, so reset straight away (no second
  // bounce animation). Otherwise snap the world back and carry on.
  #fallOff() {
    this.#playSound('hurt');
    this.health -= 2;
    if (this.health <= 0) {
      this.gameOver = true; // fell to death on the last life
      return;
    }
    this.slug.y = 100;
    this.velocityY = 0.5;
    this.pipe.resetX();
    for (const e of this.blocks) e.resetX();
    for (const e of this.strawberries) e.resetX();
    for (const e of this.salt) e.resetX();
    for (const e of this.saltBalls) e.resetX();
    for (const e of this.enemies) e.reset();
  }

  // Last life lost: pop the slug up so it tumbles off the bottom of the map.
  #startDeath() {
    this.dying = true;
    this.velocityY = C.SLUG_DEATH_BOUNCE_VY;
    this.#playSound('hurt');
  }

  // Fall under gravity until off-screen, then it's game over.
  #updateDeath() {
    if (this.velocityY < C.GRAVITY) this.velocityY += C.WEIGHT;
    this.slug.y += this.velocityY;
    this.#updateParticles();
    if (this.slug.y > this.canvas.height) {
      this.dying = false;
      this.gameOver = true;
    }
  }

  // Clear all transient per-life state (shared by next-level and play-again).
  #resetState() {
    this.winGame = false;
    this.gameOver = false;
    this.dying = false;
    this.velocityY = 0.5;
    this.isRight = true;
    this.isLeft = false;
    this.jumping = false;
    this.grounded = false;
    this.jumpHeld = false;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
    this.shooting = false;
    this.slimeParticlesStop = false;
    this.coolDown = false;
    this.soundPlaying = false;
    this.bgPos = 0;
    this.ammo = C.MAX_SLIMEBALLS;
    this.refillTimer = 0;
    this.animTimer = 0;
    this.walkToggle = false;
    this.slimeballs = [];
    this.blood = [];
    this.slimeTrail = [];
    this.popups = [];
  }

  // Won the level: advance difficulty, keep the cumulative score.
  #nextLevel() {
    this.level += 1;
    this.#resetState();
    this.#build(); // harder random level + slug + full health
  }

  // Out of lives: back to level 1 with a fresh score.
  #restart() {
    this.level = 1;
    this.points = 0;
    this.#resetState();
    this.#build();
  }

  #randomSlimeSprite() {
    const name = SLIME_BLOCK_VARIANTS[Math.floor(Math.random() * SLIME_BLOCK_VARIANTS.length)];
    return this.images[name];
  }

  #playWalkSound() {
    this.#playSound(Math.random() < 0.5 ? 'slime_move' : 'slime_move_2');
  }

  #playSound(name) {
    playSound(this.sounds[name]);
  }

  // ---- Rendering ----
  #render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.gameOver) {
      this.#renderGameOver();
      return;
    }

    if (this.winGame) {
      this.#renderWin();
      return;
    }

    canvas.style.backgroundPositionX = `${this.bgPos}px`;

    for (const p of this.blood) p.draw(ctx);

    if (this.dying) {
      // Flip the slug upside-down as it tumbles off the map.
      ctx.save();
      ctx.translate(this.slug.x, this.slug.y + this.slug.height);
      ctx.scale(1, -1);
      ctx.drawImage(this.slug.sprite, 0, 0);
      ctx.restore();
    } else {
      // Blink the slug while invulnerable after a hit.
      const visible = !this.coolDown || Math.floor(performance.now() / 100) % 2 === 0;
      if (visible) this.slug.draw(ctx);
    }

    this.pipe.draw(ctx);
    for (const b of this.saltBalls) b.draw(ctx);
    for (const s of this.salt) s.draw(ctx);
    for (const b of this.blocks) b.draw(ctx);
    for (const e of this.enemies) e.draw(ctx);
    for (const s of this.strawberries) s.draw(ctx);
    this.#renderHearts();
    for (const b of this.slimeballs) b.draw(ctx);
    for (const p of this.slimeTrail) p.draw(ctx);
    for (const p of this.popups) p.draw(ctx);

    ctx.fillStyle = '#fff';
    ctx.font = '24px arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Collected: ${this.points}/${this.amountOfStrawberries}`, 10, 25);
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${this.level}`, canvas.width / 2, 25);
    ctx.textAlign = 'left';

    this.#renderAmmo();
  }

  // Slime-ball ammo pips: solid = ready, the next one grows as it recharges.
  #renderAmmo() {
    const { ctx } = this;
    const r = 7;
    const gap = 20;
    const cy = 44;
    for (let i = 0; i < C.MAX_SLIMEBALLS; i++) {
      const cx = 17 + i * gap;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#2e7d32';
      ctx.stroke();

      if (i < this.ammo) {
        ctx.fillStyle = '#5dd35d';
        ctx.fill();
      } else if (i === this.ammo) {
        const progress = this.refillTimer / C.SLIMEBALL_REFILL_MS;
        ctx.beginPath();
        ctx.arc(cx, cy, r * progress, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(93, 211, 93, 0.55)';
        ctx.fill();
      }
    }
  }

  // Hearts (top-right), each rendered full, half (left side only), or empty.
  #renderHearts() {
    const { ctx, images } = this;
    const heart = images.heart;
    const hearts = this.maxHealth / 2;
    for (let i = 0; i < hearts; i++) {
      const x = i * 32 + 500;
      const filled = this.health - i * 2; // 2 = full, 1 = half, <= 0 = empty
      if (filled >= 2) {
        ctx.drawImage(heart, x, 5);
      } else if (filled === 1) {
        const hw = heart.width / 2;
        ctx.drawImage(heart, 0, 0, hw, heart.height, x, 5, hw, heart.height);
      }
    }
  }

  #renderWin() {
    const { ctx, canvas } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = '#5dd35d';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${this.level} complete!`, cx, cy - 12);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${this.points}`, cx, cy + 18);

    ctx.fillStyle = '#ffe44d';
    ctx.font = '16px Arial';
    ctx.fillText(`▶ Click for level ${this.level + 1}`, cx, cy + 52);
  }

  #renderGameOver() {
    const { ctx, canvas } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.fillStyle = '#ff5b5b';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', cx, cy - 10);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`You collected ${this.points}/${this.amountOfStrawberries}`, cx, cy + 22);
    this.#renderPlayAgain(cx, cy + 56);
  }

  #renderPlayAgain(cx, y) {
    const { ctx } = this;
    ctx.fillStyle = '#ffe44d';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('▶ Click to play again', cx, y);
  }
}
