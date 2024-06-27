// Event listener for warnings
export default (client) => {
    client.on('warn', warning => {
        console.warn('🟡 Warning:', warning);
    })
}