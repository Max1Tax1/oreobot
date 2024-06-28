/**
 * Event listener for errors
 */

export default {
    name: 'error',
    once: false,
    execute(error) {
        console.error('❌ An error occurred:\n', error)
    },
}