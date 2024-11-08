/**
 * Handler for setting up the media player and module
 */

import { DisTube } from 'distube'
import { YouTubePlugin } from '@distube/youtube'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'
import * as config from '../config.js'
import * as secrets from '../secrets.js'

export const startMessage = 'Setting up DisTube module'
export const finishMessage = 'DisTube setup complete'
export default async function handleDistube(client) {
    try {
        const extractorPlugins = {
            youtube: new YouTubePlugin({
                cookies: secrets.youtubeCookies
            }),
            soundcloud: new SoundCloudPlugin(),
            spotify: new SpotifyPlugin()
        }
        const distube = new DisTube(client, {
            ...config.musicPlayer.distubeOptions,
            plugins: Object.values(extractorPlugins),
        })
        distube.setMaxListeners(config.musicPlayer.maxListeners)
        client.distube = distube
        client.distube.extractorPlugins = extractorPlugins
        client.distube.silentMode = config.musicPlayer.allowNotif ? false : true
    } catch (error) {
        throw new Error(`Error occurred whilst setting up DisTube:\n${error}`)
    }
}