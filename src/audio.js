// Central audio control with a persisted mute setting. Both the menu and the
// game route sound through playSound() so the toggle affects everything.

const STORAGE_KEY = 'slugger.muted';

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

let muted = readStored();

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = Boolean(value);
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // Ignore storage failures (e.g. private mode) — muting still works in-session.
  }
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

/** Play an HTMLAudioElement from the start, unless sound is muted. */
export function playSound(audio) {
  if (muted || !audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
