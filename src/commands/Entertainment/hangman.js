/**
 * Command for Oreo to flip a coin and send the results in an embed message
 */

import { SlashCommandBuilder } from 'discord.js'
import { isWord, getTextFile, randInt } from '../../utils/general.js'
import { HangmanGame } from '../../utils/entertainment/HangManGame.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Starts a game of hangman.')
    .addStringOption(option =>
		option.setName('word')
			.setDescription('The hidden word for this game (Minimum length of 3).')
            .setRequired(false))

async function getRandomWord() {
    try {
        const data = await getTextFile('filtered_dict.txt')
        const words = data.split('\r\n')
        return words[randInt(0, words.length)]
    } catch (error) {
        console.error('❌ An error occurred whilst reading words list!', error)
        return 'oreo'
    }
}

export async function execute(interaction, client) {
    let word = interaction.options.get('word')?.value

    // Ensure the word is properly defined
    if (!word) word = await getRandomWord()
    else if (!isWord(word)) return await interaction.reply({
        content: `"${word}" contains non-alphabetical characters! Check the spelling and try again.`,
        ephemeral: true
    })
    else if (word.length < 3) return await interaction.reply({
        content: `"${word}" is too short (minimum length 3)! Try another word.`,
        ephemeral: true
    })

    // Start hangman game
    const hangmanGame = new HangmanGame(interaction, client, word)
    await hangmanGame.init()
}