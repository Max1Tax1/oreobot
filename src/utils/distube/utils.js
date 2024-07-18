/**
 * Utility functions for Oreo related to DisTube media player
 */

import { defaultEmbed, numberTextFormat, getEmoji, escapePunc } from '../general.js'

/**
 * Generates an embed message, to display all information of a song.
 * 
 * @param {Client} client - The bot client.
 * @param {Song} song - The song to display the information.
 * @param {String} title - The title-status to attach to this embed.
 * @param {String} simpleMode - Whether or not to return a simplified embed.
 * @returns {EmbedBuilder} - An instance embed object with the song's info.
 */
export function songInfoEmbed(client, song, title, simpleMode = false) {
    const e = (name) => { return getEmoji(client, name) }

    // Create embed for song info
    const songEmbed = defaultEmbed(client, song.user, title)
    songEmbed.setTitle((song.name) ? escapePunc(song.name) : song.url).setURL(song.url)

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

    // Return now if in simple mode
    if (simpleMode) return songEmbed
    
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
            throw new Error('❌ Invalid option type for get music request!')
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