import { colors } from '../constants';

/**
 * Returns a random color from the `colors` array.
 * @returns {string} A randomly selected color.
 */
export function getRandomColor(): string {
  return colors[Math.round(Math.random() * colors.length)];
}
