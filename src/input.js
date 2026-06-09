// Keyboard tracking via KeyboardEvent.code (the modern, layout-independent
// replacement for the deprecated keyCode numbers the original used).

export class Keyboard {
  #pressed = new Set();
  #onRelease;

  /**
   * @param {() => void} [onRelease] called on every keyup, used to clear
   *   one-shot action locks (shoot, etc.) — preserving the original feel.
   */
  constructor(onRelease) {
    this.#onRelease = onRelease;
    window.addEventListener('keydown', this.#handleDown);
    window.addEventListener('keyup', this.#handleUp);
  }

  #handleDown = (event) => {
    // Stop arrows/space from scrolling the page while playing.
    if (GAME_KEYS.has(event.code)) event.preventDefault();
    this.#pressed.add(event.code);
  };

  #handleUp = (event) => {
    this.#pressed.delete(event.code);
    this.#onRelease?.();
  };

  isDown(code) {
    return this.#pressed.has(code);
  }

  destroy() {
    window.removeEventListener('keydown', this.#handleDown);
    window.removeEventListener('keyup', this.#handleUp);
  }
}

export const Keys = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  JUMP: 'Space',
  SHOOT: 'KeyS',
};

const GAME_KEYS = new Set(Object.values(Keys));
