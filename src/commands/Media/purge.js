/**
 * Command to stop oreo's media player
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription("Stops Oreo's media player and clears the media queue.")

export async function execute(interaction, client) {

    // Check if media player already isn't playing
    const queue = client.distube.getQueue(interaction.guild.id)
    if (!queue) return await interaction.reply({
            content: 'The media player is not playing anything',
            ephemeral: true
    })
    
    // Tells the media player to stop
    queue.stop(interaction.guild.id)
    const replyEmbed = defaultEmbed(client, interaction.user, '🛑 Media Player Stopped')
    replyEmbed.setDescription('Media player has been stopped and queue cleared.')
    await interaction.reply({
        embeds: [replyEmbed]
    })

}