const fs = require('fs-extra');
const path = require('path');

const pathData = path.join(__dirname, '../commands/cache/antiemoji.json');

const crFile = (f, i = []) => {
  if (!fs.existsSync(f)) {
    const data = JSON.stringify(i, null, 2);
    fs.writeFileSync(f, data);
  }
};

// Initialize file if it doesn't exist
crFile(pathData);

module.exports.config = {
  name: "antiemoji",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Kashif Raza",
  description: "Prevent group emoji changes",
  commandCategory: "Administration",
  usages: "[on | off]",
  cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
  const { threadID } = event;

  try {
    // Read data from file
    let antiData = await fs.readJSON(pathData);

    // Find group info in the list
    let threadEntry = antiData.find(entry => entry.threadID === threadID);

    if (threadEntry) {
      // If anti-emoji mode is enabled, disable it
      antiData = antiData.filter(entry => entry.threadID !== threadID);
      await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
      api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled group emoji change protection, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
    } else {
      // Get current group emoji
      const threadInfo = await Threads.getInfo(threadID);
      const emoji = threadInfo.emoji;

      // Add group info and current emoji to the list
      antiData.push({ threadID, emoji });
      await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
      api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled group emoji change protection, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
    }
  } catch (error) {
    console.error("Error enabling/disabling group emoji change protection:", error);
    api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred during processing.**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
  }
};