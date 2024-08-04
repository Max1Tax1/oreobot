/**
 * Command to add media to queue
 */

import { SlashCommandBuilder } from 'discord.js'
import { playMedia } from '../../utils/distube/utils.js'
import { MusicController } from '../../utils/distube/MusicController.js'
import { checkVCState } from '../../utils/general.js'
import * as config from '../../config.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue control panel. Add media name optionally to queue it.')
    .addStringOption(option =>
        option.setName('media')
            .setDescription('The media to queue. Can be a search or the URL.')
            .setRequired(false))

export async function execute(interaction, client) {
    const mediaName = interaction.options.get('media')?.value
    const queue = client.distube.getQueue(interaction.guild.id)
    const vcState = checkVCState(interaction, client)

    // User specified media, add media to queue
    if (mediaName) {
        const replyMessage = await playMedia(interaction, mediaName, 'default', true)
        return await interaction.reply(replyMessage)
    }

    // Check if media player is active (playing song/queued songs)
    if (!queue) return await interaction.reply({
        content: 'The media player is inactive. Join a voice channel, ' +
            'and try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })

    // Check if user in voice channel of Oreo
    if (!vcState == 3) return await interaction.reply({
        content: "We're not in the same place! Please join a voice channel that I'm in first.",
        ephemeral: true
    })

    // Create and send the queue embed message
    await interaction.deferReply()
    const musicController = new MusicController(interaction, client, 'queue')
    await musicController.init()
    const replyMessage = await interaction.followUp(musicController.panel.panelMessage)

    // Collector for button interactions
    const collector = await replyMessage.createMessageComponentCollector()
    collector.on('collect', async (inter) => {
        musicController.collectorFunc(inter, queue)
    })
}