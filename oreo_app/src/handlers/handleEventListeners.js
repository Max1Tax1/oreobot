/**
 * Handler for registering event listeners
 */
import { readdirSync } from 'fs'
import { basename, extname } from 'path'
import { getDir, addEventListener } from '../utils/general.js'

export const startMessage = 'Loading in event listeners'
export const finishMessage = 'Event listeners loaded'
export default async function handleEventListeners(client) {

    // Function to register/store listener to event emitter
    function registerListener(client, eventEmitter, listener, listenerName, eventName) {
        const listenerFunction = addEventListener(
            client, eventEmitter, eventName, listener.once, listener.function
        )

        // Store the listener info
        eventEmitter.listeners.set(listenerName, {
            event: eventName,
            function: listenerFunction
        })
    }

    // Function to load event listener files from a folder
    async function loadEventFolder(dir, eventEmitter) {
        try {
            const folderPath = getDir(import.meta.url, dir)
            const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'))
            eventEmitter.listeners = new Map()

            for (let file of eventFiles) {

                // Import listener from file
                const { default: listener } = await import(`${dir}/${file}`)
                const listenerName = basename(file, extname(file))

                // Get listener.eventName type and assign listener to event accordingly
                if (typeof listener.eventName === 'object') {
                    if (Array.isArray(listener.eventName)) {
                        listener.eventName.forEach(eventName => {
                            registerListener(client, eventEmitter, listener, listenerName, eventName)
                        })
                    } else {
                        throw TypeError(`eventName for listener ${listenerName} is of an invalid type`)
                    }
                } else if (typeof listener.eventName === 'string') {
                    registerListener(client, eventEmitter, listener, listenerName, listener.eventName)
                } else {
                    throw TypeError(`eventName for listener ${listenerName} is of an invalid type`)
                }
            }
            
        } catch (error) {
            throw new Error(`Error occurred whilst importing event listener from ${dir}:\n${error}`)
        }
    }

    // Load client and distube event listeners
    await loadEventFolder('../events/client', client)
    await loadEventFolder('../events/distube', client.distube)
}
