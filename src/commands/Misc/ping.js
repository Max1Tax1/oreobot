import { SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot, to test if commands work.')

export async function execute(interaction, client) {
    await interaction.reply({
        content: 'Pong!'
    })
}