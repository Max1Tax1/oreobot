/**
 * File that contains the queue panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, embedLS, getEmoji, escapePunc, generateUID } from '../general.js'
import { songInfoEmbed } from './utils.js'
import { MusicControllerPanel } from './MusicControllerPanel.js'
import * as config from '../../config.js'

/**
 * A class that represents a control panel for the media player's queue
 */
export class QueuePanel extends MusicControllerPanel {
    /**
     * Constructs a QueuePanel instance, which is used to control the media queue for DisTube.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     */
    constructor(interaction, client, navButtons, helpEmbed) {
        super(interaction, client, navButtons, helpEmbed)
        this._currSelection = 0
        this._queueList = []
    }

    // Set up the queue panel. Must be run after creation.
    async setup() {
        const queue = await this.client.distube.getQueue(this.interaction.guild.id)
        this.panelMessage = {
            embeds: [this._getEmbed(this.interaction, queue)],
            components: this._getButtons(queue),
            files: []
        }
    }

    // Actions for interactions with control buttons
    collectorActions = {

        // Up button pressed, select track above or cycle to bottom.
        trackUp: async (interaction, queue) => {
            if (this._currSelection === 0) this._currSelection = queue.songs.length - 2
            else this._currSelection--
            return await this.updatePanel(interaction, false)
        },

        // Down button pressed, select track below or cycle to top.
        trackDown: async (interaction, queue) => {
            if (this._currSelection === queue.songs.length - 2) this._currSelection = 0
            else this._currSelection++
            return await this.updatePanel(interaction, false)
        },

        // Select first track in queue
        selectFirst: async (interaction, queue) => {
            this._currSelection = 0
            return await this.updatePanel(interaction, false)
        },

        // Select last track in queue
        selectLast: async (interaction, queue) => {
            this._currSelection = queue.songs.length - 2
            return await this.updatePanel(interaction, false)
        },

        // Display the selected track's info
        getSelectionInfo: async (interaction, queue) => {
            const selectedTrack = queue.songs[this._currSelection + 1]
            return await interaction.update({
                embeds: [songInfoEmbed(this.client, selectedTrack, 'ℹ️ Media Info')],
                components: this.returnButtons
            })
        },

        // Removes the selected track from queue
        removeTrack: async (interaction, queue) => {
            if (this._currSelection === queue.songs.length - 2) this._currSelection--
            queue.songs.splice(this._currSelection + 1, 1)
            return await this.updatePanel(interaction, false)
        },
        
        // Moves the song to the second position of queue
        playNext: async (interaction, queue) => {
            if (this._currSelection > 0) {
                const selectedSong = queue.songs.splice(this._currSelection + 1, 1)[0]
                queue.songs.splice(1, 0, selectedSong)
                this._currSelection = 0
            }
            return await this.updatePanel(interaction)
        },

        // Plays the selected song immediately
        playNow: async (interaction, queue) => {
            if (this._currSelection > 0) {
                const selectedSong = queue.songs.splice(this._currSelection + 1, 1)[0]
                queue.songs.splice(1, 0, selectedSong)
                this._currSelection = 0
            }

            // Return a promise that resolves when the event listener is triggered and the updatePanel function is executed
            async function delayFunc() {
                return new Promise((resolve) => {
                    queue.skip()
                    this.client.distube.once('playSong', async () => { resolve() })
                })
            }
            return await this.delayedUpdatePanel(interaction, delayFunc.bind(this))
        },

        // Skips all songs from the queue until specified song.
        skipTo: async (interaction, queue) => {
            async function delayFunc() {
                new Promise((resolve) => {
                    queue.jump(this._currSelection + 1)
                    this.client.distube.once('playSong', async () => { resolve() })
                })
            }
            return await this.delayedUpdatePanel(interaction, delayFunc.bind(this))
        },

        // Adds a related song to the currently playing song
        findRelated: async (interaction, queue) => {
            await queue.addRelatedSong().then(async (song) => {
                song.uid = generateUID(song.id)
                if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
                return await this.updatePanel(interaction)
            })
        },

        // Shuffle queue
        shuffleSongs: async (interaction, queue) => {
            await queue.shuffle().then(async () => {
                return await this.updatePanel(interaction)
            })
        },

        // Deletes every queued song.
        removeQueue: async (interaction, queue) => {
            await queue.songs.splice(1, queue.songs.length - 1)
            return await this.updatePanel(interaction)
        },
    }

