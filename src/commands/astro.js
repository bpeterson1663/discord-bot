const { EmbedBuilder, SlashCommandBuilder  } = require('discord.js')

const { fetchForecast } = require('../requests/forecast')

const data = new SlashCommandBuilder()
    .setName('astro')
    .setDescription('Replies with the astronomical information for the day!')
    .addStringOption((option) => {
        return option
            .setName('location')
            .setDescription('The location can be a city, zip/postal code, or a latitude and longitude')
            .setRequired(true)
    })

async function execute(interaction) {
    await interaction.deferReply('thinking....');
    const location = interaction.options.getString('location')

    try {
        const { locationName, weatherData } = await fetchForecast(location)

        const embed = new EmbedBuilder().setColor('Aqua').setTitle(`Astronomical forecast for ${locationName}...`).setTimestamp().setFooter({text: 'Pwered by the weatherapi.com API'})
    
        for (const day of weatherData) {    
            embed.addFields({
                name: day.date,
                value: `Sunrise: ${day.sunriseTime}\nSunset: ${day.sunsetTime}\nMoonrise: ${day.moonriseTime}\nMoonset: ${day.moonsetTime}`
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