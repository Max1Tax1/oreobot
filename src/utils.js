// Utility functions

/**
 * Returns a random item from an array.
 * 
 * @param {Array} arr - The array to select a random item from.
 * @returns {*} A random item from the array.
 */
export function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * 
 * @param {number} min - The minimum integer (inclusive).
 * @param {number} max - The maximum integer (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}