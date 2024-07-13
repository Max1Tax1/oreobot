/**
 * Handler for registering event listeners
 */
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export default async function handleEvents(client) {
    const currDir = dirname(fileURLToPath(import.meta.url))

    // Function to load event files from a folder
    const loadEventFolder = async (dir, eventEmitter) => {
        try {
            const folderPath = join(currDir, dir)
            const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'))

            for (let file of eventFiles) {
                const { default: event } = await import(`${dir}/${file}`)

                if (event.once) {
                    eventEmitter.once(event.name, (...args) => event.execute(...args, client))
                } else {
                    eventEmitter.on(event.name, (...args) => event.execute(...args, client))
                }
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
