// A drawable, collidable game object. This replaces the original `function
// Object(...)` constructor, which dangerously shadowed the built-in Object.

export class Entity {
  /**
   * @param {HTMLImageElement} sprite
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(sprite, x, y, width, height) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Original spawn position, used to snap objects back on death.
    this.prevX = x;
    this.prevY = y;

    // Jump impulse scales with height; tuned to match the original feel.
    this.jumpHeight = height / 2.5;

    // Blocks turn "slimey" the first time the slug lands on them.
    this.changed = false;

    // Per-ball velocity (only used by salt balls).
    this.vx = 0;
    this.vy = 0;
  }

  // Axis-aligned bounding-box overlap test.
  isCollide(other) {
    return (
      this.x <= other.x + other.width &&
      this.x + this.width >= other.x &&
      this.y <= other.y + other.height &&
      this.y + this.height >= other.y
    );
  }

  resetX() {
    this.x = this.prevX;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y);
  }
}
