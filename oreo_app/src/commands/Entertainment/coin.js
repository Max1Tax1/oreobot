/**
 * Command for Oreo to flip a coin and send the results in an embed message
 */

import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js'
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

    // Create embed message
    const resultEmbed = defaultEmbed(client, interaction.user, 'Coin Flip')
    resultEmbed.addFields({
            name: ':coin: Result:',
            value: getRandomItem(responses) + "`" + result + "` " + "!",
            inline: false
        })        
    
    // Attach appropriate image thumbnail to embed message and send
    const fileName = result == 'Heads' ? 'coinheads.png' : 'cointails.png'
    const image = new AttachmentBuilder(client.assets.entertainment.get(fileName), { name: fileName })
    resultEmbed.setThumbnail(`attachment://${fileName}`)
    await interaction.reply({
        embeds: [resultEmbed],
        files: [image]
    })
}