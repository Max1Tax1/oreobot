/**
 * Event listener for errors
 */

export default {
    eventName: 'error',
    once: false,
    function: (error) => {
        console.error('❌ An error occurred:\n', error)
    },
}