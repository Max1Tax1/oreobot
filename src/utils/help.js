
/**
 * Utility functions for Oreo's help navigator and all help embeds
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, embedLS, getTextFile, getEmoji } from './general.js'

/**
 * Creates a row of buttons for navigating help pages inside the module.
 *
 * @param {string} [prevPageId] - The custom ID for the previous page button. If not provided, the button is not added.
 * @param {string} [nextPageId] - The custom ID for the next page button. If not provided, the button is not added.
 * @returns {ActionRowBuilder} A row of buttons containing navigation options.
 */
function createPageActionRow(client, prevPageId, nextPageId) {
    const components = []
    if (prevPageId) components.push(new ButtonBuilder().setCustomId(prevPageId)
        .setEmoji(getEmoji(client, 'o_arrow_left'))
        .setStyle(ButtonStyle.Success))
    components.push(new ButtonBuilder().setCustomId('Navigator')
        .setEmoji(getEmoji(client, 'o_navigate'))
        .setStyle(ButtonStyle.Success))
    if (nextPageId) components.push(new ButtonBuilder().setCustomId(nextPageId)
        .setEmoji(getEmoji(client, 'o_arrow_right'))
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
            pageEmbed.addFields({ name: embedLS(), value: `*Press ${getEmoji(client, 'o_navigate')} to return to the navigator.*` })
            pagesList.push(pageEmbed)
        }

        // For any additional help pages to attach to modules
        getModuleExtraEmbeds(client, module).forEach(embed => {
            embed.addFields({ name: ' ', value: `*Press ${getEmoji(client, 'o_navigate')} to return to the navigator.*` })
            pagesList.push(embed)
        })

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
                    buttons: createPageActionRow(client, prevButton, nextButton)
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

//-------------------------------------------------
// Additional help pages implementation
// ------------------------------------------------

/**
 * Returns an array of extra help pages for the specified module. Declare any additional help pages here also.
 *
 * @param {string} module - The name of the module (folder name)
 * @returns {EmbedBuilder[]} An array of extra help embeds for the specified module, if there is any.
 */
function getModuleExtraEmbeds(client, module) {
    switch (module) {
        case 'Media':
            return [getPlayerHelpEmbed(client), getQueueHelpEmbed(client)]
        default:
            return []
    }
}

// Function to get the help section for navigation buttons attached to some panel.
function getMediaNavHelpField(client, panels) {
    const e = (name) => { return getEmoji(client, name) }
    let navHelpText = []
    navHelpText.push(`- ${e('o_help')}: Where you're currently at!`)
    panels.forEach(panel => {
        switch (panel) {
            case 'player':
                navHelpText.push(`- ${e('o_music_player')}: Switches to the media player panel.`)
                break
            case 'queue':
                navHelpText.push(`- ${e('o_queue_list')}: Switches to the queue control panel.`)
                break
            default: console.warn(`⚠️ Navigation button "${panel}" is not valid in Music Controller!`)
        }
    })
    navHelpText.push(`- ${e('o_close_panel')}: Closes the panel.`)
    return {
        name: 'Navigation',
        value: navHelpText.join('\n')
    }
}

// Media queue control panel help page
export function getQueueHelpEmbed(client) {
    const e = (name) => { return getEmoji(client, name) }
    const embed = defaultEmbed(client, null, '📼 Queue Panel Help', false, false)
    embed.setDescription(embedLS(false) +
        "The /\`queue\` Queue Panel is for viewing and managing queued songs.\n" +
        "Below is the legend for the control panel's buttons." +
        embedLS(true, false))
    embed.addFields([{
        name: 'Selection Controls', 
        value: `Use ${e('o_arrow_up')} and ${e('o_arrow_down')} to select tracks from the Media Queue.
        Selected track is **bold** and has an ➜ next to its name.`
    }, { name: ' ', value: ' ' }])
    embed.addFields([{
        name: 'Queued Media Control',
        value: 
            `- ${e('o_play_now')}: Immediately plays selected media, skips the current one.\n` +
            `- ${e('o_play_next')}: Queues selected media as the next to be played.\n` +
            `- ${e('o_jumpto')}: Immediately plays selected media, skipping everything in queue before it.\n` +
            `- ${e('o_shuffle')}: Shuffles queue order.\n` +
            `- ${e('o_find_related')}: Adds media related to the current track to queue.`
    }, { name: ' ', value: ' ' }])
    embed.addFields([{
        name: 'Queue Mode Switches',
        value: 
            `- ${e('o_repeat_one_off')}: Loops the current track.\n` +
            `- ${e('o_repeat_off')}: Loops the entire queue.\n` +
            `- ${e('o_autoplay_off')}: Automatically add related tracks when queue is empty.`
    }, { name: ' ', value: ' ' }])
    embed.addFields(getMediaNavHelpField(client, ['player']))
    embed.addFields({ name: embedLS(), value: ' ' })
    return embed
}

// Media player panel help page
export function getPlayerHelpEmbed(client) {
    const e = (name) => { return getEmoji(client, name) }
    const embed = defaultEmbed(client, null, '📼 Media Player Help', false, false)
    embed.addFields(getMediaNavHelpField(client, ['queue']))
    embed.addFields({ name: embedLS(), value: ' ' })
    return embed
}
// ------------------------------------------------