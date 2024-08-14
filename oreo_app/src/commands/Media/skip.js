/**
 * Command to skip the current song
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed, checkVCState } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing media.')

export async function execute(interaction, client) {
    const queue = await client.distube.getQueue(interaction.guild.id)

    // Checks if skip command can be used
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

    // Skips the current song
    const replyEmbed = defaultEmbed(client, interaction.user, '⏩ Track Skipped')
    replyEmbed.setDescription(`Media skipped: *${queue.songs[0].name}*`)
    if (queue.songs.length <= 1) queue.stop(interaction.guild.id)
    else queue.skip()
    return await interaction.reply({
        embeds: [replyEmbed]
    })
}