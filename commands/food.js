const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const petData = require('../api.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('food')
		.setDescription('Get info on a food item!')
		
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The name of the food you want to look up!')
				.setRequired(true)),
	async execute(interaction) {
		let item = petData.foods[`food-${interaction.options.getString('input').toLowerCase().split(' ').join("-")}`]
		const infoEmbed = new MessageEmbed().setTitle(`${item.name} (${item.packs.join(', ')})`)
		//God this was a pain
		let hex = item.image.unicodeCodePoint.codePointAt(0).toString(16);
		if (item.image.source == "fxemoji") {
			var link = 'https://raw.githubusercontent.com/ProbablyGallium/PetBot-img/master/u1f48a.png' //This can only be sleeping pill at the moment, I'm hardcoding it, cope
		}
		else if (item.image.source == "noto-emoji") {
			var repo = "/googlefonts/noto-emoji/"
			var dirs = "/png/512/emoji_u"
			var link = "https://raw.githubusercontent.com" + repo + item.image.commit + dirs + "0000".substring(0, 4 - hex.length) + hex + ".png";
		}
		else if (item.image.source == "twemoji") {
			var repo = "/twitter/twemoji/"
			var dirs = "/assets/72x72/"
			var link = "https://raw.githubusercontent.com" + repo + item.image.commit + dirs + "0000".substring(0, 4 - hex.length) + hex + ".png";
		}
		infoEmbed.setThumbnail(link)
		switch(item.tier) {
			case 1:
				infoEmbed.addField('Tier', item.tier.toString() + ' (Turn 1)', true)
				break
			case "Summoned":
				infoEmbed.addField('Tier', item.tier, true)
				break
			default:
				infoEmbed.addField('Tier', item.tier + ` (Turn ${item.tier + item.tier - 1})`, true)
		}
		infoEmbed.addField('Ability', item.ability.description, true)

		await interaction.reply({ embeds: [infoEmbed] });
	}
}