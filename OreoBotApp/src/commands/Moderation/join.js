/**
 * Command to join the bot to the user's vc
 */

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import { checkVCState } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins Oreo to the voice channel you are in.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('channel')
			.setDescription('Select a specific voice channel to put Oreo in.')
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildVoice))

export async function execute(interaction, client) {
    const vcState = checkVCState(interaction, client)
    let voiceChannel = interaction.options?.getChannel('channel')

    // Checkers for where the user/Oreo is
    if (vcState == 0) return await interaction.reply({
        content: "You are not in a voice channel! Join one first and then try /\`join\` again.",
        ephemeral: true
    })
    if (vcState == 2) return await interaction.reply({
        content: "I am in another voice channel already! Use /\`join\` with \`force\`=\`true\` to add me to this voice channel.",
        ephemeral: true
    })

    if (!voiceChannel) voiceChannel = interaction.member.voice.channel
    joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    })
    return await interaction.reply({
        content: `Joined voice channel ${interaction.member.voice.channel}!`,
        emphemeral: true
    })
}