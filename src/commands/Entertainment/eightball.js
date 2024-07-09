/**
 * Command for Oreo to flip a coin and send the results in an embed message
 */

import { SlashCommandBuilder } from 'discord.js'
import { getRandomItem, defaultEmbed } from '../../utils.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask a question for the magic 8-ball to answer.')
    .addStringOption(option =>
		option.setName('question')
			.setDescription('A question you want answered.')
            .setRequired(true)
        )

export async function execute(interaction) {
    const responses = [[
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes, definitely.",
        "Most Likely.",
        "Yes.",
        "All signs point to yes.",
        "As I see it, yes.",
        "It appears so.",
        "I think it is true."
    ], [
        "I better not tell you now.",
        "Perhaps.",
        "Maybe.",
        "Who knows?",
        "Possibly."
    ],[
        "My reply is no.",
        "My sources say no.",
        "Maybe not.",
        "I don't think so.",
        "No.",
        "I think not.",
        "Most unlikely."
    ]]

    // Create embed message
    const resultEmbed = defaultEmbed(interaction, 'Magic 8-ball')
    resultEmbed.addFields({
        name: `:question: ${interaction.user.username} asked:`,
        value: `\`${interaction.options.get('question')?.value}\``,
        inline: false
    })
    resultEmbed.addFields({
            name: ':8ball: 8-ball:',
            value: `\`${getRandomItem(getRandomItem(responses))}\``,
            inline: false
    })        
    
    await interaction.reply({
        embeds: [resultEmbed],
    })
}