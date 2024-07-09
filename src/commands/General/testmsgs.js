/**
 * Command to send a bunch of messages
 */

import { SlashCommandBuilder } from "discord.js"
import { randInt } from "../../utils.js"

export const properties = {
    enabled: false,
    core: false
}
export const data = new SlashCommandBuilder()
    .setName('testmsgs')
    .setDescription('Types a bunch of messages.')

export async function execute(interaction) {
    for (let i = 0; i < 10; i++) {
        await interaction.channel.send({
            content: i + '. This is a test message ' + randInt(1, 10000000)
        })
    }
}