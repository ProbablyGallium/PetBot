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
		let pet = petData.pets[`pet-${interaction.options.getString('input').toLowerCase()}`]
		var infoEmbed = new MessageEmbed()
		.setTitle(pet.name)
		.addField('Tier', pet.tier.toString(), true)
		.addField('Stats', "❤" + pet.baseHealth +"/🪨" + pet.baseAttack, true)
		.addField('Level 1', pet.level1Ability.description)
		.addField('Level 2', pet.level2Ability.description)
		.addField('Level 3', pet.level3Ability.description)

		await interaction.reply({ embeds: [infoEmbed] });
	},
};