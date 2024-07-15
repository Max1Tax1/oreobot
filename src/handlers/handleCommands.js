/**
 * Handler for registering commands
 */

import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { readdirSync } from 'fs'
import * as secrets from '../secrets.js'
import { buildHelpPages } from '../utils/help.js'

export default async function handleCommands(client) {

    // Importing each command dynamically and add to client command collection
    try {
        const commandsPath = './src/commands'
        client.commandArray = []
        client.commandModules = new Map()
        for (let folder of readdirSync(commandsPath)) {
            const commandFiles = readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'))
            let moduleCommands = []
            for (const file of commandFiles) {
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
        console.error('❌ Error occurred whilst importing commands:\n', error)
        process.exit(1)
    }

    // Register the slash commands to discord using REST API
    const rest = new REST({ version: '9' }).setToken(secrets.botToken)
    try {
        console.log('🔵 Registering (/) commands with REST API.')

        // Global command registration request
        // TODO: 'body: client.commandArray' when bot is ready to be deployed
        // await rest.put(
        //     Routes.applicationCommands(config.botID),
        //     { body: client.commandArray }
        // )

        // Guild command registration request (mainly for testing)
        await rest.put(
            Routes.applicationGuildCommands(secrets.botID, secrets.testGuildID),
            { body: client.commandArray }
        )
    } catch (error) {
        console.error('❌ Error occurred whilst registering (/) commands with REST API:\n', error)
        process.exit(1)
    } finally {
        console.log('✅ Successfully registered (/) commands.')
    }

    // Create the help page for modules and commands
    buildHelpPages(client)
}