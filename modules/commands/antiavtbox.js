const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const pathData = path.join(__dirname, '../commands/cache/antiavtbox.json');

const crFile = (f, i = []) => {
  if (!fs.existsSync(f)) {
    const data = JSON.stringify(i, null, 2);
    fs.writeFileSync(f, data);
  }
};

// Initialize file if it doesn't exist
crFile(pathData);

module.exports.config = {
  name: "antiavtbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Kashif Raza",
  description: "Prevent group avatar changes",
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
      // If anti-avatar mode is enabled, disable it
      antiData = antiData.filter(entry => entry.threadID !== threadID);
      await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
      api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully disabled group avatar protection, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
    } else {
      let url;
      let msg = await api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Activating group avatar protection, please wait...**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
      const thread = (await Threads.getInfo(threadID));

      try {
        // Store the current image URL directly
        url = thread.imageSrc;

        // Add group info and avatar to the list
        const Data = {
          threadID: threadID,
          url: url,
          report: {}
        };
        antiData.push(Data);

        await fs.writeFile(pathData, JSON.stringify(antiData, null, 4), 'utf-8');
        api.unsendMessage(msg.messageID);
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**Successfully enabled group avatar protection, Kashif Raza!**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred while enabling group avatar protection.**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
      }
    }
  } catch (error) {
    console.error("Error processing group avatar protection:", error);
    api.sendMessage(`⊱ ────── {⋅. ✯ .⋅} ────── ⊰\n**An error occurred during processing.**\n⊱ ────── {⋅. ✯ .⋅} ────── ⊰`, threadID);
  }
};