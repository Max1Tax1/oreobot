/**
 * Handler for registering commands
 */

import { REST } from "@discordjs/rest"
import { Routes } from 'discord-api-types/v9'
import { readdirSync } from 'fs'
import * as config from '../config.js'

export default function handleCommands(client) {
    client.handleCommands = async (commandFolders, path) => {

        // Importing each command dynamically and add to client command collection
        try {
            client.commandArray = []
            for (let folder of commandFolders) {
                const commandFiles = readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
                for (const file of commandFiles) {
                    const command = await import(`../commands/${folder}/${file}`)
                    client.commands.set(command.data.name, command)
                    client.commandArray.push(command.data.toJSON())
                }
            }
        } catch (error) {
            console.error('❌ Error occurred whilst importing commands:\n', error)
            process.exit(1)
        }

        // Register the slash commands to discord using REST API
        const rest = new REST({ version: '9' }).setToken(config.botToken)
        try {
            console.log('🔵 Registering (/) commands with REST API.')

            // Global command registration request
            // TODO: Enable when bot is ready to be deployed
            // await rest.put(
            //     Routes.applicationCommands(config.botID),
            //     { body: client.commandArray }
            // )

            // Guild command registration request (mainly for testing)
            await rest.put(
                Routes.applicationGuildCommands(config.botID, config.guildID),
                { body: client.commandArray }
            )
        } catch (error) {
            console.error('❌ Error occurred whilst registering (/) commands with REST API:\n', error)
            process.exit(1)
        } finally {
            console.log('✅ Successfully registered (/) commands.')
        }
    }
}