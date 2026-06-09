import './style.css';
import { Menu } from './menu.js';
import { Game, GAME_IMAGES, GAME_SOUNDS } from './game.js';
import { loadImages, loadSounds } from './assets.js';
import { isMuted, toggleMuted } from './audio.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Tiled background, shown behind both the menu and the game (relative path so
// it resolves under any deploy sub-path).
canvas.style.backgroundImage = "url('IMAGES/bg.png')";

// Sound on/off toggle (persisted across sessions).
const soundToggle = document.getElementById('sound-toggle');
function refreshSoundLabel() {
  soundToggle.textContent = isMuted() ? '🔇 Sound: Off' : '🔊 Sound: On';
}
refreshSoundLabel();
soundToggle.addEventListener('click', () => {
  toggleMuted();
  refreshSoundLabel();
  soundToggle.blur(); // release focus so Space/arrows don't re-trigger it mid-game
});

async function main() {
  const menu = new Menu(canvas, ctx);

  // Preload the game's assets while the player is on the title screen,
  // so pressing Start drops straight into the level with no loading gap.
  const gameImagesPromise = loadImages(GAME_IMAGES);

  await menu.load();

  menu.start(async () => {
    const images = await gameImagesPromise;
    const sounds = loadSounds(GAME_SOUNDS);
    new Game(canvas, ctx, images, sounds).start();
  });
}

main();
