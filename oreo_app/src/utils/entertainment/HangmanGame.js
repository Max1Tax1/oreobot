/**
 * File that contains the game class for hangman
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { InteractionPanel } from '../InteractionPanel.js'
import { defaultEmbed, embedLS, getEmoji, getTextFile, randInt, getRandomItem } from '../general.js'
import * as config from '../../config.js'

/**
 * A class that starts a hangman game
 */
export class HangmanGame extends InteractionPanel {
    /**
     * Constructs a HangManGame instance, which is for a game of hangman
     * @param {Interaction} interaction - The Discord interaction calling the search.
     * @param {Discord.Client} client - The Discord client instance.
     * @param {string} word - (Optional) Word to start hangman with. Will get a random word
     * if left empty.
     */
    constructor(interaction, client, word = null) {
        super(interaction, client, true)

        this._alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
        this._word = word
        this._lettersGuessed = []
        this._totalLives = 6
        this._lives = this._totalLives
        this._guessState = 0    // 0 = no guesses made, 1 = good guess, -1 = bad guess
        this._gameState = 0     // 0 = game progressing, 1 = win, -1 = loss
        this._buttonPage = 1
        this.panelMessage = {
            embeds: [this._getEmbed()],
            components: this._getButtons()
        }
    }
    _guessGood = [
        'Good guess!',
        'Nice one!',
        'You got it!',
        "You're on the right track!",
        'Excellent guess!',
        'Right on target!',
        'Spot on!',
        "That's the right letter to guess!",
        'Nice work!',
        'You nailed it!',
        "You've got it!",
        "You've uncovered a letter!",
        'Bullseye!',
        "You've found a letter!",
        "You're on fire!"
    ]
    _guessBad = [
        'That letter is not in the word.',
        'Try again!',
        'Not quite right.',
        'Incorrect guess.',
        'Oops, wrong letter.',
        'Keep guessing!',
        "That letter isn't part of the word.",
        'No match there.',
        'Try another letter.',
        "That's not the letter we're looking for.",
        'Wrong guess, try another.',
        'Incorrect choice.',
        'Better luck next guess.',
        "That's not correct.",
        'Wrong letter, try another one.'
    ]

    // Function to handle interaction collection logic
    async onCollect(inter) {
        const actionId = inter.customId
        
        // Navigation actions
        if (this.collectorActions[actionId]) return await this.collectorActions[actionId](inter)
        
        // Letter guess action
        else if (actionId.startsWith('letter')) {
            const guess = actionId.charAt(actionId.length - 1).toLowerCase()
            return await this.collectorActions.guess(inter, guess)
        }
        else {
            console.error(`❌ Unknown interaction ID ${actionId} received.`)
            inter.deferUpdate()
        }
    }

    // Function to run after timeout/interaction collector stop
    async onEnd() {
        const embed = this._getEmbed(this.interaction)
        embed.setFooter({ text: 'This game has timed out. Use /hangman to start a new game.'})
        this.interaction.editReply({
            embeds: [embed],
            components: [],
        })
    } 

    // Collector action functions for navigation
    collectorActions = {

        // Navigate to button page one
        pageOne: async (interaction) => {
            this._buttonPage = 1
            this._guessState = 0
            return await this.updatePanel(interaction)
        },

        // Navigate to button page two
        pageTwo: async (interaction) => {
            this._buttonPage = 2
            this._guessState = 0
            return await this.updatePanel(interaction)
        },

        // Ends and closes the game
        close: async (interaction) => {
            return await this.closePanel(interaction, 'This hangman game has been closed.')
        },

        // Guess was made, update panel and game info
        guess: async (interaction, guess) => {
            const wordArray = this._word.split('')
            this._lettersGuessed.push(guess)

            // Update guess state (good or bad guess)
            if (wordArray.includes(guess)) this._guessState = 1
            else {
                this._guessState = -1
                this._lives--
            }

            // Update game state
            if (this._lives == 0) this._gameState = -1
            else if (wordArray.every(letter => this._lettersGuessed.includes(letter)))
                this._gameState = 1
            else this._gameState = 0
            return await this.updatePanel(interaction)
        }
    }

