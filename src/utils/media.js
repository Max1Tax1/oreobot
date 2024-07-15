/**
 * Utility functions for Oreo related to DisTube media player
 */

import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { defaultEmbed, numberTextFormat, embedLS, deepCopy } from './general.js'


/**
 * Generates an embed message, to display all information of a song.
 * 
 * @param {Client} client - The bot client.
 * @param {Song} song - The song to display the information.
 * @param {String} title - The title-status to attach to this embed.
 * @param {String} simpleMode - Whether or not to return a simplified embed.
 * @returns {EmbedBuilder} - An instance embed object with the song's info.
 */
export function songInfoEmbed(client, song, title, simpleMode=false) {

    // Create embed for song info
    const songEmbed = defaultEmbed(client, song.user, title)
    songEmbed.setTitle((song.name) ? song.name : song.url).setURL(song.url)

    // Add source info
    let sourceInfo = `🔍 Sourced from: \`${song.source[0].toUpperCase() + song.source.substring(1)}\`\n`
    sourceInfo += song.uploader.name ? `📤 Uploaded by: \`${song.uploader.name}\`\n` : ':detective: Unknown uploader\n'
    songEmbed.addFields({ name: 'Source', value: sourceInfo, inline: true })

    // Add duration and views info
    if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
    let statsInfo = (song.formattedDuration === 'Live') ? '🔴 Livestreamed media\n' : `🕒 Duration: \`${song.formattedDuration}\`\n`
    statsInfo += (song.views) ? `🎧 Times played: \`${numberTextFormat(song.views)}\`\n` : ''
    songEmbed.addFields({ name: 'Stats', value: statsInfo, inline: true })

    // Return now if in simple mode
    if (simpleMode) return songEmbed
    
    // Add a like bar (if applicable)
    let likeBar = song.likes ? `👍 *${numberTextFormat(song.likes)}*` : ''
    if (song.likes && song.dislikes) likeBar += ' | '
    likeBar += song.dislikes ? `👎 *${numberTextFormat(song.dislikes)}*` : ''
    if (song.likes && song.dislikes) {
        const barLength = 20
        const likeCount = Math.round((song.likes / song.likes + song.dislikes) * barLength)
        likeBar += '\n```' + '▬'.repeat(likeCount) + '□'.repeat(barLength - likeCount) + '```'
    }
    likeBar += (likeBar === '') ? '' : '\n'
    if (likeBar) songEmbed.addFields({ name: '\u200B', value: likeBar, inline: false })

    // Set thumbnail image
    if (song.thumbnail) songEmbed.setImage(song.thumbnail)
    return songEmbed
}

/**
 * Search's for a media and plays it/ adds it to queue
 * 
 * @param {Interaction} interaction - The interaction that initiated the media request.
 * @param {String} mediaName - The name of the media to play. Can also be URL.
 * @param {String} option - What to do with this media. Can be one of 'play', 'add', 'addNext', 'playNow' (default 'play')
 * @returns {EmbedBuilder} - An instance embed object with the song's info.
 */
export async function getMedia(interaction, mediaName, option='play') {
    const client = interaction.client
    const voiceChannel = interaction.member.voice.channel
    const queue = client.distube.getQueue(interaction.guild.id)
    let playOptions = {
        member: interaction.member,
        textChannel: interaction.channel
    }
    
    // Change play option according to request
    switch (option) {
        case 'addNext':
            playOptions.position = 1
            break
        case 'playNow':
            playOptions.skip = true
            break
        case 'play':
        case 'add': break
        default:
            throw new Error('❌ Invalid option type for get music request!');
    }

    // Try to get and play music
    try { 
        client.distube.play(voiceChannel, mediaName, {
            member: interaction.member,
            textChannel: interaction.channel
        })
        if (option == 'add') {
            if (!queue || queue.songs.length == 0) client.distube.pause
        }
    } catch (error) {
        console.log('❌ An error occurred whilst getting/playing media:\n', error)
    }
}

/**
 * A class that represents a control panel for the media player's queue
 */
export class QueuePanel {
    /**
     * Constructs a QueuePanelConfig instance.
     * @param {Interaction} interaction - The Discord interaction object triggering the panel.
     * @param {Discord.Client} client - The Discord client instance.
     * @param {Array} queue - The current queue of items to display.
     */
    constructor(interaction, client, queue) {
        this._queueIdsCopy = deepCopy(queue.songs.map(song => song.id))
        this._currSelection = 0
        this._queueList = []
        this._getQueueEmbed(interaction, client, queue)
        this.buttons = [this._playlistButtons, this._getModeButtons(interaction, client, queue), this._helpButton]
        this.collectorFunc = this._buttonOnClick.bind(this)
    }
    
