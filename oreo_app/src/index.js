/**
 * Main file for oreo bot
 */

import { Client, IntentsBitField } from 'discord.js'
import { basename } from 'path'
import { readdirSync } from 'fs'
import { getDir, printBotInfo } from './utils/general.js'
import * as secrets from './secrets.js'

//-------------------------------------------------
// Bot client initialization and setup
// ------------------------------------------------

// Print bot info
printBotInfo()

// Create a new Discord client instance with parameters
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
})

// Bot login
console.log('🔵 Logging in...')
await client.login(secrets.botToken).then(() => {
    console.log(`✅ Logged in as ${client.user.tag}`)
}).catch(error => {
    console.error('❌ Login failed:\n', error)
    process.exit(1)
})

// Once the bot is ready, set up the bot
client.once('ready', async () => {
    console.log('🔵 Setting up Oreo...')
    try {
        
        // Read in and run handlers (ALPHABETICAL ORDER! DO NOT CHANGE FILE NAMES!)
        const handlers = readdirSync(getDir(import.meta.url, './handlers')).filter(file => file.endsWith(".js"))
        for (let file of handlers) {
            const handler = await import(`./handlers/${file}`)
            try {
                console.log(`    🔵 ${handler.startMessage}...`)
                await handler.default(client)
            } catch (error) {
                console.error(`    ❌ Error occurred during setup, at ${basename(file)}\n${error}`)
                process.exit(1)
            } finally {
                console.log(`    ✅ ${handler.finishMessage}!`)
            }
        }

        // Set bot presence
        client.user.setPresence({
            activities: [{ name: 'with your feelings 💘' }],
            status: 'idle'
        })
    } catch (error) {
        console.error('❌ An error occurred during setup:\n', error)
        process.exit(1)
    } finally {
        console.log('✅ Setup complete!')
    }
})