const readline = require('readline');
const mineflayer = require('mineflayer');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
var figlet = require("figlet");
const { once } = require("events");
const gradient = require('gradient-string');
require('dotenv').config();
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');
const { CategoryChannel } = require('discord.js');
require('events').EventEmitter.defaultMaxListeners = 40;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const webhookUrl = process.env.WEBHOOK_URL;

const warpCooldown = 10000; // Set the cooldown for /p warp to 10 seconds (in milliseconds)
let lastWarpTime = 0;
let walkingToMortCount = 0;
let lastWalkingToMortTime = Date.now();
let isProcessingPartyLeave = false;
let isProcessingEvacuation = false;
let isProcessingRat = false;
let isProcessingWarp = false;
let isProcessingScam = false;
let isProcessingPartyFinder = false;
let isProcessingScammer = false; // Initialize a processing flag for the scammer event handler
let isProcessingRatter = false;  // Initialize a processing flag for the ratter event handler
let isProcessingScamming = false; // Initialize a processing flag for the scamming event handler
let isProcessingRatting = false;  // Initialize a processing flag for the ratting event handler
let isBotBusy = false;
let isStartQueueRunning = false;

function fetchUsernameFromMinecraftWebsite(ssid) {
  return axios
    .get('https://api.minecraftservices.com/minecraft/profile', {
      headers: {
        Authorization: 'Bearer ' + ssid,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      throw new Error(chalk.red('Invalid SSID.'));
    });
}

function createRandomGuild(baseName) {
  let randomNumbers = '';
  for (let i = 0; i < 4; i++) {
      randomNumbers += Math.floor(Math.random() * 10) + 1; // Generates a random number between 1 and 10
  }
  let guildName = baseName + "_" + randomNumbers;
  // Assuming bot is an object capable of creating a guild
  bot.chat(`/guild create ${guildName}`);
}

async function restartbot() {
  process.exit()
}

async function main() {

  console.log(gradient.vice.multiline`Starting Guildbot....`);

  const ssid = process.env.SSID;
  try {

    const { name, id } = await fetchUsernameFromMinecraftWebsite(ssid);
    console.log(chalk.green(`Minecraft username: ${name}`));
    console.log(chalk.green(`Client Token: ${id}`));

    const bot = mineflayer.createBot({
      host: 'hypixel.net',
      port: 25565,
      version: '1.8.9',
      username: name,
      session: {
        accessToken: ssid,
        clientToken: id,
        selectedProfile: {
          id: id,
          name: name,
      keepAlive: false,
        },
      },
      auth: 'mojang',
      skipValidation: true,
    });

    bot.loadPlugin(pathfinder);
      const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))
 
      bot.on('messagestr', (message) => {
        const messageString = message.toString();
      
        // Exclude messages containing mana, defense, and health
        if (
          !messageString.includes('✎') &&
          !messageString.includes('❈') &&
          !messageString.includes('❤') &&
          !messageString.includes('+400 Bits from Cookie Buff!')
        ) {
          console.log(gradient.fruit.multiline(`${message.toString()}`));
        }
      });

      bot.once('login', async () => {
        console.log(chalk.yellow(`Logged in to Hypixel as ${bot.username}`));

        // Perform actions after logging in
        await sleep(2000); // Initial cooldown

        // Send chat commands once
        bot.chat('/language english');
        await sleep(3000);
        bot.chat('/play skyblock');
        await sleep(5000);
        bot.chat('/p leave');
        await sleep(2000);
        bot.chat('/guild leave');
        await sleep(2000);
        bot.chat('/guild confirm');
        await sleep(2000);
        bot.chat('/guild disband');
        await sleep(2000);
        bot.chat('/guild confirm');
        await sleep(2000);
        createRandomGuild("join_us_now");
        await sleep(2000);
        
        
      bot.loadPlugin(pathfinder)

async function logToWebhook(message) {
  const webhookUrl = process.env.WEBHOOK_URL;

  try {
    const data = {
      content: message // Set the message content
    };

    const response = await axios.post(webhookUrl, data);
    console.log('Log successfully sent to webhook.');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error sending log to webhook:', error);
  }
}

// Define an empty array to store IGNs
let invitedPlayers = [];

// Listen for chat messages
bot.on('message', (message) => {
    const messageString = message.toString();

    // Regular expression to match IGNs
    const ignRegex = /\b[A-Za-z0-9_]{3,16}\b/g;
    let match;

    // Find all IGNs in the message
    while ((match = ignRegex.exec(messageString)) !== null) {
        const IGN = match[0];

        // Check if the player is not already invited
        if (!invitedPlayers.includes(IGN)) {
            invitedPlayers.push(IGN); // Add the player to the list of invited players

            // Invite the player to the guild
            bot.chat(`/guild invite ${IGN}`);
            console.log(`Inviting ${IGN} to the guild...`);
        }
    }
});
