/**
 * Command to search and choose a media to play/add to queue
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('search')
    .setDescription("Search for media and choose a search result to play/add to playlist.")
    .addStringOption(option =>
		option.setName('media')
			.setDescription('The media to be played. Can be a search or the URL.')
            .setRequired(true))
    .addIntegerOption(option =>
		option.setName('choices')
			.setDescription('The amount of results returned to choose from (max 15, default 5)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(15))

export async function execute(interaction, client) {


}