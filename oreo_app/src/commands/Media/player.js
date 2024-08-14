/**
 * Command to bring up the media player panel
 */

import { SlashCommandBuilder } from 'discord.js'
import { MusicController } from '../../utils/distube/MusicController.js'
import { checkVCState } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('player')
    .setDescription('Displays the media player panel.')

export async function execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild.id)
    const vcState = checkVCState(interaction, client)

    // Check if media player is active (playing song/queued songs)
    if (!queue || vcState == 0) return await interaction.reply({
        content: 'The media player is inactive. Join a voice channel, ' +
            'and try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })

    // Check if user in voice channel of Oreo
    if (vcState == 2) return await interaction.reply({
        content: "We're not in the same place! Please join a voice channel that I'm in first.",
        ephemeral: true
    })

    // Create and send the music player embed message
    const musicController = new MusicController(interaction, client, 'player')
    await musicController.init()
}