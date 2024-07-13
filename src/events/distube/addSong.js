/**
 * Event listener for when distube adds a song
 */
import { songInfoEmbed } from '../../utils/media.js'
import { embedLS } from '../../utils/general.js'

export default {
    name: 'addSong',
    once: false,
    async execute(queue, song, client) {

        // Do not return anything when music player is silenced.
        if (client.distube.silentMode) return

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