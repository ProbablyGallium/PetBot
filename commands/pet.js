const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const petData = require('../api.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Get info on a pet!')
		
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The name of the pet you want to look up!')
				.setRequired(true)),
	async execute(interaction) {
		let pet = petData.pets[`pet-${interaction.options.getString('input').toLowerCase().split(' ').join("-")}`]
		const infoEmbed = new MessageEmbed().setTitle(`${pet.name} (${pet.packs.join(', ')})`)
		//God this was a pain
		let hex = pet.image.unicodeCodePoint.codePointAt(0).toString(16);
		if (pet.image.source == "fxemoji") {
			var repo = "/ProbablyGallium/PetBot-img/"
			var dirs = "master/"
			var link = `https://raw.githubusercontent.com${repo}${dirs}u${"0000".substring(0, 4 - hex.length) + hex}.png`
		}
			else if (pet.image.source == "noto-emoji") {
				var repo = "/googlefonts/noto-emoji/"
				var dirs = "/png/128/emoji_u"
				var link = "https://raw.githubusercontent.com" + repo + pet.image.commit + dirs + "0000".substring(0, 4 - hex.length) + hex + ".png";		
			}
			else if (pet.image.source == "twemoji") {
				var repo = "/twitter/twemoji/"
				var dirs = "/assets/72x72/"
				var link = "https://raw.githubusercontent.com" + repo + pet.image.commit + dirs + "0000".substring(0, 4 - hex.length) + hex + ".png";		
			}
		infoEmbed.setThumbnail(link)
		switch(pet.tier) {
			case 1:
				infoEmbed.addField('Tier', pet.tier.toString() + ' (Turn 1)', true)
				break
			case "Summoned":
				infoEmbed.addField('Tier', pet.tier, true)
				break
			default:
				infoEmbed.addField('Tier', pet.tier + ` (Turn ${pet.tier - 1})`, true)
		}
		infoEmbed.addField('Base Stats', "❤" + pet.baseHealth +"/🪨" + pet.baseAttack, true)
		if (pet.status) {infoEmbed.addField('Status', `${petData.statuses[pet.status].name}: ${petData.statuses[pet.status].ability.description}`)}
		if (typeof pet.level1Ability != "undefined") {
			infoEmbed.addField('Level 1', pet.level1Ability.description)
		}
		if (typeof pet.level2Ability != "undefined") {
			infoEmbed.addField('Level 2', pet.level2Ability.description)
		}
		if (typeof pet.level3Ability != "undefined") {
			infoEmbed.addField('Level 3', pet.level3Ability.description)
		}

		await interaction.reply({ embeds: [infoEmbed] });
	}
}