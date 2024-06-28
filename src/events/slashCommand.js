/**
 * Event listener for when a command is created
 */

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {

        // Do not do anything if the user interaction is not a command from Oreo
        if (!interaction.isCommand()) return
        const command = client.commands.get(interaction.commandName)
        if (!client.commands.get(interaction.commandName)) return
        
        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.log(error)
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            })
        }
    }
}