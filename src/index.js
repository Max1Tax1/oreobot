/**
 * Main file for oreo bot
 */

import {Client, IntentsBitField, Collection} from 'discord.js'
import { readdirSync } from 'fs'
import * as config from './config.js'

const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'))
const handlers = readdirSync("./src/handlers").filter(file => file.endsWith(".js"))
const commandFolders = readdirSync("./src/commands")

//-------------------------------------------------
// Bot client initialization and setup
// ------------------------------------------------

console.log('----------------------------------')
console.log('🔵 Initiating Oreo...')

// Create a new Discord client instance with parameters
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,         // Intent to receive guild information
        IntentsBitField.Flags.GuildMembers,   // Intent to receive member information in guilds
        IntentsBitField.Flags.GuildMessages,  // Intent to receive messages in guilds
        IntentsBitField.Flags.MessageContent  // Intent to receive message contents
    ]
})

// Once the bot is ready, set up the bot
client.once('ready', async () => {
    try {
        client.commands = new Collection()
        client.commandModules = new Map()

        // Read in and set up handlers. Handler functions are attached to client.
        for (let file of handlers) {
            const handler = await import(`./handlers/${file}`)
            handler.default(client)
        }
        client.loadCommands(commandFolders, './src/commands')
        client.loadEvents(eventFiles)

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
client.login(config.botToken).then(() => {
    console.log(`✅ ${client.user.tag} Logged in.`)
}).catch(error => {
    console.error('❌ Login failed:\n', error)
    process.exit(1)
})