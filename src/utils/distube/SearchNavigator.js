/**
 * File that contains the queue panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, embedLS, getEmoji, escapePunc, generateUID, abbrText } from '../general.js'
import { songInfoEmbed, playMedia } from './utils.js'
import * as config from '../../config.js'
import { getSearchHelpEmbed } from '../help.js'

/**
 * A class that displays and controls search results
 */
export class SearchResults {
    /**
     * Constructs a SearchResults instance, which is used to select search results.
     * @param {Interaction} interaction - The Discord interaction calling the search.
     * @param {Discord.Client} client - The Discord client instance.
     */
    constructor(interaction, client, mediaName, pluginName) {
        this.interaction = interaction
        this.client = client
        this.mediaName = mediaName
        this.pluginName = pluginName
        this._currSelection = 0
        this._infoButtons = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('returnToResults')
                .setEmoji(getEmoji(client, 'o_return'))
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('close')
                .setEmoji(getEmoji(client, 'o_close_panel'))
                .setStyle(ButtonStyle.Danger)
        ])
    }

    // Function to set up search results. Must be run after creation.
    async init() {

        // Search song with specified plugin
        const plugin = this.client.distube.extractorPlugins[this.pluginName]
        this.results = await plugin.search(this.mediaName,
            config.mediaSearchType[this.pluginName], config.searchLimit)
        this.results = this.results.slice(0, config.searchLimit)
        
        // Create titles for embed display
        const e = (name) => { return getEmoji(this.client, name) }
        let num = 1
        this.results.forEach(song => {
            const songName = song.name ? abbrText(song.name, 55) : song.url
            let uploader = song.uploader.name ? abbrText(song.uploader.name, 25) : null
            uploader = uploader ? e('o_user') + escapePunc(uploader) : e('o_help') + ' Unknown Uploader'
            if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
            song.infoTitle =  `\`${num}\`. ${escapePunc(songName)}\n` +
                `　　[\`${song.formattedDuration}\`] | ` +
                `Uploader: ${song.uploader.url ? `[${uploader}](${song.uploader.url})` : uploader} | `
            num++
        })
        this.panelMessage = {
            embeds: [this._getEmbed(this.interaction)],
            components: this._getButtons(),
        }
    }

    // Actions for interactions with control buttons
    collectorActions = {

        // Up button pressed, select track above or cycle to bottom.
        selectUp: async (interaction) => {
            if (this._currSelection === 0) this._currSelection = this.results.length - 1
            else this._currSelection--
            return await this.updatePanel(interaction)
        },

        // Down button pressed, select track below or cycle to top.
        selectDown: async (interaction) => {
            if (this._currSelection === this.results.length - 1) this._currSelection = 0
            else this._currSelection++
            return await this.updatePanel(interaction)
        },

        // Select first track in queue
        selectFirst: async (interaction) => {
            this._currSelection = 0
            return await this.updatePanel(interaction)
        },

        // Select last track in queue
        selectLast: async (interaction) => {
            this._currSelection = this.results.length - 1
            return await this.updatePanel(interaction)
        },

        // Navigate to help page
        help: async (interaction) => {
            return await interaction.update({
                embeds: [getSearchHelpEmbed(this.client, 
                    `*Press the ${getEmoji(this.client, 'o_return')} button to return to search results.*`,
                    true)],
                components: [this._infoButtons],
                files: []
            })
        },

        // Display the selected track's info
        trackInfo: async (interaction) => {
            const selectedTrack = this.results[this._currSelection]
            return await interaction.update({
                embeds: [songInfoEmbed(this.client, selectedTrack, 'ℹ️ Media Info')],
                components: [this._infoButtons]
            })
        },

        // Return from info page to search results
        returnToResults: async (interaction) => {
            return await this.updatePanel(interaction)
        },

        // Add the select track to back of queue
        addToQueue: async (interaction) => {
            const selectedTrack = this.results[this._currSelection]
            const reply = await playMedia(interaction, selectedTrack.url, 'default', true)
            return await interaction.update(reply)
        },

        // Add the select track as next in queue
        addAsNext: async (interaction) => {
            const selectedTrack = this.results[this._currSelection]
            const reply = await playMedia(interaction, selectedTrack.url, 'addNext', true)
            return await interaction.update(reply)
        },

        // Plays the selected track immediately
        playNow: async (interaction) => {
            const selectedTrack = this.results[this._currSelection]
            const reply = await playMedia(interaction, selectedTrack.url, 'playNow', true)
            return await interaction.update(reply)
        },

        // Closes this interaction
        close: async (interaction) => {
            return await interaction.update({
                content: `This panel has been closed.`,
                embeds: [], components: [], files: []
            }).then(setTimeout(() => { interaction.deleteReply() }, 2000))
        }
    }

    // Function to get all buttons
    _getButtons() {
        const e = (name) => {return getEmoji(this.client, name)}
        return [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('selectFirst')
                    .setEmoji(e('o_goto_top'))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('selectUp')
                    .setEmoji(e('o_arrow_up'))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('selectDown')
                    .setEmoji(e('o_arrow_down'))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('selectLast')
                    .setEmoji(e('o_goto_bottom'))
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('trackInfo')
                    .setEmoji(e('o_song_info'))
                    .setStyle(ButtonStyle.Primary),
            ]),
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('addToQueue')
                    .setEmoji(e('o_queue_add'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('addAsNext')
                    .setEmoji(e('o_play_next'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('playNow')
                    .setEmoji(e('o_play_now'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('help')
                    .setEmoji(e('o_help'))
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('close')
                    .setEmoji(e('o_close_panel'))
                    .setStyle(ButtonStyle.Danger)
            ]),
        ]
    }

    // Function to create the search results embed
    _getEmbed(interaction) {
        const embed = defaultEmbed(this.client, interaction.user, '🔍 Search Results')

        // Create the text for each result, highlighting the selection
        let description = embedLS(false, true) + 
            'Use the buttons below to select a track and add it to queue/play it.' + embedLS()
        this.results.forEach((song, index) => {
            if (index == this._currSelection) description += '➜ **' + song.infoTitle + '**\n'
            else description += song.infoTitle + '\n'
        })
        description += embedLS(false)
        embed.setDescription(description)
        embed.setThumbnail(this.results[this._currSelection].thumbnail)

        return embed
    }

    // Function to update the queue panel with the latest info
    async updatePanel(interaction, display) {
        this.panelMessage = {
            embeds: [this._getEmbed(interaction)],
            components: this._getButtons(),
        }
        return await interaction.update(this.panelMessage)
    }
}