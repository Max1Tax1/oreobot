
/**
 * Utility functions for Oreo related to DisTube media player
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, embedLS, getTextFile } from './general.js'

/**
 * Creates a row of buttons for navigating help pages inside the module.
 *
 * @param {string} [prevPageId] - The custom ID for the previous page button. If not provided, the button is not added.
 * @param {string} [nextPageId] - The custom ID for the next page button. If not provided, the button is not added.
 * @returns {ActionRowBuilder} A row of buttons containing navigation options.
 */
function createPageActionRow(prevPageId, nextPageId) {
    const components = []
    if (prevPageId) components.push(new ButtonBuilder().setCustomId(prevPageId)
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Success))
    components.push(new ButtonBuilder().setCustomId('Navigator')
        .setLabel('🧭')
        .setStyle(ButtonStyle.Success))
    if (nextPageId) components.push(new ButtonBuilder().setCustomId(nextPageId)
        .setLabel('➡️')
        .setStyle(ButtonStyle.Success))
    return new ActionRowBuilder().addComponents(components)
}

/**
 * Builds the help command embed pages for each module and sets up navigation buttons.
 *
 * @param {Client} client - The Discord client instance.
 * @returns {Promise<void>} A promise that resolves when the help pages are built and set in the client's helpPages map.
 */
export async function buildHelpPages(client) {
    client.helpPages = new Map()

    // Create help pages for each module, and create the navigator also
    const navigatorEmbed = defaultEmbed(client, null, '🧭 Help Navigator', false, false)
    navigatorEmbed.setDescription(embedLS(false) + await getTextFile('Navigator.txt') + embedLS(true, false))
    const navigatorButton = new ActionRowBuilder()
    for (const [module, commands] of client.commandModules) {
        
        // Create one interactable button for each module in navigator
        navigatorButton.addComponents(
            new ButtonBuilder().setCustomId(module)
            .setLabel(`${module} module`)
            .setStyle(ButtonStyle.Success))
        const pageDescription = await getTextFile(`${module}.txt`)
        navigatorEmbed.addFields({ name: `${module} Module`, value: pageDescription })
        navigatorEmbed.addFields({ name: ' ', value: ' ' })
        
        // Create embed "pages" for commands in module
        let pagesList = []
        const commandsIter = commands[Symbol.iterator]()
        let nextCommand = commandsIter.next()
        while (!nextCommand.done) {
            const pageEmbed = defaultEmbed(client, null, `${module} Module`, false, false)
            pageEmbed.setDescription(embedLS(false) + pageDescription + embedLS(true, false))
            
            // Build page content - 5 commands and their descriptions
            for (let i = 0; i < 5; i++) {
                let command = nextCommand.value
                let commandName = command.data.name
                let description = command.data.description
                const options = command.data.options
                if (options) options.forEach(option => {
                    commandName += ` \`${option.name}\``
                    description += `\n　　\`${option.name}\`: ${option.description}`
                    if (option.required) description += ` *(required)*`
                })
                pageEmbed.addFields({ name: `/${commandName}`, value: description })
                nextCommand = commandsIter.next()
                if (nextCommand.done) break
                pageEmbed.addFields({ name: ' ', value: ' ' })
            }
            pageEmbed.addFields({ name: embedLS(), value: ' ' })
            pageEmbed.setFooter({ text: 'Press 🧭 to return to the navigator.'})
            pagesList.push(pageEmbed)
        }

        // Create Action Row buttons for each page
        let pageId = 1
        pagesList.forEach((pageEmbed, index) => {
            let prevButton = null
            let nextButton = null

            // Determine previous and next page IDs
            if (index > 0) prevButton = `${module}${pageId - 1 > 1 ? pageId - 1 : '' }`
            if (index < pagesList.length - 1) nextButton = `${module}${pageId + 1}`

            // Set the help page entry in the client's helpPages map
            client.helpPages.set(
                index === 0 ? module : `${module}${pageId}`, {
                    embed: pageEmbed,
                    buttons: createPageActionRow(prevButton, nextButton)
                }
            )
            pageId++
        })
    }

    // Finish up Navigator page
    navigatorEmbed.addFields({ name: embedLS(), value: ' ' })
    client.helpPages.set('Navigator', {
        embed: navigatorEmbed,
        buttons: navigatorButton
    })
}