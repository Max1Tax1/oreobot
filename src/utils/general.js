/**
 * General utility functions for Oreo
 */

import { EmbedBuilder } from 'discord.js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { readFileSync } from 'fs'
import * as config from '../config.js'

//-------------------------------------------------
// Bot/Client related util functions
// ------------------------------------------------

/**
 * Prints bot information to the console, including version, start time, and author details.
 */
export function printBotInfo() {
    const currDate = new Date().toLocaleDateString('en-GB')
    const currTime = new Date().toLocaleTimeString('en-GB')
    const mode = config.testMode ? 'test' : 'stable'
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
    console.log('▄▄▄▄▄▄▄▄▄▄▄▄▄                                 ▄▄▄▄▄▄▄▄▄▄▄▄▄')
    console.log('█░░░░▒▒▒▒▓▓▓▓ ▄█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▄ ▓▓▓▓▒▒▒▒░░░░█')
    console.log('█░░░░  ▄▄▄▄▄▄▄█ ╔═════════════════════════╗ █▄▄▄▄▄▄▄  ░░░░█')
    console.log('█░░░░           ║     🍪 Oreo bot 🍪      ║           ░░░░█')
    console.log('█░░░░  ▀▀▀▀▀▀▀█ ╚═════════════════════════╝ █▀▀▀▀▀▀▀  ░░░░█')
    console.log('█░░░░▒▒▒▒▓▓▓▓ ▀█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█▀ ▓▓▓▓▒▒▒▒░░░░█')
    console.log('█▀▀▀▀▀▀▀▀▀▀▀▀                                 ▀▀▀▀▀▀▀▀▀▀▀▀█')   
    console.log(`█ ${padText(`💡 Version: ${packageJson.version} (${mode} mode)`)}█`)
    console.log(`█ ${padText(`📅 Started on: ${currDate}`)}█`)
    console.log(`█ ${padText(`🕒 Time at: ${currTime}`)}█`)
    console.log(`█ ${padText(`📝 Written by ${packageJson.author}`)}█`)
    console.log('█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█')
}

/**
 * Adds an event listener to an event emitter with a wrapped function, to catch all arguments dynamically.
 *
 * @param {Client} client - The bot client.
 * @param {Object} eventEmitter - The event emitter where the listener is from.
 * @param {string} event - The name of the event.
 * @param {boolean} once - Whether or not this is a one-time listener. (default false)
 * @param {Function} listenerFunction - The listener's to-do function.
 * @returns {Function} The wrapped function that was added as a listener to the event emitter.
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

/**
 * Checks if the client (bot) is in the same voice channel as the user who initiated the interaction.
 *
 * @param {Interaction} interaction - The interaction object that contains the user and guild information.
 * @param {Client} client - The Discord client (bot) instance.
 * @returns {integer} Returns a state of 0 to 3
 *  - 0: User is not in a voice channel
 *  - 1: Client is not in a voice channel
 *  - 2: User and Client are in voice channels, but not the same one.
 *  - 3: User and Client are both in the same voice channel
 */
export function checkVCState(interaction, client) {
    
    // User not in vc
    const userVoiceChannel = interaction.member.voice.channel
    if (!userVoiceChannel) return 0

    // Bot not in vc
    if (client.voice?.adapters?.size == 0) return 1


    // Bot and user in same vc
    if (userVoiceChannel.members.find(member => member.id === client.user.id)) return 3

    // Bot and user not in same vc
    return 2
}

//-------------------------------------------------
// Message/Embed related util functions
// ------------------------------------------------

/**
 * Generates a default embed message with specific settings for a bot interaction.
 * 
 * @param {Client} client - The bot client.
 * @param {User} user - The user which requested this embed.
 * @param {string} title - The title to be displayed in the embed.
 * @param {boolean} hasFooter - Whether or not to include the 'request by' footer
 * @param {boolean} hasTimestamp - Whether or not to include the timestamp
 * @returns {EmbedBuilder} An instance embed object configured with default settings.
 */
export function defaultEmbed(client, user, title, hasFooter=true, hasTimestamp=true) {
    const botAvatar = client.user.avatarURL({ dynamic: true })
    const userAvatar = user ? user.avatarURL({ dynamic: true }) : null
    const embed = new EmbedBuilder()
        .setAuthor({ name: title, url: null, iconURL: botAvatar })
        .setColor(config.embedColour)
    if (hasFooter && user) embed.setFooter({ text: 'Requested by ' + user.username, iconURL: userAvatar })
    if (hasTimestamp) embed.setTimestamp()
    return embed
}

/**
 * Returns the line separator used for Oreo's embeds.
 *
 * @param {boolean} breakBefore - Whether or not to include a '\n' character before the separator
 * @param {boolean} hasTimestamp - Whether or not to include a '\n' character after the separator
 * @returns {String} The line separator.
 */
