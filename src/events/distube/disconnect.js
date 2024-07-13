/**
 * Event listener for when distube is disconnected from voice channel
 */

export default {
    name: 'disconnect',
    once: false,
    async execute(queue) {
        queue.textChannel.send({
            content: `Disconnected from \`${queue.voiceChannel}\` voice channel.`
        })
    }
}