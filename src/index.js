require('dotenv').config()

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')

const { clientReadyHandler } = require('./events/clientReady.js')
const { interactionCreateHandler } = require ('./events/interactionCreateHandler.js')
const pingCommand = require('./commands/ping.js')
const forecastCommand = require('./commands/forecast.js')
const astroCommand = require('./commands/astro.js')
const client = new Client({
    intents: [ GatewayIntentBits.Guilds ],
})

client.commands = new Collection();

client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(forecastCommand.data.name, forecastCommand);
client.commands.set(astroCommand.data.name, astroCommand);

client.once(Events.ClientReady, clientReadyHandler)

client.on(Events.InteractionCreate, interactionCreateHandler)

client.login();