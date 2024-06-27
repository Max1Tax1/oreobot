// Event listener for errors
export default (client) => {
    client.on('error', error => {
        console.error('❌ An error occurred:', error);
    })
}