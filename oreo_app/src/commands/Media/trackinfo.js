/**
 * Command to get the currently playing track's info
 */

import { SlashCommandBuilder } from 'discord.js'
import { checkVCState } from '../../utils/general.js'
import { songInfoEmbed } from '../../utils/distube/utils.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('trackinfo')
    .setDescription("Get the currently playing track's info")

export async function execute(interaction, client) {
    const queue = await client.distube.getQueue(interaction.guild.id)

    // Checks if track info command can be used
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
    return await interaction.reply({
        embeds: [songInfoEmbed(client, queue.songs[0], 'ℹ️ Track Info', false, true)]
    })
}