/**
 * Command to play media
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'
import { getMedia } from '../../utils/distube/utils.js'

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
    const voiceChannel = interaction.member.voice.channel
    const mediaName = interaction.options.get('media')?.value
    const queue = client.distube.getQueue(interaction.guild.id)

    // Check if user in voice channel
    if (!voiceChannel) return await interaction.reply({
        content: 'Please join a voice channel first!',
        ephemeral: true
    })

    // If command invoked is to unpause media player
    if (!mediaName) {
        if (!queue) await interaction.reply({
            content: 'There is no media to play. Try \`/play\` again with a \`media\` name!',
            ephemeral: true
        })
        else if (queue.paused) {
            queue.resume()
            const replyEmbed = defaultEmbed(client, interaction.user, '▶️Player resumed')
            replyEmbed.setDescription('Media player has been unpaused.')
            await interaction.reply({
                embeds: [replyEmbed]
            }
        )}
        else if (queue.playing) await interaction.reply({
            content: 'The media player is already playing!',
            ephemeral: true
        })
        return
    }
    
    // Media name specified, search and play media
    getMedia(interaction, mediaName)
    await interaction.reply({
        content: 'Media found, now playing...',
        ephemeral: true
    })
}