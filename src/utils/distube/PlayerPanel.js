/**
 * File that contains the player panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, getEmoji, escapePunc } from '../general.js'

/**
 * A class that represents a control panel for the media player/currently playing song
 */
export class PlayerPanel {
    /**
     * Constructs a PlayerPanel instance, which is used to control the currently playing song.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     */
    constructor(interaction, client) {
        const queue = client.distube.getQueue(interaction.guild.id)

        this._navButtons = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('help')
                .setEmoji(getEmoji(client, 'o_help'))
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('queue')
                .setEmoji(getEmoji(client, 'o_queue_list'))
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close')
                .setEmoji(getEmoji(client, 'o_close_panel'))
                .setStyle(ButtonStyle.Danger)
        ])

        this.embed = defaultEmbed(client, interaction.user, 'IN DEVELOPMENT')
        this.buttons = [this._navButtons]
    }

    // Function to handle interaction music player control buttons
    async collectorFunc(interaction, client, queue) {

        return
    }

    // Function to update the music player panel with the latest info
    async updatePanel(interaction, client, resetSelection=true) {
        return interaction.update({
            embeds: [this.embed],
            components: this.buttons
        })
    }
}