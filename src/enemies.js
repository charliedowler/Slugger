import {
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_COLOR,
  ENEMY_COLOR_DARK,
  ENEMY_BOUNCE_VY,
  ENEMY_DEATH_GRAVITY,
  ENEMY_KNOCK_VX,
} from './constants.js';

// A patrolling enemy, drawn as a colour block (no sprite asset). It walks back
// and forth between two world bounds; the bounds scroll with the world so it
// stays over its platform. When shot or stomped it dies: it pops upward, then
// falls off the map under gravity and is removed once it leaves the screen.
export class Enemy {
  constructor(x, y, leftBound, rightBound) {
    this.x = x;
    this.y = y;
    this.width = ENEMY_SIZE;
    this.height = ENEMY_SIZE;
    this.leftBound = leftBound;
    this.rightBound = rightBound;
    this.dir = 1;
    this.dying = false;
    this.vy = 0;
    this.vx = 0;

    // Snapshot for snapping back when the slug dies and the world resets.
    this.prevX = x;
    this.prevLeft = leftBound;
    this.prevRight = rightBound;
  }

  // Kill the enemy: bounce it up and knock it sideways; gravity does the rest.
  kill(knockDir) {
    this.dying = true;
    this.vy = ENEMY_BOUNCE_VY;
    this.vx = knockDir * ENEMY_KNOCK_VX;
  }

  update() {
    if (this.dying) {
      this.vy += ENEMY_DEATH_GRAVITY;
      this.y += this.vy;
      this.x += this.vx;
      return;
    }

    this.x += this.dir * ENEMY_SPEED;
    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.dir = 1;
    } else if (this.x + this.width >= this.rightBound) {
      this.x = this.rightBound - this.width;
      this.dir = -1;
    }
  }

  // Shift with the scrolling world (position and patrol bounds together).
  scroll(dx) {
    this.x += dx;
    this.leftBound += dx;
    this.rightBound += dx;
  }

  reset() {
    this.x = this.prevX;
    this.leftBound = this.prevLeft;
    this.rightBound = this.prevRight;
    this.dir = 1;
    this.dying = false;
    this.vy = 0;
    this.vx = 0;
  }

  isOffMap(height) {
    return this.y > height;
  }

  isCollide(other) {
    return (
      this.x <= other.x + other.width &&
      this.x + this.width >= other.x &&
      this.y <= other.y + other.height &&
      this.y + this.height >= other.y
    );
  }

  draw(ctx) {
    if (this.dying) {
      // Flip upside-down to read as "defeated" while it tumbles away.
      ctx.save();
      ctx.translate(this.x, this.y + this.height);
      ctx.scale(1, -1);
      this.#drawBody(ctx, 0, 0);
      ctx.restore();
      return;
    }
    this.#drawBody(ctx, this.x, this.y);
  }

  #drawBody(ctx, x, y) {
    ctx.fillStyle = ENEMY_COLOR;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.fillStyle = ENEMY_COLOR_DARK;
    ctx.fillRect(x, y, this.width, 4); // top shading
    // Eyes, facing the direction of travel.
    ctx.fillStyle = '#fff';
    const eyeY = y + 9;
    const eyeX = this.dir > 0 ? x + 14 : x + 6;
    ctx.fillRect(eyeX, eyeY, 5, 5);
    ctx.fillRect(eyeX + 7, eyeY, 5, 5);
    ctx.fillStyle = '#000';
    ctx.fillRect(eyeX + 2, eyeY + 2, 2, 2);
    ctx.fillRect(eyeX + 9, eyeY + 2, 2, 2);
  }
}
