const { Client } = require("discord.js-selfbot-v13");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client();

const targetUserId = "661195193437126688"; // Replace with the user ID to track
const targetChannelIds = ["1339321496379592829"]; // Replace with the channel IDs to monitor

const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1); // Numbers 1-50
let numberSet = new Set(); // To store received numbers
let isTracking = false;
let detectedChannelId = null;

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

client.on("messageCreate", async (message) => {
  if (
    message.author.id === targetUserId &&
    targetChannelIds.includes(message.channel.id)
  ) {
    if (message.content.toLowerCase().includes("guess the number")) {
      console.log(
        `Keyword detected from ${message.author.username} in channel ${message.channel.id}: ${message.content}`
      );
      isTracking = true;
      numberSet.clear();
      detectedChannelId = message.channel.id;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      isTracking = false;

      let leftoverNumbers = allNumbers.filter((num) => !numberSet.has(num));

      // Shuffle the leftover numbers
      leftoverNumbers = leftoverNumbers.sort(() => Math.random() - 0.5);

      // Send each number with a delay
      for (const number of leftoverNumbers) {
        const channel = client.channels.cache.get(detectedChannelId);
        if (channel) {
          await channel.send(number.toString());
          console.log(`Sent number: ${number}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  }

  if (isTracking && targetChannelIds.includes(message.channel.id)) {
    const number = parseInt(message.content, 10);
    if (!isNaN(number) && number >= 1 && number <= 50) {
      numberSet.add(number);
    }
  }
});

client.login(process.env.token);
