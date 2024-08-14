/**
 * Event listener to notify when the queue is finished.
 */

import { defaultEmbed } from '../../utils/general.js'

export default {
    eventName: 'finish',
    once: false,
    function: async (queue, client) => {
        if (client.distube.silentMode) return

        const embed = new defaultEmbed(client, null, '🏁 Queue finished', false, true)
        embed.setDescription(`The media queue has finished.
            Use \`/play\` with a \`media\` name to start playing again! `)
        queue.textChannel.send({
            embeds: [embed]
        })
    }
}