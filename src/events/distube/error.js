/**
 * Event listener for errors
 */

export default {
    eventName: 'error',
    once: false,
    function: async (error, queue) => {
        if (queue.textChannel) queue.textChannel.send(
            '⚠️ An error occurred while trying to play this media. Please try a different media or try again in a few minutes.')
        console.error('❌ An error occurred with DisTube:\n', error)
    }
}