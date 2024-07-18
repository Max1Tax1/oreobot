/**
 * File that contains the queue panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { RepeatMode } from 'distube'
import { defaultEmbed, embedLS, getEmoji, escapePunc, addEventListener } from '../general.js'

/**
 * A class that represents a control panel for the media player's queue
 */
export class QueuePanel {
    /**
     * Constructs a QueuePanel instance, which is used to control the media queue for DisTube.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     */
    constructor(interaction, client, navButtons) {
        const queue = client.distube.getQueue(interaction.guild.id)
        this._currSelection = 0
        this._queueList = []
        this._getQueueEmbed(interaction, client, queue)
        this._navButtons = navButtons
        this.buttons = [
            this._getQueueButtons(client, queue),
            this._getModeButtons(client, queue),
            this._navButtons
        ]
    }

    // Actions for interactions with control buttons
    collectorActions = {

        // Up button pressed, select track above or cycle to bottom.
        trackUp: async (interaction, client, queue) => {
            if (this._currSelection === 0) this._currSelection = queue.songs.length - 2
            else this._currSelection--
            return await this.updatePanel(interaction, client, false)
        },

        // Down button pressed, select track below or cycle to top.
        trackDown: async (interaction, client, queue) => {
            if (this._currSelection === queue.songs.length - 2) this._currSelection = 0
            else this._currSelection++
            return await this.updatePanel(interaction, client, false)
        },
        
        // Moves the song to the second position of queue
        playNext: async (interaction, client, queue) => {
            if (this._currSelection > 0) {
                const selectedSong = queue.songs.splice(this._currSelection + 1, 1)[0]
                queue.songs.splice(1, 0, selectedSong)
                this._currSelection = 0
            }
            return await this.updatePanel(interaction, client)
        },

        // Plays the selected song immediately
        playNow: async (interaction, client, queue) => {
            if (this._currSelection > 0) {
                const selectedSong = queue.songs.splice(this._currSelection + 1, 1)[0];
                queue.songs.splice(1, 0, selectedSong);
                this._currSelection = 0;
            }

            // Return a promise that resolves when the event listener is triggered and the updatePanel function is executed
            return new Promise((resolve) => {
                queue.skip()
                client.distube.once('playSong', async () => {
                    await this.updatePanel(interaction, client)
                    resolve()
                })
            })
        },

        // Skips all songs from the queue until specified song.
        skipTo: async (interaction, client, queue) => {
            return new Promise((resolve) => {
                queue.jump(this._currSelection + 1)
                client.distube.once('playSong', async () => {
                    await this.updatePanel(interaction, client)
                    resolve()
                })
            })
        },

        // Toggle loop track mode. Will turn off loop queue if it is on. 
        loopOneMode: async (interaction, client, queue) => {
            const loopOneMode = queue.repeatMode === 0 || queue.repeatMode === 2 ? RepeatMode.SONG : RepeatMode.DISABLED
            await queue.setRepeatMode(loopOneMode).then(async () => {
                return await this.updatePanel(interaction, client)
            })
        },

        // Toggle loop queue mode. Will turn off loop track if it is on.
        loopMode: async (interaction, client, queue) => {
            const loopMode = queue.repeatMode === 0 || queue.repeatMode === 1 ? RepeatMode.QUEUE : RepeatMode.DISABLED
            await queue.setRepeatMode(loopMode).then(async () => {
                return await this.updatePanel(interaction, client)
            })
        },

        // Turn on/off autoplay mode
        autoPlayMode: async (interaction, client, queue) => {
            await queue.toggleAutoplay().then(async () => {
                return await this.updatePanel(interaction, client)
            })
        },

        // Shuffle queue
        shuffleSongs: async (interaction, client, queue) => {
            await queue.shuffle().then(async () => {
                return await this.updatePanel(interaction, client)
            })
        },

        // Adds a related song to the currently playing song
        findRelated: async (interaction, client, queue) => {
            await queue.addRelatedSong().then(async () => {
                return await this.updatePanel(interaction, client)
            })
        }
    }

