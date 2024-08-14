/**
 * File that contains the parent class InteractionPanel, for message/embed with interaction components.
 */

import { getInteractionCollector } from './general.js'
import * as config from '../config.js'

/**
 * A class that represents a message/embed with interaction components.
 */
export class InteractionPanel {
    constructor(interaction, client, deferReply = false) {
        this._deferReply = deferReply
        this.interaction = interaction
        this.client = client
        this.panelMessage = { }
    }

    // Panel initialisation function, for pre-setup asynchronous tasks
    // !!! Do not override under normal circumstance !!!
    async init() { 
        if (this._deferReply) await this.interaction.deferReply()
        await this.setup()
    }

    // Panel setup function, which sets up the interaction collector
    async setup() {

        // Create and store the interaction's reply message
        let replyMessage = null
        if (this._deferReply) replyMessage = await this.interaction.followUp(this.panelMessage)
        else replyMessage = await this.interaction.reply(this.panelMessage)
        
        // Bind interaction functions to this object, then create the interaction collector
        this.onCollect = this.onCollect.bind(this)
        this.onEnd = this.onEnd.bind(this)
        this.interactionCollector = getInteractionCollector(this.interaction, replyMessage,
            this.onCollect, this.onEnd)
    }

    // Default function to handle interaction collection logic
    async onCollect(inter) {
        const actionId = inter.customId
        if (this.collectorActions[actionId]) return await this.collectorActions[actionId](inter)
        else {
            console.error(`❌ Unknown interaction ID ${actionId} received.`)
            inter.deferUpdate()
        }
    }

    // Default Function to run after timeout/interaction collector stop
    async onEnd() {
        this.interaction.editReply({
            content: `Interaction timed out (${config.interactionTimeout/1000} seconds)`,
            components: []
        })
    }

    // Set new function to handle interaction collection
    async setEventListener(eventName, func) {
    
        // Dirty code to remove any previous on event listeners for this event name
        const listeners = this.interactionCollector._events[eventName]
        this.interactionCollector._events[eventName] = [listeners[0]]

        // Set new on eventName function
        this.interactionCollector.on(eventName, func)
    }

    // Stops the interaction collector and closes panel, after a close interaction request is received
    async closePanel(interaction, closeMsg = 'This panel has been closed.') {
        
        // Set interaction collector on end function to close panel, with custom message
        this.setEventListener('end', async () => {
            await interaction.update({
                content: closeMsg,
                embeds: [], components: [], files: []
            })
        })

        // Remove the interaction collector and delete the reply.
        await this.interactionCollector.stop()
        setTimeout(async () => {
            return await interaction.deleteReply()
        }, 2000)
    }

    // Actions for interactions with control buttons
    collectorActions = {}

    // Updates this control panel with the specified embed and buttons
    async updatePanel(interaction) { }
    
    // Updates this control panel after some promise function is resolved.
    async delayedUpdatePanel(interaction, delayFunc) { }
}