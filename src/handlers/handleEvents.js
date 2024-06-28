/**
 * Handler for registering event listeners
 */

export default function handleEvents(client) {
    client.handleEvents = async (eventFiles) => {
        try {
            for (let file of eventFiles) {
                const { default: event } = await import(`../events/${file}`)

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client))
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client))
                }
            }
        } catch (error) {
            console.error('❌ Error occurred whilst importing event listeners:\n', error)
            process.exit(1)
        }
    }
}