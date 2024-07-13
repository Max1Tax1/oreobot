/**
 * Command to send a bunch of messages
 */

import { SlashCommandBuilder } from 'discord.js'
import { getMedia } from '../../utils/media.js'

export const properties = {
    enabled: true,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command.')

export async function execute(interaction, client) {
    const delay = 3000
    setTimeout(() => { 
        getMedia(interaction, 'Zer0 vs DEN | Down to the floor | #bbu22 Top 16')
    }, delay)
    setTimeout(() => {
        getMedia(interaction, 'lofi')
    }, delay)
    setTimeout(() => {
        getMedia(interaction, 'lofi')
    }, delay)
    await interaction.reply({
        content: 'Done.'
    })
}