    // Function to draw the hangman in ascii
    _getHangmanAscii() {
        let hangedMan = '    ─┼───────┼─\n' + '     │       │\n'
        const head = this._gameState == 1 ? '😃' : '😲'

        // Perfect win
        if (this._lives == 6 && this._gameState == 1) return '\`\`\`　\n' +
            '       ☆。 *。 ☆。\n' +
            '     ★。\\  |  /。★\n' +
            '    *   Perfect!  *\n' +
            '     ★。/  |  \\。★\n' +
            '       ☆。 *。 ☆。\n' +
            '  __________________\n' +
            ' /                 /│___\n' +
            '/_________________/ /  /│\n' +
            '│                 |/__/ /\n' +
            '|_____________________|/\`\`\`'
        
        // Head and arms of hangman
        if (this._lives == 6) hangedMan += '     │\n'
        else if (this._lives >= 4) hangedMan += `     │      ${head}\n`
        else if (this._lives == 3) hangedMan += `     │     \\${head}\n`
        else if (this._lives == 0) hangedMan += `     │      😵\n`
        else hangedMan += `     │     \\${head}/\n`                   
        
        // Upper body of hangman
        if (this._lives >= 5) hangedMan += '     │\n'
        else if (this._lives == 0) hangedMan += '     │      /█\\\n'
        else hangedMan += '     │       █\n'
        
        // Lower body of hangman
        if (this._lives >= 5) hangedMan += '     │\n'
        else hangedMan += '     │       ║\n'
        
        // Legs of hangman
        if (this._lives > 1) hangedMan += '     │\n'
        else if (this._lives == 1) hangedMan += '     │      /\n'
        else if (this._lives == 0) hangedMan += '     │      / \\\n'
        
        // Base of hangman
        hangedMan = hangedMan +
        '  ___│______________\n' +
        ' /  /│\\            /│___\n' +
        '/_________________/ /  /│\n' +
        '│                 |/__/ /\n' +
        '|_____________________|/'
        return '\`\`\`' + hangedMan + '\`\`\`'
    }

    // Function to build the embed
    _getEmbed() {
        const e = (name) => { return getEmoji(this.client, name) }
        const embed = defaultEmbed(this.client, null, `⛓️ Hangman - ${this._word.length} letters`, false, true)

        // Build the display for the word, covering up un-guessed letters
        let wordArray = []
        this._word.split('').forEach(letter => {
            if (this._lettersGuessed.includes(letter)) wordArray.push(letter)
            else wordArray.push('_')
        })
        const formatWord = '\`' + wordArray.join('\` \`') + '\`'

        // Build stats for the current game state
        let stateText = 'Press a letter to make a guess.'
        if (this._lettersGuessed.length == 0) stateText = 'New game started. Guess a letter to begin!'
        else if (this._gameState == 1) stateText = 'You Win!'
        else if (this._gameState == -1) stateText = `Game over! The word was \`${this._word}\``
        else if (this._guessState == 1) stateText = getRandomItem(this._guessGood)
        else if (this._guessState == -1) stateText = getRandomItem(this._guessBad)
        
        // Add the stats and hangman to embed
        embed.setDescription(
            embedLS(false, true) + `${stateText}\n
            Lives: ${e('o_heart').repeat(this._lives) + e('o_heartbreak').repeat(this._totalLives - this._lives)}
            Guesses: ${this._lettersGuessed ? '' : `\`${this._lettersGuessed.join('\`, \`')}\``}
            \n${formatWord}`
        )
        embed.addFields({
            name: ' ',
            value: this._getHangmanAscii()
        })
        return embed
    }
    
    _getButtons() {
        const e = (name) => { return getEmoji(this.client, name) }

        // Create rows of buttons for letter selector
        let pageButtonLetters
        if (this._buttonPage == 1) pageButtonLetters = this._alphabet.slice(0, 12)
        else pageButtonLetters = this._alphabet.slice(12, 24)
        
        // Creates the letter buttons for the page
        const maxButtonsPerRow = 4
        let pageButtons = []
        let currentRow = new ActionRowBuilder()
        pageButtonLetters.forEach((letter, index) => {
            currentRow.addComponents(
                new ButtonBuilder().setCustomId(`letter${letter}`)
                    .setLabel(letter)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(this._lettersGuessed.includes(letter.toLowerCase()))
            )
            if ((index + 1) % maxButtonsPerRow === 0 && index > 0) {
                pageButtons.push(currentRow)
                currentRow = new ActionRowBuilder()
            }
        })

        // Creates navigation buttons + maybe some letters
        if (this._buttonPage == 1) {
            pageButtons.push(new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('pageTwo')
                    .setEmoji(e('o_arrow_right'))
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('close')
                    .setEmoji(e('o_close_panel'))
                    .setStyle(ButtonStyle.Danger)
            ]))
        } else {
            pageButtons.push(new ActionRowBuilder().addComponents([
                new ButtonBuilder().setCustomId('pageOne')
                    .setEmoji(e('o_arrow_left'))
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('close')
                    .setEmoji(e('o_close_panel'))
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('letterY')
                    .setLabel('Y')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(this._lettersGuessed.includes('y')),
                new ButtonBuilder().setCustomId('letterZ')
                    .setLabel('Z')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(this._lettersGuessed.includes('z'))
            ]))
        }
        return pageButtons
    }

    // Updates the game panel
    async updatePanel(interaction) { 

        // Update game display
        this.panelMessage = {
            embeds: [this._getEmbed()],
            components: this._gameState == 0 ? this._getButtons(): []
        }

        // Check if game end, and close interaction collector if so
        if (this._gameState != 0) {
            this.setEventListener('end', async () => {})
            this.interactionCollector.stop()
        }

        return await interaction.update(this.panelMessage)
    }
}
