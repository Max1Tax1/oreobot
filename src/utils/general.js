/**
 * General utility functions for Oreo
 */

import { EmbedBuilder } from 'discord.js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { readFileSync } from 'fs'
import * as config from '../config.js'

/**
 * Prints bot information to the console, including version, start time, and author details.
 */
export function printBotInfo() {
    const currDate = new Date().toLocaleDateString('en-GB')
    const currTime = new Date().toLocaleTimeString('en-GB')
    let packageJson = {}

    // function to pad text for output
    function padText(text) {
        const totalLength = 56
        const paddingLength = totalLength - text.length
        return text + ' '.repeat(paddingLength)
    }

    try {
        packageJson = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json'), 'utf-8'))
    } catch (error) {
        console.error('❌ An error occurred whilest reading package.json:\n', error)
    }
    console.log('\x1b[1m\x1b[33m▄▄▄▄▄▄▄▄▄▄▄▄▄                                 ▄▄▄▄▄▄▄▄▄▄▄▄▄')
    console.log('█░░░░▒▒▒▒▓▓▓▓ ▄█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▄ ▓▓▓▓▒▒▒▒░░░░█')
    console.log('█░░░░  ▄▄▄▄▄▄▄█ ╔═════════════════════════╗ █▄▄▄▄▄▄▄  ░░░░█')
    console.log('█░░░░           ║     🍪 Oreo bot 🍪      ║           ░░░░█')
    console.log('█░░░░  ▀▀▀▀▀▀▀█ ╚═════════════════════════╝ █▀▀▀▀▀▀▀  ░░░░█')
    console.log('█░░░░▒▒▒▒▓▓▓▓ ▀█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█▀ ▓▓▓▓▒▒▒▒░░░░█')
    console.log('█▀▀▀▀▀▀▀▀▀▀▀▀                                 ▀▀▀▀▀▀▀▀▀▀▀▀█')   
    console.log(`█ ${padText(`💡 Version: ${packageJson.version}`)}█`)
    console.log(`█ ${padText(`📅 Started on: ${currDate}`)}█`)
    console.log(`█ ${padText(`🕒 Time at: ${currTime}`)}█`)
    console.log(`█ ${padText(`🖊️  Written by ${packageJson.author}`)}  █`)
    console.log('█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█\x1b[0m\n')
}

/**
 * Returns a random item from an array.
 * 
 * @param {Array} arr - The array to select a random item from.
 * @returns {*} A random item from the array.
 */
export function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * 
 * @param {number} min - The minimum integer (inclusive).
 * @param {number} max - The maximum integer (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates a default embed message with specific settings for a bot interaction.
 * 
 * @param {Client} client - The bot client.
 * @param {User} user - The user which requested this embed.
 * @param {string} title - The title to be displayed in the embed.
 * @param {boolean} hasFooter - Whether or not to include the 'request by' footer
 * @param {boolean} hasTimestamp - Whether or not to include the timestamp
 * @returns {EmbedBuilder} - An instance embed object configured with default settings.
 */
export function defaultEmbed(client, user, title, hasFooter=true, hasTimestamp=true) {
    const botAvatar = client.user.avatarURL({ dynamic: true })
    const userAvatar = (user != null) ? user.avatarURL({ dynamic: true }) : null
    const embed = new EmbedBuilder()
        .setAuthor({ name: title, url: null, iconURL: botAvatar })
        .setColor(config.embedColour)
    if (hasFooter) embed.setFooter({ text: 'Requested by ' + user.username, iconURL: userAvatar })
    if (hasTimestamp) embed.setTimestamp()
    return embed
}

/**
 * Reads the content of a file from the resources/texts/ folder and returns it as a string.
 *
 * @param {string} filename - The name of the file to read.
 * @returns {Promise<string>} - A promise that resolves to the content of the file as a string.
 */
export async function getTextFile(filename) {
    try {
        const filePath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'resources', 'texts', filename)
        const content = await readFile(filePath, 'utf-8')
        return content
    } catch (error) {
        console.error('❌ Error reading text file:\n', error)
        process.exit(1)
    }
}

