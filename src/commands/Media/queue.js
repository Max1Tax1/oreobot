/**
 * Command to add media to queue
 * TODO: Check for queue change when button press, and send queue change msg when happen
 */

import { SlashCommandBuilder } from 'discord.js'
import { getMedia, QueuePanel } from '../../utils/media.js'

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
    const voiceChannel = interaction.member.voice.channel
    const mediaName = interaction.options.get('media')?.value
    const queue = client.distube.getQueue(interaction.guild.id)

    // User specified media, add media to queue
    if (mediaName) {

        // Check if user in voice channel
        if (!voiceChannel) return await interaction.reply({
            content: 'Please join a voice channel first!',
            ephemeral: true
        })

        // Add media to queue
        getMedia(interaction, mediaName, 'add')
        return await interaction.reply({
            content: 'Media found, now playing...',
            ephemeral: true
        })
    }

    // Check if media player is active (playing song/queued songs)
    if (!queue) return await interaction.reply({
        content: 'The media player is inactive, and the queue is empty. Try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })

    // Create and send the queue embed message
    const queuePanel = new QueuePanel(interaction, client, queue)
    const replyMessage = await interaction.reply({
        embeds: [queuePanel.embed],
        components: queuePanel.buttons
    })

    // Collector for button interactions
    const collector = await replyMessage.createMessageComponentCollector()
    collector.on('collect', async (inter) => {
        
        // Apply appropriate response
        queuePanel.collectorFunc(inter, client, queue)
    })
}