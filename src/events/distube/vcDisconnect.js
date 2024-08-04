/**
 * Event listener for when distube is disconnected from voice channel
 */

export default {
    eventName: 'disconnect',
    once: false,
    function: async (queue) => {
        queue.textChannel.send({
            content: `Disconnected from \`${queue.voiceChannel}\` voice channel.`
        })
    }
}