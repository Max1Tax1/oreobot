/**
 * Command to ping oreo
 */

import { SlashCommandBuilder } from 'discord.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot, to test if commands work.')

export async function execute(interaction) {

    await interaction.reply({
        content: '🏓Pong!'
    })
}