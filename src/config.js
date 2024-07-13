
/**
 * Config file for Oreo
 */
import ffmpegPath from 'ffmpeg-static'

export const embedColour = 'F9F6EE'
export const embedSeparator = '━━━━━━━━━━━━━━━━━━━━━━━━━━━'
export const mongodbURL = 'mongodb+srv://shiva:shiva@musicbotyt.ouljywv.mongodb.net/?retryWrites=true&w=majority'
export const language = 'en'

export const playlistSettings = {
    maxPlaylist: 10,
    maxTrackPerList: 75,
}

export const musicPlayer = {
    silentMode: false,
    DJ: {
        commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle'],
    },
    distubeOptions: {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        ffmpeg: { path: ffmpegPath }
    },
    maxVol: 150,
}
