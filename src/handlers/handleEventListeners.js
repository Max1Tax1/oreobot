/**
 * Handler for registering event listeners
 */
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, basename, extname } from 'path'
import { addEventListener } from '../utils/general.js'

export default async function handleEvents(client) {
    const currDir = dirname(fileURLToPath(import.meta.url))

    // Function to load event listener files from a folder
    async function loadEventFolder(dir, eventEmitter) {
        try {
            const folderPath = join(currDir, dir)
            const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'))
            eventEmitter.listeners = new Map()

            for (let file of eventFiles) {

                // Import listener from file
                const { default: listener } = await import(`${dir}/${file}`)

                // Register listener to event emitter
                const listenerFunction = addEventListener(
                    client, eventEmitter, listener.eventName, listener.once, listener.function
                )

                // Store the listener info
                const listenerName = basename(file, extname(file))
                eventEmitter.listeners.set(listenerName, {
                    event: listener.eventName,
                    function: listenerFunction
                })
            }
            
        } catch (error) {
            console.error(`❌ Error occurred whilst importing event listener from ${dir}:\n`, error)
            process.exit(1)
        }
    }

    // Load client and distube event listeners
    await loadEventFolder('../events/client', client)
    await loadEventFolder('../events/distube', client.distube)
}
