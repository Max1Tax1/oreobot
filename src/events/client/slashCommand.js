/**
 * Event listener for when a command is sent
 */

export default {
    eventName: 'interactionCreate',
    once: false,
    function: async (interaction, client) => {

        // Do not do anything if the user interaction is not a command for Oreo
        if (!interaction.isCommand()) return
        const command = client.commands.get(interaction.commandName)
        if (!client.commands.get(interaction.commandName)) return

        // Check for disabled command
        if (command.properties.enabled == false) {
            await interaction.reply({
                content: 'This command has been disabled!',
                ephemeral: true
            })
            return
        }
        
        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.log(error)
            await interaction.reply({
                content: '❌ There was an error while executing this command! ❌',
                ephemeral: true
            })
        }
    }
}