/**
 * Command to send a bunch of messages
 */

import { SlashCommandBuilder, AttachmentBuilder} from 'discord.js'
import { createCanvas, loadImage } from 'canvas'
import { extname } from 'path'
import { request } from 'undici'
import sharp from 'sharp'
import * as config from '../../config.js'
import { playMedia } from '../../utils/distube/utils.js'

async function _getThumbnailImage(client, queue) {
    const song = queue.songs[0]
    const canvas = createCanvas(1280, 720)
    const context = canvas.getContext('2d')
    
    // Try to draw all assets on canvas
    try {

        // Fetch and draw song thumbnail image, or use local replacement file
        let thumbnailBuffer = null
        if (!song.thumbnail) thumbnailBuffer = client.assets.playerpanel.get('default_thumbnail.png')
        else {
            const { body } = await request(song.thumbnail)
            thumbnailBuffer = Buffer.from(await body.arrayBuffer())
            if (extname(song.thumbnail).toLowerCase() !== '.png')
                thumbnailBuffer = await sharp(thumbnailBuffer).png().toBuffer()
        }
        const width = 72
        const height = 64
        context.drawImage(await loadImage(thumbnailBuffer),
            width, height, canvas.width - width * 2, canvas.height - height * 2)
        
        // Cut rectangular holes, for the cassette
        context.globalCompositeOperation = 'destination-out'
        context.fillStyle = '#000000'
        let holeWidth = 550
        let holeHeight = 160
        context.fillRect((canvas.width - holeWidth) / 2, (canvas.height - holeHeight) / 2,
            holeWidth, holeHeight)
        holeWidth = 710
        holeHeight = 84
        context.fillRect((canvas.width - holeWidth) / 2, (canvas.height - holeHeight),
            holeWidth, holeHeight)
        context.globalCompositeOperation = 'source-over'
        
        // Load in cassette image from file
        const cassetteBuffer = client.assets.playerpanel.get('cassette.png')
        context.drawImage(await loadImage(cassetteBuffer),
            0, 0, canvas.width, canvas.height)
        
        // Draw song title and requester text onto the image
        context.font = 'italic 25px Sans'
        context.fillStyle = '#000000'
        const songName = song.name ? song.name : 'Unnamed Media'
        const formatLength = 72
        
        let firstLine = songName.substring(0, formatLength)
        if (firstLine.length == formatLength) firstLine += '-'
        context.fillText(firstLine, 207, 125)
        
        let secondLine = songName.substring(formatLength, formatLength * 2)
        secondLine = secondLine.length > formatLength ?
            secondLine.substring(0, formatLength - 3) + "..." : secondLine.padEnd(formatLength)
        context.fillText(secondLine, 207, 166)
        
        context.font = 'italic 25px Calibri'
        context.fillText(song.user.username, 826, 576)

    } catch (error) {
        console.error('❌ An error occurred whilest drawing song image:\n', error)
    }
    return new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'player.png' })
}

export const properties = {
    enabled: config.testMode,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command.')

export async function execute(interaction, client) {
    const firstDelay = 2000
    const delay = 500

    // BB
    await playMedia(interaction, 'https://www.youtube.com/watch?v=g380lSFcUDU')

    // Madonna
    // getMedia(interaction, 'https://www.youtube.com/watch?v=XQvrq_h0Ju4')

    // Lofi
    // getMedia(interaction, 'https://www.youtube.com/watch?v=ptFkddgODAA')
    // setTimeout(() => {
    //     getMedia(interaction, 'lofi girl')
    // }, firstDelay)
    // setTimeout(() => {
    //     getMedia(interaction, 'lofi cat')
    // }, firstDelay + delay)
    // setTimeout(() => {
    //     getMedia(interaction, 'lofi nature')
    // }, firstDelay + delay * 2)
}