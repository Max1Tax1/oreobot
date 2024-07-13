/**
 * Command to play media, skipping the current one.
 */

import { SlashCommandBuilder } from 'discord.js'
import { getMedia } from '../../utils/media.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('playnow')
    .setDescription('Skips the currently playing track to play the specified media.')
    .addStringOption(option =>
		option.setName('media')
			.setDescription('The media to be played. Can be a search or the URL.')
            .setRequired(true))

export async function execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel
    const mediaName = interaction.options.get('media')?.value
    const queue = client.distube.getQueue(interaction.guild.id)

    // Check if user in voice channel
    if (!voiceChannel) return await interaction.reply({
        content: 'Please join a voice channel first!',
        ephemeral: true
    })
    
    // Play specified song immediately
    getMedia(interaction, mediaName, 'playNow')
    await interaction.reply({
        content: 'Media found, now playing...',
        ephemeral: true
    })
}