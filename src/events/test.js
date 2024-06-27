// Test
export default (client) => {
    client.on('messageCreate', msg => {
        console.log(msg.content)
    })
}