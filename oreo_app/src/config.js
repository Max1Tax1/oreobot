
/**
 * Config file for Oreo
 */
import ffmpegPath from 'ffmpeg-static'

export const testMode = true
export const embedColour = 'F9F6EE'
export const embedSeparator = '━━━━━━━━━━━━━━━━━━━━━━━━━━━'
export const interactionTimeout = '90000'

export const botEmojiGuildIDs = {
    'music': '1252869262738067477',
    'navigation': '1265159808323944480'
}

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