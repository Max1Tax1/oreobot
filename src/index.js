// Imports and definitions
import { Client, IntentsBitField } from 'discord.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readdirSync } from 'fs'
import { botToken } from './config.js'

const filename = fileURLToPath(import.meta.url);

//-------------------------------------------------
// Bot Client Initialization
// ------------------------------------------------

console.log('----------------------------------')
console.log('🔵 Initiating Oreobot...')

// Create a new Discord client instance with parameters
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,         // Intent to receive guild information
        IntentsBitField.Flags.GuildMembers,   // Intent to receive member information in guilds
        IntentsBitField.Flags.GuildMessages,  // Intent to receive messages in guilds
        IntentsBitField.Flags.MessageContent  // Intent to receive message contents
    ]
})

// Bot login login
client.login(botToken).then(() => {
    console.log(`✅ ${client.user.tag} Login successful.`);
}).catch(error => {
    console.error('❌ Login failed:', error);
})

// Once the bot is ready, register event listeners and log in
client.once('ready', () => {
    loadEventHandlers()
        .then(() => {
            console.log('✅ All event handlers loaded.')
        })
        .catch(error => {
            console.error('❌ Failed to load event handlers:', error);
        })
})

// ------------------------------------------------
// Helper functions
// ------------------------------------------------

// Function to load event handlers dynamically
const loadEventHandlers = async () => {
    const eventsDir = join(dirname(filename), 'events');
    const eventFiles = readdirSync(eventsDir).filter(file => file.endsWith('.js'));

    console.log('🔵 Loading event handlers...')
    for (const file of eventFiles) {
        const eventHandler = await import(`file://${join(eventsDir, file)}`);
        if (typeof eventHandler.default === 'function') {
            eventHandler.default(client);
            console.log(`\t✅ Loaded event handler from ${file}`);
        } else {
            console.warn(`\t⚠️ No default export function found in ${file}. Skipping.`);
        }
    }
}
