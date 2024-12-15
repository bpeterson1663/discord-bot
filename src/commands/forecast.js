const { EmbedBuilder, SlashCommandBuilder  } = require('discord.js')

const { fetchForecast } = require('../requests/forecast')

const data = new SlashCommandBuilder()
    .setName('forecast')
    .setDescription('Replies with the weather forecast')
    .addStringOption((option) => {
        return option
            .setName('location')
            .setDescription('The location can be a city, zip/postal code, or a latitude and longitude')
            .setRequired(true)
    })
    .addStringOption(option => {
        return option
            .setName('units')
            .setDescription('The unit system of the results: either "metric" or "imperial"')
            .setRequired(false)
            .addChoices(
                { name: 'Metric', value: 'metric'}, 
                { name: "Imperial", value: 'imperial'}
            )
    })

async function execute(interaction) {
    await interaction.deferReply('thinking....');
    const location = interaction.options.getString('location')
    const units = interaction.options.getString('units') || 'metric';
    const isMetric = units == 'metric'

    try {
        const { locationName, weatherData } = await fetchForecast(location)

        const embed = new EmbedBuilder().setColor('Aqua').setTitle(`Weather forecast for ${locationName}`).setDescription(` using the ${units} system`).setTimestamp().setFooter({text: 'Pwered by the weatherapi.com API'})
    
        for (const day of weatherData) {
            const temperatureMin = isMetric ? day.temperatureMinC : day.temperatureMinF;
            const temperatureMax = isMetric ? day.temperatureMaxC : day.temperatureMaxF
    
            embed.addFields({
                name: day.date,
                value: `Low: ${temperatureMin} ${isMetric ? 'C' : 'F'}, High: ${temperatureMax}  ${isMetric ? 'C' : 'F'}`
            })
        }
    
        await interaction.editReply({
            embeds: [embed]
        })
    } catch(error) {
        console.error(error)
        await interaction.editReply(error)
    }  
}

module.exports = {
    data,
    execute
}