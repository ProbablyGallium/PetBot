// I HATE TYPESCRIPT! I HATE TYPESCRIPT!
require('dotenv').config()
const https = require('https');
const fs = require('fs-extra');
const { Client, Collection, Intents } = require('discord.js');
const token = process.env.TOKEN
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//It's occured to me that this thing doesn't...exactly *run* if there's no api.json.
//...Less I have to check for!

function retrieveAPI() {
    function updateAPI() {
        let file = fs.createWriteStream("api.json");
        let request = https.get("https://superauto.pet/api.json", function(response) {
            response.pipe(file);
        })
    }
    let stats = fs.statSync('api.json')
    let options = {headers: {
        'If-Modified-Since': new Date(stats.mtime).toUTCString()
    }}
    https.get("https://superauto.pet/api.json", options, (res) => {
        if (res.statusCode == 304) {
            console.log("API up to date! Using local copy...")
            return;
        } 
            else {
                console.log("API outdated! Requesting fresh copy...")
                updateAPI()
            }
    })
}; 

retrieveAPI()
const petData = require('./api.json')

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command! (Did you spell the name correctly?)', ephemeral: true });
	}
});

client.login(token);