export function embedLS(breakBefore = true, breakAfter = true) {
    let separator = []
    if (breakBefore) separator.push(`\n`)
    separator.push(config.embedSeparator)
    if (breakAfter) separator.push(`\n`)
    return separator.join('')
}

/**
 * Looks up emoji by name and returns the formatted string for the emoji to show graphically.
 *
 * @param {string} name - The name of the emoji
 * @param {boolean} animated - Whether or not the emoji is animated (default false)
 * @returns {string} The formatted emoji string for discord to convert into a graphical emoji
 */
export function getEmoji(client, name, animated=false) {
    const emoji = client.emojiList.find(e => e.name === name)
    return animated ? `a<:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`
}

/**
 * Creates a message component collector for the specified reply message.
 * 
 * @param {Interaction} interaction - The interaction object related to this message.
 * @param {Message} replyMessage - The result of an await interaction.reply-like.
 * @param {Function} onCollect - Function to run on interaction collect.
 * @param {Function} onEnd - (Optional) Function to run on interaction timeout.
 * Takes "interaction" as its only argument. Default function edits the message embed/content.
 * @param {number} time - (Optional) Duration in milliseconds for interaction timeout.
 * Default defined in config.js.
 * @returns {MessageComponentCollector} The message component collector that handles
 * interactions for the provided message.
 */
export function getInteractionCollector(interaction, replyMessage, onCollect, onEnd,
    time = config.interactionTimeout) {
    const collector = replyMessage.createMessageComponentCollector({ time: time })
    collector.on('collect', async (inter) => {
        collector.resetTimer()
        return await onCollect(inter)
    })
    collector.on('end', async () => {
        return await onEnd()
    })
    return collector
}

//-------------------------------------------------
// Generic util functions
// ------------------------------------------------

/**
 * Gets the current directory + specified directory
 *
 * @param {*} importMetaUrl - Use import.meta.url here to grab the current directory URL.
 * @param {string} subdir - Subdirectory from current directory.
 * @returns {string} - The entire directory line.
 */
export function getDir(importMetaUrl, subdir = '') {
    return join(dirname(fileURLToPath(importMetaUrl)), subdir)
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
 */
export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        throw new TypeError('Input must be an object')
    }
    return JSON.parse(JSON.stringify(obj))
}

/**
 * Reads the content of a file from the resources/texts/ folder and returns it as a string.
 *
 * @param {string} filename - The name of the file to read.
 * @returns {Promise<string>} A promise that resolves to the content of the file as a string.
 */
export async function getTextFile(filename) {
    try {
        const filePath = getDir(import.meta.url, `../../resources/texts/${filename}`)
        const content = await readFile(filePath, 'utf-8')
        return content
    } catch (error) {
        console.error('❌ Error reading text file:\n', error)
        process.exit(1)
    }
}

/**
 * Abbreviates a long string of text to have '...' at the end , if it exceeds the specified
 * max length.
 *
 * @param {string} text - Text to shorten.
 * @param {integer} maxLen - the max length of the text.
 * @returns {Promise<string>} A promise that resolves to the content of the file as a string.
 */
export function abbrText (text, maxLen) {
    return text.length > maxLen ? text.substring(0, maxLen - 3) + "..." : text.padEnd(maxLen)
}

/**
 * Formats a given non-negative integer by appending appropriate suffixes (K, M, B)
 * for thousands, millions, and billions, respectively.
 *
 * @param {number} num - The integer to be formatted. It must be a non-negative and finite integer.
 * @returns {string} The formatted string with appropriate suffix.
 */
export function numberTextFormat(num) {
    if (num < 1000) {
        return num.toString()
    } else if (num < 1000000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    } else if (num < 1000000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    } else {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
    }
}

/**
 * Adds a backslash before every punctuation symbol in the given string.
 *
 * @param {string} text - The input string.
 * @returns {string} The modified string with backslashes before punctuation symbols.
 */
export function escapePunc(text) {
    const punctuationRegex = /[*_~#\-\`>|]/g
    return text.replace(punctuationRegex, '\\$&')
}

/**
 * Generates a unique ID by combining a given base string with the current timestamp.
 *
 * @param {string} baseString - The base string to be used in generating the unique ID.
 * @returns {string} - The generated unique ID, consisting of the base string and the current timestamp.
 */
export function generateUID(baseString) {
    return `${baseString}_${Date.now()}`
}

/**
 * Checks if a string contains only alphabetical characters.
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a word (only alphabetical characters), false otherwise.
 */
export function isWord(str) {
    // Regular expression to match only alphabetical characters
    const regex = /^[A-Za-z]+$/;
    return regex.test(str);
  }