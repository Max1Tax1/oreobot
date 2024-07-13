/**
 * Command to make media player silent
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('silentplayer')
    .setDescription('Silent mode turns off notifications from the media player.')
    .addStringOption(option =>
		option.setName('switch')
			.setDescription('Turns silent mode on/off')
            .setRequired(false)
            .addChoices(
				{ name: 'on', value: 'on' },
				{ name: 'off', value: 'off' }
			))

export async function execute(interaction, client) {
    const userMode = interaction.options.get('switch')?.value === 'off' ? false : true
    const currMode = client.distube.silentMode

    // Check if already in silent mode
    if (currMode == userMode)
        return await interaction.reply({
            content: `The player ${currMode ? 'is already' : 'was not'} in silent mode!`,
            ephemeral: true
        })

    // Make media player go silent mode and send embed
    client.distube.silentMode = userMode
    const replyEmbed = defaultEmbed(client, interaction.user,
        `${userMode ? '🔕' : '🔔'} Silent mode ${userMode ? 'on' : 'off'}!`)
    replyEmbed.setDescription(`The media player will ${currMode ? 'now send player' : 'no longer send'} notifications!`)
    await interaction.reply({
        embeds: [replyEmbed]
    })
}