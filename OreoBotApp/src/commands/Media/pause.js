/**
 * Command to pause the media player
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed, checkVCState } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the media player.')

export async function execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id)

    // Checks if pause command can be used
    if (!queue) return await interaction.reply({
        content: 'The media player is inactive. Join a voice channel, ' +
            'and try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })

    // Check if user in voice channel of Oreo
    if (!checkVCState(interaction, client) == 3) return await interaction.reply({
        content: "We're not in the same place! Please join a voice channel that I'm in first.",
        ephemeral: true
    })
    
    // Checks if already paused
    if (queue.paused) return await interaction.reply({
        content: 'The media player is already paused!',
        ephemeral: true
    })
    
    // Pause the music player
    queue.pause()
    const replyEmbed = defaultEmbed(client, interaction.user, '⏸️Player paused')
    replyEmbed.setDescription('Media player has been paused.')
    return await interaction.reply({
        embeds: [replyEmbed]
    })
}