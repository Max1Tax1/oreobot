/**
 * Handler for setting up the media player and module
 */

import { DisTube } from 'distube'
import { YouTubePlugin } from '@distube/youtube'
import fs from 'fs'
import path from 'path'
import * as config from '../config.js'

export default async function handleMusicPlayer(client) {
    const distube = new DisTube(client, {
        ...config.musicPlayer.distubeOptions,
        plugins: [
            new YouTubePlugin()
        ],
    })
    process.env.YTSR_NO_UPDATE = '1'
    client.distube = distube
    client.distube.silentMode = config.musicPlayer.silentMode
}