    // Buttons for queue control
    _playlistButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId('trackUp')
            .setLabel('🔼')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('trackDown')
            .setLabel('🔽')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('playNow')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Danger)
    ])

    // Button for help
    _helpButton = new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId('help')
            .setLabel('Help')
            .setStyle(ButtonStyle.Success),
    ])

    // Function to handle interaction with control buttons
    async _buttonOnClick(interaction, client, queue) {

        // Check for empty queue/queue updated from previous display
        if (!queue || queue.length == 0 ) return
        if (this._queueIdsCopy.toString() !== queue.songs.map(song => song.id).toString())
            return await interaction.update({
                content: `:warning: The queue has changed. Please use \`/queue\` again to modify queue!`,
                embeds: [],
                components: []
            })
        
        // Handle each button interaction
        switch (interaction.customId) {
            
            // Up button pressed, select track above or cycle to bottom.
            case 'trackUp':
                if (this._currSelection == 0) this._currSelection = queue.songs.length - 2
                else this._currSelection--
                this._writeQueueText(this.embed, queue)
                return await interaction.update({
                    embeds: [this.embed],
                    components: this.buttons
                })
            
            // Down button pressed, select track below or cycle to top.
            case 'trackDown':
                if (this._currSelection == queue.songs.length - 2) this._currSelection = 0
                else this._currSelection++
                this._writeQueueText(this.embed, queue)
                return await interaction.update({
                    embeds: [this.embed],
                    components: this.buttons
                })
            
            // Play the currently selected track now.
            case 'playNow':
                await queue.jump(this._currSelection + 1)
                return await this._updateQueuePanel(interaction, client, queue)
            case 'playNext':            
                return await this._updateQueuePanel(interaction, client, queue)
            case 'loopOneMode':
                return await this._updateQueuePanel(interaction, client, queue, true)
            case 'loopMode':
                
                return await this._updateQueuePanel(interaction, client, queue, true)
            
            // Turn on/off autoplay mode
            case 'autoPlayMode':
                interaction.channel.send({
                    content: `Autoplay mode is now ${queue.toggleAutoplay() ? 'on' : 'off'}!`
                })
                return await this._updateQueuePanel(interaction, client, queue, true)
            
            // Shuffle playlist
            case 'shuffleSongs':
                await queue.shuffle()
                return await this._updateQueuePanel(interaction, client, queue)
            
            // Unknown interaction: Just update queue panel
            default:
                return await this._updateQueuePanel(interaction, client, queue)
        }
    }

    // Function to create the queue control panel embed
    _getQueueEmbed(interaction, client, queue) {
        const queueEmbed = defaultEmbed(client, interaction.user, '📼 Queue Panel')
        queueEmbed.setTitle(`${queue.voiceChannel} - Media Queue`)

        // Make the queued songs section
        const queuedSongs = queue.songs.slice(1)
        const infoLen = 55
        let num = 1
        queuedSongs.forEach(song => {
            const songName = (song.name) ? song.name : song.url
            const formatName = songName.length > infoLen ? songName.substring(0, infoLen - 3) + "..." : songName.padEnd(infoLen)
            const songTitle = `\`${num}\`. [\`${song.formattedDuration}\`] ${formatName}`
            if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
            this._queueList.push(
                `${songTitle}
                　　**Added by:** @${song.user.username}`)
            num++
        })
        this._writeQueueText(queueEmbed, queue)
        this.embed = queueEmbed
    }

    // Function to update the queue panel with the latest info
    async _updateQueuePanel(interaction, client, queue, buttonUpdate = false) {
        this._queueList = []
        this._getQueueEmbed(interaction, client, queue)
        this._queueIdsCopy = deepCopy(queue.songs.map(song => song.id))
        if (buttonUpdate)
            this.buttons[1] = this._getModeButtons(interaction, client, queue)
        return await interaction.update({
            embeds: [this.embed],
            components: this.buttons
        })
    }

    // Function to update/get the buttons of the control panel
    _getModeButtons(interaction, client, queue) {
        const modeButtons = new ActionRowBuilder().addComponents([
            new ButtonBuilder().setCustomId('loopOneMode')
                .setLabel('🔂')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('loopMode')
                .setLabel('🔁')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('autoPlayMode')
                .setLabel('⏯️')
                .setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('shuffleSongs')
                .setLabel('🔀')
                .setStyle(ButtonStyle.Secondary)
        ])
        return modeButtons
    }

    // Function to update the queue's embed message
    _writeQueueText(queueEmbed, queue) {

        // Make the currently playing section
        const currSong = queue.songs[0]
        let currPlaying = `${embedLS()}▶️  **Currently playing**
            ${(currSong.name) ? currSong.name : currSong.url}
            　　**Added by:** @${currSong.user.username}
            ${embedLS(false, true)}`

        // Make the queued songs section
        if (this._queueList.length != 0) {
            currPlaying += '📀  **Media Queue**\n\n'
            
            // Highlight selection
            const prefix = '➜ **'
            const suffix = '**'
            this._queueList.forEach((songText, index) => {
                if (songText.startsWith(prefix) && songText.endsWith(suffix)){
                    this._queueList[index] = songText.substring(prefix.length, songText.length - suffix.length)
                }
                if (index == this._currSelection) this._queueList[index] = prefix + songText + suffix
            })
            queueEmbed.setDescription(currPlaying + this._queueList.join('\n') + embedLS(true, false))
        } else {
            queueEmbed.setDescription(currPlaying + '*Empty Playlist*' + embedLS(true, false))
        }
        return queueEmbed
    }
}
