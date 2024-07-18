
/**
 * File that contains the MusicController class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { getEmoji, deepCopy } from '../general.js'
import { getQueueHelpEmbed, getPlayerHelpEmbed } from '../help.js'
import { PlayerPanel } from './PlayerPanel.js'
import { QueuePanel } from './QueuePanel.js'
import { songInfoEmbed } from './utils.js'

/**
 * A class that represents the music controller, which is used produce an UI for the user to 
 * interact with DisTube's music playing functionalities
 */
export class MusicController {
    /**
     * Constructs a MusicControl instance, which is used to control the DisTube music functionality.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     * @param {string} display - Which panel the music controller should show. Can be 'player' or 'queue'.
     */
    constructor(interaction, client, display = 'player') {

        // Build queue help embed
        const returnEmoji = getEmoji(client, 'o_return')
        this._queueHelpEmbed = getQueueHelpEmbed(client)
        this._queueHelpEmbed.addFields({ name: ' ', value: `*Press the ${returnEmoji} button to return to queue panel.*` })

        // Build player help embed
        this._playerHelpEmbed = getPlayerHelpEmbed(client)
        this._playerHelpEmbed.addFields({ name: ' ', value: `*Press the ${returnEmoji} button to return to music player.*` })

        // Build return to panel button
        this._returnButtons = [new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('return')
                .setEmoji(returnEmoji)
                .setStyle(ButtonStyle.Success)
        ])]

        // Build both panels related to the music controller
        this._playerPanel = new PlayerPanel(interaction, client, this._getNavButtons(client, ['queue'], true))
        this._queuePanel = new QueuePanel(interaction, client, this._getNavButtons(client, ['player'], true))

        // Get a copy of the queue, for safe guarding purposes
        const queue = client.distube.getQueue(interaction.guild.id)
        this._queueIdsCopy = deepCopy(queue.songs.map(song => song.id))

        // Set the active display to show
        switch (display) {
            case 'player':
                this.panel = this._playerPanel
                break
            case 'queue':
                this.panel = this._queuePanel
                break
            default:
                throw new Error(`Failed creating MusicController - display: "${display}" is invalid!`)
        }
        this._setCollectorFunc()
    }

    // Function that is "attached" to the collector function, for panel navigation
    navCollectorActions = {
    
        // Navigate to this panel's help page
        help: async (interaction, client, queue) => {
            const helpEmbed = (this.panel === this._playerPanel) ?
                this._playerHelpEmbed : this._queueHelpEmbed
            return await interaction.update({
                embeds: [helpEmbed],
                components: this._returnButtons
            })
        },
                    
        // Navigate to the currently playing song's info
        getInfo: async (interaction, client, queue) => {
            const currSong = queue.songs[0]
            return await interaction.update({
                embeds: [songInfoEmbed(client, currSong, 'ℹ️ Song Info')],
                components: this._returnButtons
            })
        },

        // For returning to whatever panel it was before
        return: async (interaction, client, queue) => {
            return await this.switchPanel(interaction, client, this.panel)
        },
            
        // For player panel navigation
        queue: async (interaction, client, queue) => {
            return await this.switchPanel(interaction, client, this._queuePanel)
        },
            
        // For queue panel navigation
        player: async (interaction, client, queue) => {
            return await this.switchPanel(interaction, client, this._playerPanel)
        },
            
        // Close the music controller
        close: async (interaction, client, queue) => {
            return await interaction.update({
                content: `This panel has been closed.`,
                embeds: [],
                components: []
            }).then(setTimeout(() => { interaction.deleteReply() }, 2000))
        }
    }

    // Function to define the collecter function, with the currently displayed panel's collector also
    _setCollectorFunc() {
        this.collectorFunc = async (interaction, client, queue) => {
            
            // Safeguard for invalid queue or changed queue before button interaction
            if (!queue) return await interaction.update({
                content: 'The media player is inactive and the queue is empty. Try \`/play\` with a \`media\` name to start playing!',
                embeds: [],
                components: []
            })
            if (this._queueIdsCopy.toString() !== queue.songs.map(song => song.id).toString()) {
                return await interaction.update({
                    content: ':warning: The queue has changed. Please try the command again!',
                    embeds: [],
                    components: []
                })
            }
            
            // Safely execute collector functions
            const actionId = interaction.customId
            if (this.navCollectorActions[actionId]) return await this.navCollectorActions[actionId](interaction, client, queue)
            else if (this.panel.collectorActions[actionId]) {
                await this.panel.collectorActions[actionId](interaction, client, queue)
                this._queueIdsCopy = deepCopy(queue.songs.map(song => song.id))
            }
        }
    }

    // Switches to a different display panel
    async switchPanel(interaction, client, panel) {
        if (this.panel !== panel) {
            this.panel = panel
            this._setCollectorFunc()
        }
        this.panel.updatePanel(interaction, client)
    }

    // Function that returns the navigation buttons based on current panel
    _getNavButtons(client, panels, musicInfoButton=false) {

        // Put the help button as the first button
        let panelNavButtons = [new ButtonBuilder().setCustomId('help')
            .setEmoji(getEmoji(client, 'o_help'))
            .setStyle(ButtonStyle.Success)]

        // Put any subsequent panel navigation buttons next
        panels.forEach(panel => {
            switch (panel) {
                case 'player':
                    panelNavButtons.push(new ButtonBuilder().setCustomId('player')
                        .setEmoji(getEmoji(client, 'o_music_player'))
                        .setStyle(ButtonStyle.Success))
                    break
                case 'queue':
                    panelNavButtons.push(new ButtonBuilder().setCustomId('queue')
                        .setEmoji(getEmoji(client, 'o_queue_list'))
                        .setStyle(ButtonStyle.Success))
                    break
                default: console.warn(`⚠️ Navigation button "${panel}" is not valid in Music Controller!`)
            }
        })

        // Put music info button if enabled
        if (musicInfoButton) panelNavButtons.push(new ButtonBuilder().setCustomId('getInfo')
            .setEmoji(getEmoji(client, 'o_song_info'))
            .setStyle(ButtonStyle.Success))
        
        // Lastly, put in close panel button
        panelNavButtons.push(new ButtonBuilder().setCustomId('close')
        .setEmoji(getEmoji(client, 'o_close_panel'))
        .setStyle(ButtonStyle.Danger))

        return new ActionRowBuilder().addComponents(panelNavButtons)
    }
}