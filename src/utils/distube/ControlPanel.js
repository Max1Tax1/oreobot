/**
 * File that contains the queue panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { getEmoji } from '../general.js'

/**
 * A class that represents a control panel for the media player's queue
 */
export class ControlPanel {
    constructor(interaction, client, navButtons, helpEmbed) {
        this.interaction = interaction
        this.client = client
        this.navButtons = navButtons
        this.helpEmbed = helpEmbed
        this.panelMessage = {}
        
        // Return to panel button
        this.returnButtons = [new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('return')
                .setEmoji(getEmoji(client, 'o_return'))
                .setStyle(ButtonStyle.Success)
        ])]
    }

    // Will be run for setup, for required async operations (return this for chaining)
    async init() { return this }

    // Actions for interactions with control buttons
    collectorActions = {}

    // Updates this control panel with the specified embed and buttons
    async updatePanel(interaction) { }
    
    // Updates this control panel after some promise function is resolved.
    async delayedUpdatePanel(interaction, delayFunc) { }
}