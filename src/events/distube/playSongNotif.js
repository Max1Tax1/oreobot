/**
 * Event listener to notify with an embed when a song is played
 */
import { songInfoEmbed } from '../../utils/distube/utils.js'

export default {
    eventName: 'playSong',
    once: false,
    function: async (queue, song, client) => {
        if (client.distube.silentMode) return
        
        const playEmbed = songInfoEmbed(client, song, '🎵 Now playing', true, true)
        queue.textChannel.send({
            embeds: [playEmbed]
        })
    }
}