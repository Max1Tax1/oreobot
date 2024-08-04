/**
 * File that contains the player panel class
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder} from 'discord.js'
import { defaultEmbed, getEmoji, escapePunc } from '../general.js'
import { songInfoEmbed } from './utils.js'
import { ControlPanel } from './ControlPanel.js'
import { createCanvas, loadImage } from 'canvas'

/**
 * A class that represents a control panel for the media player/currently playing song
 */
export class PlayerPanel extends ControlPanel {
    /**
     * Constructs a PlayerPanel instance, which is used to control the currently playing song.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     */
    constructor(interaction, client, navButtons, helpEmbed) {
        super(interaction, client, navButtons, helpEmbed)

        this._navButtons = navButtons
    }

    // Function to set up the music player panel. Must be run after creation.
    async init() {
        this._imageAssets = {
            barBg: await loadImage(this.client.assets.playerpanel.get('musicbar.png')),
            mSlider: await loadImage(this.client.assets.playerpanel.get('music_slider.png')),
            vSlider: await loadImage(this.client.assets.playerpanel.get('volume_slider.png')),
            paused: await loadImage(this.client.assets.playerpanel.get('paused.png')),
            playing: await loadImage(this.client.assets.playerpanel.get('playing.png')),
        }
        const queue = await this.client.distube.getQueue(this.interaction.guild.id)
        const musicbar = await this._getMusicBarImage(queue)
        this.panelMessage = {
            embeds: this._getEmbeds(this.interaction, queue),
            components: this._getButtons(queue),
            files: [musicbar]
        }
        return this
    }

    // Actions for interactions with control buttons
    collectorActions = {
        
        // Plays the previous track, if it exists.
        prevTrack: async (interaction, queue) => {
            async function delayFunc() {
                return new Promise((resolve) => {
                    queue.previous()
                    this.client.distube.once('playSong', async () => { resolve() })
                })
            }
            return await this.delayedUpdatePanel(interaction, delayFunc.bind(this))
        },

        // Play/pauses the media player
        playPause: async (interaction, queue) => {
            if (queue.paused) queue.resume()
            else queue.pause()
            return await this.updatePanel(interaction)
        },

        // Display the currently playing track's info
        trackInfo: async (interaction, queue) => {
            return await interaction.update({
                embeds: [songInfoEmbed(this.client, queue.songs[0], 'ℹ️ Media Info')],
                components: this.returnButtons
            })
        },

        // Plays the next track, if it exists.
        nextTrack: async (interaction, queue) => {
            async function delayFunc() {
                return new Promise((resolve) => {
                    queue.skip()
                    this.client.distube.once('playSong', async () => { resolve() })
                })
            }
            return await this.delayedUpdatePanel(interaction, delayFunc.bind(this))
        },

        // Seek forward by 30 seconds. If no more time in track, skip to next track.
        seekForward: async (interaction, queue) => {
            let seekTime = queue.currentTime + 30
            if (seekTime < queue.songs[0].duration) {
                queue.seek(seekTime)
                return await this.updatePanel(interaction)

            // No more songs. Set to end of song.
            } else if (queue.songs.length <= 1) {
                queue.seek(queue.songs[0].duration)
                return await this.updatePanel(interaction)

            // Skips to the next song.
            } else {
                async function delayFunc() {
                    return new Promise((resolve) => {
                        queue.skip()
                        this.client.distube.once('playSong', async () => { resolve() })
                    })
                }
                return await this.delayedUpdatePanel(interaction, delayFunc.bind(this))
            }
        },

        // Seek backwards by 30 seconds. Go to start if time < 30 seconds
        seekBackward: async (interaction, queue) => {
            let seekTime = queue.currentTime - 30
            if (seekTime < 0) seekTime = 0
            queue.seek(seekTime)
            return await this.updatePanel(interaction)
        },

        // Set volume +10
        volumeUp: async (interaction, queue) => {
            queue.setVolume(queue.volume + 10)
            return await this.updatePanel(interaction)
        },

        // Set volume -10
        volumeDown: async (interaction, queue) => {
            queue.setVolume(queue.volume - 10)
            return await this.updatePanel(interaction)
        },

    }