    // Function to get/update all buttons on the queue panel
    _getButtons(queue) {
        const e = (name) => {return getEmoji(this.client, name)}
        const loopMode = queue.repeatMode
        return [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('trackUp')
                    .setEmoji(e('o_arrow_up'))
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('trackDown')
                    .setEmoji(e('o_arrow_down'))
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('selectFirst')
                    .setEmoji(e('o_goto_top'))
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('selectLast')
                    .setEmoji(e('o_goto_bottom'))
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('getSelectionInfo')
                    .setEmoji(e('o_song_info'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 1),
            ]),
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('removeTrack')
                    .setEmoji(e('o_delete'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 1),
                new ButtonBuilder().setCustomId('playNow')
                    .setEmoji(e('o_play_now'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 1),
                new ButtonBuilder().setCustomId('playNext')
                    .setEmoji(e('o_play_next'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('skipTo')
                    .setEmoji(e('o_jumpto'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('findRelated')
                    .setEmoji(e('o_find_related'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length > config.queueSettings.maxQueue)
            ]),
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('loopOneMode')
                    .setEmoji(loopMode == 1 ? e('o_repeat_one_on') : e('o_repeat_one_off'))
                    .setStyle(loopMode == 1 ? ButtonStyle.Success : ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('loopMode')
                    .setEmoji(loopMode == 2 ? e('o_repeat_on') : e('o_repeat_off'))
                    .setStyle(loopMode == 2 ? ButtonStyle.Success : ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('autoPlayMode')
                    .setEmoji(queue.autoplay ? e('o_autoplay_on') : e('o_autoplay_off'))
                    .setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('shuffleSongs')
                    .setEmoji(e('o_shuffle'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 2),
                new ButtonBuilder().setCustomId('removeQueue')
                    .setEmoji(e('o_queue_remove'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 1),
            ]),
            this.navButtons
        ]
    }

    // Function to create the queue control panel embed
     _getEmbed(interaction, queue) {
        const queueEmbed = defaultEmbed(this.client, interaction.user, '🎼 Queue Panel', false, false)
        queueEmbed.setTitle(`${queue.voiceChannel} - Media Queue`)

        // Make the queued songs section
        const queuedSongs = queue.songs.slice(1)
        const infoLen = 55
        let num = 1
        if (queuedSongs.length > 0) queuedSongs.forEach(song => {
            const songName = (song.name) ? song.name : song.url
            const formatName = songName.length > infoLen ? songName.substring(0, infoLen - 3) + "..." : songName.padEnd(infoLen)
            const songTitle = `\`${num}\`. [\`${song.formattedDuration}\`] ${escapePunc(formatName)}`
            if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
            this._queueList.push(
                `${songTitle}
                　　[${getEmoji(this.client, 'o_link')} Link](${song.url}) \|  Added by: *@${song.user.username}*`)
            num++
        })
        this._writeQueueText(queueEmbed, queue)
        return queueEmbed
    }

    // Function to update the queue's embed message
    _writeQueueText(queueEmbed, queue) {
        const playEmoji = getEmoji(this.client, 'o_play')
        const queueEmoji = getEmoji(this.client, 'o_queue_list')

        // Make the currently playing section
        const currSong = queue.songs[0]
        const currTime = (currSong.formattedDuration == 'Live') ? 'Live' : 
            `${queue.formattedCurrentTime} / ${currSong.formattedDuration}`
        let currPlaying = `${embedLS()}${playEmoji}  **Currently Playing** [\`${currTime}\`]
            \`\`\`${(currSong.name) ? currSong.name : currSong.url} \`\`\`\
            [${getEmoji(this.client, 'o_link')} Link](${currSong.url}) \| Added by: @${currSong.user.username}
            ${embedLS(true, true)}`

        // Make the queued songs section
        if (this._queueList.length != 0) {
            currPlaying += `${queueEmoji}  **Media Queue**\n\n`
            
            // Highlight selection
            const prefix = '➜ **'
            const suffix = '**'
            this._queueList.forEach((songText, index) => {
                if (songText.startsWith(prefix) && songText.endsWith(suffix)) {
                    this._queueList[index] = songText.substring(prefix.length, songText.length - suffix.length)
                }
                if (index == this._currSelection) this._queueList[index] = prefix + songText + suffix
            })
            queueEmbed.setDescription(currPlaying + this._queueList.join('\n') + embedLS() + 
                `*Press the ${getEmoji(this.client, 'o_help')} button for the help page*`)
        } else {
            queueEmbed.setDescription(currPlaying + '*Empty queue*' + embedLS() + 
                `*Press the ${getEmoji(this.client, 'o_help')} button for the help page*`)
        }
        return queueEmbed
    }

    // Function to update the queue panel with the latest info
    async updatePanel(interaction, resetSelection=true) {
        const queue = await this.client.distube.getQueue(interaction.guild.id)
        this._queueList = []
        if (resetSelection) this._currSelection = 0
        this.panelMessage = {
            embeds: [this._getEmbed(interaction, queue)],
            components: this._getButtons(queue),
            files: []
        }
        return await interaction.update(this.panelMessage)
    }

    // Function to update the queue panel after long process time
    async delayedUpdatePanel(interaction, delayFunc) {
        const panelMessage = await interaction.channel.messages.fetch(interaction.message.id)

        // Disable all buttons and reply
        const components = this.panelMessage.components
        const disabledButtons = components.map(buttonRow => {
            const newRow = new ActionRowBuilder().addComponents(
                buttonRow.components.map(button => button.setDisabled(true))
            )
            return newRow
        })
        await interaction.update({
            components: disabledButtons
        })

        // Run the function that takes time to resolve
        await delayFunc()

        // Edit the message after the function completes
        const queue = await this.client.distube.getQueue(interaction.guild.id)
        this._queueList = []
        this._currSelection = 0
        this.navButtons.components.map(button => button.setDisabled(false))
        this.panelMessage = {
            embeds: [this._getEmbed(interaction, queue)],
            components: this._getButtons(queue),
            files: []
        }
        return await panelMessage.edit(this.panelMessage)
    }
}