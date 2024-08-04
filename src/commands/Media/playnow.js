/**
 * Command to play media, skipping the current one.
 */

import { SlashCommandBuilder } from 'discord.js'
import { playMedia } from '../../utils/distube/utils.js'
import { checkVCState } from '../../utils/general.js'

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
    const mediaName = interaction.options.get('media')?.value
    
    // Play specified song immediately
    await interaction.deferReply()
    const replyMessage = await playMedia(interaction, mediaName, 'playNow', true)
    await interaction.followUp(replyMessage)
}