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
		const infoEmbed = new MessageEmbed().setTitle(pet.name)
		var hex = pet.image.unicodeCodePoint.codePointAt(0).toString(16);
		var result = "\\u" + "0000".substring(0, 4 - hex.length) + hex;
		console.log(result)
		infoEmbed.setImage()
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
		//what Packs is this thing in?
		//todo: add images
		infoEmbed.addField('Base Stats', "❤" + pet.baseHealth +"/🪨" + pet.baseAttack, true)
		if (typeof pet.level1Ability != "undefined") {
			infoEmbed.addField('Level 1', pet.level1Ability.description)
			infoEmbed.addField('Level 2', pet.level2Ability.description)
			infoEmbed.addField('Level 3', pet.level3Ability.description)
		}


		await interaction.reply({ embeds: [infoEmbed] });
	},
};