# Oreo

A fun, exploratory project aimed at learning and experimenting with Discord.js. It includes a .NET WinForms manager for monitoring and managing the bot’s operations. This README provides an overview of the project, setup instructions, and usage details for anyone interested in it. This project may contain some unfound bugs :P

---

## Project Overview

**Oreo** is a Discord bot that interacts with the Discord API using the `discord.js` library. The bot's functionality can be monitored and controlled via a .NET WinForms application. This setup allows for easy management and real-time monitoring of the bot's activities.

## Features

- **Slash commands**: Uses slash commands only for ease of use when calling the bot.
- **DisTube Integration**: Play/search media in voice channels.
- **Entertainment module**: Minigames/game related commands.
- **Moderation commands**: Includes some simple moderation commands.
- **Custom Manager**: Provides a user-friendly interface to monitor and control the bot.

---

## Prerequisites

- Preferrably Windows OS to host the bot (for UI)
- Node.js (version 14 or later)

## Installation

1. Ensure Node.js is installed. You can check with `node -v` or `npm -v`
2. Create a new file, named `secrets.js`, using the following template:
    ```
    export const botToken = '' // Your bot's token here
    export const botID = '' // Your bot's ID here
    export const youtubeCookies = [] // (Optional) Your Youtube account's cookies
    ```
3. Put this file in *"oreo_app/src/"*

    ### For Windows
    4. Run the executable in *"oreo_manager/"*
    5. Press the "Install" button to install dependencies.
    
    ### For Linux - Ubuntu/Debian
    4. Run the following commands to set up Node.js (if not done so):
        ```
        sudo apt update
        sudo apt install nodejs npm
        node -v && npm -v
        ```
        
    5. Install pm2 to manage the bot:
        ```
        sudo npm install pm2 -g
        pm2 -v (To ensure it is installed properly)
        ```

---

## Usage

### With the manager executable
Instructions for using the manager in a Windows OS:
1. Run the executable in *"oreo_manager/"*
2. Press the "Update" button to update dependencies (if necessary).
3. Use the interface to start, stop, or monitor the Discord bot.

### Running the Bot Directly
If you prefer to run the Discord bot directly, use the following commands:
- To start the bot client
    ```
    pm2 start npm --name "oreo" -- start
    ```
- Managing the application:
    -  To view logs:
        ```
        pm2 logs oreo
        ```
    - To stop/restart the application:
        ```
        pm2 stop oreo
        pm2 restart oreo
        ```

---
