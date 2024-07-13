/**
 * Command for Oreo to flip a coin and send the results in an embed message
 */

import { SlashCommandBuilder } from 'discord.js'
import { getRandomItem, defaultEmbed } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Flips a coin.')

export async function execute(interaction, client) {
    const result = getRandomItem(['Heads', 'Tails'])
    const responses = [
        "I got ",
        "It landed on ",
        "Got ",
        "...and it's ",
        "And... it's ",
        "The toss was ",
        "It was ",
        "Landed on ",
        "The coin's face was ",
        "The coin landed on "
    ]

    await interaction.deferReply()

    // Create embed message
    const resultEmbed = defaultEmbed(client, interaction.user, 'Coin Flip')
    resultEmbed.addFields({
            name: ':coin: Result:',
            value: getRandomItem(responses) + "`" + result + "` " + "!",
            inline: false
        })        
    
    // Attach appropriate image thumbnail to embed message and send
    if (result == 'Heads') {
        resultEmbed.setThumbnail('attachment://coinheads.png')
        await interaction.followUp({
            embeds: [resultEmbed],
            files: ['./resources/images/coinheads.png']
        })
    } else {
        resultEmbed.setThumbnail('attachment://cointails.png')
        await interaction.followUp({
            embeds: [resultEmbed],
            files: ['./resources/images/cointails.png']
        })
    }
}