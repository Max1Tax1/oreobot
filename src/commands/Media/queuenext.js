/**
 * Command to play media, skipping the current one.
 */

import { SlashCommandBuilder } from 'discord.js'
import { playMedia } from '../../utils/distube/utils.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('queuenext')
    .setDescription("Queue's the media specified as the next track to be played.")
    .addStringOption(option =>
		option.setName('media')
			.setDescription('The media to be played. Can be a search or the URL.')
            .setRequired(true))

export async function execute(interaction, client) {
    const mediaName = interaction.options.get('media')?.value
    
    // Add track as next in queue
    const replyMessage = await playMedia(interaction, mediaName, 'addNext', true)
    await interaction.reply(replyMessage)
}