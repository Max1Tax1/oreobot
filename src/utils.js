/**
 * Utility functions for Oreo
 */

import { EmbedBuilder } from 'discord.js'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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
 * @param {Interaction} interaction - The interaction object this embed is related to. 
 * @param {string} title - The title to be displayed in the embed.
 * @param {boolean} hasFooter - Whether or not to include the "request by" footer
 * @param {boolean} hasTimestamp - Whether or not to include the timestamp
 * @returns {EmbedBuilder} - An instance embed object configured with default settings.
 */
export function defaultEmbed(interaction, title, hasFooter=true, hasTimestamp=true) {
    const botAvatar = interaction.client.user.avatarURL({ dynamic: true })
    const userAvatar = interaction.user.avatarURL({ dynamic: true })
    const resultEmbed = new EmbedBuilder()
        .setAuthor({ name: title, url: null, iconURL: botAvatar })
        .setColor(0xF9F6EE)
    if (hasFooter) resultEmbed.setFooter({ text: 'Requested by ' + interaction.user.username, iconURL: userAvatar })
    if (hasTimestamp) resultEmbed.setTimestamp()
    return resultEmbed
}

/**
 * Reads the content of a file from the resources/texts/ folder and returns it as a string.
 *
 * @param {string} filename - The name of the file to read.
 * @returns {Promise<string>} - A promise that resolves to the content of the file as a string.
 */
export async function getTextFile(filename) {
    try {
        const filePath = join(dirname(fileURLToPath(import.meta.url)), '..', 'resources', 'texts', filename)
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
    separator.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    if (breakAfter) separator.push(`\n`)
    return separator.join('')
}