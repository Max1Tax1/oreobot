/**
 * Command to get the help navigation page (Help page creation in handleCommands.js)
 */

import { SlashCommandBuilder } from 'discord.js'
import { getInteractionCollector } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help page for Oreo.')

export async function execute(interaction, client) {
    const helpEmbedPages = client.helpPages
    let embed = helpEmbedPages.get('Navigator').embed

    console.log(Array.from(interaction.client.commandModules.keys()))
    
    // Send the navigator embed
    const replyMessage = await interaction.reply({
        embeds: [embed],
        components: [helpEmbedPages.get(!selectedModule ? 'Navigator' : module).buttons],
        ephemeral: true
    })
    
    // Define interaction collector
    const onCollect = async (inter) => {
        embed = helpEmbedPages.get(inter.customId).embed
        await inter.update({
            embeds: [embed],
            components: [helpEmbedPages.get(inter.customId).buttons],
            ephemeral: true 
        })
    }
    const onEnd = async () => {
        await interaction.editReply({
            content: 'Help navigation timed out. Please use /help again to navigate.',
            embeds: [embed],
            components: [],
            ephemeral: true
        })
    }
    await getInteractionCollector(interaction, replyMessage, onCollect, onEnd)
}