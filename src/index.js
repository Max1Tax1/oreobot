/**
 * Main file for oreo bot
 */

import { Client, IntentsBitField } from 'discord.js'
import { readdirSync } from 'fs'
import * as secrets from './secrets.js'
import { printBotInfo } from './utils/general.js'

//-------------------------------------------------
// Bot client initialization and setup
// ------------------------------------------------

// Print bot info
printBotInfo()
console.log('🔵 Initiating Oreo...')

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

// Once the bot is ready, set up the bot
client.once('ready', async () => {
    try {

        // Read in and run handlers (ALPHABETICAL ORDER! DO NOT CHANGE FILE NAMES!)
        const handlers = readdirSync("./src/handlers").filter(file => file.endsWith(".js"))
        for (let file of handlers) {
            const handler = await import(`./handlers/${file}`)
            handler.default(client)
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
        console.log('✅ Bot setup with no errors.')
    }
})

// Bot login
client.login(secrets.botToken).then(() => {
    console.log(`✅ ${client.user.tag} Logged in.`)
}).catch(error => {
    console.error('❌ Login failed:\n', error)
    process.exit(1)
})