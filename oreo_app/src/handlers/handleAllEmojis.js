/**
 * Handler for registering event listeners
 */
import { readdirSync } from 'fs'
import { join, parse } from 'path'
import { getDir } from '../utils/general.js'
import * as config from '../config.js'

// Function to get a guild and the guild's emojis, from the guildID
async function getGuildEmojis(client, guildID) {
    const guild = client.guilds.cache.get(guildID)
    return {
        guild: guild,
        guildEmojis: await guild.emojis.fetch().catch(console.error)
    }
}

export const startMessage = 'Checking guild emojis'
export const finishMessage = 'Emojis checked and updated'
export default async function handleAllEmojis(client) {

    // Read in emojis from folders
    client.emojiList = []
    try {
        const emojiDirectory = getDir(import.meta.url, '../../resources/emojis')
        for (let folder of readdirSync(emojiDirectory)) {
            const emojiFiles = readdirSync(join(emojiDirectory, folder))

            // Map each file to { name: file name, url: image directory, folder: folder name}
            emojiFiles.map(file => ({
                name: parse(file).name,
                url: join(emojiDirectory, folder, file),
                folder: folder
            })).forEach(emoji => {
                client.emojiList.push(emoji)
            })
        }
    } catch (error) {
        throw new Error(`Error reading directory:\n${error}`)
    }

    // A dictionary to map each emoji folder name to a discord server of where it's at
    const emojiGuilds = {}
    try {
        for (const [name, guildID] of Object.entries(config.botEmojiGuildIDs)) {
            emojiGuilds[name] = await getGuildEmojis(client, guildID)
        }
    } catch (error) {
        throw new Error(`An error occurred whilst getting guild emojis:\n${error}`)
    }

    // Update the emojis for each of the emoji guilds
    try {
        for (const [folderName, { guild, guildEmojis }] of Object.entries(emojiGuilds)) {
            const localEmojiList = client.emojiList.filter(emoji => emoji.folder === folderName)
            localEmojiList.forEach(emoji => {
                
                // Check and find emoji that is registered in this guild
                const registeredEmoji = guildEmojis.find(e => e.name === emoji.name)
                if (registeredEmoji) emoji.id = registeredEmoji.id
                    
                // Emoji not registered, create it in this guild
                else {
                    guild.emojis.create({ attachment: emoji.url, name: emoji.name })
                    .then(emoji => console.log(`✅ Created new emoji with name ${emoji.name}, in ${guild.name}!`))
                    .catch(console.error)
                }
            })
        }
    } catch (error) {
        throw new Error(`Error occurred whilst loading emojis!:\n${error}`)
    }
}