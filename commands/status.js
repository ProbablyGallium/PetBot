const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const petData = require('../api.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get info on a status effect!')
		
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The name of the effect you want to look up!')
				.setRequired(true)),
	async execute(interaction) {
		let effect = petData.statuses[`status-${interaction.options.getString('input').toLowerCase().split(' ').join("-")}`]
		const infoEmbed = new MessageEmbed().setTitle(`${effect.name}`)
		//God this was a pain
		let hex = effect.image.unicodeCodePoint.codePointAt(0).toString(16);
		if (effect.image.source == "noto-emoji") {
			var repo = "/googlefonts/noto-emoji/"
			var dirs = "/png/512/emoji_u"
		}
		else if (effect.image.source == "twemoji") {
			var repo = "/twitter/twemoji/"
			var dirs = "/assets/72x72/"
		}
		var link = "https://raw.githubusercontent.com" + repo + effect.image.commit + dirs + "0000".substring(0, 4 - hex.length) + hex + ".png";		
		infoEmbed.setThumbnail(link)
		infoEmbed.addField('Ability', effect.ability.description, true)

		await interaction.reply({ embeds: [infoEmbed] });
	}
}