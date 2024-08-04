/**
 * Command to get the help navigation page (Help page creation in handleCommands.js)
 */

import { SlashCommandBuilder } from 'discord.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help page for Oreo.')
    .addStringOption(option =>
        option.setName('module')
            .setDescription("Display specified module's help page.")
            .setRequired(false))

export async function execute(interaction, client) {
    const helpEmbedPages = client.helpPages
    const selectedModule = interaction.options.get('module')?.value
    
    // Send the navigator embed
    const replyMessage = await interaction.reply({
        embeds: [helpEmbedPages.get(!selectedModule ? 'Navigator' : module).embed],
        components: [helpEmbedPages.get(!selectedModule ? 'Navigator' : module).buttons],
        ephemeral: true
    })

    // Collector for button interactions
    const collector = await replyMessage.createMessageComponentCollector()
    collector.on('collect', async (inter) => { 
        await inter.update({
            embeds: [helpEmbedPages.get(inter.customId).embed],
            components: [helpEmbedPages.get(inter.customId).buttons],
            ephemeral: true 
        })
    })
}