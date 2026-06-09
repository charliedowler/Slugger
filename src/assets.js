// Promise-based asset loading. The original used a manual "resources loaded"
// counter and polled with setTimeout; modern code just awaits the load events.

// Relative paths resolve correctly in dev and under any deploy sub-path.
const IMAGE_BASE = 'IMAGES/';
const SOUND_BASE = 'SOUNDS/';

function loadImage(name) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${name}`));
    img.src = `${IMAGE_BASE}${name}.png`;
  });
}

/**
 * Load a list of image names into a name -> HTMLImageElement map.
 * @param {string[]} names
 * @returns {Promise<Record<string, HTMLImageElement>>}
 */
export async function loadImages(names) {
  const loaded = await Promise.all(names.map(loadImage));
  return Object.fromEntries(names.map((name, i) => [name, loaded[i]]));
}

/**
 * Build a name -> HTMLAudioElement map. Audio can play before fully buffered,
 * so we don't need to await these the way we do images.
 * @param {string[]} names
 * @returns {Record<string, HTMLAudioElement>}
 */
export function loadSounds(names) {
  return Object.fromEntries(names.map((name) => [name, new Audio(`${SOUND_BASE}${name}.mp3`)]));
}
