/**
 * Command to delete messages in a channel
 */

import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { defaultEmbed } from "../../utils.js"

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('clearmsg')
    .setDescription('Clears a set amount of messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption(option =>
		option.setName('amount')
			.setDescription('Amount of messages to delete.')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
    )
    .addBooleanOption(option => 
        option.setName('announce')
			.setDescription('Whether or not to announce this change in channel (default False)')
            .setRequired(false)
    )

export async function execute(interaction, client) {
    let amount = interaction.options.get('amount').value
    const userSetAnnounced = interaction.options.get('announce')?.value
    const isAnnounced = (userSetAnnounced != null) ? userSetAnnounced : false
    const timeout = 5000

    try {
        const channelMessages = await interaction.channel.messages.fetch()
        
        // No more messages to clear
        if (channelMessages.size === 0) {
            await interaction.reply({
                content: 'There are no more messages to clear!',
                ephemeral: false
            })
            return
        
            // Delete channel messages according to specified amount
        } else {
            await interaction.deferReply()

            // Ensure messages are cleared within amount in channel
            if (amount > channelMessages.size) amount = channelMessages.size
                
            // Post delete request and respond to user (+ 1 to delete deferReply()'s "Oreo is thinking")
            await interaction.channel.bulkDelete(amount + 1, false)
            const responseEmbed = defaultEmbed(interaction, `Deleted ${amount} messages from this channel!`)
            responseEmbed.setDescription(`This message will be deleted in ${timeout/1000} seconds.`)
            await interaction.channel.send({
                embeds: [responseEmbed],
                ephemeral: isAnnounced
            })
                .then(message => {
                    setTimeout(() => { message.delete() }, timeout)
                })
      
        }
    } catch (error) {
        console.error(`❌ An error occured during /clearmsg ${amount}:\n`, error)
    }
}