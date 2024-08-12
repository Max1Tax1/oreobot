
/**
 * File that contains the MusicController class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { RepeatMode } from 'distube'
import { getEmoji, deepCopy, getInteractionCollector } from '../general.js'
import { getQueueHelpEmbed, getPlayerHelpEmbed } from '../help.js'
import { PlayerPanel } from './PlayerPanel.js'
import { QueuePanel } from './QueuePanel.js'

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
        this.interaction = interaction
        this.client = client

        // Get a copy of the queue, for safe guarding purposes
        const queue = client.distube.getQueue(interaction.guild.id)
        this._queueIdsCopy = deepCopy(queue.songs.map(song => song.uid))
        
        // Setup panels
        this._initDisplay = display
        this._setCollectorFunc()
    }

    // Function to set up music controller. Must be run after creation.
    async init() {  
        const returnEmoji = getEmoji(this.client, 'o_return')

        // Defer reply for more time to set up
        await this.interaction.deferReply()

        // Build player panel and help embed
        const playerHelpTailText = `*Press the ${returnEmoji} button to return to music player.*`
        const playerPanelNavOptions = ['queue']
        this._playerPanel = new PlayerPanel(this.interaction, this.client,
            this._getNavButtons(playerPanelNavOptions),
            getPlayerHelpEmbed(this.client, playerPanelNavOptions, playerHelpTailText, true)
        )
        await this._playerPanel.setup()

        // Build queue panel and help embed
        const queueHelpTailText = `*Press the ${returnEmoji} button to return to queue panel.*`
        const queuePanelNavOptions = ['player']
        this._queuePanel = new QueuePanel(this.interaction, this.client,
            this._getNavButtons(queuePanelNavOptions),
            getQueueHelpEmbed(this.client, queuePanelNavOptions, queueHelpTailText, true)
        )
        await this._queuePanel.setup()

        // Set the active display to show on startup
        switch (this._initDisplay) {
            case 'player':
                this.panel = this._playerPanel
                break
            case 'queue':
                this.panel = this._queuePanel
                break
            default:
                throw new Error(`Failed MusicController init - Display: "${display}" is invalid!`)
        }

        // Follow up on defer reply, set interaction collector and on exit message
        const replyMessage = await this.interaction.followUp(this.panel.panelMessage)
        this._onEnd = this._onEnd.bind(this)
        this.interactionCollector = await getInteractionCollector(this.interaction, replyMessage,
            this.collectorFunc, this._onEnd) 
        return this
    }

    // Panel timeout function
    async _onEnd() {
        const embeds = this.panel.panelMessage.embeds 
        embeds[embeds.length - 1].setFooter({ text: 'Timed out. Retry command to use the controls.' })
        return await this.interaction.editReply({
            embeds: embeds,
            components: [],
        })
    }

    // Functions for panel navigation
    navCollectorActions = {
    
        // Navigate to this panel's help page
        help: async (interaction) => {
            return await interaction.update({
                embeds: [this.panel.helpEmbed],
                components: this.panel.returnButtons,
                files: []
            })
        },

        // For returning to whatever panel it was before
        return: async (interaction) => {
            return await this.switchPanel(interaction, this.panel)
        },
            
        // For player panel navigation
        queue: async (interaction) => {
            return await this.switchPanel(interaction, this._queuePanel)
        },
            
        // For queue panel navigation
        player: async (interaction) => {
            return await this.switchPanel(interaction, this._playerPanel)
        },
            
        // Close the music controller
        close: async (interaction) => {
            
            // Dirty code to remove any previous on 'end' event listeners (the timeout one)
            const endEvents = this.interactionCollector._events.end
            this.interactionCollector._events.end = [endEvents[0]]

            // Register interaction collector on end function to close panel, with custom message
            this.interactionCollector.on('end', async () => {
                await interaction.update({
                    content: 'This panel has been closed.',
                    embeds: [], components: [], files: []
                })
            })

            // Remove the interaction collector and delete the reply.
            await this.interactionCollector.stop()
            setTimeout(async () => {
                return await interaction.deleteReply()
            }, 2000)
        }
    }

    // Functions for setting music player mode (shared between queue and player panels)
    modeCollectorActions = {

        // Toggle loop track mode. Will turn off loop queue if it is on. 
        loopOneMode: async (interaction, queue) => {
            const loopOneMode = queue.repeatMode === 0 || queue.repeatMode === 2 ?
                RepeatMode.SONG : RepeatMode.DISABLED
            await queue.setRepeatMode(loopOneMode)
            return await this.panel.updatePanel(interaction)
        },

        // Toggle loop queue mode. Will turn off loop track if it is on.
        loopMode: async (interaction, queue) => {
            const loopMode = queue.repeatMode === 0 || queue.repeatMode === 1 ?
                RepeatMode.QUEUE : RepeatMode.DISABLED
            await queue.setRepeatMode(loopMode)
            return await this.panel.updatePanel(interaction)
        },

        // Turn on/off autoplay mode
        autoPlayMode: async (interaction, queue) => {
            await queue.toggleAutoplay()
            return await this.panel.updatePanel(interaction)
        }
    }

    // Function to define the collecter function, with the currently displayed panel's collector also
    _setCollectorFunc() {
        this.collectorFunc = async (interaction) => {
            const queue = await this.client.distube.getQueue(interaction.guild.id)
            
            // Safeguard for invalid queue or changed queue before button interaction
            if (!queue) return await interaction.update({
                content: 'The media player is inactive and the queue is empty.' +
                    'Be in a voice channel, and try \`/play\` with a \`media\` name to start playing!',
                embeds: [], components: [], files: []
            })
            if (this._queueIdsCopy.toString() !== queue.songs.map(song => song.uid).toString()) {
                return await interaction.update({
                    content: ':warning: The queue has changed. Please try the command again!',
                    embeds: [], components: [], files: []
                })
            }
            
            // Safely execute collector functions
            const actionId = interaction.customId
            if (this.navCollectorActions[actionId]) return await this.navCollectorActions[actionId](interaction, queue)
            else if (this.modeCollectorActions[actionId]) return await this.modeCollectorActions[actionId](interaction, queue)
            else if (this.panel.collectorActions[actionId]) {
                await this.panel.collectorActions[actionId](interaction, queue)
                this._queueIdsCopy = deepCopy(queue.songs.map(song => song.uid))
            }
            else {
                console.error(`❌ Unknown interaction ID ${actionId} received.`)
                interaction.deferUpdate()
            }
        }
    }

    // Switches to a different display panel
    async switchPanel(interaction, panel) {
        if (this.panel !== panel) {
            this.panel = panel
            this._setCollectorFunc()
        }
        await this.panel.updatePanel(interaction)
    }

    // Function that returns the navigation buttons based on current panel
    _getNavButtons(panels) {

        // Put the help button as the first button
        let panelNavButtons = [new ButtonBuilder().setCustomId('help')
            .setEmoji(getEmoji(this.client, 'o_help'))
            .setStyle(ButtonStyle.Success)]

        // Put any subsequent panel navigation buttons next
        panels.forEach(panel => {
            switch (panel) {
                case 'player':
                    panelNavButtons.push(new ButtonBuilder().setCustomId('player')
                        .setEmoji(getEmoji(this.client, 'o_music_player'))
                        .setStyle(ButtonStyle.Success))
                    break
                case 'queue':
                    panelNavButtons.push(new ButtonBuilder().setCustomId('queue')
                        .setEmoji(getEmoji(this.client, 'o_queue_list'))
                        .setStyle(ButtonStyle.Success))
                    break
                default: console.warn(`⚠️ Navigation button "${panel}" is not valid in Music Controller!`)
            }
        })
        
        // Lastly, put in close panel button
        panelNavButtons.push(new ButtonBuilder().setCustomId('close')
        .setEmoji(getEmoji(this.client, 'o_close_panel'))
        .setStyle(ButtonStyle.Danger))

        return new ActionRowBuilder().addComponents(panelNavButtons)
    }
}