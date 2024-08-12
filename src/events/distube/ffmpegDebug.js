/**
 * Event listener for errors
 */

export default {
    eventName: 'ffmpegDebug',
    once: false,
    function: async (error, queue) => {
        // console.error('❌ An error occurred with FFMPEG:\n', error)
    }
}