/**
 * Event listener for warnings
 */

export default {
    eventName: 'error',
    once: false,
    function: (warning) => {
        console.error('🟡 Warning:\n', warning)
    },
}