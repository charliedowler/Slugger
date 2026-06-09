import { loadImages, loadSounds } from './assets.js';
import { playSound } from './audio.js';

const MENU_IMAGES = ['slugger', 'twitter', 'start1', 'start2'];

// The title screen: logo, a hover-reactive start button, and a twitter badge.
export class Menu {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.images = {};
    this.sound = null;
    this.mouseX = -1;
    this.mouseY = -1;
    this.hovering = false;
    this.running = false;
    this.onStart = null;
  }

  async load() {
    this.images = await loadImages(MENU_IMAGES);
    this.sound = loadSounds(['menu']).menu;
  }

  start(onStart) {
    this.onStart = onStart;
    this.running = true;
    this.canvas.addEventListener('pointermove', this.#onMove);
    this.canvas.addEventListener('click', this.#onClick);
    requestAnimationFrame(this.#loop);
  }

  stop() {
    this.running = false;
    this.canvas.removeEventListener('pointermove', this.#onMove);
    this.canvas.removeEventListener('click', this.#onClick);
  }

  #onMove = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  };

  #onClick = () => {
    if (this.#overButton()) {
      this.stop();
      this.onStart?.();
    }
  };

  #overButton() {
    const { canvas, images } = this;
    const btn = images.start1;
    return (
      this.mouseX > canvas.width / 2 - btn.width / 2 &&
      this.mouseX < canvas.width / 2 + btn.width / 2 &&
      this.mouseY < canvas.height / 2 + btn.height &&
      this.mouseY > canvas.height / 2 - btn.height / 4
    );
  }

  #loop = () => {
    if (!this.running) return;
    const { ctx, canvas, images } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const over = this.#overButton();
    if (over && !this.hovering) {
      playSound(this.sound);
      this.hovering = true;
    } else if (!over) {
      this.hovering = false;
    }

    const button = over ? images.start2 : images.start1;
    ctx.drawImage(images.slugger, canvas.width / 2 - images.slugger.width / 2, canvas.height / 4);
    ctx.drawImage(button, canvas.width / 2 - button.width / 2, canvas.height / 2);
    ctx.drawImage(images.twitter, canvas.width / 2 - images.twitter.width / 2, canvas.height / 1.1);

    requestAnimationFrame(this.#loop);
  };
}
