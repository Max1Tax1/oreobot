/**
 * Command to pause the media player
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the media player.')

export async function execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel
    const queue = client.distube.getQueue(interaction.guild.id)

    // Check if user in voice channel of Oreo TODO!!!
    console.log(voiceChannel)
    console.log(client.channels.fetch(interaction.member.voice.channel.id))
    if (!voiceChannel || !client.channels.fetch(interaction.member.voice.channel.id)) {
        return await interaction.reply({
            content: "Please join a voice channel that I'm in first!",
            ephemeral: true
        })
    }

    // Checks if pause command can be used
    if (!queue) return await interaction.reply({
        content: 'The media player is inactive. Try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })
    if (queue.paused) return await interaction.reply({
        content: 'The media player is already paused!',
        ephemeral: true
    })
    
    // Pause the music player
    queue.pause()
    const replyEmbed = defaultEmbed(client, interaction.user, '⏸️Player paused')
    replyEmbed.setDescription('Media player has been paused.')
    await interaction.reply({
        embeds: [replyEmbed]
    })
}