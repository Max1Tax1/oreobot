/**
 * Event listener to notify with an embed when a song is added
 */
import { songInfoEmbed } from '../../utils/distube/utils.js'

export default {
    eventName: 'addSong',
    once: false,
    function: async (queue, song, client) => {
        const songPos = queue.songs.findIndex(queuedSong => queuedSong.id === song.id)
        const addedEmbed = songInfoEmbed(client, song, '➕ Song added to queue', true)
        if (songPos) addedEmbed.addFields({
            name: ' ',
            value: `➜ Added ${(songPos > 1) ? `at position ${songPos} of the queue!` :  `as the next track!`}`
        })
        queue.textChannel.send({
            embeds: [addedEmbed]
        })
    }
}