/**
 * Handler for loading in larger assets beforehand, such as images
 */
import { readFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { getDir } from '../utils/general.js'
import * as config from '../config.js'

async function loadAsset(filePath) {
    try {
        return readFileSync(filePath)
    } catch (error) {
        throw new Error(`Error occurred whilst loading ${filePath}:\n${error}`)
    }
}

export const startMessage = 'Loading in assets'
export const finishMessage = 'All assets loaded'
export default async function handleAssets(client) {
    
    // Try to load all assets from resources
    try {
        const resourcesPath = getDir(import.meta.url, '../../resources')
        client.assets = {}

        // Load all assets of each folder + assign raw file name to it
        for (const folder of config.assetFolders) {
            client.assets[folder] = new Map()
            const folderPath = join(resourcesPath, folder)
            for (const file of readdirSync(folderPath)) {
                const filePath = join(folderPath, file)
                const asset = await loadAsset(filePath)
                client.assets[folder].set(basename(filePath), asset)
            }
        }
    } catch (error) {
        throw new Error(`An error occurred whilst loading assets:\n${error}`)
    }
}