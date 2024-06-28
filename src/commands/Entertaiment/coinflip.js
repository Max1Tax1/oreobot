/**
 * Command for Oreo to flip a coin and send the results in an embed message
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { getRandomItem } from '../../utils.js'

export const data = new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Flips a coin.')

export async function execute(interaction, client) {
    const botAvatar = client.user.avatarURL({ dynamic: true })
    const userAvatar = interaction.user.avatarURL({ dynamic: true })
    const coinFaces = ['Heads', 'Tails']
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

    //-------------------------------------------------
    // Embed message builder section

    const resultEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Coin Flip', url: null, iconURL: botAvatar})
        .addFields({
            name: ':coin: Result:',
            value: getRandomItem(responses) + "`" + getRandomItem(coinFaces) + "` " + "!",
            inline: false
        })        
        .setFooter({ text: 'Requested by ' + interaction.user.username, iconURL: userAvatar})
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .setColor(0xffcc00)
        .setTimestamp()
    
    //-------------------------------------------------
    
    await interaction.reply({
        embeds: [ resultEmbed ]
    })
}