    // Function to get all buttons on music player panel
    _getButtons(queue) {
        const e = (name) => {return getEmoji(this.client, name)}
        return [
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('prevTrack')
                    .setEmoji(e('o_prev_track'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.previousSongs.length == 0),
                new ButtonBuilder().setCustomId('playPause')
                    .setEmoji(queue.paused ? e('o_play') : e('o_pause'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('trackInfo')
                    .setEmoji(e('o_song_info'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('nextTrack')
                    .setEmoji(e('o_next_track'))
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(queue.songs.length <= 1),
                new ButtonBuilder().setCustomId('volumeUp')
                    .setEmoji(e('o_volume_up'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(queue.volume == 100)
            ]),
            new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('seekBackward')
                    .setEmoji(e('o_seek_backward'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('loopOneMode')
                    .setEmoji(queue.repeatMode == 1 ? e('o_repeat_one_on') : e('o_repeat_one_off'))
                    .setStyle(queue.repeatMode == 1 ? ButtonStyle.Success : ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('autoPlayMode')
                    .setEmoji(queue.autoplay ? e('o_autoplay_on') : e('o_autoplay_off'))
                    .setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('seekForward')
                    .setEmoji(e('o_seek_forward'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('volumeDown')
                    .setEmoji(e('o_volume_down'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(queue.volume == 0)
            ]),
            this.navButtons
        ]
    }

    // Function to create the embeds for the images
    _getEmbeds(interaction, queue) {
        const song = queue.songs[0]

        // Embed to host the song info
        const songEmbed = defaultEmbed(this.client, song.user, '📼 Media Player', false, false)
        songEmbed.setTitle(song.name ? escapePunc(song.name) : escapePunc(song.url)).setURL(song.url)
        songEmbed.setImage(song.thumbnail)

        // Embed to host the music bar
        const barEmbed = defaultEmbed(this.client, interaction.user, ' ', false, false)
        barEmbed.setImage('attachment://musicbar.png')
        return [songEmbed, barEmbed]
    }

    // Function to create the music bar UI
    async _getMusicBarImage(queue) {
        const song = queue.songs[0]
        const canvas = createCanvas(1280, 150)
        const context = canvas.getContext('2d')
        
        // Try to draw all assets on canvas
        try {
    
            // Load in progress bar backdrop
            context.drawImage(this._imageAssets.barBg,
                0, 0, canvas.width, canvas.height)
            
            // Add music progress slider
            const mSlider = this._imageAssets.mSlider
            const progress = Math.round((queue.currentTime / song.duration) * 1150)
            context.drawImage(mSlider,
                53 + progress, 23, mSlider.width, mSlider.height)
            
            // Add volume slider
            const vSlider = this._imageAssets.vSlider
            const vPosition = Math.round((queue.volume / 100) * 250)
            context.drawImage(vSlider,
                969 + vPosition, 99, vSlider.width, vSlider.height)
            
            // Add duration text
            context.font = 'bold 25px Sans'
            context.fillStyle = '#000000'
            const totalTime = song.formattedDuration
            if (totalTime == 'Live') context.fillText(totalTime, 52, 80)
            else {
                context.fillText(queue.formattedCurrentTime, 52, 80)
                if (totalTime.length <= 5) context.fillText(totalTime, 1157, 80)
                else context.fillText(totalTime, 1117, 80)
            }
    
            // Add status text
            const statusIcon = queue.paused ? this._imageAssets.paused : this._imageAssets.playing
            context.drawImage(statusIcon, 23, 76,
                statusIcon.width, statusIcon.height)
            context.fillText(queue.paused ? 'Paused' : 'Playing', 90, 125)
    
        } catch (error) {
            console.error('❌ An error occurred whilest drawing song image:\n', error)
        }
        return new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'musicbar.png' })
    }

    // Function to update the music player panel with the latest info
    async updatePanel(interaction) {
        const queue = await this.client.distube.getQueue(interaction.guild.id)
        const musicbar = await this._getMusicBarImage(queue)
        this.panelMessage = {
            embeds: this._getEmbeds(interaction, queue),
            components: this._getButtons(queue),
            files: [musicbar]
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
        const musicbar = await this._getMusicBarImage(queue)
        this.panelMessage = {
            embeds: this._getEmbeds(interaction, queue),
            components: this._getButtons(queue),
            files: [musicbar]
        }
        return await panelMessage.edit(this.panelMessage)
    }
}