/**
 * Command for Oreo to roll a dice and send the results in an embed message
 */

import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { getRandomItem, randInt } from '../../utils.js'

export const data = new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Rolls a dice of your choosing.')
    .addNumberOption(option =>
		option.setName('dice-faces')
			.setDescription('How many faces the dice will have (default 6)')
            .setRequired(false)
            .setMinValue(1)
        )

export async function execute(interaction, client) {
    const botAvatar = client.user.avatarURL({ dynamic: true })
    const userAvatar = interaction.user.avatarURL({ dynamic: true })
    const userResponse = interaction.options.get('dice-faces')?.value
    const diceFaces = (userResponse != null) ? userResponse : 6
    const responses = [
        "I got a ",
        "It landed on ",
        "Got a ",
        "...and it's a ",
        "And... a ",
        "Rolled a ",
        "It was a ",
        "It's a ",
        "I rolled a ",
        "The dice says "
    ]

    //-------------------------------------------------
    // Embed message builder section

    const resultEmbed = new EmbedBuilder()
        .setFooter({ text: 'Requested by ' + interaction.user.username, iconURL: userAvatar})
        .setColor(0xffcc00)
        .setTimestamp()
    
    // Send ball embed if 1 dice face, otherwise reply with normal dice roll embed
    if (diceFaces == 1) {
        resultEmbed.setAuthor({ name: 'Ball.', url: null, iconURL: botAvatar })
        resultEmbed.setDescription("You wanted a ball, here's a ball.")
        resultEmbed.setThumbnail(`attachment://diceball.png`)
    } else if (diceFaces >= 2) {
        resultEmbed.setAuthor({ name: diceFaces + '-Sided Dice Toss', url: null, iconURL: botAvatar })
        resultEmbed.addFields({
            name: ':game_die: Result:',
            value: getRandomItem(responses) + "`" + randInt(1, diceFaces) + "` " + "!",
            inline: false
        }) 
    }

    // Add flavour text for different dice sizes
    if (diceFaces == 2) {
        resultEmbed.setDescription("Try a coin flip next time.")
    } else if (diceFaces >= 20) {
        resultEmbed.setDescription("That's a big dice!")
    }

    //-------------------------------------------------

    await interaction.reply({
        embeds: [resultEmbed],
        files: ['./resources/images/diceball.png']
    })
}