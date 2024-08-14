/**
 * Handler for registering commands
 */

import { Collection, Routes, REST } from 'discord.js'
import { readdirSync } from 'fs'
import { buildHelpPages } from '../utils/help.js'
import * as secrets from '../secrets.js'
import * as config from '../config.js'
import { getDir } from '../utils/general.js'

export const startMessage = 'Reading and registering (/) commands'
export const finishMessage = 'Successfully registered (/) commands'
export default async function handleSlashCommands(client) {

    // Importing each command dynamically and add to client command collection
    let file = null
    try {
        const commandsPath = getDir(import.meta.url, '../commands')
        client.commandArray = []
        client.commands = new Collection()
        client.commandModules = new Map()
        for (let folder of readdirSync(commandsPath)) {
            const commandFiles = readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'))
            let moduleCommands = []
            for (file of commandFiles) {
                const command = await import(`../commands/${folder}/${file}`)
                client.commands.set(command.data.name, command)
                client.commandArray.push(command.data.toJSON())
                moduleCommands.push({
                    properties: command.properties,
                    data: command.data.toJSON()
                })
            }
            client.commandModules.set(folder, moduleCommands)
        }
        client.helpPages = new Map()
        buildHelpPages(client)
    } catch (error) {
        throw new Error(`Error occurred whilst importing command from ${file}:\n${error}`)
    }

    // Register the slash commands to discord using REST API
    const rest = new REST({ version: '9' }).setToken(secrets.botToken)
    try {

        // Global command registration request
        if (!config.testMode) await rest.put(
            Routes.applicationCommands(secrets.botID),
            { body: client.commandArray }
        )

        // Guild command registration request (for testing)
        else {
            await rest.put(
                Routes.applicationCommands(secrets.botID),
                { body: [] }
            )
            await rest.put(
                Routes.applicationGuildCommands(secrets.botID, '1261958892074569729'),
                { body: client.commandArray }
            )
        }
    } catch (error) {
        throw new Error(`Error occurred whilst registering (/) commands with REST API:\n${error}`)
    }
}