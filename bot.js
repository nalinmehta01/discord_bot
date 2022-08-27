// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://cofawriainghyunutcdr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZmF3cmlhaW5naHl1bnV0Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE2MzA2NDUsImV4cCI6MTk3NzIwNjY0NX0.u1oMAUyW1TWXVGGMNXa1KzkC7ALAQD0ZgAnS9LbKRsk')


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (interaction.commandName === 'info') {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}


	} else if (interaction.commandName === 'add') {
		const word = interaction.options.getString('word');
		const definition = interaction.options.getString('definition')
		const { data, error } = await supabase
			.from('Dictionary')
			.insert([{ word, definition }]);
		await interaction.reply(`Added new word '${word}' with definition '${definition}'`);
	} else if (interaction.commandName === 'list') {
		const { data } = await supabase.from('Dictionary').select('*')
		let parsedWords = "";

		for(i = 0; i < data.length; i++) {
			parsedWords += `**${data[i].word}:** ${data[i].definition}\n`
		}
		
		await interaction.reply(parsedWords);
	}
});

// Login to Discord with your client's token
client.login(token);







