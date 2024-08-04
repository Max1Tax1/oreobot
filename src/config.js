
/**
 * Config file for Oreo
 */
import ffmpegPath from 'ffmpeg-static'
import { YouTubePlugin } from '@distube/youtube'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { SpotifyPlugin } from '@distube/spotify'

export const testMode = true
export const embedColour = 'F9F6EE'
export const embedSeparator = '━━━━━━━━━━━━━━━━━━━━━━━━━━━'

export const assetFolders = [
    'entertainment',
    'playerpanel'
]

export const queueSettings = {
    maxQueue: 10,
    maxTrackPerList: 75,
}

export const mediaSearchType = {
    youtube: 'video',
    soundcloud: 'track',
    spotify: 'track'
}
export const searchLimit = 8

export const musicPlayer = {
    allowNotif: true,
    distubeOptions: {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        ffmpeg: { path: ffmpegPath }
    },
    maxListeners: 5,
    maxVol: 100
}