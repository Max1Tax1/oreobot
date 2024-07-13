/**
 * Command to skip the current song
 */

import { SlashCommandBuilder } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the currently playing media.')

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

    // Checks if skip command can be used
    if (!queue) return await interaction.reply({
        content: 'The media player is inactive. Try \`/play\` with a \`media\` name to start playing!',
        ephemeral: true
    })

    // Skips the current song
    const replyEmbed = defaultEmbed(client, interaction.user, '⏩ Track Skipped')
    replyEmbed.setDescription(`Media skipped: *${queue.songs[0].name}*`)
    if (queue.songs.length <= 1) queue.stop(interaction.guild.id)
    else queue.skip()
    await interaction.reply({
        embeds: [replyEmbed]
    })
}