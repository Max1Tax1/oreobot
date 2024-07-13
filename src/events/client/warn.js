/**
 * Event listener for warnings
 */

export default {
    name: 'error',
    once: false,
    execute(warning) {
        console.error('🟡 Warning:\n', warning)
    },
}