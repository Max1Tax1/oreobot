/**
 * Command for Oreo to roll a dice and send the results in an embed message
 */

import { SlashCommandBuilder } from 'discord.js'
import { getRandomItem, randInt } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Rolls a die of your choice.')
    .addNumberOption(option =>
		option.setName('faces')
			.setDescription('How many faces the die will have (default 6)')
            .setRequired(false)
            .setMinValue(1))

export async function execute(interaction, client) {
    const botAvatar = client.user.avatarURL({ dynamic: true })
    const userResponse = interaction.options.get('faces')?.value
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

    await interaction.deferReply()

    // Create embed message
    const resultEmbed = defaultEmbed(client, interaction.user, diceFaces + '-Sided Dice Toss')
    
    // Send ball embed if 1 dice face
    if (diceFaces == 1) {
        resultEmbed.setAuthor({ name: 'Ball.', url: null, iconURL: botAvatar })
        resultEmbed.setDescription("You wanted a ball, here's a ball.")
        resultEmbed.setThumbnail('attachment://diceball.png')
        await interaction.followUp({
            embeds: [resultEmbed],
            files: ['./resources/images/diceball.png']
        })
        return
    }
    
    // Normal dice toss + flavour text for different dice sizes
    if (diceFaces >= 2) {
        resultEmbed.setAuthor({ name: diceFaces + '-Sided Dice Toss', url: null, iconURL: botAvatar })
        resultEmbed.addFields({
            name: ':game_die: Result:',
            value: getRandomItem(responses) + "`" + randInt(1, diceFaces) + "` " + "!",
            inline: false
        }) 
    }
    if (diceFaces == 2) {
        resultEmbed.setDescription("Try a coin flip next time.")
    } else if (diceFaces >= 20) {
        resultEmbed.setDescription("That's a big dice!")
    }

    await interaction.followUp({
        embeds: [resultEmbed]
    })
}