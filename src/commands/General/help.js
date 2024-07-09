/**
 * Command to get the help navigation page
 */

import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { defaultEmbed, getTextFile, embedLS } from "../../utils.js"

export const properties = {
    enabled: true,
    core: true
}
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help page for Oreo.')

export async function execute(interaction, client) {

    // Create a help page for each module, and create the navigator also
    const navigatorEmbed = new defaultEmbed(interaction, 'Help Navigator', false, false)
    navigatorEmbed.setDescription(embedLS(false) + await getTextFile('Navigator.txt') + embedLS(true, false))
    const navigatorButton = new ActionRowBuilder()
    const helpEmbedPages = new Map()
    for (const [module, commands] of client.commandModules) {
        navigatorButton.addComponents(
            new ButtonBuilder()
            .setCustomId(module)
            .setLabel(`${module} module`)
            .setStyle(ButtonStyle.Success)
        )
        const pageEmbed = new defaultEmbed(interaction, `${module} Module`, false, false)
        const pageDescription = await getTextFile(`${module}.txt`)
        navigatorEmbed.addFields({ name: `${module} Module`, value: pageDescription })
        pageEmbed.setDescription(embedLS(false) + pageDescription + embedLS(true, false))
        
        // Create command description for each command
        commands.forEach((command) => {
            const status = command.properties.enabled ? '' : '\`Disabled\` '
            pageEmbed.addFields({ name: `/${command.data.name}`, value: command.data.description })
        })
        pageEmbed.addFields({ name: embedLS(), value: ' ' })
        helpEmbedPages.set(module, pageEmbed)
    }
    navigatorEmbed.addFields({ name: embedLS(), value: ' ' })

    // Post the reply and interactable buttons component
    const replyMessage = await interaction.reply({
        embeds: [navigatorEmbed],
        components: [navigatorButton],
        ephemeral: true 
    })
    const collector = await replyMessage.createMessageComponentCollector()
    collector.on('collect', async (inter) => { 
        await inter.update({
            embeds: [helpEmbedPages.get(inter.customId)],
            ephemeral: true 
        })
    })
}