/**
 * Returns the line separator used for Oreo's embeds.
 *
 * @param {boolean} breakBefore - Whether or not to include a '\n' character before the separator
 * @param {boolean} hasTimestamp - Whether or not to include a '\n' character after the separator
 * @returns {String} - The line separator.
 */
export function embedLS(breakBefore = true, breakAfter = true) {
    let separator = []
    if (breakBefore) separator.push(`\n`)
    separator.push(config.embedSeparator)
    if (breakAfter) separator.push(`\n`)
    return separator.join('')
}

/**
 * Creates a deep copy of a given object using JSON serialization.
 *
 * This function uses JSON.stringify() and JSON.parse() to create a deep copy of
 * the input object. Note that this method will not work correctly for objects
 * containing non-JSON safe values such as functions, undefined, Date, Map, Set,
 * Infinity, NaN, and other special values.
 *
 * @param {Object} obj - The object to be deep copied.
 * @returns {Object} A deep copy of the input object.
 * @throws {TypeError} If the input is not an object.
 *
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const copy = deepCopy(original);
 * console.log(copy); // { a: 1, b: { c: 2 } }
 * console.log(original === copy); // false
 * console.log(original.b === copy.b); // false
 */
export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        throw new TypeError('Input must be an object');
    }
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Formats a given non-negative integer by appending appropriate suffixes (K, M, B)
 * for thousands, millions, and billions, respectively.
 *
 * @param {number} num - The integer to be formatted. It must be a non-negative and finite integer.
 * @returns {string} - The formatted string with appropriate suffix.
 *
 * @example
 * // returns "999"
 * formatNumber(999);
 *
 * @example
 * // returns "1.5K"
 * formatNumber(1500);
 *
 * @example
 * // returns "1.2M"
 * formatNumber(1200000);
 *
 * @example
 * // returns "3.5B"
 * formatNumber(3500000000);
 */
export function numberTextFormat(num) {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1000000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else if (num < 1000000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
}

/**
 * Adds a backslash before every punctuation symbol in the given string.
 *
 * @param {string} str - The input string.
 * @returns {string} - The modified string with backslashes before punctuation symbols.
 */
export function escapePunc(str) {
    const punctuationRegex = /([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g
    return str.replace(punctuationRegex, '\\$1')
}

/**
 * Looks up emoji by name and returns the formatted string for the emoji to show graphically.
 *
 * @param {string} name - The name of the emoji
 * @param {boolean} animated - Whether or not the emoji is animated (default false)
 * @returns {string} - The formatted emoji string for discord to convert into a graphical emoji
 */
export function getEmoji(client, name, animated=false) {
    const emoji = client.emojiList.find(e => e.name === name)
    return animated ? `a<:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`
}


/**
 * Adds an event listener to an event emitter with a wrapped function, to catch all arguments dynamically.
 *
 * @param {Client} client - The bot client.
 * @param {Object} eventEmitter - The event emitter where the listener is from.
 * @param {string} event - The name of the event.
 * @param {boolean} once - Whether or not this is a one-time listener. (default false)
 * @param {Function} listenerFunction - The listener's to-do function.
 * @returns {Function} - The wrapped function that was added as a listener to the event emitter.
 */
export function addEventListener(client, eventEmitter, event, once=false, listenerFunction) {
    const wrappedFunction = function (...args) { listenerFunction(...args, client) }
    if (once) eventEmitter.once(event, wrappedFunction)
    else eventEmitter.on(event, wrappedFunction)
    return wrappedFunction
}

/**
 * Removes an event listener from an event emitter.
 *
 * @param {Object} eventEmitter - The event emitter where the listener is from.
 * @param {string} event - The name of the event.
 * @param {Function} listenerFunction - The listener's to-do function.
 */
export function removeEventListener(eventEmitter, event, listenerFunction) {
    eventEmitter.off(event, listenerFunction)
}