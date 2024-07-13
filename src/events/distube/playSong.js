/**
 * Event listener for when distube plays media
 */
import { songInfoEmbed } from '../../utils/media.js'

export default {
    name: 'playSong',
    once: false,
    async execute(queue, song, client) {
        
        // Do not return anything when music player is silenced.
        if (client.distube.silentMode) return
        
        const playEmbed = songInfoEmbed(client, song, '🎵 Now playing')
        queue.textChannel.send({
            embeds: [playEmbed]
        })
    }
}