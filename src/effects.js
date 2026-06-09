// Visual effects: blood splatter, slime trail, and slime-ball projectiles.
// Each separates update() (physics) from draw() (rendering) so the game's
// fixed-timestep loop can advance them independently of the frame rate.

const rand = (n) => Math.floor(Math.random() * n);

class GravityParticle {
  constructor(x, y, color, velY, spread) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.grav = 20;
    this.weight = 0.1;
    this.r = rand(4) + 1;
    this.velY = velY;
    this.velX = rand(5) - 2.5;
    this.arc = Math.random() * Math.PI * spread;
  }

  update() {
    if (this.velY < this.grav) this.velY += this.weight;
    this.y += this.velY;
    this.x += this.velX;
    this.r += 0.01;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, this.arc, false);
    ctx.fill();
  }

  isDead(width, height) {
    return this.r > 4 || this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

export class BloodParticle extends GravityParticle {
  constructor(slug) {
    super(slug.x + rand(32) + 1, slug.y + rand(32) + 1, 'red', -3, 1.5);
  }
}

export class SlimeParticle extends GravityParticle {
  constructor(slug) {
    super(slug.x + 16, slug.y + 32, 'green', -1, 1.1);
  }
}

export class SlimeBall {
  constructor(slug, sprite, direction, speed, launchVy, gravity) {
    this.sprite = sprite;
    this.x = direction === 'left' ? slug.x + slug.width / 5 : slug.x + slug.width / 1.5;
    this.y = slug.y + slug.height / 2;
    this.width = sprite.width || 16;
    this.height = sprite.height || 16;

    // Launched as a projectile: horizontal speed + an initial upward kick,
    // then gravity pulls it into an arc.
    this.vx = direction === 'left' ? -speed : speed;
    this.vy = launchVy;
    this.gravity = gravity;
  }

  update() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
  }

  isCollide(other) {
    return (
      this.x <= other.x + other.width &&
      this.x + this.width >= other.x &&
      this.y <= other.y + other.height &&
      this.y + this.height >= other.y
    );
  }

  isExpired(width, height) {
    return this.x > width || this.x + this.width < 0 || this.y > height;
  }
}

// A short-lived "+1" that floats up and fades when a strawberry is collected.
export class FloatingText {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.life = 60;
    this.maxLife = 60;
  }

  update() {
    this.y -= 0.6;
    this.life -= 1;
  }

  get dead() {
    return this.life <= 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = '#ffe44d';
    ctx.font = 'bold 16px arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
