/**
 * File that contains the parent class MusicControllerPanel, for all message-interaction panels
 * that are in the MusicController class.
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { getEmoji } from '../general.js'
import { InteractionPanel } from '../InteractionPanel.js'

/**
 * A class that represents a message with interaction components included in the MusicController class.
 */
export class MusicControllerPanel extends InteractionPanel {
    constructor(interaction, client, navButtons, helpEmbed) {
        super(interaction, client, false)

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

    // If this music controller panel does not have .setup(), or calls super.setup(), return error
    async setup() {
        throw new Error('❌ Error: This panel must have an setup() function/not call super.setup()!')
    }

    // Interaction collection is controlled by MusicController.
    async onCollect() { }
    async onEnd() { }
}