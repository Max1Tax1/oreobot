/**
 * Command to search and choose a media to play/add to queue TODO
 */

import { SlashCommandBuilder } from 'discord.js'
import { notUserPlayable } from '../../utils/distube/utils.js'
import { SearchNavigator } from '../../utils/distube/SearchNavigator.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription("Search for media and choose a search result to play/add to queue.")
    .addStringOption(option =>
		option.setName('media')
			.setDescription('The media to be played. Can be a search or the URL.')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('from')
            .setDescription('Where the media should be searched from. Default from YouTube.')
            .setRequired(false)
            .addChoices(
				{ name: 'youtube', value: 'youtube' },
                { name: 'soundcloud', value: 'soundcloud' },
                { name: 'spotify', value: 'spotify'}
			))

export async function execute(interaction, client) {
    const mediaName = interaction.options.get('media').value
    const userSetOption = interaction.options.get('from')?.value
    const pluginName = userSetOption ? userSetOption : 'youtube'
    
    // Check to see if this command can be invoked
    const replyMsg = notUserPlayable(interaction, client, 'search')
    if (replyMsg) return await interaction.reply(replyMsg)

    // Search for specified string and send results
    const searchNav = new SearchNavigator(interaction, client, mediaName, pluginName)
    await searchNav.init()
}