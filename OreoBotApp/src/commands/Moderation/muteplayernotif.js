/**
 * Command to turn on/off media player notifications
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('muteplayernotif')
    .setDescription('Turns on/off notifications from the media player.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
		option.setName('switch')
			.setDescription('Mute or unmute player.')
            .setRequired(true)
            .addChoices(
				{ name: 'on', value: 'on' },
				{ name: 'off', value: 'off' }
			))

export async function execute(interaction, client) {
    const userMode = interaction.options.get('switch')?.value === 'on' ? true : false
    const currMode = client.distube.silentMode

    // Check if already in silent mode
    if (currMode == userMode)
        return await interaction.reply({
            content: `Media player notifications are already ${currMode ? 'off' : 'on'}!`,
            ephemeral: true
        })

    // Make media player go silent mode and send embed
    client.distube.silentMode = userMode
    const replyEmbed = defaultEmbed(client, interaction.user,
        `${userMode ? '🔕' : '🔔'} Notifications ${userMode ? 'off' : 'on'}!`)
    replyEmbed.setDescription(`The media player will ${currMode ? 'now send' : 'no longer send'} notifications!`)
    return await interaction.reply({
        embeds: [replyEmbed]
    })
}