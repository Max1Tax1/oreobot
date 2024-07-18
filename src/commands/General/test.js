/**
 * Command to send a bunch of messages
 */

import { SlashCommandBuilder } from 'discord.js'
import { getMedia } from '../../utils/distube/utils.js'
import { addEventListener, removeEventListener } from '../../utils/general.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command.')

export async function execute(interaction, client) {
    const firstDelay = 2000
    const delay = 500

    getMedia(interaction, 'dropical beatbox circlejam helium')
    setTimeout(() => {
        getMedia(interaction, 'lofi girl')
    }, firstDelay)
    setTimeout(() => {
        getMedia(interaction, 'lofi cat')
    }, firstDelay + delay)
    setTimeout(() => {
        getMedia(interaction, 'lofi nature')
    }, firstDelay + delay * 2)

    await interaction.reply({
        content: 'Done.'
    })
}