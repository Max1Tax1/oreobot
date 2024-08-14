/**
 * Command to disable a command
 */

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import { defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: true
}

export const data = new SlashCommandBuilder()
    .setName('enablecommand')
    .setDescription('Enables or disables a selected command.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
		option.setName('command')
			.setDescription('Specify the command to disable')
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName('enabled')
            .setDescription('Turn this command on/off')
            .setRequired(true))
        

export async function execute(interaction, client) {
    const selectedCommand = interaction.options.get('command').value
    const userSetEnabled = interaction.options.get('enabled')?.value
    const isEnabled = (userSetEnabled != null) ? userSetEnabled : true
    let replied = false

    client.commands.forEach(async command => {
        if (selectedCommand == command.data.name) {

            // Cannot disable core commands (to avoid logical flaws)
            if (command.properties.core == true) {
                replied = true
                await interaction.reply({
                    content: `Cannot disable core command \`/${selectedCommand}\`!`,
                    ephemeral: true
                })
                return
            }

            // Do not enable/disable commands that are already enabled/disabled
            if (command.properties.enabled == isEnabled) {
                replied = true
                await interaction.reply({
                    content: `Command \`/${selectedCommand}\` is already ${isEnabled ? "enabled" : "disabled"}!`,
                    ephemeral: true
                })
                return
            }

            // Disable command
            command.properties.enabled = isEnabled
            replied = true
            const responseEmbed = defaultEmbed(client, interaction.user, `Command ${isEnabled ? "enabled" : "disabled"}`)
            responseEmbed.setDescription(`Command \`/${selectedCommand}\` has been ${isEnabled ? "enabled" : "disabled"}!`)
            await interaction.reply({
                embeds: [responseEmbed] 
            })
            return
        }
    })

    if (replied == false) {
        await interaction.reply({
            content: `Command unknown: \`/${selectedCommand}\`.`,
            ephemeral: true
        })
    }
}