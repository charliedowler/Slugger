// Shared object sizes and the slug's spawn point. The actual layout (blocks,
// strawberries, salt, salt balls, pipe) is produced at runtime by levelgen.js.

export const BLOCK_SIZE = 32;
export const STRAWBERRY_SIZE = 16;
export const SALT = { width: 32, height: 8 };
export const SALT_BALL_SIZE = 8;

export const SLUG_START = { x: 140, y: 200, width: 32, height: 32 };
