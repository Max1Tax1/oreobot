/**
 * Command to play media
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed, checkVCState } from '../../utils/general.js'
import { playMedia } from '../../utils/distube/utils.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joins your voice channel and plays media. Use the command by itself to unpause the media player.')
    .addStringOption(option =>
		option.setName('media')
			.setDescription('The media to be played. Can be a search or the URL.')
            .setRequired(false))

export async function execute(interaction, client) {
    const mediaName = interaction.options.get('media')?.value
    const queue = await client.distube.getQueue(interaction.guild.id)

    // If command invoked is to unpause media player
    if (!mediaName) {
        
        // Check if inactive media player
        if (!queue) return await interaction.reply({
            content: 'The media player is currently inactive. Try \`/play\` again with a \`media\` name!',
            ephemeral: true
        })

        // Check if already paused
        else if (queue.playing) return await interaction.reply({
            content: 'The media player is already playing!',
            ephemeral: true
        })

        // Unpause the media player
        else if (queue.paused) {
            queue.resume()
            const replyEmbed = defaultEmbed(client, interaction.user, '▶️Player resumed')
            replyEmbed.setDescription('Media player has been unpaused.')
            return await interaction.reply({
                embeds: [replyEmbed]
            }
            )
        }
    }
    
    // Media name specified, search and play media
    const replyMessage = await playMedia(interaction, mediaName, 'default', true)
    return await interaction.reply(replyMessage)
}