    // Function to create the queue control panel embed
    _getQueueEmbed(interaction, client, queue) {
        const queueEmbed = defaultEmbed(client, interaction.user, '📼 Queue Panel', false, false)
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
                　　[${getEmoji(client, 'o_link')} Link](${song.url}) \|  Added by: *@${song.user.username}*`)
            num++
        })
        this._writeQueueText(client, queueEmbed, queue)
        this.embed = queueEmbed
    }

    // Function to update the queue panel with the latest info
    async updatePanel(interaction, client, resetSelection = true) {
        const queue = await client.distube.getQueue(interaction.guild.id)
        this._queueList = []
        if (resetSelection) this._currSelection = 0
        if (queue.songs.slice(1).length > 0) this._getQueueEmbed(interaction, client, queue)
        this.buttons = [
            this._getQueueButtons(client, queue),
            this._getModeButtons(client, queue),
            this._navButtons
        ]
        return await interaction.update({
            embeds: [this.embed],
            components: this.buttons
        })
    }

    // Function to update/get the queue control buttons
    _getQueueButtons(client, queue) {
        const queueButtons = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('trackUp')
                .setEmoji(getEmoji(client, 'o_arrow_up'))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(queue.songs.length <= 1),
            new ButtonBuilder().setCustomId('trackDown')
                .setEmoji(getEmoji(client, 'o_arrow_down'))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(queue.songs.length <= 1),
            new ButtonBuilder().setCustomId('playNow')
                .setEmoji(getEmoji(client, 'o_play_now'))
                .setStyle(ButtonStyle.Danger)
                .setDisabled(queue.songs.length == 0),
            new ButtonBuilder().setCustomId('playNext')
                .setEmoji(getEmoji(client, 'o_play_next'))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(queue.songs.length == 0),
            new ButtonBuilder().setCustomId('skipTo')
                .setEmoji(getEmoji(client, 'o_jumpto'))
                .setStyle(ButtonStyle.Primary)
                .setDisabled(queue.songs.length <= 1),
        ])
        return queueButtons
    }

    // Function to update/get the buttons for mode control
    _getModeButtons(client, queue) {
        function e(name) {return getEmoji(client, name)}
        const loopMode = queue.repeatMode

        const modeButtons = new ActionRowBuilder().addComponents([
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
                .setDisabled(queue.songs.length <= 1),
            new ButtonBuilder().setCustomId('findRelated')
                .setEmoji(e('o_find_related'))
                .setStyle(ButtonStyle.Primary),
        ])
        return modeButtons
    }

    // Function to update the queue's embed message
    _writeQueueText(client, queueEmbed, queue) {
        const playEmoji = getEmoji(client, 'o_play')
        const queueEmoji = getEmoji(client, 'o_queue_list')

        // Make the currently playing section
        const currSong = queue.songs[0]
        const currTime = (currSong.formattedDuration == 'Live') ? 'Live' : 
            `${queue.formattedCurrentTime} / ${currSong.formattedDuration}`
        let currPlaying = `${embedLS()}${playEmoji}  **Currently Playing** [\`${currTime}\`]
            \`\`\`${(currSong.name) ? currSong.name : currSong.url} \`\`\`\
            [${getEmoji(client, 'o_link')} Link](${currSong.url}) \| Added by: @${currSong.user.username}
            ${embedLS(true, true)}`

        // Make the queued songs section
        if (this._queueList.length != 0) {
            currPlaying += `${queueEmoji}  **Media Queue**\n\n`
            
            // Highlight selection
            const prefix = '➜ **'
            const suffix = '**'
            this._queueList.forEach((songText, index) => {
                if (songText.startsWith(prefix) && songText.endsWith(suffix)){
                    this._queueList[index] = songText.substring(prefix.length, songText.length - suffix.length)
                }
                if (index == this._currSelection) this._queueList[index] = prefix + songText + suffix
            })
            queueEmbed.setDescription(currPlaying + this._queueList.join('\n') + embedLS() + 
                `*Press the ${getEmoji(client, 'o_help')} button for the help page*`)
        } else {
            queueEmbed.setDescription(currPlaying + '*Empty queue*' + embedLS() + 
                `*Press the ${getEmoji(client, 'o_help')} button for the help page*`)
        }
        return queueEmbed
    }
}