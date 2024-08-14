/**
 * Event listener to format a new song with relevant info.
 */

import { generateUID } from '../../utils/general.js'

export default {
    eventName: ['playSong', 'addSong'],
    once: false,
    function: async (queue, song, client) => {
        song.uid = (generateUID(song.id))
        if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
    }
}