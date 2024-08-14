/**
 * Utility functions for Oreo related to DisTube media player
 */

import { defaultEmbed, numberTextFormat, getEmoji, escapePunc, checkVCState } from '../general.js'
import * as config from '../../config.js'

/**
 * Generates an embed message, to display all information of a song.
 * 
 * @param {Client} client - The bot client.
 * @param {Song} song - The song to display the information.
 * @param {String} title - The title-status to attach to this embed.
 * @param {Boolean} simpleMode - Whether or not to return a simplified embed.
 * @returns {EmbedBuilder} An instance embed object with the song's info.
 */
export function songInfoEmbed(client, song, title, simpleMode = false, includeThumbnail = true) {
    const e = (name) => { return getEmoji(client, name) }

    // Create embed for song info
    const songEmbed = defaultEmbed(client, song.user, title)
    songEmbed.setTitle(song.name ? escapePunc(song.name) : escapePunc(song.url)).setURL(song.url)

    // Return now if in simple mode
    if (simpleMode) {
        if (song.thumbnail && includeThumbnail) songEmbed.setThumbnail(song.thumbnail)
        return songEmbed
    }

    // Add source info
    let sourceInfo = `${e('o_search')} Sourced from: \`${song.source[0].toUpperCase() + song.source.substring(1)}\`\n`
    sourceInfo += song.uploader.name ? `${e('o_upload')} Uploaded by: \`${song.uploader.name}\`\n` :
        `${e('o_user')} Unknown uploader\n`
    songEmbed.addFields({ name: 'Source', value: sourceInfo, inline: true })

    // Add duration and views info
    if (song.formattedDuration === '00:00') song.formattedDuration = 'Live'
    let statsInfo = (song.formattedDuration === 'Live') ? `${e('o_live')} Livestreamed media\n` :
        `${e('o_timer')} Duration: \`${song.formattedDuration}\`\n`
    statsInfo += (song.views) ? `${e('o_headphones')} Times played: \`${numberTextFormat(song.views)}\`\n` : ''
    songEmbed.addFields({ name: 'Stats', value: statsInfo, inline: true })
    
    // Add a like bar (if applicable)
    let likeBar = song.likes ? `${e('o_like')} *${numberTextFormat(song.likes)}*` : ''
    if (song.likes && song.dislikes) likeBar += ' | '
    likeBar += song.dislikes ? `${e('o_dislike')} *${numberTextFormat(song.dislikes)}*` : ''
    if (song.likes && song.dislikes) {
        const barLength = 20
        const likeCount = Math.round((song.likes / song.likes + song.dislikes) * barLength)
        likeBar += '\n```' + '▬'.repeat(likeCount) + '□'.repeat(barLength - likeCount) + '```'
    }
    likeBar += (likeBar === '') ? '' : '\n'
    if (likeBar) songEmbed.addFields({ name: '\u200B', value: likeBar, inline: false })

    // Set thumbnail image
    if (song.thumbnail && includeThumbnail) songEmbed.setImage(song.thumbnail)
    return songEmbed
}

/**
 * Checks if the user is allowed to use distube.
 * 
 * @param {Interaction} interaction - The interaction that initiated the media request.
 * @param {Client} client - The bot client.
 * @param {String} option - Optional parameter specifying the action being performed. Default to none.
 * @returns {Object|null} Returns interaction.reply content. Returns `null` if no restrictions are met.
 */
export function notUserPlayable(interaction, client, option='default') {
    const vcState = checkVCState(interaction, client)
    const queue = client.distube.getQueue(interaction.guild.id)


    // Check if user not in voice channel
    if (vcState == 0) return {
        content: 'Please join a voice channel first, and try \`/play\` again with a \`media\` name!',
        ephemeral: true
    }

    // Check if user in voice channel of Oreo
    if (vcState == 2) return {
        content: "We're not in the same place! Please join a voice channel that I'm in first.",
        ephemeral: true
    }

    // Check if max queue length (don't have to for play now, as it skips a song.)
    if (option != 'playNow') {
        let maxQueue = config.queueSettings.maxQueue
        if (queue && queue.songs.length + 1 > maxQueue) {
            return {
                content: `⚠️ The media queue is full! (Max queued songs at ${maxQueue})`,
                ephemeral: true
            }
        }
    }

    return null
}

/**
 * Searchs for the specified string and plays it/ adds it to queue.
 * Note: 'playNow' option takes a long time. Please interaction.deferReply() beforehand.
 * Note: playOptions.skip is broken (just adds as next song). This function needs to be
 * updated when it is fixed.
 * 
 * @param {Interaction} interaction - The interaction that initiated the media request.
 * @param {String} mediaName - The name of the media to play. Can also be URL.
 * @param {String} option - What to do with this media. Can be one of 'default', 'addNext', 'playNow'.
 * @param {boolean} checkers - Set of constraints to ensure getMedia is valid for a normal user.
 */
export async function playMedia(interaction, mediaName, option='default', checkers=false) {
    const client = interaction.client
    let queue = client.distube.getQueue(interaction.guild.id)
    const hasSongs = !!queue

    // Checkers to see if this function can be invoked
    if (checkers) {
        const replyMsg = notUserPlayable(interaction, client, option)
        if (replyMsg) return replyMsg
    }
    
    // Set up play options and also reply text
    let playOptions = {
        member: interaction.member,
        textChannel: interaction.channel
    }
    let replyText
    switch (option) {
        case 'addNext': // playOptions.skip is broken, so for now just use this:
            replyText = 'Media found, adding as the next track...'
            playOptions.skip = true
            break
        case 'playNow':
            replyText = 'Media found, playing now...'
            playOptions.skip = true
            break
        case 'default':
            replyText = `Media found, ${hasSongs ? 'adding to queue' : 'now playing'}...`
            break
        default:
            throw new Error('❌ Invalid option type for getMedia request!')
    }

    // Try to get and play music
    try {
        const voiceChannel = interaction.member.voice.channel
        if (option != 'playNow') client.distube.play(voiceChannel, mediaName, playOptions)
        else {
        
            // Silently add as next track and skip to it (change )
            const queue = await client.distube.getQueue(interaction.guild.id)
            if (!queue || queue.songs.length == 0) {
                client.distube.play(voiceChannel, mediaName, playOptions)
            } else {
                const silentMode = client.distube.silentMode
                client.distube.silentMode = true
                await client.distube.play(voiceChannel, mediaName, playOptions).then(() => {
                    client.distube.silentMode = silentMode
                })
                queue.skip()
            }
        }
    } catch (error) {
        console.log('❌ An error occurred whilst getting/playing media:\n', error)
    }

    return {
        content: replyText,
        ephemeral: true,
        embeds:[], components: [], files: []
    }
}