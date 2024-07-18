/**
 * Handler for registering event listeners
 */
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, parse } from 'path'
import { exit } from 'process'

import { botGuildID } from '../secrets.js'

export default async function handleCustomEmojis(client) {
    client.emojiList = []

    // Read in emojis from folder
    try {
        const currDir = dirname(fileURLToPath(import.meta.url))
        const emojiDirectory = join(currDir, '../../resources/emojis')
        const pngFiles = readdirSync(emojiDirectory).filter(file => file.toLowerCase().endsWith('.png'))
      
        // Map each file to { name: file name, image: image directory }
        client.emojiList = pngFiles.map(file => ({
            name: parse(file).name,
            url: join(emojiDirectory, file)
        }))
    } catch (error) {
        console.error('Error reading directory:', error)
        exit(1)
    }

    // Update the custom emojis on oreo's base server
    try {
        const guild = client.guilds.cache.get(botGuildID)
        const guildEmojis = await guild.emojis.fetch().catch(console.error)
        // guildEmojis.forEach(emoji => {
        //     emoji.delete()
        // })
        client.emojiList.forEach(emoji => {
            const registeredEmoji = guildEmojis.find(e => e.name === emoji.name)
            if (registeredEmoji) emoji.id = registeredEmoji.id
            else {
                guild.emojis.create({ attachment: emoji.url, name: emoji.name })
                .then(emoji => console.log(`✅ Created new emoji with name ${emoji.name}!`))
                .catch(console.error)
            }
        })
    } catch (error) {
        console.error('❌ Error occurred whilst loading emojis!:\n', error)
        exit(1)
    } finally {
        console.log(`✅ Emojis checked and updated!`)
    }
}